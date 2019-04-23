import { Plugin } from '../Plugin';
import { pluginFactory } from '../_lib/plugin-factory';
import { ContextState } from '../_lib/type';

interface OsciloscopeProps {
  canvas?: HTMLCanvasElement;
  audioContext?: AudioContext;
  fillColor?: string;
  strokeColor?: string;
}

export class OsciloscopePlugin implements Plugin<OsciloscopeProps, AnalyserNode> {
  private animationFrame: number;
  private node: AnalyserNode;
  private dataArray: Uint8Array;
  private canvas: HTMLCanvasElement;
  private previousContextState: ContextState;
  private fillColor: string;
  private strokeColor: string;

  constructor() {
    this.createNode = this.createNode.bind(this);
    this.handleVisualizationChange = this.handleVisualizationChange.bind(this);
    this.updateNode = this.updateNode.bind(this);
  }

  private handleVisualizationChange() {
    this.animationFrame = requestAnimationFrame(this.handleVisualizationChange);
    this.node.getByteTimeDomainData(this.dataArray);
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.fillStyle = this.fillColor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.strokeColor;

    ctx.beginPath();

    const sliceWidth = (this.canvas.width * 1.0) / this.node.frequencyBinCount;
    let x = 0;

    for (let i = 0; i < this.node.frequencyBinCount; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = (v * this.canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(this.canvas.width, this.canvas.height / 2);
    ctx.stroke();
  }

  shouldNotUpdate(prevProps: OsciloscopeProps, nextProps: OsciloscopeProps) {
    return !!nextProps.audioContext && nextProps.audioContext.state !== ContextState.RUNNING;
  }

  createNode(
    audioContext: AudioContext,
    { canvas, fillColor = 'rgb(200, 200, 200)', strokeColor = 'rgb(0, 0, 0)' }: OsciloscopeProps,
  ) {
    this.node = audioContext.createAnalyser();
    this.node.fftSize = 2048;
    this.dataArray = new Uint8Array(this.node.frequencyBinCount);
    this.strokeColor = strokeColor;
    this.fillColor = fillColor;

    return this.node;
  }

  updateNode(node: AnalyserNode, { canvas }: OsciloscopeProps, audioContext: AudioContext) {
    if (this.previousContextState !== audioContext.state) {
      this.previousContextState = audioContext.state as ContextState;
      this.canvas = canvas as HTMLCanvasElement;

      switch (audioContext.state) {
        case ContextState.SUSPENDED:
          this.animationFrame && cancelAnimationFrame(this.animationFrame);
          break;
        case ContextState.CLOSED:
          this.animationFrame && cancelAnimationFrame(this.animationFrame);
          break;
        case ContextState.RUNNING:
          this.handleVisualizationChange();
          break;
      }
    }
  }
}

export default pluginFactory<OsciloscopeProps, AnalyserNode>(new OsciloscopePlugin());

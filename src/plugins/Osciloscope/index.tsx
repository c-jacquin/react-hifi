import { Plugin } from '../Plugin';
import { pluginFactory } from '../_lib/plugin-factory';
import { ContextState } from '../_lib/type';

interface OsciloscopeProps {
  audioContext?: AudioContext;
  onVisualisationData: (data: number[][]) => void;
  height: number;
  width: number;
}

export class OsciloscopePlugin implements Plugin<OsciloscopeProps, AnalyserNode> {
  private animationFrame: number;
  private node: AnalyserNode;
  private dataArray: Uint8Array;
  private previousContextState: ContextState;
  private height: number;
  private width: number;
  private onData: (data: number[][]) => void;

  constructor() {
    this.createNode = this.createNode.bind(this);
    this.handleVisualizationChange = this.handleVisualizationChange.bind(this);
    this.updateNode = this.updateNode.bind(this);
  }

  private handleVisualizationChange() {
    this.animationFrame = requestAnimationFrame(this.handleVisualizationChange);
    this.node.getByteTimeDomainData(this.dataArray);

    const sliceWidth = (this.width * 1.0) / this.node.frequencyBinCount;
    let x = 0;
    const data: number[][] = [];

    for (let i = 0; i < this.node.frequencyBinCount; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = (v * this.height) / 2;

      data.push([x, y]);

      x += sliceWidth;
    }

    this.onData(data);
  }

  shouldNotUpdate(prevProps: OsciloscopeProps, nextProps: OsciloscopeProps) {
    return !!nextProps.audioContext && nextProps.audioContext.state !== ContextState.RUNNING;
  }

  createNode(audioContext: AudioContext, { height, width, onVisualisationData }: OsciloscopeProps) {
    this.node = audioContext.createAnalyser();
    this.node.fftSize = 2048;
    this.dataArray = new Uint8Array(this.node.frequencyBinCount);
    this.width = width;
    this.height = height;
    this.onData = onVisualisationData;

    return this.node;
  }

  updateNode(node: AnalyserNode, { height, width }: OsciloscopeProps, audioContext: AudioContext) {
    if (this.height !== height) {
      this.height = height;
    }

    if (this.width !== width) {
      this.width = width;
    }

    if (this.previousContextState !== audioContext.state) {
      this.previousContextState = audioContext.state as ContextState;

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

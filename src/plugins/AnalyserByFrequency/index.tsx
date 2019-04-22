import React from 'react';
import { pluginFactory } from '../_lib/plugin-factory';
import { Plugin } from '../Plugin';
import { ContextState } from '../_lib/type';

interface AnalyserByFrequencyProps {
  frequencies: number[];
  onVisualisationData: (data: number[]) => void;
  audioContext?: AudioContext;
}

export class AnalyserByFrequencyPlugin implements Plugin<AnalyserByFrequencyProps, AnalyserNode> {
  private frequencyData: Uint8Array;
  private previousContextState: ContextState;
  private animationFrame: number;
  private onVisualisationData: (data: number[]) => void;
  private node: AnalyserNode;
  private frequencies: number[];

  constructor() {
    this.createNode = this.createNode.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.handleVisualizationChange = this.handleVisualizationChange.bind(this);
  }

  private formatDataVizByFrequency(data: Uint8Array, frequencies: number[]): number[] {
    const values = [];
    const HERTZ_ITER = 23.4;
    let currentIndex = 0;

    for (let i = 0; i <= frequencies[frequencies.length - 1] + HERTZ_ITER; i = i + HERTZ_ITER) {
      const freq = frequencies[currentIndex];

      if (i > freq && i < freq + HERTZ_ITER) {
        currentIndex++;

        values.push(data[Math.round(i / HERTZ_ITER)]);
      }
    }

    return values;
  }

  private handleVisualizationChange() {
    this.animationFrame = requestAnimationFrame(this.handleVisualizationChange);
    this.node.getByteFrequencyData(this.frequencyData);

    this.onVisualisationData(this.formatDataVizByFrequency(this.frequencyData, this.frequencies));
  }

  shouldNotUpdate(prevProps: AnalyserByFrequencyProps, nextProps: AnalyserByFrequencyProps) {
    return !!nextProps.audioContext && nextProps.audioContext.state !== ContextState.RUNNING;
  }

  createNode(audioContext: AudioContext, props: AnalyserByFrequencyProps) {
    this.node = audioContext.createAnalyser();
    this.onVisualisationData = props.onVisualisationData;
    this.frequencies = props.frequencies;

    this.node.fftSize = 32768;
    this.frequencyData = new Uint8Array(this.node.frequencyBinCount);

    return this.node;
  }

  updateNode(node: AnalyserNode, props: AnalyserByFrequencyProps, audioContext: AudioContext) {
    if (this.previousContextState !== audioContext.state) {
      this.previousContextState = audioContext.state as ContextState;

      switch (audioContext.state) {
        case ContextState.SUSPENDED:
          this.animationFrame && cancelAnimationFrame(this.animationFrame);
          break;
        case ContextState.CLOSED:
          this.animationFrame && cancelAnimationFrame(this.animationFrame);
          this.onVisualisationData(props.frequencies.map(() => 0));
          break;
        case ContextState.RUNNING:
          this.handleVisualizationChange();
          break;
      }
    }
  }
}

export default React.memo(
  pluginFactory<AnalyserByFrequencyProps, AnalyserNode>(new AnalyserByFrequencyPlugin()),
  (prevProps, nextProps) =>
    !!nextProps.audioContext && nextProps.audioContext.state !== ContextState.RUNNING,
);

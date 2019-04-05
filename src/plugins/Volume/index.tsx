import { memo } from 'react';
import { pluginFactory } from '../_lib/factory';
import { Plugin } from '../Plugin';

interface VolumePluginProps {
  /** a number between 0 and 100 */
  value: number;
}

export class VolumePlugin implements Plugin<VolumePluginProps, GainNode> {
  constructor() {
    this.createNode = this.createNode.bind(this);
  }

  createNode(audioContext: AudioContext, props: VolumePluginProps) {
    const gainNode =  audioContext.createGain();
    this.updateNode(gainNode, props);

    return gainNode;
  }

  updateNode({ gain }: GainNode, { value }: VolumePluginProps) {
    gain.value = value / 100;
  }
}

export default memo(
  pluginFactory<VolumePluginProps, GainNode>(new VolumePlugin()),
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);

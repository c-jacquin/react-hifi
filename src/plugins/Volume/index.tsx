import { pluginFactory } from '../_lib/plugin-factory';
import { Plugin } from '../Plugin';

export interface VolumePluginProps {
  /** a number between 0 and 100 */
  value: number;
}

export class VolumePlugin implements Plugin<VolumePluginProps, GainNode> {
  constructor() {
    this.createNode = this.createNode.bind(this);
  }

  shouldNotUpdate(prevProps: VolumePluginProps, nextProps: VolumePluginProps) {
    return prevProps.value === nextProps.value;
  }

  createNode(audioContext: AudioContext, props: VolumePluginProps) {
    const gainNode = audioContext.createGain();
    this.updateNode(gainNode, props);

    return gainNode;
  }

  updateNode(node: GainNode, { value }: VolumePluginProps) {
    node.gain.value = value / 100;
  }
}

export default pluginFactory<VolumePluginProps, GainNode>(new VolumePlugin());

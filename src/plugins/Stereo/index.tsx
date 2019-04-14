import { pluginFactory } from '../_lib/plugin-factory';
import { Plugin } from '../Plugin';

interface StereoPluginProps {
  /** a number between -1 and 1 */
  value: number;
}

export class StereoPlugin implements Plugin<StereoPluginProps, StereoPannerNode> {
  shouldNotUpdate(prevProps: StereoPluginProps, nextProps: StereoPluginProps) {
    return prevProps.value === nextProps.value;
  }

  createNode(audioContext: AudioContext, { value }: StereoPluginProps) {
    return new StereoPannerNode(audioContext, { pan: value });
  }

  updateNode({ pan }: StereoPannerNode, { value }: StereoPluginProps) {
    pan.value = value;
  }
}

export default pluginFactory<StereoPluginProps, StereoPannerNode>(new StereoPlugin());

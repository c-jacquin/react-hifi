import { memo } from 'react';

import { pluginFactory } from '../_lib/factory';
import { Plugin } from '../Plugin';

interface StereoPluginProps {
  /** a number between -1 and 1 */
  value: number;
}

export class StereoPlugin implements Plugin<StereoPluginProps, StereoPannerNode> {
  createNode(audioContext: AudioContext, { value }: StereoPluginProps) {
    return new StereoPannerNode(audioContext, { pan: value });
  }

  updateNode({ pan }: StereoPannerNode, { value }: StereoPluginProps) {
    pan.value = value;
  }
}

export default memo(
  pluginFactory<StereoPluginProps, StereoPannerNode>(new StereoPlugin()),
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);

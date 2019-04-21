import { pluginFactory } from '../_lib/plugin-factory';
import { Plugin } from '../Plugin';

interface BiQuadPluginProps {
  value: number;
  freq: number;
  q?: number;
  type:
    | 'lowpass'
    | 'highpass'
    | 'bandpass'
    | 'lowshelf'
    | 'highshelf'
    | 'peaking'
    | 'notch'
    | 'allpass';
}

export class BiQuadPlugin implements Plugin<BiQuadPluginProps, BiquadFilterNode> {
  shouldNotUpdate(prevProps: BiQuadPluginProps, nextProps: BiQuadPluginProps) {
    return prevProps.value === nextProps.value && prevProps.q === nextProps.q;
  }

  createNode(audioContext: AudioContext, { value, freq, type, q }: BiQuadPluginProps) {
    const filter = new BiquadFilterNode(audioContext);

    filter.frequency.value = freq;
    filter.gain.value = value;
    filter.type = type;

    if (q) {
      filter.Q.value = q;
    }

    return filter;
  }

  updateNode({ gain, Q }: BiquadFilterNode, { value, q }: BiQuadPluginProps) {
    gain.value = value;

    if (q) {
      Q.value = q;
    }
  }
}

export default pluginFactory<BiQuadPluginProps, BiquadFilterNode>(new BiQuadPlugin());

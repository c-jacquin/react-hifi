import { pluginFactory } from '../_lib/plugin-factory';
import { Plugin } from '../Plugin';
import { shallowObject } from '../../helpers';

interface EqualizerProps {
  data: Record<string, number>;
  preAmp?: number;
}

export class EqualizerPlugin implements Plugin<EqualizerProps, BiquadFilterNode[]> {
  shouldNotUpdate(prevProps: EqualizerProps, nextProps: EqualizerProps) {
    return shallowObject(prevProps.data, nextProps.data) && prevProps.preAmp === nextProps.preAmp;
  }

  createNode(audioContext: AudioContext, { data, preAmp = 0 }: EqualizerProps): BiquadFilterNode[] {
    const frequencies = Object.keys(data).map(Number);

    return frequencies.map((freq, idx) => {
      const filter = new BiquadFilterNode(audioContext);

      filter.frequency.value = freq;
      filter.gain.value = data[freq] + preAmp;

      switch (idx) {
        case 0:
          filter.type = 'lowshelf';
          break;
        case frequencies.length - 1:
          filter.type = 'highshelf';
          break;
        default:
          filter.type = 'peaking';
          filter.Q.value = (2 * freq) / Math.abs(frequencies[idx + 1] - frequencies[idx - 1]);
          break;
      }

      return filter;
    });
  }

  updateNode(nodes: BiquadFilterNode[], { preAmp = 0, data }: EqualizerProps): void {
    nodes.forEach((node, idx) => {
      node.gain.value = data[node.frequency.value] + preAmp;
    });
  }
}

export default pluginFactory<EqualizerProps, BiquadFilterNode[]>(new EqualizerPlugin());

/* tslint:disable:no-empty */
import 'jsdom';

class AudioNodeMock {
  type = 'foo';
  frequency = {
    value: 0,
  };
  gain = {
    value: 0,
  };
  Q = {
    value: 0,
  };
  connect() {
    return new AudioNodeMock();
  }
}

class Analyser extends AudioNodeMock {
  getByteFrequencyData(foo: Uint8Array) {
    foo = new Uint8Array(10);
  }
}

class AudioContextMock {
  createBiquadFilter() {
    return new AudioNodeMock();
  }

  createGain() {
    return new AudioNodeMock();
  }

  createMediaElementSource() {
    return new AudioNodeMock();
  }

  createAnalyser() {
    return new Analyser();
  }
}

class StereoPannerNodeMock extends AudioNodeMock {
  pan: { value: number };

  constructor(options?: { pan: number }) {
    super();
    this.pan = {
      value: options ? options.pan : 0,
    };
  }
}

(global as any).AudioContext = AudioContextMock;
(global as any).StereoPannerNode = StereoPannerNodeMock;

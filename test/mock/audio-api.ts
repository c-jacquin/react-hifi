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
  connect() {}
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
    return new AudioNodeMock();
  }
}

(global as any).AudioContext = AudioContextMock;

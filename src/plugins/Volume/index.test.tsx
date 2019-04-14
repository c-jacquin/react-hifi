import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import Volume from './index';

describe('Volume plugin', () => {
  test('should register the plugin', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Volume value={5} />
      </Sound>,
      options,
    );

    const instance = testRenderer.getInstance();
    expect((instance as any).state.audioNodes.length).toBe(1);
  });

  test('should update the gainNode value when props change', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Volume value={5} />
      </Sound>,
      options,
    );

    const instance = testRenderer.getInstance();

    testRenderer.update(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Volume value={100} />
      </Sound>,
    );

    expect((instance as any).state.audioNodes[1].gain.value).toBe(100 / 100);
  });
});

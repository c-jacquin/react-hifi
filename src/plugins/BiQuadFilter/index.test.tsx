import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import BiQuadFilter from './index';

describe('BiQuadFilter plugin', () => {
  test('should register the plugin', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <BiQuadFilter freq={10} value={4} />
      </Sound>,
      options,
    );

    const instance = testRenderer.getInstance();
    expect((instance as any).state.audioNodes.length).toBe(1);
  });

  test('should update the biquadfilter node gain value when props change', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <BiQuadFilter freq={100} value={0} />
      </Sound>,
      options,
    );

    const instance = testRenderer.getInstance();

    testRenderer.update(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <BiQuadFilter freq={100} value={1} />
      </Sound>,
    );

    expect((instance as any).state.audioNodes[1].gain.value).toBe(1);
  });
});

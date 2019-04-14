import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import Volume from '../Volume';

describe('Plugin Factory', () => {
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
});

import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import Equalizer from './index';

describe('Equalizer plugin', () => {
  test('should register the plugin', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Equalizer data={{ 90: 4, 160: 10, 300: -5 }} />
      </Sound>,
      options,
    );

    const instance = testRenderer.getInstance();

    testRenderer.update(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Equalizer data={{ 90: 4, 160: 10, 300: 10 }} preAmp={4} />
      </Sound>,
    );

    testRenderer.update(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Equalizer data={{ 90: 4, 160: 10, 300: 10 }} />
      </Sound>,
    );

    expect((instance as any).state.audioNodes.length).toBe(2);
  });
});

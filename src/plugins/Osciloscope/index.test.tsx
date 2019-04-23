import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import { Osciloscope } from '../index';

describe('Oscilator plugin', () => {
  test('should render', () => {
    const canvas = document.createElement('canvas');
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Osciloscope />
      </Sound>,
      options,
    );

    testRenderer.update(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PLAYING}>
        <Osciloscope canvas={canvas} />
      </Sound>,
    );

    expect(testRenderer).toBeDefined();
  });
});

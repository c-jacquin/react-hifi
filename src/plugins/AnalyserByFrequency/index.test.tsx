/* tslint:disable:no-empty */
import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import AnalyserByFrequency, { AnalyserByFrequencyPlugin } from './index';

describe('AnalyserByFrequency plugin', () => {
  const plugin = new AnalyserByFrequencyPlugin();
  const ctx = new AudioContext();
  const props = {
    frequencies: [10],
    onVisualisationData: () => {},
  };

  test('should register the plugin', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <AnalyserByFrequency frequencies={[10, 40]} onVisualisationData={() => {}} />
      </Sound>,
      options,
    );

    const instance = testRenderer.getInstance();
    expect((instance as any).state.audioNodes.length).toBe(1);
  });

  test('should call onVisualisationData when audioContext state change', () => {
    const spy = jest.spyOn(props, 'onVisualisationData');

    plugin.createNode(ctx, props);

    (ctx as any).state = 'running';
    plugin.updateNode(ctx.createAnalyser(), props, ctx);
    expect(spy).toHaveBeenCalled();

    (ctx as any).state = 'suspended';
    plugin.updateNode(ctx.createAnalyser(), props, ctx);

    (ctx as any).state = 'closed';
    plugin.updateNode(ctx.createAnalyser(), props, ctx);
    expect(spy).toHaveBeenCalledTimes(2);

    (ctx as any).state = 'running';
    plugin.updateNode(ctx.createAnalyser(), props, ctx);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  describe('shouldNotUpdate', () => {
    test('should update if no audio context', () => {
      expect(plugin.shouldNotUpdate(props, props)).toBeFalsy();
    });

    test('should not update if ctx state is not running', () => {
      const newProps = { ...props, audioContext: ctx };
      (ctx as any).state = 'closed';

      expect(plugin.shouldNotUpdate(newProps, newProps)).toBeTruthy();
    });

    test('should update if ctx state is running', () => {
      (ctx as any).state = 'running';
      const newProps = { ...props, audioContext: ctx };

      expect(plugin.shouldNotUpdate(newProps, newProps)).toBeFalsy();
    });
  });
});

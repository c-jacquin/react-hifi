/* tslint:disable:no-empty */
import React from 'react';
import TestRenderer from 'react-test-renderer';

import { options } from '../../../__mocks__/audio-element';
import { Sound } from '../../Sound';
import Osciloscope, { OsciloscopePlugin } from './';

describe('Oscilator plugin', () => {
  const plugin = new OsciloscopePlugin();
  const ctx = new AudioContext();

  const props = {
    height: 10,
    width: 100,
    onVisualisationData: () => {},
  };

  test('should register the plugin', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Osciloscope height={100} width={100} onVisualisationData={() => {}} />
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

    (ctx as any).state = 'running';
    plugin.updateNode(ctx.createAnalyser(), props, ctx);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});

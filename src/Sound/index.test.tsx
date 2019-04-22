/* tslint:disable:no-empty */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import { mount } from 'enzyme';

import { Sound } from './index';
import { Stereo, Volume } from '../plugins';
import { audioElementMock, options } from '../../__mocks__/audio-element';

/**
 * Sound test
 */
describe('Sound Component', () => {
  test('should render', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED} />,
      options,
    );
    expect(testRenderer).toBeDefined();
  });

  test('basic controls play / pause / stop', () => {
    const playSpy = jest.spyOn(AudioContext.prototype, 'resume');
    const pauseSpy = jest.spyOn(AudioContext.prototype, 'suspend');
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED} />,
      options,
    );

    expect(pauseSpy).toBeCalledTimes(1);

    testRenderer.update(<Sound url="http://foo.ogg" playStatus={Sound.status.PLAYING} />);
    expect(playSpy).toBeCalledTimes(1);

    const instance = testRenderer.getInstance() as any;
    const stopSpy = jest.spyOn(instance, 'stop');

    testRenderer.update(<Sound url="http://foo.ogg" playStatus={Sound.status.STOPPED} />);
    expect(stopSpy).toHaveBeenCalled();
    expect(pauseSpy).toHaveBeenCalledTimes(2);
  });

  test('seek should update currentTime prop of audio dom element', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED} position={56} />,
      options,
    );

    expect(audioElementMock.currentTime).toBe(56);

    testRenderer.update(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED} position={100} />,
    );

    expect(audioElementMock.currentTime).toBe(100);
  });

  test('seek sould call onPlaying props if provided', () => {
    const props = {
      url: 'http://foo.ogg',
      playStatus: Sound.status.PAUSED,
      position: 56,
      onPlaying: () => {},
    };

    const spy = jest.spyOn(props, 'onPlaying');

    const testRenderer = TestRenderer.create(<Sound {...props} />, options);

    const instance = testRenderer.getInstance();

    (instance as any).handleTimeUpdate({ target: { currentTime: 45, duration: 344 } });
    expect(spy).toHaveBeenCalledWith({ position: 45, duration: 344 });
  });

  test('should close the audioContext when unmount', () => {
    const closeCtxSpy = jest.spyOn(AudioContext.prototype, 'close');
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED} />,
      options,
    );

    testRenderer.unmount();

    expect(closeCtxSpy).toHaveBeenCalledTimes(1);
  });

  test('should render properly with many children (plugins)', () => {
    const testRenderer = TestRenderer.create(
      <Sound url="http://foo.ogg" playStatus={Sound.status.PAUSED}>
        <Volume value={34} />
        <Stereo value={1} />
      </Sound>,
      options,
    );

    expect(testRenderer).toBeDefined();
  });

  test('should call onError props if an error is throw', () => {
    const error = new Error('test error');
    const UselessPlugin = () => null;
    const props = {
      url: 'http://foo.ogg',
      playStatus: Sound.status.PAUSED,
      onError: () => {},
    };

    const onErrorSpy = jest.spyOn(props, 'onError');

    const wrapper = mount(
      <Sound {...props}>
        <UselessPlugin />
      </Sound>,
    );

    const spy = jest.spyOn(Sound.prototype, 'componentDidCatch');

    wrapper.find(UselessPlugin).simulateError(error);

    expect(spy).toHaveBeenCalled();
    expect(onErrorSpy).toHaveBeenCalled();
  });
});

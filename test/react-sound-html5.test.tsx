/* tslint:disable:no-empty */
import React, { ReactElement } from 'react';
import TestRenderer from 'react-test-renderer';
import Sound from '../src';

const noop = () => {};

const audioElementMock = {
  pause() {},
  play: () => Promise.resolve()
}

const options = {
  createNodeMock: (element: ReactElement<any>) => {
    if (element.type === 'audio') {
      return audioElementMock;
    }
    return null;
  }
}

/**
 * Sound test
 */
describe('Sound Component', () => {
  it('should render', () => {
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
      />,
      options,
    );
    expect(testRenderer).toBeDefined();
  });

  it('should properly set biQuadFilterValue', () => {
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
        equalizer={{ 40: 4 }}
      />,
      options,
    );

    const instance = testRenderer.getInstance();
    expect((instance as any).filters[0].frequency.value).toEqual(40);
    expect((instance as any).filters[0].gain.value).toEqual(4);
  })

  it('should add preAmp prop to the biquadFilter value if specified', () => {
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
        equalizer={{ 40: 4, 50: 10 }}
        preAmp={10}
      />,
      options,
    );

    const instance = testRenderer.getInstance();
    expect((instance as any).filters[0].gain.value).toEqual(14);
    expect((instance as any).filters[1].gain.value).toEqual(20);
  });

  it('filters should have the correct type according to their position in the array of filters', () => {
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
        equalizer={{ 40: 4, 50: 10, 60: 45, 70: 34 }}
        preAmp={10}
      />,
      options,
    );

    const instance = testRenderer.getInstance();

    expect((instance as any).filters[0].type).toEqual('lowshelf');
    expect((instance as any).filters[1].type).toEqual('peaking')
    expect((instance as any).filters[2].type).toEqual('peaking')
    expect((instance as any).filters[3].type).toEqual('highshelf')

  });

  it('should call the play and pause method of html element according to playStatus prop', () => {
    const playSpy = jest.spyOn(audioElementMock, 'play');
    const pauseSpy = jest.spyOn(audioElementMock, 'pause');
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
      />,
      options
    );

    testRenderer.update(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PLAYING}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
      />
    );

    testRenderer.update(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={1}
      />
    );

    expect(pauseSpy).toBeCalledTimes(2);
    expect(playSpy).toBeCalledTimes(1);
  });

  it ('should update volume according to the volume props', () => {
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={100}
      />,
      options
    );

    let instance = testRenderer.getInstance();
    expect((instance as any).gainNode.gain.value).toEqual(1);

    testRenderer.update(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
        onFinishedPlaying={noop}
        onLoad={noop}
        onLoading={noop}
        onPlaying={noop}
        position={5}
        volume={50}
      />
    )

    expect((instance as any).gainNode.gain.value).toEqual(0.5);

  });
});

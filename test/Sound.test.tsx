/* tslint:disable:no-empty */
import React, { ReactElement } from 'react';
import TestRenderer from 'react-test-renderer';
import Sound from '../src';

const noop = () => {};

const audioElementMock = {
  pause() {},
  play: () => Promise.resolve(),
  currentTime: 0,
};

const options = {
  createNodeMock: (element: ReactElement<any>) => {
    if (element.type === 'audio') {
      return audioElementMock;
    }
    return null;
  },
};

/**
 * Sound test
 */
describe('Sound Component', () => {
  test('should render', () => {
    const testRenderer = TestRenderer.create(
      <Sound
        url="http://foo.ogg"
        playStatus={Sound.status.PAUSED}
      />,
      options,
    );
    expect(testRenderer).toBeDefined();
  });

  describe('props controls', () => {
    test('play / pause', () => {
      const playSpy = jest.spyOn(audioElementMock, 'play');
      const pauseSpy = jest.spyOn(audioElementMock, 'pause');
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
        />,
        options,
      );
      expect(pauseSpy).toBeCalledTimes(1);

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PLAYING}
        />,
      );
      expect(playSpy).toBeCalledTimes(1);

      const instance = testRenderer.getInstance() as any;
      const stopSpy = jest.spyOn(instance, 'stop');

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.STOPPED}
        />,
      );
      expect(stopSpy).toHaveBeenCalled();
    });

    test('volume', () => {
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          volume={100}
        />,
        options,
      );

      let instance = testRenderer.getInstance();
      expect((instance as any).gainNode.gain.value).toEqual(1);

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          volume={50}
        />,
      );

      expect((instance as any).gainNode.gain.value).toEqual(0.5);
    });

    test('stereo', () => {
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          stereoPan={1}
        />,
        options,
      );

      const instance = testRenderer.getInstance() as any;

      expect(instance.stereoPanner.pan.value).toEqual(1);

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          stereoPan={-1}
        />
      )
      expect(instance.stereoPanner.pan.value).toEqual(-1);

    });

    test('position', () => {
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          position={0}
        />,
        options,
      );

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          position={300}
        />,
      );

      const instance = testRenderer.getInstance();

      expect((instance as any).audio.currentTime).toEqual(300);
    });
  });

  describe('handlers', () => {
    test('onPlaying', () => {
      const mock = {
        onPlaying: () => {}
      }
      const spy = jest.spyOn(mock, 'onPlaying');
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PLAYING}
          onPlaying={mock.onPlaying}
        />,
        options,
      );

      const instance = testRenderer.getInstance() as any;
      instance.handleTimeUpdate({ target: {} });

      expect(spy).toHaveBeenCalled();
    });
  })

  describe('equalizer', () => {
    test('biQuadFilter', () => {
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          equalizer={{ 40: 4 }}
        />,
        options,
      );

      const instance = testRenderer.getInstance() as any;
      expect(instance.filters[0].frequency.value).toEqual(40);
      expect(instance.filters[0].gain.value).toEqual(4);

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          equalizer={{ 40: 89 }}
        />
      )
      expect((instance as any).filters[0].gain.value).toEqual(89);
    });

    test('preAmp', () => {
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          equalizer={{ 40: 4, 50: 10 }}
          preAmp={10}
        />,
        options,
      );

      const instance = testRenderer.getInstance() as any;
      expect(instance.filters[0].gain.value).toEqual(14);
      expect(instance.filters[1].gain.value).toEqual(20);

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          equalizer={{ 40: 4, 50: 10 }}
          preAmp={5}
        />
      )
      expect(instance.filters[0].gain.value).toEqual(9);
      expect(instance.filters[1].gain.value).toEqual(15);
    });

    test('filter type', () => {
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PAUSED}
          equalizer={{ 40: 4, 50: 10, 60: 45, 70: 34 }}
          preAmp={10}
        />,
        options,
      );

      const instance = testRenderer.getInstance() as any;

      expect(instance.filters[0].type).toEqual('lowshelf');
      expect(instance.filters[1].type).toEqual('peaking');
      expect(instance.filters[2].type).toEqual('peaking');
      expect(instance.filters[3].type).toEqual('highshelf');
    });

    test('visualization', next => {
      const mock = {
        vizHandler: () => {}
      }

      const spy = jest.spyOn(mock, 'vizHandler');
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PLAYING}
          equalizer={{ 40: 4, 50: 10, 60: 45, 70: 34 }}
          preAmp={10}
          onVisualizationChange={mock.vizHandler}
        />,
        options,
      );
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        testRenderer.update(<Sound url='http://foo.ogg' playStatus={Sound.status.PAUSED} />)
        next();
      }, 100);
    });

    test('visualization toggle', next => {
      const mock = {
        vizHandler: () => {}
      }

      const spy = jest.spyOn(mock, 'vizHandler');
      const testRenderer = TestRenderer.create(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PLAYING}
          equalizer={{ 40: 4, 50: 10, 60: 45, 70: 34 }}
        />,
        options,
      );

      testRenderer.update(
        <Sound
          url="http://foo.ogg"
          playStatus={Sound.status.PLAYING}
          equalizer={{ 40: 4, 50: 10, 60: 45, 70: 34 }}
          onVisualizationChange={mock.vizHandler}
        />
      );

      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        testRenderer.update(
          <Sound
            url="http://foo.ogg"
            playStatus={Sound.status.STOPPED}
            equalizer={{ 40: 4, 50: 10, 60: 45, 70: 34 }}
          />
        );
        next();
      }, 100);
    })
  });
});

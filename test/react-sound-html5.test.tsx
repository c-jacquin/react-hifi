/* tslint:disable:no-empty */
import React from 'react';
import TestRenderer from 'react-test-renderer';
import Sound from '../src/react-sound-html5';

const noop = () => {};

/**
 * Sound test
 */
describe('Sound Component test', () => {
  it('should render', () => {
    const foo = TestRenderer.create(
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
      {
        createNodeMock: (element) => {
          if (element.type === 'audio') {
            return {
              pause() {},
              play: () => {}
            }
          }
          return null;
        }
      }
    );
    expect(foo).toBeDefined();
  });
});

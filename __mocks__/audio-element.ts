/* tslint:disable:no-empty */
import { ReactElement } from 'react';

export const audioElementMock = {
  pause() {},
  play: () => Promise.resolve(),
  currentTime: 0,
};

export const options = {
  createNodeMock: (element: ReactElement<any>) => {
    if (element.type === 'audio') {
      return audioElementMock;
    }
    return null;
  },
};

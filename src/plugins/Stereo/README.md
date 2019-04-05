```jsx
import React, { useState } from 'react';
import { Sound } from 'sound';
import { Stereo } from 'plugins';
import {
  BasicControls,
  StereoControl
} from 'player';

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    stereo: 0,
    loading: false,
    position: 0
  });

  return (
    <div>
      <Sound
        url="demo.mp3"
        playStatus={state.status}
        position={state.position}
        onFinishedPlaying={() => setState({ ...state, status: Sound.status.STOPPED })}
        onLoad={() => setState({ ...state, loading: false })}
        onLoading={() => setState({ ...state, loading: true })}
        onPlaying={data => setState({ ...state, ...data  })}
      >
        <Stereo value={state.stereo} />
      </Sound>
      <BasicControls
        onPlay={() => setState({ ...state, status: Sound.status.PLAYING })}
        onPause={() => setState({ ...state, status: Sound.status.PAUSED })}
        onStop={() => setState({ ...state, status: Sound.status.STOPPED })}
        duration={state.duration}
        position={state.position}
        onTimeChange={evt => setState({ ...state, position: Number(evt.target.value) })}
      />
      <StereoControl value={state.stereo} onChange={evt => setState({ ...state, stereo: Number(evt.target.value) })} />
    </div>
  );
};

<Player />
```

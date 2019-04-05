```jsx
import React, { useState } from 'react';
import { Sound } from 'sound';
import { BiQuadFilter } from 'plugins';
import { BasicControls } from 'player';

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    loading: false,
    position: 0,
    filter: 0
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
        <BiQuadFilter value={state.filter} freq={170} />
      </Sound>
      <BasicControls
        onPlay={() => setState({ ...state, status: Sound.status.PLAYING })}
        onPause={() => setState({ ...state, status: Sound.status.PAUSED })}
        onStop={() => setState({ ...state, status: Sound.status.STOPPED })}
        duration={state.duration}
        position={state.position}
        onTimeChange={evt => setState({ ...state, position: Number(evt.target.value) })}
      />
      <input
        type="range"
        min={-10}
        max={10}
        value={state.filter}
        onChange={evt => setState({ ...state, filter: Number(evt.target.value) })}
      />
    </div>
  );
};

<Player />
```

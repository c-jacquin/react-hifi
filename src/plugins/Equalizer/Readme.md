## Full Example

```jsx
import React, { useState } from 'react';
import { Sound } from 'sound';
import { Equalizer } from 'plugins';
import {
  BasicControls,
  Equalizer as EqControls
} from 'player';

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    volume: 100,
    stereo: 0,
    loading: false,
    position: 0
  });

  const [eq, setEq] = useState({
    '60': 0,
    '170': 0,
    '310': 0,
    '600': 0,
    '1000': 0,
    '3000': 0,
    '6000': 0,
    '12000': 0,
    '14000': 0,
    '16000': 0
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
        <Equalizer data={eq} />
      </Sound>
      <BasicControls
        onPlay={() => setState({ ...state, status: Sound.status.PLAYING })}
        onPause={() => setState({ ...state, status: Sound.status.PAUSED })}
        onStop={() => setState({ ...state, status: Sound.status.STOPPED })}
        duration={state.duration}
        position={state.position}
        onTimeChange={evt => setState({ ...state, position: Number(evt.target.value) })}
      />
      <EqControls
        values={eq}
        onChange={setEq}  
      />
    </div>
  );
};

<Player />
```

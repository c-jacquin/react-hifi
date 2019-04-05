```ts
enum SoundStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

type OnPlayingArgs = {
  position: number;
  duration: number;
};
```

The Ui components used in the styleguide are just here to make styleguide usable, they are not exposed by the library.

## Simple usecase

Simply replace Sound.status.PAUSED with Sound.status.PLAYING

```jsx
import { Sound } from './index.tsx';

<Sound url="demo.mp3" playStatus={Sound.status.PAUSED} />
```

## Real life example

```jsx
import React, { useState } from 'react';
import { Sound } from 'sound';
import { BasicControls } from 'player';

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    loading: false,
    duration: 0,
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
      />
      <BasicControls
        onPlay={() => setState({ ...state, status: Sound.status.PLAYING })}
        onPause={() => setState({ ...state, status: Sound.status.PAUSED })}
        onStop={() => setState({ ...state, status: Sound.status.STOPPED })}
        duration={state.duration}
        position={state.position}
        onTimeChange={evt => setState({ ...state, position: Number(evt.target.value) })}
      />
    </div>
  );
};

<Player />
```

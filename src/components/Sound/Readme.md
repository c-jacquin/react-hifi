# Sound

## Simple usecase

```jsx
import { Sound } from './index.tsx';

<Sound
  url="demo.mp3"
  playStatus={Sound.status.PAUSED}
  onFinishedPlaying={console.log}
  onLoad={console.log}
  onLoading={console.log}
  onPlaying={console.log}
  position={5}
  volume={10}
/>
```

## Full example

```jsx
import React, { useState } from 'react';
import { Sound } from './index.tsx';

const VerticalSlider = ({
  value,
  onChange
}) => (
  <input
    type="range"
    orient="vertical"
    min="-10"
    max="10"
    value={value}
    onChange={onChange}
    style={{
      WebkitAppearance: 'slider-vertical',
      width: '8px',
      height: '175px',
      padding: '0 5px'
    }}
  />
);

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    position: 0,
    duration: 0,
    volume: 10
  });
  const [eq, setEq] = useState({
    '50': 0,
    '5000': 0,
    '15000': 0
  });

  return (
    <div>
      <div>
        <p>Equalizer</p>
        {Object.keys(eq).map(freq => (
          <VerticalSlider
            key={freq}
            value={eq[freq]}
            onChange={evt => setEq({ ...eq, [freq]: Number(evt.target.value) })}
          />
        ))}
      </div>
      <button
        onClick={() => setState({ ...state, status: Sound.status.PLAYING })}
      >
        Play
      </button>
      <button
        onClick={() => setState({ ...state, status: Sound.status.PAUSED })}
      >
        Pause
      </button>
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={state.volume}
        onChange={evt => setState({ ...state, volume: Number(evt.target.value) })}
      />
      <div>
        <input
          type="range"
          min="0"
          max={state.duration}
          step="0.1"
          value={state.position}
          onChange={evt => setState({ ...state, position: Number(evt.target.value) })}
        />
      </div>
      <Sound
        url="demo.mp3"
        playStatus={state.status}
        onFinishedPlaying={console.log}
        onLoad={console.log}
        onLoading={console.log}
        onPlaying={data => setState({ ...state, ...data  })}
        position={state.position}
        volume={state.volume}
        equalizer={eq}
      />
    </div>
  );
};

<Player />
```
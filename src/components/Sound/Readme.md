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

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

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

  const canvas = React.createRef();
  let canvasContext;

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
      <canvas
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={canvas}
      />
      <Sound
        url="http://localhost:8080/demo.mp3"
        playStatus={state.status}
        onFinishedPlaying={console.log}
        onLoad={console.log}
        onLoading={console.log}
        onPlaying={data => setState({ ...state, ...data  })}
        onVisualizationChange={data => {
          console.log(data)
          if (canvas.current) {
            if (!canvasContext) {
              canvasContext = canvas.current.getContext('2d');
              canvasContext.fillStyle = 'rgb(0, 0, 0)';
              canvasContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            }

            const barWidth = (CANVAS_WIDTH / data.length);
            let barHeight;
            let barPositionY;
            let barPositionX = 0;

            for(let i = 0; i < data.length; i++) {
              barHeight = data[i] * 4;
              barPositionY = CANVAS_HEIGHT - barHeight / 2;

              canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
              canvasContext.fillRect(barPositionX, barPositionY, barWidth, barHeight);

              barPositionX += barWidth + 1;
            }
          }
        }}
        position={state.position}
        volume={state.volume}
        equalizer={eq}
      />
    </div>
  );
};

<Player />
```

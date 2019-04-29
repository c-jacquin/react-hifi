```jsx
import React, { useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Sound } from 'sound';
import { Osciloscope } from 'plugins';
import {
  BasicControls,
  barChartConfig
} from 'player';

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    loading: false,
    position: 0,
  });

  const canvasElement = useRef();
  let ctx;

  const handleDataViz = (data) => {
    if (!ctx) {
      ctx = canvasElement.current.getContext('2d');
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasElement.current.width, canvasElement.current.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'green';

    ctx.beginPath();

    const [x, y] = data.pop();
    ctx.moveTo(x, y);

    data.forEach(([x, y]) => ctx.lineTo(x, y));

    ctx.lineTo(canvasElement.current.width, canvasElement.current.height / 2);
    ctx.stroke();
  };

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
        <Osciloscope
          onVisualisationData={handleDataViz}
          height={canvasElement.current && canvasElement.current.height}
          width={canvasElement.current && canvasElement.current.width}
        />
      </Sound>
      <BasicControls
        onPlay={() => setState({ ...state, status: Sound.status.PLAYING })}
        onPause={() => setState({ ...state, status: Sound.status.PAUSED })}
        onStop={() => setState({ ...state, status: Sound.status.STOPPED })}
        duration={state.duration}
        position={state.position}
        onTimeChange={evt => setState({ ...state, position: Number(evt.target.value) })}
      />
      <div>
        <canvas style={{ width: '100%', height: '200px' }} ref={canvasElement} />
      </div>
    </div>
  );
};

<Player />
```

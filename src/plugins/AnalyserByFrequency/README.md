```jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Sound } from 'sound';
import { AnalyserByFrequency } from 'plugins';
import {
  BasicControls,
  barChartConfig
} from 'player';

const Player = () => {
  const [state, setState] = useState({
    status: Sound.status.PAUSED,
    loading: false,
    position: 0,
    frequency: [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]
  });

  const [dataViz, setDataViz] = useState([]);

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
        <AnalyserByFrequency
          frequencies={state.frequency}
          onVisualisationData={setDataViz}
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
      <Bar
        data={{
          labels: state.frequency,
          datasets: [{
            backgroundColor: 'rgba(255,99,132,0.2)',
            data: dataViz
          }]
        }}
        width={100}
        height={200}
        options={barChartConfig}
      />
    </div>
  );
};

<Player />
```

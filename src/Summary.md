```jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Sound } from 'sound';
import { Volume, Stereo, BiQuadFilter, AnalyserByFrequency, Equalizer as EqPlugin } from 'plugins';
import {
  BasicControls,
  VolumeControl,
  StereoControl,
  Equalizer,
  barChartConfig
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

  const [dataViz, setDataViz] = useState([]);

  const frequencies = Object.keys(eq);

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
        <Volume value={state.volume} />
        <Stereo value={state.stereo} />
        <EqPlugin data={eq} />
        <AnalyserByFrequency
          frequencies={frequencies}
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
      >
        <VolumeControl
          value={state.volume}
          onChange={evt => setState({ ...state, volume: Number(evt.target.value) })}
        />
      </BasicControls>
      <StereoControl value={state.stereo} onChange={evt => setState({ ...state, stereo: Number(evt.target.value) })} />
      <Equalizer
        values={eq}
        onChange={setEq}  
      />
      <Bar
        data={{
          labels: frequencies,
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

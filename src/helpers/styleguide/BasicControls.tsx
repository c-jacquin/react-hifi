import React from 'react';

interface ControlsProps {
  loading: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onTimeChange: (foo: any) => void;
  position: number;
  duration: number;
}

export const BasicControls: React.FunctionComponent<ControlsProps> = ({
  loading,
  onPlay,
  onPause,
  onStop,
  onTimeChange,
  position,
  duration,
  children
}) => (
  <div>
    <div>
      {!loading && (
        <React.Fragment>
          <button onClick={onPlay}>Play</button>
          <button onClick={onPause}>Pause</button>
          <button onClick={onStop}>Stop</button>
        </React.Fragment>
      )}
    {children}
    {loading && <span>loading</span>}
    </div>
    <div>
      <input
        type="range"
        min="0"
        max={duration}
        step="0.1"
        value={position}
        onChange={onTimeChange}
      />
    </div>
  </div>
);

interface StereoControlProps {
  onChange: (foo: any) => void;
  value: number;
}

export const StereoControl: React.FunctionComponent<StereoControlProps> = ({ onChange, value }) => (
  <div>
    <input
      type="range"
      min="-1"
      max="1"
      step="0.1"
      value={value}
      onChange={onChange}
    />
  </div>
);

interface VolumeControlProps {
  onChange: (foo: any) => void;
  value: number;
}

export const VolumeControl: React.FunctionComponent<VolumeControlProps> = ({ onChange, value }) => (
  <input type="range" min="0" max="100" step="0.1" value={value} onChange={onChange} />
);

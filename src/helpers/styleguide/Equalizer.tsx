import React, { CSSProperties } from 'react';

interface VerticalSliderProps {
  value: number;
  onChange: (evt: any) => void;
  style?: CSSProperties;
}

export const VerticalSlider: React.FunctionComponent<VerticalSliderProps> = ({
  value,
  onChange,
  style,
}) => (
  <input
    type="range"
    min={-12}
    max={12}
    step="1"
    value={Number(value)}
    onChange={onChange}
    style={{
      ...style,
      WebkitAppearance: 'slider-vertical',
      width: '8px',
      height: '175px',
      padding: '0 5px',
    }}
  />
);

interface EqualizerProps {
  onChange: (foo: any) => void;
  values: number[];
}

export const Equalizer: React.FunctionComponent<EqualizerProps> = ({ onChange, values }) => (
  <div>
    {Object.keys(values).map(freq => (
      <VerticalSlider
        key={freq}
        value={values[freq as any]}
        onChange={evt => onChange({ ...values, [freq]: Number(evt.target.value) })}
      />
    ))}
  </div>
);

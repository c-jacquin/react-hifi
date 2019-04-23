import React, { CSSProperties, useRef } from 'react';

interface VerticalSliderProps {
  value: number;
  onChange: (evt: any) => void;
  style?: CSSProperties;
}

export const VerticalSlider: React.FunctionComponent<VerticalSliderProps> = ({
  value,
  onChange,
  style,
}) => {
  const ref = useRef(null);

  if (ref && ref.current && (ref as any).current.getAttribute('orient') !== 'vertical') {
    (ref as any).current.setAttribute('orient', 'vertical');
  }

  return (
    <input
      type="range"
      min={-12}
      max={12}
      step={0.1}
      value={Number(value)}
      onChange={onChange}
      ref={ref}
      style={{
        ...style,
        WebkitAppearance: 'slider-vertical',
        width: '8px',
        height: '175px',
        padding: '0 5px',
      }}
    />
  );
};

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

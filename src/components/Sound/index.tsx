import React from 'react';

enum SoundStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

type OnPlayingArgs = {
  position: number;
  duration: number;
};

/**
 * Sound Props
 */
export interface ISoundProps {
  url: string;
  playStatus?: string;
  position?: number;
  /** volume */
  volume?: number;
  onPlaying?: (args: OnPlayingArgs) => void;
  onFinishedPlaying?: (event: any) => void;
  onLoading?: (event: any) => void;
  onLoad?: (event: any) => void;
  onVisualizationChange?: (data: number[]) => void;
  equalizer?: Record<string, number>;
  preAmp?: number;
  stereoPan?: number;
}

/**
 * Sound Component
 */
export class Sound extends React.Component<ISoundProps> {
  private audio: HTMLAudioElement;
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private source: MediaElementAudioSourceNode;
  private filters: BiquadFilterNode[] = [];
  private analyser: AnalyserNode;
  private stereoPanner: StereoPannerNode;
  private qValues: Array<number | null>;
  private frequencyData: Uint8Array;
  private animationFrame: number;

  public static status = SoundStatus;

  constructor(props: ISoundProps) {
    super(props);

    this.handleVisualizationChange = this.handleVisualizationChange.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.attachRef = this.attachRef.bind(this);
  }

  private attachRef(element: HTMLAudioElement) {
    if (element) {
      this.audio = element;
    }
  }

  private createFilterNodes() {
    let lastInChain = this.gainNode;
    const { equalizer, preAmp = 0 } = this.props;

    if (equalizer) {
      this.qValues = Object.keys(equalizer).map((freq, i, arr) => {
        if (!i || i === arr.length - 1) {
          return null;
        } else {
          return (2 * Number(freq)) / Math.abs(Number(arr[i + 1]) - Number(arr[i - 1]));
        }
      });

      Object.keys(equalizer).forEach((freq, i, arr) => {
        const biquadFilter = this.audioContext.createBiquadFilter();

        biquadFilter.type = 'peaking';
        biquadFilter.frequency.value = Number(freq);
        biquadFilter.gain.value = equalizer[freq] + preAmp;

        if (!i || i === arr.length - 1) {
          biquadFilter.type = i ? 'highshelf' : 'lowshelf';
        } else {
          biquadFilter.Q.value = this.qValues[i] as number;
        }

        if (lastInChain) {
          lastInChain.connect(biquadFilter);
        }

        lastInChain = biquadFilter;

        this.filters.push(biquadFilter);
      });
    }

    return lastInChain;
  }

  private formatDataVizByFrequency(data: Uint8Array) {
    const { equalizer } = this.props;
    const values = [];
    const HERTZ_ITER = 23.4;
    let currentIndex = 0;

    if (equalizer) {
      const frequencies = Object.keys(equalizer).map(Number);
      for (let i = 0; i <= frequencies[frequencies.length - 1] + HERTZ_ITER; i = i + HERTZ_ITER) {
        const freq = frequencies[currentIndex];

        if (i > freq && i < freq + HERTZ_ITER) {
          currentIndex++;

          values.push(data[Math.round(i / HERTZ_ITER)]);
        }
      }
    }

    return values;
  }

  private handleVisualizationChange() {
    this.animationFrame = requestAnimationFrame(this.handleVisualizationChange);
    this.analyser.getByteFrequencyData(this.frequencyData);

    if (this.props.onVisualizationChange) {
      this.props.onVisualizationChange(this.formatDataVizByFrequency(this.frequencyData));
    }
  }

  private handleTimeUpdate({ target }: any) {
    if (this.props.onPlaying) {
      this.props.onPlaying({
        position: target.currentTime,
        duration: target.duration,
      });
    }
  }

  private setPlayerState() {
    switch (this.props.playStatus) {
      case Sound.status.PAUSED:
        this.pause();
        break;
      case Sound.status.STOPPED:
        this.stop();
        break;
      case Sound.status.PLAYING:
      default:
        this.play();
        break;
    }
  }

  private shouldUpdatePosition({ position: prevPosition = 0 }: ISoundProps) {
    const { position } = this.props;

    if (position) {
      const dif = position - prevPosition;

      return position < prevPosition || dif > 1;
    } else {
      return false;
    }
  }

  private shouldUpdateEqualizer(prevProps: ISoundProps) {
    const { equalizer, preAmp } = this.props;

    return (
      equalizer &&
      prevProps.equalizer &&
      !(
        Object.entries(equalizer).toString() ===
        Object.entries(prevProps.equalizer).toString()
      )
    ) ||
    preAmp !== prevProps.preAmp
  }

  private setVolume() {
    const { volume = 100 } = this.props;

    this.gainNode.gain.value = volume / 100;
  }

  private setPosition() {
    if (this.props.position) {
      this.audio.currentTime = this.props.position;
    }
  }

  private setStereoPan() {
    this.stereoPanner.pan.value = this.props.stereoPan || 0;
  }

  protected play() {
    this.audio
      .play()
      .then(() =>
        !!this.props.onVisualizationChange &&
        !!this.props.equalizer &&
        this.handleVisualizationChange(),
      )
      .catch(console.error);
  }

  protected pause() {
    this.audio.pause();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  protected stop() {
    this.pause();
    this.audio.currentTime = 0;
  }

  componentDidUpdate(prevProps: ISoundProps) {
    const {
      volume,
      playStatus,
      equalizer = {},
      preAmp = 0,
      stereoPan = 0
    } = this.props;

    if (volume !== prevProps.volume) {
      this.setVolume();
    }

    if (this.shouldUpdatePosition(prevProps)) {
      this.setPosition();
    }

    if (playStatus !== prevProps.playStatus) {
      this.setPlayerState();
    }

    if (stereoPan !== prevProps.stereoPan) {
      this.setStereoPan();
    }

    if (!prevProps.onVisualizationChange && this.props.onVisualizationChange && this.props.equalizer) {
      this.handleVisualizationChange();
    }

    if (prevProps.onVisualizationChange && !this.props.onVisualizationChange) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.shouldUpdateEqualizer(prevProps)) {
      Object.values(equalizer).forEach((value, idx) => {
        this.filters[idx].gain.value = value + preAmp;
      });
    }
  }

  componentDidMount() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.stereoPanner = new StereoPannerNode(
      this.audioContext,
      { pan: this.props.stereoPan || 0 }
    );
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 32768;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.source.connect(this.gainNode);
    this.createFilterNodes()
      .connect(this.analyser)
      .connect(this.stereoPanner)
      .connect(this.audioContext.destination);

    this.setVolume();
    this.setPlayerState();
    this.setStereoPan();
  }

  render() {
    return (
      <audio
        crossOrigin="anonymous"
        style={{ visibility: 'hidden' }}
        src={this.props.url}
        ref={this.attachRef}
        onTimeUpdate={this.props.onPlaying ? this.handleTimeUpdate : undefined}
        onEnded={this.props.onFinishedPlaying}
        onLoadStart={this.props.onLoading}
        onLoad={this.props.onLoad}
      />
    );
  }
}

import React from 'react';

enum SoundStatus {
  PAUSED,
  PLAYING,
  STOPPED,
}

type OnPlayingArgs = {
  position: number;
  duration: number;
};

interface SoundProps {
  url: string;
  playStatus: SoundStatus;
  onPlaying: (args: OnPlayingArgs) => void;
  onFinishedPlaying: (event: any) => void;
  onLoading: (event: any) => void;
  onLoad: (event: any) => void;
  position: number;
  volume: number;
  equalizer?: Record<string, number>;
}

class Sound extends React.Component<SoundProps> {
  audio: HTMLAudioElement;
  audioContext: AudioContext;
  gainNode: GainNode;
  source: MediaElementAudioSourceNode;
  filters: BiquadFilterNode[] = [];
  qValues: Array<number | null>;

  static status = SoundStatus;

  constructor(props: SoundProps) {
    super(props);

    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.attachRef = this.attachRef.bind(this);
  }

  attachRef(element: HTMLAudioElement) {
    if (element) {
      this.audio = element;
      this.audio.crossOrigin = 'anonymous';
    }
  }

  createFilterNodes() {
    let lastInChain = this.gainNode;

    if (this.props.equalizer) {
      this.qValues = Object.keys(this.props.equalizer).map((freq, i, arr) => {
        if (!i || i === arr.length - 1) {
          return null;
        } else {
          return (2 * Number(freq)) / Math.abs(Number(arr[i + 1]) - Number(arr[i - 1]));
        }
      });

      Object.keys(this.props.equalizer).forEach((freq, i, arr) => {
        const biquadFilter = this.audioContext.createBiquadFilter();

        biquadFilter.type = 'peaking';
        biquadFilter.frequency.value = Number(freq);
        biquadFilter.gain.value = this.props.equalizer![freq] || 0;
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

  handleTimeUpdate({ target }: any) {
    this.props.onPlaying({
      position: target.currentTime,
      duration: target.duration,
    });
  }

  setPlayerState() {
    switch (this.props.playStatus) {
      case Sound.status.PAUSED:
        this.audio.pause();
        break;
      case Sound.status.PLAYING:
        this.audio.play();
        break;
      case Sound.status.STOPPED:
        this.audio.pause();
        this.audio.currentTime = 0;
        break;
    }
  }

  shouldUpdatePosition(previousPosition: number) {
    const dif = this.props.position - previousPosition;

    return this.props.position < previousPosition || dif > 1;
  }

  setVolume() {
    this.gainNode.gain.value = this.props.volume / 100;
  }

  setPosition() {
    this.audio.currentTime = this.props.position;
  }

  componentDidUpdate(prevProps: SoundProps) {
    if (this.props.volume !== prevProps.volume) {
      this.setVolume();
    }

    if (this.shouldUpdatePosition(prevProps.position)) {
      this.setPosition();
    }

    if (this.props.playStatus !== prevProps.playStatus) {
      this.setPlayerState();
    }

    if (this.props.equalizer && prevProps.equalizer) {
      if (
        !(
          Object.entries(this.props.equalizer).toString() ===
          Object.entries(prevProps.equalizer).toString()
        )
      ) {
        Object.values(this.props.equalizer).forEach((value, idx) => {
          this.filters[idx].gain.value = value;
        });
      }
    }
  }

  componentDidMount() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.source = this.audioContext.createMediaElementSource(this.audio);

    this.source.connect(this.gainNode);
    this.createFilterNodes().connect(this.audioContext.destination);

    this.setVolume();
    this.setPlayerState();
  }

  render() {
    return (
      <audio
        autoPlay
        style={{ visibility: 'hidden' }}
        src={this.props.url}
        ref={this.attachRef}
        onTimeUpdate={this.handleTimeUpdate}
        onEnded={this.props.onFinishedPlaying}
        onLoadStart={this.props.onLoading}
        onLoad={this.props.onLoad}
      />
    );
  }
}

export default Sound;

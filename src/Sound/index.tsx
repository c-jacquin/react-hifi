import React, { ReactElement, memo } from 'react';

import { ContextProvider, AudioState } from '../AudioContext';
import { pluginFactory } from '../plugins';

enum SoundStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

type OnPlayingArgs = {
  position: number;
  duration: number;
};

const Destination = memo(
  pluginFactory<{}, AudioDestinationNode>({
    createNode(audioContext: AudioContext) {
      return audioContext.destination;
    },
  }),
  () => true,
);

/**
 * Sound Props
 */
export interface SoundProps {
  /** the url of the stream to play */
  url: string;
  /** PLAYING, PAUSED or STOPPED */
  playStatus?: SoundStatus;
  /** the position in second */
  position?: number;
  /** onTimeUpdate handler */
  onPlaying?: (args: OnPlayingArgs) => void;
  /** trigger when the sound is over */
  onFinishedPlaying?: (event: any) => void;
  /** trigger when the load start */
  onLoading?: (event: any) => void;
  /** trigger when the file is ready to play */
  onLoad?: (event: any) => void;
  children?: ReactElement[] | ReactElement;
}

export interface SoundState extends AudioState {
  /** message to display in case of error */
  error?: string;
}

/**
 * Sound Component
 */
export class Sound extends React.Component<SoundProps, SoundState> {
  private audio: HTMLAudioElement;
  private source: MediaElementAudioSourceNode;
  private animationFrame: number;

  public state: SoundState = {
    audioContext: new AudioContext(),
  };

  public static status = SoundStatus;

  constructor(props: SoundProps) {
    super(props);

    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.attachRef = this.attachRef.bind(this);
    this.updateLastInChain = this.updateLastInChain.bind(this);
  }

  private attachRef(element: HTMLAudioElement): void {
    if (element) {
      this.audio = element;
    }
  }

  private renderPlugins() {
    const { children } = this.props;

    if (Array.isArray(children)) {
      const flatChildren = children.flat();

      return [
        flatChildren.map((plugin, idx) => (
          <plugin.type {...plugin.props} position={idx + 1} key={idx + 1} audioContext={this.state.audioContext} />
        )),
      <Destination position={flatChildren.length + 1} key={flatChildren.length + 1} />,
      ]
    } else if(children) {
      return [
        <children.type {...children.props} position={1} key={1} audioContext={this.state.audioContext} />,
        <Destination position={2} key={2} />,
      ]
    } else {
      return null;
    }
  }

  private renderError() {
    return this.state.error && <span>{this.state.error}</span>;
  }

  private updateLastInChain(lastInChain: any) {
    setTimeout(() => {
      this.setState({
        lastInChain,
      });
    });
  }

  private handleTimeUpdate({ target }: any): void {
    if (this.props.onPlaying) {
      this.props.onPlaying({
        position: target.currentTime,
        duration: target.duration,
      });
    }
  }

  private setPlayerState(status?: SoundStatus): void {
    switch (status) {
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

  private shouldUpdatePosition({ position: nextPosition }: SoundProps): boolean {
    const { position } = this.props;

    if (position && nextPosition) {
      const dif = nextPosition - position;

      return position > nextPosition || dif > 1;
    } else {
      return false;
    }
  }

  private setPosition(position: number): void {
    this.audio.currentTime = position;
  }

  private play(): void {
    this.state.audioContext
      .resume()
      .then(() => this.audio.play())
      .catch(console.error);
  }

  private pause(): void {
    this.state.audioContext
      .suspend()
      .then(() => this.audio.pause())
      .catch(console.error);
  }

  private stop(): void {
    this.pause();
    this.audio.currentTime = 0;
  }

  componentWillReceiveProps(nextProps: SoundProps) {
    const { playStatus, url } = this.props;

    if ((nextProps.playStatus && playStatus !== nextProps.playStatus) || url !== nextProps.url) {
      this.setPlayerState(nextProps.playStatus);
    }

    if (this.shouldUpdatePosition(nextProps)) {
      this.setPosition(nextProps.position as number);
    }
  }

  componentDidMount() {
    this.source = this.state.audioContext.createMediaElementSource(this.audio);

    if (!this.props.children) {
      this.source.connect(this.state.audioContext.destination);
    } else {
      this.setState({
        lastInChain: this.source,
      });
    }

    this.setPlayerState(this.props.playStatus);

    this.props.position && this.setPosition(this.props.position);
  }

  componentWillUnmount() {
    this.state.audioContext.close().catch(console.error);
  }

  componentDidCatch(err: Error) {
    this.state.audioContext.close().catch(console.error);
    this.setState({ error: err.message });
  }

  render() {
    const { url, onPlaying, onFinishedPlaying, onLoad, onLoading } = this.props;

    return (
      <ContextProvider context={{ ...this.state, updateLastInChain: this.updateLastInChain }}>
        <audio
          crossOrigin="anonymous"
          style={{ visibility: 'hidden' }}
          src={url}
          ref={this.attachRef}
          onTimeUpdate={onPlaying ? this.handleTimeUpdate : undefined}
          onEnded={onFinishedPlaying}
          onLoadStart={onLoading}
          onCanPlay={onLoad}
        />
        {this.renderError()}
        {this.renderPlugins()}
      </ContextProvider>
    );
  }
}

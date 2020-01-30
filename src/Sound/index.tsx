import React, { ReactElement } from 'react';

import { pluginFactory } from '../plugins';

enum SoundStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
  STOPPED = 'STOPPED',
}

const Destination = pluginFactory<{}, AudioDestinationNode>({
  createNode(audioContext: AudioContext) {
    return audioContext.destination;
  },
});

export enum SoundErrors {
  MEDIA_ERR_ABORTED = 'Video playback aborted by the user.',
  MEDIA_ERR_NETWORK = 'A network error caused the audio download to fail.',
  MEDIA_ERR_DECODE = 'The audio playback was aborted due to a corruption problem.',
  MEDIA_ERR_SRC_NOT_SUPPORTED = 'The audio playback can not be loaded, either because the server or network failed or because the format is not supported.',
  UNKNOWN = 'An unknown error occurred during audio playback loading.',
}

interface Stream {
  type: string;
  url: string;
}

type OnPlayingArgs = {
  position: number;
  duration: number;
};

/**
 * Sound Props
 */
export interface SoundProps {
  /** the url of the stream to play */
  url: string | Stream[];
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
  /** trigger when an error is thrown */
  onError?: (error: Error) => void;

  children?: ReactElement[] | ReactElement;
}

export interface SoundState {
  /** html5 AudioContext instance */
  audioContext: AudioContext;
  /** the AudioNode register by childrens  */
  audioNodes: AudioNode[];
}

/**
 * Sound Component
 */
export class Sound extends React.Component<SoundProps, SoundState> {
  private audio: HTMLAudioElement;
  private source: MediaElementAudioSourceNode;

  public state: SoundState = {
    audioContext: new AudioContext(),
    audioNodes: [],
  };

  public static status = SoundStatus;

  constructor(props: SoundProps) {
    super(props);

    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.attachRef = this.attachRef.bind(this);
    this.handleRegisterPlugin = this.handleRegisterPlugin.bind(this);
    this.handleError = this.handleError.bind(this);
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
        ...flatChildren.map((plugin, idx) => (
          <plugin.type
            {...plugin.props}
            key={idx}
            audioContext={this.state.audioContext}
            previousNode={this.state.audioNodes[idx]}
            onRegister={this.handleRegisterPlugin}
          />
        )),
        <Destination
          key={flatChildren.length}
          audioContext={this.state.audioContext}
          previousNode={this.state.audioNodes[flatChildren.length - 1]}
        />,
      ];
    } else if (children) {
      return [
        <children.type
          {...children.props}
          key={1}
          audioContext={this.state.audioContext}
          previousNode={this.state.audioNodes[0]}
          onRegister={this.handleRegisterPlugin}
        />,
        <Destination
          key={2}
          audioContext={this.state.audioContext}
          previousNode={this.state.audioNodes[1]}
        />,
      ];
    } else {
      return null;
    }
  }

  private handleRegisterPlugin(plugin: AudioNode) {
    this.setState({
      audioNodes: [...this.state.audioNodes, plugin],
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

  private shouldUpdatePosition({ position }: SoundProps): boolean {
    const { position: nextPosition } = this.props;

    if ((position || position === 0) && (nextPosition || nextPosition === 0)) {
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
    this.state.audioContext.resume().then(() => this.audio.play());
  }

  private pause(): void {
    this.state.audioContext.suspend().then(() => this.audio.pause());
  }

  private stop(): void {
    this.pause();
    this.audio.currentTime = 0;
  }

  private handleError(evt: any) {
    let error: Error;
    switch (evt.target.error.code) {
      case evt.target.error.MEDIA_ERR_ABORTED:
        error = new Error(SoundErrors.MEDIA_ERR_ABORTED);
        break;
      case evt.target.error.MEDIA_ERR_NETWORK:
        error = new Error(SoundErrors.MEDIA_ERR_NETWORK);
        break;
      case evt.target.error.MEDIA_ERR_DECODE:
        error = new Error(SoundErrors.MEDIA_ERR_DECODE);
        break;
      case evt.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        error = new Error(SoundErrors.MEDIA_ERR_SRC_NOT_SUPPORTED);
        break;
      default:
        error = new Error(SoundErrors.UNKNOWN);
        break;
    }
    this.props.onError && this.props.onError(error);
  }

  componentDidUpdate(prevProps: SoundProps) {
    const { playStatus, url } = this.props;

    if ((playStatus && prevProps.playStatus !== playStatus) || url !== prevProps.url) {
      this.setPlayerState(playStatus);
    }

    if (this.shouldUpdatePosition(prevProps)) {
      this.setPosition(this.props.position as number);
    }
  }

  componentDidMount() {
    this.source = this.state.audioContext.createMediaElementSource(this.audio);

    if (!this.props.children) {
      this.source.connect(this.state.audioContext.destination);
    } else {
      this.setState({
        audioNodes: [this.source],
      });
    }

    this.setPlayerState(this.props.playStatus);

    this.props.position && this.setPosition(this.props.position);
  }

  componentWillUnmount() {
    this.state.audioContext.close();
  }

  componentDidCatch(err: Error) {
    this.state.audioContext.close();
    this.props.onError && this.props.onError(err);
  }

  render() {
    const { url, onPlaying, onFinishedPlaying, onLoad, onLoading } = this.props;

    return (
      <React.Fragment>
        <audio
          crossOrigin="anonymous"
          style={{ visibility: 'hidden' }}
          src={Array.isArray(url) ? undefined : url}
          ref={this.attachRef}
          onTimeUpdate={onPlaying ? this.handleTimeUpdate : undefined}
          onEnded={onFinishedPlaying}
          onLoadStart={onLoading}
          onCanPlay={onLoad}
          onError={this.handleError}
        >
          {Array.isArray(url) &&
            url.map(({ url, type }, index) => <source key={index} type={type} src={url} />)}
        </audio>
        {this.renderPlugins()}
      </React.Fragment>
    );
  }
}

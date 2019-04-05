import React, { createContext, useState } from 'react';

export enum ContextState {
  RUNNING = 'running',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export interface AudioState {
  audioContext: AudioContext;
  lastInChain?: AudioNode;
}

export interface AudioContextState extends AudioState {
  updateLastInChain?: <N = AudioNode>(node: N) => void;
}

interface ContextProviderProps {
  context: AudioContextState;
}

const initialState: AudioContextState = {
  audioContext: new AudioContext(),
};

const { Provider, Consumer } = createContext<AudioContextState>(initialState);

const ContextProvider: React.FunctionComponent<ContextProviderProps> = ({ children, context }) => (
  <Provider value={context}>{children}</Provider>
);

export interface ContextConsumerContext {
  audioContext: AudioContext;
  lastInChain: AudioNode;
  updateLastInChain: <N = AudioNode>(node: N) => void;
}

interface ContextConsumerProps {
  children: (context: ContextConsumerContext) => React.ReactNode;
}

interface ContextConsumerState {
  prevNode?: AudioNode;
}

const ContextConsumer: React.FunctionComponent<ContextConsumerProps> = ({ children }) => {
  const [state, setState] = useState<ContextConsumerState>({});

  return (
    <Consumer>
      {context => {
        if (
          context.audioContext &&
          context.audioContext.state !== ContextState.CLOSED &&
          context.lastInChain &&
          context.updateLastInChain &&
          state.prevNode !== context.lastInChain
        ) {
          setState({ prevNode: context.lastInChain });
          children(context as ContextConsumerContext);
        } else {
          return null;
        }
      }}
    </Consumer>
  );
};

export { ContextConsumer, ContextProvider };

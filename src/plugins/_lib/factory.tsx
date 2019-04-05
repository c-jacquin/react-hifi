import React, { useState } from 'react';
import { ContextConsumer } from '../../AudioContext';
import { Plugin } from '../Plugin';

export interface PluginState<N = AudioNode> {
  node?: N;
  audioContext?: AudioContext;
}

export interface PluginProps {
  position: number;
  audioContext?: AudioContext;
}

export function pluginFactory<P, N = AudioNode>({
  createNode,
  updateNode,
}: Plugin<P, N>): React.FunctionComponent<P & PluginProps> {
  return props => {
    const [state, setState] = useState<PluginState<N>>({});

    if (!state.node) {
      let count = 0;

      return (
        <ContextConsumer>
          {({ updateLastInChain, lastInChain, audioContext }) => {
            count++;

            if (count === props.position) {
              const node = createNode(audioContext, props);

              setState({ node, audioContext });
              updateLastInChain<N>(node);
              lastInChain.connect(node as any);
            }

            return null;
          }}
        </ContextConsumer>
      );
    } else {
      updateNode && updateNode(state.node, props, state.audioContext as AudioContext);

      return null;
    }
  };
}

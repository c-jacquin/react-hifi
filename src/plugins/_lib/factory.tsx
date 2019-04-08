import React, { useState, memo } from 'react';
import { Plugin } from '../Plugin';

export interface PluginState<N = AudioNode> {
  node?: N;
  audioContext?: AudioContext;
}

export interface PluginProps<N> {
  audioContext?: AudioContext;
  previousNode?: AudioNode;
  onRegister?: (node: N) => void;
}

export function pluginFactory<P, N = AudioNode>({
  createNode,
  updateNode,
  shouldNotUpdate = () => true,
}: Plugin<P, N>): React.FunctionComponent<P & PluginProps<N>> {
  return memo(
    props => {
      const [node, setNode] = useState<N>();

      if (props.previousNode && props.audioContext && !node) {
        const node = createNode(props.audioContext, props);

        props.previousNode.connect(node as any);
        setNode(node);
        props.onRegister && props.onRegister(node);
      }

      node && updateNode && props.audioContext && updateNode(node, props, props.audioContext);

      return null;
    },
    (prevProps, nextProps) =>
      prevProps.previousNode === nextProps.previousNode && shouldNotUpdate(prevProps, nextProps),
  );
}

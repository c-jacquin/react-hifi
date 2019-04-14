import React, { useState, memo, useEffect } from 'react';
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
      let createdNode: N;
      const [node, setNode] = useState<N>();

      if (props.previousNode && props.audioContext && !node) {
        createdNode = createNode(props.audioContext, props);

        props.previousNode.connect(createdNode as any);
      }

      useEffect(() => {
        createdNode && setNode(createdNode);
      });

      useEffect(() => {
        if (node) {
          props.onRegister && props.onRegister(node);
        }
      }, [node]);

      node && updateNode && props.audioContext && updateNode(node, props, props.audioContext);

      return null;
    },
    (prevProps, nextProps) =>
      prevProps.previousNode === nextProps.previousNode && shouldNotUpdate(prevProps, nextProps),
  );
}

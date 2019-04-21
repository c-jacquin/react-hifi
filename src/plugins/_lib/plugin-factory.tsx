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

export function pluginFactory<P, N = AudioNode | AudioNode[]>({
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

        if (Array.isArray(createdNode)) {
          let lastInChain = createdNode[0];
          props.previousNode.connect(lastInChain);

          for (let i = 1; i < createdNode.length; i++) {
            lastInChain.connect(createdNode[i]);
            lastInChain = createdNode[i];
          }
        } else {
          props.previousNode.connect(createdNode as any);
        }
      }

      useEffect(() => {
        createdNode && setNode(createdNode);
      });

      useEffect(() => {
        if (node) {
          props.onRegister && props.onRegister(Array.isArray(node) ? node[node.length - 1] : node);
        }
      }, [node]);

      node && updateNode && props.audioContext && updateNode(node, props, props.audioContext);

      return null;
    },
    (prevProps, nextProps) =>
      prevProps.previousNode === nextProps.previousNode && shouldNotUpdate(prevProps, nextProps),
  );
}

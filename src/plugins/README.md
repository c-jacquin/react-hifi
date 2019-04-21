A plugin is simply an object wich match the interface below passed to pluginFactory.
This library give you access to a few presets.
Plugins can do everything allowed by the [html5 audio api](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

```ts
interface Plugin<Props, Node = AudioNode | AudioNode[]> {
  createNode(audioContext: AudioContext, props: Props): Node;
  updateNode?(node: Node, props: Props): void;
  shouldNotUpdate?(prevProps: MyNodeProps, nextProps: MyNodeProps): boolean;
}
```

```tsx
interface MyNodeProps {
  value: number;
}

const myCustomPlugin: Plugin<MyNodeProps, GainNode> = {
  createNode(ctx: AudioContext, props: MyNodeProps) {
    return ctx.createGain();
  },
  updateNode(node, props: MyNodeProps) {
    node.gain.value = props.value;
  }
  shouldNotUpdate(prevProps: MyNodeProps, nextProps: MyNodeProps) {
    return prevProps.value === nextProps.value;
  },
}

const MyNode = pluginFactory<MyNodeProps, GainNode>(myCustomPlugin);

render(
  <Sound url="http://foo/bar.mp3">
    <MyNode value={0.5} />
  </Sound>
)
```

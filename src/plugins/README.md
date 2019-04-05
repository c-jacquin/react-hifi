A plugin is simply an object wich match the interface below passed to pluginFactory.
This library give you access to a few presets.
Plugins can do everything allowed by the [html5 audio api](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

```ts
interface Plugin<Props, Node = AudioNode> {
  createNode(audioContext: AudioContext, props: Props): Node;
  updateNode?(node: Node, props: Props): void;
}
```

```tsx
const myCustomPlugin = {
  createNode(ctx, props) {
    return ctx.createGain();
  },
  updateNode(node, props) {
    node.gain.value = props.value;
  }
}

const MyNode = pluginFactory<{ value: number }, GainNode>(myCustomPlugin);

render(
  <Sound url="http://foo/bar.mp3">
    <MyNode value={0.5} />
    <Destination />
  </Sound>
)
```

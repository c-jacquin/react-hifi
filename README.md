# React-hifi

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Travis](https://img.shields.io/travis/charjac/react-hifi.svg)](https://travis-ci.org/charjac/react-hifi)
[![Coveralls](https://img.shields.io/coveralls/charjac/react-hifi.svg)](https://coveralls.io/github/charjac/react-hifi)
[![Dev Dependencies](https://david-dm.org/charjac/react-hifi/dev-status.svg)](https://david-dm.org/charjac/react-hifi?type=dev)

A composable Abstraction for AudioContext API with a easy to use react API.

check the [documentation](https://charjac.github.io/react-hifi/)

## Installation

```bash
npm i react-hifi
# or
yarn add react-hifi
```

## Example

```tsx
import React from 'react';
import { render } from 'react-dom';
import {
  Sound,
  Volume,
  Stereo,
  BiQuadFilter,
} from 'react-hifi';


render(
  <Sound url="http://foo/bar.mp3">
    <Volume value={50} />
    <Stereo value={0.5} />
    <BiQuadFilter value={5} type="peaking" />
  </Sound>
)

```

## Plugins

A plugin is simply an object wich match the interface below passed to pluginFactory.
This library give you access to a few basic plugin :
 - Volume
 - Stereo
 - BiQuadFilter
 - Equalizer
 - AnalyserByFrequency (visualisation)

Plugins can do everything allowed by the [html5 audio api](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext).

```ts
interface Plugin<Props, Node = AudioNode | AudioNode[]> {
  createNode(audioContext: AudioContext, props: Props): Node;
  updateNode?(node: Node, props: Props): void;
  shouldNotUpdate?(prevProps: MyNodeProps, nextProps: MyNodeProps): boolean;
}
```

lets rewrite the volume plugin

```tsx
import React from 'react';
import { render } from 'react-dom';
import Sound, { pluginFactory } from 'react-hifi';

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



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

### Example

```jsx
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

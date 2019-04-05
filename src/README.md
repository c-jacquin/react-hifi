## React-Sound-Html5

A composable Abstraction for AudioContext API with a easy to use react API.

### Installation

```bash
npm i react-sound-html5
# or
yarn add react-sound-html5
```

```tsx
<Sound url="http://foo/bar.mp3">
  <Volume value={50} />
  <Stereo value={0.5} />
  <BiQuadFilter value={5} type="peaking" />
</Sound>
```

# Sound

```jsx
import { Sound } from './index.tsx';

<Sound
  url="demo.mp3"
  playStatus={Sound.status.PLAYING}
  onFinishedPlaying={console.log}
  onLoad={console.log}
  onLoading={console.log}
  onPlaying={console.log}
  position={5}
  volume={10}
/>
```

import { useCallback, useEffect, useState } from "@lynx-js/react";

import "./App.css";
import arrow from "./assets/arrow.png";
import lynxLogo from "./assets/lynx-logo.png";
import reactLynxLogo from "./assets/react-logo.png";

export function App(props: { onMounted?: () => void }) {
  const [alterLogo, setAlterLogo] = useState(false);

  useEffect(() => {
    console.info("Hello, ReactLynx");
    props.onMounted?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTap = useCallback(() => {
    "background only";
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <view className="Banner">
          {/* @ts-expect-error TODO: fix ts */}
          <view bindtap={onTap} className="Logo">
            {alterLogo ? (
              // @ts-expect-error TODO: fix ts
              <image className="Logo--react" src={reactLynxLogo} />
            ) : (
              // @ts-expect-error TODO: fix ts
              <image className="Logo--lynx" src={lynxLogo} />
            )}
          </view>
          <text className="Title">React</text>
          <text className="Subtitle">on Lynx</text>
        </view>
        <view className="Content">
          {/* @ts-expect-error TODO: fix ts */}
          <image className="Arrow" src={arrow} />
          <text className="Description">Tap the logo and have fun!</text>
          <text className="Hint">
            Edit<text style={{ fontStyle: "italic" }}>{" src/App.tsx "}</text>
            to see updates!
          </text>
        </view>
        <view style={{ flex: 1 }} />
      </view>
    </view>
  );
}

import reactLogo from "@/assets/react.svg";
import { SayHelloInput } from "@/components/say-hello-input";
import { Card, CardContent } from "@/primitives/card";
import {
  envBun,
  envTauri,
  envVite,
  isBunEnv,
  isTauriEnv,
  isViteEnv,
} from "@/utils/env";

import { APITester } from "./APITester";
import bunLogo from "./assets/bun.svg";
import tauriLogo from "./assets/tauri.svg";
import viteLogo from "./assets/vite.svg";
import "./index.css";

export function App() {
  return (
    <div className="relative z-10 container mx-auto p-8 text-center">
      <div className="mb-8 flex items-center justify-center gap-8">
        {isBunEnv && (
          <a
            href="https://bun.sh/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="Bun Logo"
              className={`
                h-36 scale-120 p-6 transition-all duration-300
                hover:drop-shadow-[0_0_2em_#646cffaa]
              `}
              src={bunLogo}
            />
          </a>
        )}
        {isTauriEnv && (
          <>
            <a
              href="https://tauri.app/start"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="Tauri Logo"
                className={`
                  h-36 scale-120 p-6 transition-all duration-300
                  hover:drop-shadow-[0_0_2em_#646cffaa]
                `}
                src={tauriLogo}
              />
            </a>
            <a
              href="https://vitejs.dev/guide/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt="Vite Logo"
                className={`
                  h-36 scale-120 p-6 transition-all duration-300
                  hover:drop-shadow-[0_0_2em_#646cffaa]
                `}
                src={viteLogo}
              />
            </a>
          </>
        )}
        {!isBunEnv && !isTauriEnv && (
          <a
            href="https://vitejs.dev/guide/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="Vite Logo"
              className={`
                h-36 scale-120 p-6 transition-all duration-300
                hover:drop-shadow-[0_0_2em_#646cffaa]
              `}
              src={viteLogo}
            />
          </a>
        )}
        <a
          href="https://react.dev/learn"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="React Logo"
            className={`
              h-36 p-6 transition-all duration-300
              [animation:spin_20s_linear_infinite]
              hover:drop-shadow-[0_0_2em_#61dafbaa]
            `}
            src={reactLogo}
          />
        </a>
      </div>
      <Card className="border-muted bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h1 className="my-4 text-5xl leading-tight font-bold">Relbox</h1>
          <p
            className={`
              relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono
              text-sm
            `}
          >
            <code>
              environment:{" "}
              {isTauriEnv
                ? "tauri"
                : isViteEnv
                  ? "browser-vite"
                  : isBunEnv
                    ? "browser-bun"
                    : "browser"}
            </code>
            , <code>vite: {envVite}</code>, <code>bun: {envBun}</code>,{" "}
            <code>tauri: {envTauri}</code>
          </p>

          {/* TODO: when preparing deployment version - `dler build` should 
          remove this (with imports if needed) when target IS NOT BUN/TAURI */}
          {isBunEnv && <APITester />}
          {isTauriEnv && <SayHelloInput />}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

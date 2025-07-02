import reactLogo from "@/assets/react.svg";
import { Card, CardContent } from "@/primitives/card";
import { isBunEnv, isTauriEnv, isViteEnv } from "@/utils/env";

import { AppClientComponent } from "./App.client";
import bunLogo from "./assets/bun.svg";
import tauriLogo from "./assets/tauri.svg";
import viteLogo from "./assets/vite.svg";
import "./index.css";

const getEnvironmentMessage = () => {
  if (isTauriEnv) {
    return "Click on the Tauri, Vite, and React logos to learn more.";
  }
  if (isBunEnv) {
    return "Click on the Bun and React logos to learn more.";
  }
  if (isViteEnv) {
    return "Click on the Vite and React logos to learn more.";
  }
  return "Click on the React logo to learn more.";
};

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
          <p className="mb-8 text-zinc-800">{getEnvironmentMessage()}</p>

          <AppClientComponent />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";

export function SayHelloInput() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className={"flex flex-col items-center justify-center p-4"}>
      <div className="mb-8" />
      <p className="mb-8 text-gray-600">
        Click on the Tauri, Vite, and React logos to learn more.
      </p>

      <form
        className="mb-4 flex w-full max-w-md flex-row items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          className={`
            flex-1 rounded-md border border-gray-300 px-4 py-2 shadow-sm
            focus:ring-2 focus:ring-blue-400 focus:outline-none
          `}
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button
          className={`
            rounded-md bg-blue-600 px-4 py-2 text-white transition-colors
            hover:bg-blue-700
          `}
          type="submit"
        >
          Greet
        </button>
      </form>
      <p className="min-h-[1.5em] text-lg text-green-700">{greetMsg}</p>
    </div>
  );
}

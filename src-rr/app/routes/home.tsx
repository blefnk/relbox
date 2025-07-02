/* eslint-disable no-empty-pattern */
import type { Route } from "./+types/home";

import { Welcome } from "../welcome/welcome";

export default function Home() {
  return <Welcome />;
}

// biome-ignore lint/correctness/noEmptyPattern: <>
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { content: "Welcome to React Router!", name: "description" },
  ];
}

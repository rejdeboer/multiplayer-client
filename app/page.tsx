'use client';

import Script from "next/script";

export default function Home() {
  return (
    <Script type="module" src="/init-editor.js" />
  );
}

#!/usr/bin/env bash
cargo build -p editor --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/debug/editor.wasm --out-dir ./public --target web --no-typescript

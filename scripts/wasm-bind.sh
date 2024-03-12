#!/usr/bin/env bash
cargo build -p multiplayer-client --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/debug/multiplayer-client.wasm --out-dir . --target web --no-typescript

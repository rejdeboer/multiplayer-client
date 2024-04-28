#!/usr/bin/env bash
cargo build -p wasm --target wasm32-unknown-unknown
wasm-bindgen target/wasm32-unknown-unknown/debug/wasm.wasm --out-dir . --target web --no-typescript

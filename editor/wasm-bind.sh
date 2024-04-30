#!/usr/bin/env bash
cargo build --manifest-path editor/Cargo.toml -p editor --target wasm32-unknown-unknown
wasm-bindgen editor/target/wasm32-unknown-unknown/debug/editor.wasm --out-dir ./public --target web --no-typescript

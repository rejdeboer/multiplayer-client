import init from "/multiplayer-client.js";

try {
    await init('./multiplayer-client_bg.wasm');
} catch (e) {
    if (!e.message.includes("This isn't actually an error!")) {
        console.error(e);
    }
}

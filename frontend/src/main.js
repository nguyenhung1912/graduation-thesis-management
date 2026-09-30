import { mount } from "svelte";
import App from "./App.svelte";
import "@picocss/pico/css/pico.min.css";

const app = mount(App, {
  target: document.getElementById("app") ?? document.body,
});

export default app;

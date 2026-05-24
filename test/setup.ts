import { afterEach } from "bun:test";
import { GlobalWindow } from "happy-dom";

const window = new GlobalWindow();

Object.assign(globalThis, {
  window,
  document: window.document,
  Node: window.Node,
  Event: window.Event,
  EventTarget: window.EventTarget,
  CustomEvent: window.CustomEvent,
  DocumentFragment: window.DocumentFragment,
  HTMLElement: window.HTMLElement,
  HTMLTemplateElement: window.HTMLTemplateElement,
  SyntaxError: window.SyntaxError,
});

afterEach(() => {
  document.body.innerHTML = "";
});

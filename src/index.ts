import { createLume as _createLume } from "./app";
import { defineComponent as _defineComponent } from "./component";
import {
  batch as _batch,
  computed as _computed,
  effect as _effect,
  signal as _signal,
} from "./reactivity";

export const createLume = _createLume;
export const defineComponent = _defineComponent;
export const signal = _signal;
export const computed = _computed;
export const effect = _effect;
export const batch = _batch;

export type {
  ComponentContext,
  ComponentFactory,
  Dispose,
  EffectFn,
  LumeApp,
  Plugin,
  SignalGetter,
} from "./types";

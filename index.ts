'use strict';

export = function impor<T extends object>(id: string): T {
  let mod: T;
  return new Proxy((() => {}) as T, {
    apply: (_, thisArg, argumentsList) => {
      mod = mod || require(id);
      return Reflect.apply(mod as Function, thisArg, argumentsList);
    },
    construct: (_, argumentsList) => {
      mod = mod || require(id);
      return Reflect.construct(mod as Function, argumentsList);
    },
    defineProperty: (_, key, attributes) => {
      mod = mod || require(id);
      return Reflect.defineProperty(mod, key, attributes);
    },
    deleteProperty: (_, key) => {
      mod = mod || require(id);
      return Reflect.deleteProperty(mod, key);
    },
    get: (_, key, reciver) => {
      mod = mod || require(id);
      return Reflect.get(mod, key, reciver);
    },
    getPrototypeOf: (_) => {
      mod = mod || require(id);
      return Reflect.getPrototypeOf(mod);
    },
    has: (_, key) => {
      mod = mod || require(id);
      return Reflect.has(mod, key);
    },
    isExtensible: (_) => {
      mod = mod || require(id);
      return Reflect.isExtensible(mod);
    },
    ownKeys: (_) => {
      mod = mod || require(id);
      return mod ? Reflect.ownKeys(mod) : [];
    },
    preventExtensions: (_) => {
      mod = mod || require(id);
      return Reflect.preventExtensions(mod);
    },
    set: (_, key, value, reciver) => {
      mod = mod || require(id);
      return Reflect.set(mod, key, value, reciver);
    },
    setPrototypeOf: (_, value) => {
      mod = mod || require(id);
      return Reflect.setPrototypeOf(mod, value);
    }
  });
};
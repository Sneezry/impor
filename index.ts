'use strict';

export = function impor<T extends object>(id: string): T {
  let mod: T;
  return new Proxy({} as T, {
    get: (target, key, reciver) => {
      mod = mod || require(id);
      return Reflect.get(mod, key, reciver);
    },
    has: (target, key) => {
      mod = mod || require(id);
      return Reflect.has(mod, key);
    },
    set: (target, key, value, reciver) => {
      mod = mod || require(id);
      return Reflect.set(mod, key, value, reciver);
    },
    deleteProperty: (target, key) => {
      mod = mod || require(id);
      return Reflect.deleteProperty(mod, key);
    },
    defineProperty: (target, key, attributes) => {
      mod = mod || require(id);
      return Reflect.defineProperty(mod, key, attributes);
    },
    isExtensible: (target) => {
      mod = mod || require(id);
      return Reflect.isExtensible(mod);
    },
    ownKeys: (target) => {
      mod = mod || require(id);
      return mod ? Reflect.ownKeys(mod) : [];
    },
    getPrototypeOf: (target) => {
      mod = mod || require(id);
      return Reflect.getPrototypeOf(mod);
    },
    setPrototypeOf: (target, value) => {
      mod = mod || require(id);
      return Reflect.setPrototypeOf(mod, value);
    },
    preventExtensions: (target) => {
      mod = mod || require(id);
      return Reflect.preventExtensions(mod);
    },
    apply: (target, thisArg, argumentsList) => {
      mod = mod || require(id);
      return Reflect.apply(mod as Function, thisArg, argumentsList);
    },
    construct: (target, argumentsList) => {
      mod = mod || require(id);
      return Reflect.construct(mod as Function, argumentsList);
    }
  });
};
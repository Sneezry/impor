'use strict';

import {join} from 'path';

const importQueue:string[] = [];
let importJobBusy = false;

function impor<T extends object>(id: string, rootDir: string): T {
  if (/^\./.test(id)) {
    id = join(rootDir, id);
  }
  if (importQueue.indexOf(id) === -1) {
    importQueue.push(id);
  }
  let mod: T;
  return new Proxy((() => {}) as T, {
    apply: (_, thisArg, argumentsList) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.apply(mod as Function, thisArg, argumentsList);
    },
    construct: (_, argumentsList) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.construct(mod as Function, argumentsList);
    },
    defineProperty: (_, key, attributes) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.defineProperty(mod, key, attributes);
    },
    deleteProperty: (_, key) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.deleteProperty(mod, key);
    },
    get: (_, key, reciver) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.get(mod, key, reciver);
    },
    getPrototypeOf: (_) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.getPrototypeOf(mod);
    },
    has: (_, key) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.has(mod, key);
    },
    isExtensible: (_) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.isExtensible(mod);
    },
    ownKeys: (_) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return mod ? Reflect.ownKeys(mod) : [];
    },
    preventExtensions: (_) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.preventExtensions(mod);
    },
    set: (_, key, value, reciver) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.set(mod, key, value, reciver);
    },
    setPrototypeOf: (_, value) => {
      if (!mod) {
        removeJob(id);
        mod = require(id);
      }
      return Reflect.setPrototypeOf(mod, value);
    }
  });
}

function removeJob(id: string) {
  const index = importQueue.indexOf(id);
  if (index === -1) {
    return;
  }

  importQueue.splice(index, 1);
}

async function importJob() {
  if (importJobBusy) {
    return;
  }
  if (importQueue.length === 0) {
    return;
  }

  const id = importQueue.shift();
  if (!id) {
    return;
  }
  importJobBusy = true;
  await import(id);
  importJobBusy = false;
}

setInterval(importJob, 1000);

export = (rootDir: string) => {
  return (id: string) => {
    return impor(id, rootDir);
  };
}
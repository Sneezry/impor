'use strict';

import {join} from 'path';

function impor<T extends object>(id: string, rootDir: string): T {
  if (/^\./.test(id)) {
    id = join(rootDir, id);
  }
  if (ImportJob.importQueue.indexOf(id) === -1) {
    ImportJob.importQueue.push(id);
  }
  let mod: T;
  return new Proxy((() => {}) as T, {
    apply: (_, thisArg, argumentsList) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.apply(mod as Function, thisArg, argumentsList);
    },
    construct: (_, argumentsList) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.construct(mod as Function, argumentsList);
    },
    defineProperty: (_, key, attributes) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.defineProperty(mod, key, attributes);
    },
    deleteProperty: (_, key) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.deleteProperty(mod, key);
    },
    get: (_, key, reciver) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.get(mod, key, reciver);
    },
    getPrototypeOf: (_) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.getPrototypeOf(mod);
    },
    has: (_, key) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.has(mod, key);
    },
    isExtensible: (_) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.isExtensible(mod);
    },
    ownKeys: (_) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return mod ? Reflect.ownKeys(mod) : [];
    },
    preventExtensions: (_) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.preventExtensions(mod);
    },
    set: (_, key, value, reciver) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.set(mod, key, value, reciver);
    },
    setPrototypeOf: (_, value) => {
      if (!mod) {
        ImportJob.removeJob(id);
        mod = require(id);
      }
      return Reflect.setPrototypeOf(mod, value);
    }
  });
}

class ImportJob {
  private static isStarted = false;
  static importQueue:string[] = [];
  static importJobBusy = false;
  static async importJob() {
    if (ImportJob.importJobBusy) {
      return;
    }
    if (ImportJob.importQueue.length === 0) {
      return;
    }
  
    const id = ImportJob.importQueue.shift();
    if (!id) {
      return;
    }
    ImportJob.importJobBusy = true;
    await import(id);
    ImportJob.importJobBusy = false;
  }
  static removeJob(id: string) {
    const index = ImportJob.importQueue.indexOf(id);
    if (index === -1) {
      return;
    }
  
    ImportJob.importQueue.splice(index, 1);
  }
  static start() {
    if (ImportJob.isStarted) {
      return;
    }
    ImportJob.isStarted = true;
    setInterval(ImportJob.importJob, 1000);
  }
}

ImportJob.start();

export = (rootDir: string) => {
  return (id: string) => {
    return impor(id, rootDir);
  };
}
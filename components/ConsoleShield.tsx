'use client';

import { useEffect } from 'react';

export default function ConsoleShield() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const makeSafe = (obj: any, seen = new WeakSet()): any => {
      if (obj === null || typeof obj !== 'object') return obj;
      
      // Avoid circular references
      if (seen.has(obj)) return '[Circular Reference]';

      // Avoid serializing complex React, DOM, or synthetic structures
      if (obj.nodeType) return `[DOM Element: ${obj.tagName || 'Node'}]`;
      if (obj.$$typeof) return '[React Component/Element]';
      if (obj._reactName) return '[React Event]';
      if (obj.constructor && obj.constructor.name === 'SyntheticBaseEvent') return '[React Event]';

      if (obj instanceof Error) {
        return {
          name: obj.name,
          message: obj.message,
          stack: obj.stack
        };
      }

      seen.add(obj);

      if (Array.isArray(obj)) {
        return obj.map(item => makeSafe(item, seen));
      }

      const copy: any = {};
      const keys = Object.keys(obj);
      for (const key of keys) {
        try {
          const val = obj[key];
          copy[key] = makeSafe(val, seen);
        } catch (e) {
          copy[key] = '[Unserializable]';
        }
      }
      return copy;
    };

    const patchConsole = (method: 'log' | 'warn' | 'error' | 'info' | 'debug') => {
      const original = window.console[method];
      if (!original) return;

      // Prevent double wrapping
      if ((original as any).__isPatchedByShield) return;

      const patched = function(this: any, ...args: any[]) {
        const safeArgs = args.map(arg => {
          try {
            if (typeof arg === 'object' && arg !== null) {
              return makeSafe(arg);
            }
          } catch (e) {
            return '[Error Serializing Argument]';
          }
          return arg;
        });
        return original.apply(this, safeArgs);
      };

      (patched as any).__isPatchedByShield = true;
      window.console[method] = patched as any;
    };

    // Run patch on load
    ['log', 'warn', 'error', 'info', 'debug'].forEach(m => patchConsole(m as any));

    // Monitor and maintain patch in case external tools override window.console
    const interval = setInterval(() => {
      ['log', 'warn', 'error', 'info', 'debug'].forEach(m => patchConsole(m as any));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
}

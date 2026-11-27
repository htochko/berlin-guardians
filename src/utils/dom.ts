// src/utils.dom.ts
type ElementChild = Node | string;

type EventHandlers = {
  [E in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[E]) => void;
};

export interface CreateElementOptions {
  className?: string;
  text?: string;
  attributes?: Readonly<Record<string, string>>;
  dataset?: Readonly<Record<string, string>>;
  events?: EventHandlers;
  children?: readonly ElementChild[];
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options: CreateElementOptions = {},
): HTMLElementTagNameMap[K] {
  const element: HTMLElementTagNameMap[K] = document.createElement(tagName);

  if (options.className !== undefined) {
    element.className = options.className;
  }

  if (options.text !== undefined) {
    element.textContent = options.text;
  }

  for (const [name, value] of Object.entries(options.attributes ?? {})) {
    element.setAttribute(name, value);
  }

  for (const [key, value] of Object.entries(options.dataset ?? {})) {
    element.dataset[key] = value;
  }

  for (const [name, handler] of Object.entries(options.events ?? {})) {
    if (handler !== undefined) {
      // the event name comes from a loop, so TypeScript cannot match it to its handler type
      element.addEventListener(name, handler as EventListener);
    }
  }

  element.append(...(options.children ?? []));

  return element;
}

type EventHolder = HTMLElement | Document | Window;
type EventListener = (...args: any[]) => void;

interface EventListenerOptions {
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
}

/**
 * Adds event of type to element.
 */
export function addEventListener(
  ref: EventHolder,
  type: string,
  listener: EventListener,
  options?: EventListenerOptions,
): void {
  ref.addEventListener(type, listener, options);
}

/**
 * Adds events of types to element.
 */
export function addEventListeners(
  ref: EventHolder,
  types: string[],
  listener: EventListener,
  options?: EventListenerOptions,
): void {
  types.forEach((type) => {
    addEventListener(ref, type, listener, options);
  });
}

/**
 * Removes event of type from element.
 */
export function removeEventListener(
  ref: EventHolder,
  type: string,
  listener: EventListener,
  options?: EventListenerOptions,
): void {
  ref.removeEventListener(type, listener, options);
}

/**
 * Removes events of types from element.
 */
export function removeEventListeners(
  ref: EventHolder,
  types: string[],
  listener: EventListener,
  options?: EventListenerOptions,
): void {
  types.forEach((type) => {
    ref.removeEventListener(type, listener, options);
  });
}

interface CustomEventInit<T> {
  detail?: T;
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
}

/**
 * Triggers event and returns false if the event is cancelled.
 */
export function triggerEvent<T = undefined>(
  ref: EventHolder,
  type: string,
  options?: CustomEventInit<T>,
): boolean {
  return ref.dispatchEvent(new CustomEvent(type, options));
}

/**
 * Triggers events and returns false if any of the event is
 * cancelled.
 */
export function triggerEvents<T>(
  ref: EventHolder,
  types: string[],
  options?: CustomEventInit<T>,
): boolean {
  return types.every((type) => triggerEvent(ref, type, options));
}

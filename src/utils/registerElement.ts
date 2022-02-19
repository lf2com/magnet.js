/**
 * Registers Knob element.
 */
function registerElement(
  Node: typeof HTMLElement,
  nodeName: string,
): ReturnType<typeof customElements.whenDefined> {
  if (customElements.get(nodeName)) {
    return Promise.reject(
      new Error(`Already defined <${nodeName}>`),
    );
  }

  customElements.define(nodeName, Node);

  return customElements.whenDefined(nodeName);
}

export default registerElement;

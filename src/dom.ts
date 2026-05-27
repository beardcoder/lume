function escapeSelector(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
}

function describeRoot(root: HTMLElement): string {
  const name = root.getAttribute("data-lume");
  const id = root.getAttribute("data-lume-id");
  if (!name) return "<detached>";
  return id ? `${name}#${id}` : name;
}

export function queryPart<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  name: string
): T {
  const el = root.querySelector<T>(
    `[data-lume-part="${escapeSelector(name)}"]`
  );
  if (!el) {
    throw new Error(`[lume] part "${name}" not found in ${describeRoot(root)}`);
  }
  return el;
}

export function queryParts<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  name: string
): T[] {
  return Array.from(
    root.querySelectorAll<T>(`[data-lume-part="${escapeSelector(name)}"]`)
  );
}

export function queryTemplate(
  root: HTMLElement,
  name: string
): () => DocumentFragment {
  const tpl = root.querySelector<HTMLTemplateElement>(
    `template[data-lume-part="${escapeSelector(name)}"]`
  );
  if (!tpl) {
    throw new Error(
      `[lume] template "${name}" not found in ${describeRoot(root)}`
    );
  }
  return () => tpl.content.cloneNode(true) as DocumentFragment;
}

export function findLumeRoots(root: HTMLElement | Document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-lume]"));
}

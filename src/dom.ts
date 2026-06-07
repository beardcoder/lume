function partSelector(name: string): string {
  return `[data-lume-part="${CSS.escape(name)}"]`;
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
  const el = root.querySelector<T>(partSelector(name));
  if (!el) {
    throw new Error(`[lume] part "${name}" not found in ${describeRoot(root)}`);
  }
  return el;
}

export function queryParts<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  name: string
): T[] {
  return Array.from(root.querySelectorAll<T>(partSelector(name)));
}

export function queryTemplate(
  root: HTMLElement,
  name: string
): () => DocumentFragment {
  const tpl = root.querySelector<HTMLTemplateElement>(
    `template${partSelector(name)}`
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

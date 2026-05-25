export function queryPart(root: HTMLElement, name: string): HTMLElement {
  const el = root.querySelector<HTMLElement>(`[data-lume-part="${name}"]`);
  if (!el) throw new Error(`[lume] part "${name}" not found`);
  return el;
}

export function queryParts(root: HTMLElement, name: string): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(`[data-lume-part="${name}"]`)
  );
}

export function queryTemplate(
  root: HTMLElement,
  name: string
): () => DocumentFragment {
  const tpl = root.querySelector<HTMLTemplateElement>(
    `template[data-lume-part="${name}"]`
  );
  if (!tpl) throw new Error(`[lume] template "${name}" not found`);
  return () => tpl.content.cloneNode(true) as DocumentFragment;
}

export function findLumeRoots(root: HTMLElement | Document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>("[data-lume]"));
}

export function queryPart<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  name: string
): T {
  const el = root.querySelector<T>(`[data-lume-part="${name}"]`);
  if (!el) throw new Error(`[lume] part "${name}" not found`);
  return el;
}

export function queryParts<T extends HTMLElement = HTMLElement>(
  root: HTMLElement,
  name: string
): T[] {
  return Array.from(root.querySelectorAll<T>(`[data-lume-part="${name}"]`));
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

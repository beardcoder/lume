import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeNova from "starlight-theme-nova";

export default defineConfig({
  site: "https://beardcoder.github.io",
  base: "/lume",
  integrations: [
    starlight({
      title: "Lume",
      description: "Small reactive components for existing HTML.",
      plugins: [starlightThemeNova()],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/beardcoder/lume",
        },
      ],
      customCss: [],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Installation", slug: "getting-started/installation" },
            { label: "Quick Start", slug: "getting-started/quick-start" },
          ],
        },
        {
          label: "Core Concepts",
          items: [
            { label: "Components", slug: "concepts/components" },
            { label: "Signals & Effects", slug: "concepts/signals" },
            { label: "Events", slug: "concepts/events" },
            { label: "Templates", slug: "concepts/templates" },
            { label: "Plugins", slug: "concepts/plugins" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "createLume", slug: "api/create-lume" },
            { label: "defineComponent", slug: "api/define-component" },
            { label: "Component Context", slug: "api/component-context" },
          ],
        },
        {
          label: "Examples",
          items: [
            { label: "Disclosure", slug: "examples/disclosure" },
            { label: "Toast", slug: "examples/toast" },
          ],
        },
      ],
    }),
  ],
});

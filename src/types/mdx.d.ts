declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType<Record<string, unknown>>;
  export const frontmatter: Record<string, unknown> | undefined;
  export default MDXComponent;
}

Markdown Mirrors — conventions for AstraWear

Purpose:
Provide clean, text-first Markdown snapshots of important pages so LLMs can read them without scripts, navigation, or boilerplate.

Where to store mirrors:
- Put mirrors under `public/markdown-mirrors/` (one file per important page).
  Examples:
  - `public/markdown-mirrors/index.md`         -> home page snapshot
  - `public/markdown-mirrors/about.md`         -> about page
  - `public/markdown-mirrors/collections.md`   -> collections listing
  - `public/markdown-mirrors/products/slug.md` -> product detail snapshots (one file per product)

Snapshot format (required frontmatter):
---
title: "Product Title"
url: "https://astrawear.vercel.app/product/example-slug"
lastmod: "YYYY-MM-DD"
type: "product"
sku: "SKU1234"
price: "29.99"
availability: "in_stock"
---

# Product Title

Short summary paragraph...

## Key specs
- Feature 1
- Feature 2

## Description
Full description in plain Markdown (no HTML tags).

## Images
- https://astrawear.vercel.app/images/product/example-1.jpg
- https://astrawear.vercel.app/images/product/example-2.jpg

Guidelines:
- Strip navigation, footers, scripts, and inline event-handlers.
- Use semantic headings (H1 = page title, H2/H3 = sections).
- For product lists: include a table or bullet list with title, short desc, price, and canonical URL.
- For paginated lists: create incremental snapshots (collections-page-1.md, etc.).

Updating:
- Update `lastmod` when the page changes.
- Use absolute URLs for images and canonical links.

Security:
- Do not include user-submitted PII (addresses, emails, order numbers).

Last updated: 2026-05-19

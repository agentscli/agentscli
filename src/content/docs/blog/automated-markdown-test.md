---
title: "Testing Automated Markdown Blogs"
description: "A demonstration showing how standard .md files are automatically parsed into the blog layout."
authors: elena
category: ANNOUNCEMENTS
date: 2023-11-01
---

Welcome to the automated markdown test page!

This file is a standard **Markdown (`.md`)** file, not MDX. By simply dropping this file into the `src/content/docs/blog/` directory, the build system automatically parses it.

It automatically applies:
1. The global blog styling and typography (Plus Jakarta Sans).
2. The breadcrumbs and category tags.
3. The Hero placeholder and Author footer components.

### Code Snippets Example

Standard markdown code fences are also supported and parsed natively:

```css
.card {
  width: 300px;
  background-color: #24233b;
}
```

This proves that your `/blog/*.md` workflow is working perfectly. You don't need to manually import React or Astro components into every file to get the beautiful layout.

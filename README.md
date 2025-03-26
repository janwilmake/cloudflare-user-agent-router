# Cloudflare Worker Template

A template for building agent-friendly Cloudflare Workers from first principles, without many dependencies, in the most minimal way possible.

Stack:

- Cloudflare Worker [WinterTC](https://wintertc.org) Syntax in Typescript but allowing JS
- Vanilla HTML with inline Tailwind or vanilla CSS
- Server-side rendering
- Vanilla JS

## Benefits

- **Flexibility**: Serve content in multiple formats (HTML, Markdown, JSON, YAML, PNG) from a single endpoint
- **SEO Optimization**: Automatically detects and serves SEO-friendly HTML to crawlers
- **Developer Friendly**:
  - Supports path extensions for easy format selection
  - Defaults to Markdown for simple CLI usage (curl/fetch)
  - Clean, minimal dependencies
- **Social Media Ready**: Generates Open Graph images for better sharing
- **Performance**:
  - Uses KV caching for OG images
  - Server-side rendering for fast responses
  - Lightweight implementation with WinterTC compliance
- **Maintainability**:
  - TypeScript with clear type definitions
  - Modular design with separate format handling
  - Easy to extend with additional formats
- **Versatility**: Works with browsers, CLIs, and API clients through content negotiation

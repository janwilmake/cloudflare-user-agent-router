# Cloudflare Worker Template

A template for building agent-friendly Cloudflare Workers from first principles, without many dependencies, in the most minimal way possible.

Stack:

- Cloudflare Worker [WinterTC](https://wintertc.org) Syntax in Typescript but allowing JS
- Vanilla HTML with inline Tailwind or vanilla CSS
- Server-side rendering
- Vanilla JS

## Philosophy

The reason I built this is that I feel most of the web today is built on legacy standards and frameworks, and I wanted to show a different way. The most important fact that is the root for the choices that I've made, is that we don't need to serve just 1 format for any page, but we need to serve:

- structured data for apis
- markdown for agents
- html for SEO crawlers and humans
- og-image for social media

This template implementation shows how to do this in a way that makes intuitive sense, adhering to the accept header properly, serving the right format to the right client, while still allowing easy testing by changing the extension in the path.

I think this could be a great starting point to build a framework that goes back to basics, serving: JS, HTML, CSS, JSON, and PNG, all from a Cloudflare worker.

## Benefits

- Shared application layer that serves the same information to **agents, crawlers, humans, and APIs**
- Developer-friendly: intuitive and accessible paths for easy testing.

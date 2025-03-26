import { getOgImage } from "./getOgImage.js";

export default {
  // WinterTC syntax for defining a fetch handler
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
  },
};

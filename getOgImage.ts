import { ImageResponse } from "workers-og";
/**
 * OG Image Generator Example
 *
 * This is a generic example of generating Open Graph images for content sharing.
 * It demonstrates how to create dynamic preview images for social media platforms.
 */
export const getOgImage = async (
  request: Request,
  kv: KVNamespace,
  /** 
 # workers-og gotchas:
- must use inline styles
- All divs must use 'display: flex', and 'position: absolute' should NOT be used 
   */
  html: string,
  prefetch: boolean,
  expirationTtl: number = 86400,
): Promise<Response> => {
  try {
    // Check if this is a request for an OG image
    const url = new URL(request.url);

    const cacheKey = `og:${url.pathname}`;
    // Try to get the image from KV cache
    const cachedImage = await kv.get(cacheKey, {
      type: "arrayBuffer",
    });

    if (cachedImage) {
      // If found in cache, return it with appropriate headers
      return new Response(cachedImage, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    // Create the OG image HTML template
    const config = {
      width: 1200,
      height: 630,
      format: "png",
    };

    if (!prefetch) {
      // just return it
      return new ImageResponse(html, config);
    }

    // if prefetch, only put in kv and return '202 created'
    const imageBuffer = await new ImageResponse(html, config).arrayBuffer();

    await kv.put(cacheKey, imageBuffer, { expirationTtl });

    // Return the original image response
    return new Response("Created", { status: 202 });
  } catch (error: any) {
    console.error("Error generating OG image:", error);
    // Return undefined so the request can continue to regular handler
    return new Response("Error generating OG image" + error.message, {
      status: 500,
    });
  }
};

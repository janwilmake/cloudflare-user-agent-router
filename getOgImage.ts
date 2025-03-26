/**
 * OG Image Generator Example
 *
 * This is a generic example of generating Open Graph images for content sharing.
 * It demonstrates how to create dynamic preview images for social media platforms.
 *
 * # workers-og gotchas:
 * - All divs must use display: flex
 * - position: absolute should NOT be used as it doesn't work properly
 */

import { ImageResponse } from "workers-og";

// Define the content data structure without external dependencies
interface ContentData {
  title: string;
  subtitle: string;
  totalItems: number;
  participants: string[];
  avatarUrls: string[];
  contentCount: number;
}

export const getOgImage = async (
  request: Request,
  env: any,
  contentData: ContentData,
  prefetch: boolean,
): Promise<Response | undefined> => {
  try {
    // Check if this is a request for an OG image
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    if (pathParts.length < 4 || pathParts[2] !== "og") {
      return undefined;
    }

    // Extract content ID
    const lastPart = pathParts[3];
    const [contentId] = lastPart.split(".");
    if (!contentId) {
      return undefined;
    }

    // Create cache key
    const cacheKey = `og:${url.pathname}`;

    // Try to get the image from KV cache
    const cachedImage = await env.CONTENT_KV.get(cacheKey, {
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
    const html = generateOgImageHtml(contentData);
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

    await env.CONTENT_KV.put(cacheKey, imageBuffer, { expirationTtl: 86400 });

    // Return the original image response
    return new Response("Created", { status: 202 });
  } catch (error: any) {
    console.error("Error generating OG image:", error);
    // Return undefined so the request can continue to regular handler
    return undefined;
  }
};

function generateOgImageHtml(contentData: ContentData): string {
  const {
    title,
    subtitle,
    totalItems,
    participants,
    avatarUrls,
    contentCount,
  } = contentData;

  // Prepare display text
  const participantsText =
    participants.length <= 2
      ? participants.join(" and ")
      : `${participants.slice(0, 2).join(", ")} and ${
          participants.length - 2
        } others`;

  // Limit the number of avatars to display (max 6)
  const displayAvatars = avatarUrls.slice(0, 6);

  // Generate avatar HTML with proper positioning - using flex instead of absolute positioning
  let avatarsHtml = "";
  displayAvatars.forEach((url, index) => {
    avatarsHtml += `
      <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 2px solid #333; display: flex; margin-right: 10px;">
        <img src="${url}" alt="User ${
      index + 1
    }" width="120" height="120" style="object-fit: cover;" />
      </div>
    `;
  });

  // Construct the HTML template
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
                background-color: #fff; margin: 0; width: 1200px; height: 630px; display: flex; flex-direction: column;">
      <!-- Header Bar -->
      <div style="background-color: #0066cc; height: 80px; width: 100%; display: flex; align-items: center; padding: 0 60px;">
        <div style="display: flex; align-items: center;">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="white"/>
            <path d="M8 8H24V24H8V8Z" fill="#0066cc"/>
          </svg>
          <span style="color: white; font-size: 32px; margin-left: 16px; font-weight: bold;">Content Preview</span>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div style="display: flex; flex-direction: column; flex: 1; padding: 60px;">
        <!-- Title - Large Display -->
        <div style="font-size: 64px; font-weight: 800; margin-bottom: 16px; color: #000; display: flex;">
          ${title}
        </div>
        
        <!-- Subtitle -->
        <div style="font-size: 32px; color: #333; margin-bottom: 40px; display: flex;">
          ${subtitle}
        </div>
        
        <!-- Stats Container -->
        <div style="display: flex; margin-bottom: 40px;">
          <div style="display: flex; flex-direction: column; margin-right: 60px;">
            <span style="font-size: 24px; color: #666; display: flex;">Total Items</span>
            <span style="font-size: 48px; font-weight: bold; display: flex;">${totalItems.toLocaleString()}</span>
          </div>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 24px; color: #666; display: flex;">Contributors</span>
            <span style="font-size: 48px; font-weight: bold; display: flex;">${
              participants.length
            }</span>
          </div>
        </div>
        
        <!-- User Avatars Container - Using flex layout -->
        <div style="display: flex; height: 120px; margin-bottom: 20px;">
          ${avatarsHtml}
        </div>
        
        <!-- Participants Text -->
        <div style="font-size: 24px; color: #555; display: flex;">
          With contributions from ${participantsText}
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background-color: #0066cc; color: white; padding: 20px 60px; font-size: 24px; display: flex; justify-content: center;">
        <span style="display: flex;">View full content • ${contentCount} items</span>
      </div>
    </div>
  `;
}

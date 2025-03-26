import { getFormat } from "./getFormat.js";
import { getOgImage } from "./getOgImage.js";

// Define some hardcoded data for demonstration
const getData = (name: string) => {
  return {
    title: `${name}'s Dashboard`,
    subtitle: "An example dashboard for demonstration purposes",
    totalItems: 1256,
    participants: ["Alice", "Bob", "Charlie", "David", "Eve", "Frank"],
    avatarUrls: [
      "https://i.pravatar.cc/150?u=alice",
      "https://i.pravatar.cc/150?u=bob",
      "https://i.pravatar.cc/150?u=charlie",
      "https://i.pravatar.cc/150?u=david",
      "https://i.pravatar.cc/150?u=eve",
      "https://i.pravatar.cc/150?u=frank",
    ],
    contentCount: 42,
    description:
      "This is a sample dashboard showing various metrics and statistics.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Define the content data structure without external dependencies
interface ContentData {
  title: string;
  subtitle: string;
  totalItems: number;
  participants: string[];
  avatarUrls: string[];
  contentCount: number;
}

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

// Generate HTML response
const generateHtml = (name: string, data: any) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <meta name="description" content="${data.description}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${data.subtitle}">
  <meta property="og:image" content="/${name}.png">
  <meta property="og:type" content="website">
  <script type="application/ld+json">
    ${JSON.stringify(data)}
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 { color: #0066cc; }
    .stats { display: flex; gap: 20px; margin: 20px 0; }
    .stat { padding: 15px; background: #f0f5ff; border-radius: 5px; }
    .avatars { display: flex; gap: 10px; margin: 20px 0; }
    .avatar { width: 50px; height: 50px; border-radius: 50%; }
  </style>
</head>
<body>
  <h1>${data.title}</h1>
  <p>${data.subtitle}</p>
  
  <div class="stats">
    <div class="stat">
      <div>Total Items</div>
      <strong>${data.totalItems.toLocaleString()}</strong>
    </div>
    <div class="stat">
      <div>Contributors</div>
      <strong>${data.participants.length}</strong>
    </div>
    <div class="stat">
      <div>Content Count</div>
      <strong>${data.contentCount}</strong>
    </div>
  </div>
  
  <h2>Participants</h2>
  <div class="avatars">
    ${data.avatarUrls
      .map(
        (url: string, i: number) =>
          `<img class="avatar" src="${url}" alt="${data.participants[i]}" title="${data.participants[i]}">`,
      )
      .join("")}
  </div>
  
  <p>Contributors: ${data.participants.join(", ")}</p>
  <p>Last updated: ${new Date(data.updatedAt).toLocaleString()}</p>
</body>
</html>`;
};

// Generate Markdown response
const generateMarkdown = (name: string, data: any) => {
  return `# ${data.title}

${data.subtitle}

## Stats

- Total Items: ${data.totalItems.toLocaleString()}
- Contributors: ${data.participants.length}
- Content Count: ${data.contentCount}

## Participants

${data.participants.map((name: string) => `- ${name}`).join("\n")}

_Last updated: ${new Date(data.updatedAt).toLocaleString()}_

[View as HTML](/${name}.html) | [View as JSON](/${name}.json) | [View as YAML](/${name}.yaml) | [View Open Graph Image](/${name}.png)
`;
};

// Generate YAML response
const generateYaml = (data: any) => {
  // Simple YAML conversion
  const yamlLines = [];
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      yamlLines.push(`${key}:`);
      for (const item of value) {
        yamlLines.push(`  - ${item}`);
      }
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  }
  return yamlLines.join("\n");
};

export default {
  // WinterTC syntax for defining a fetch handler
  async fetch(
    request: Request,
    env: { CONTENT_KV: KVNamespace },
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Skip if requesting the root path
    if (pathname === "/" || pathname === "") {
      return new Response(
        "Welcome to the dashboard example. Try /{name} to see a dashboard.",
        {
          headers: { "Content-Type": "text/plain" },
        },
      );
    }

    // Extract the name from the pathname
    const segments = pathname.split("/").filter(Boolean);
    const nameWithExtension = segments[0] || "default";

    // Remove any file extensions from the name
    const name = nameWithExtension.split(".")[0];

    // Get the format based on the request
    const format = getFormat(request);
    console.log({ format });
    if (!format) {
      return new Response("Unacceptable format", { status: 400 });
    }

    // Get the data for this name
    const data = getData(name);

    if (!data) {
      return new Response("Not found", { status: 404 });
    }

    // ensure to prefetch og image!
    ctx.waitUntil(
      getOgImage(
        request,
        env.CONTENT_KV,
        generateOgImageHtml(data),
        true,
        86400,
      ),
    );

    // Check if this is a request for the OG image
    if (format === "image/png") {
      return getOgImage(
        request,
        env.CONTENT_KV,
        generateOgImageHtml(data),
        false,
      );
    }

    // Respond based on the determined format
    if (format === "application/json") {
      return new Response(JSON.stringify(data, undefined, 2), {
        headers: { "Content-Type": "application/json;charset=utf8" },
      });
    }

    if (format === "text/yaml") {
      return new Response(generateYaml(data), {
        headers: { "Content-Type": "text/yaml;charset=utf8" },
      });
    }

    if (format === "text/markdown") {
      return new Response(generateMarkdown(name, data), {
        headers: { "Content-Type": "text/markdown;charset=utf8" },
      });
    }

    return new Response(generateHtml(name, data), {
      headers: { "Content-Type": "text/html;charset=utf8" },
    });
  },
};

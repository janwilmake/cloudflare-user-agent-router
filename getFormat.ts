/*
This implementation allows the following

1. SEO Crawlers must be served SEO-friendly HTML at all cost
2. The path may end with a segment with an extension such as .html, .md, or .json, as https://llmstxt.org suggests
3. If accept `*\/*` is provided (such as with some clis) it will default to text/markdown, which is desired for simple implementation with curl and fetch.
4. If none of the above is true, it will use the accept header and find the first matching format, or return 'null' if no format matches.

By default this function requires also supports yaml. Alter the function as desired
*/
const getCrawler = (userAgent: string | null) => {
  const crawlers = [
    { name: "Facebook", userAgentRegex: /facebookexternalhit|Facebot/ },
    { name: "Twitter", userAgentRegex: /Twitterbot/ },
    { name: "LinkedIn", userAgentRegex: /LinkedInBot/ },
    { name: "Slack", userAgentRegex: /Slackbot-LinkExpanding/ },
    { name: "Discord", userAgentRegex: /Discordbot/ },
    { name: "WhatsApp", userAgentRegex: /WhatsApp/ },
    { name: "Telegram", userAgentRegex: /TelegramBot/ },
    { name: "Pinterest", userAgentRegex: /Pinterest/ },
    { name: "Google", userAgentRegex: /Googlebot/ },
    { name: "Bing", userAgentRegex: /bingbot/ },
  ];
  const crawler = crawlers.find((item) =>
    item.userAgentRegex.test(userAgent || ""),
  )?.name;

  return crawler;
};

const allowedFormats = {
  md: "text/markdown",
  html: "text/html",
  json: "application/json",
  yaml: "text/yaml",
} as const;

type AllowedFormat = (typeof allowedFormats)[keyof typeof allowedFormats];

/** Useful function to determine what to respond with */
export const getFormat = (request: Request): AllowedFormat | null => {
  const crawler = getCrawler(request.headers.get("user-agent"));
  if (crawler) {
    return "text/html";
  }
  const accept = request.headers.get("accept") || "*/*";
  const pathname = new URL(request.url).pathname;
  const segmentChunks = pathname.split("/").pop()!.split(".");
  const ext =
    segmentChunks.length > 1
      ? (segmentChunks.pop()! as AllowedFormat)
      : undefined;

  if (ext && Object.keys(allowedFormats).includes(ext)) {
    // allow path to determine format
    return ext;
  }

  if (accept === "*/*") {
    return "text/markdown";
  }

  const acceptedFormats = accept
    .split(",")
    .map((f) => f.trim().split(";")[0].trim());
  const allowedFomat = acceptedFormats.find((format) =>
    Object.values(allowedFormats).includes(format as AllowedFormat),
  ) as AllowedFormat | undefined;

  return allowedFomat || null;
};

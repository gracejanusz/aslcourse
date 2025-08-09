// deploy.ts
import 'dotenv/config';
import { FreestyleSandboxes } from "freestyle-sandboxes";

const apiKey = process.env.FREESTYLE_API_KEY;
if (!apiKey) {
  console.error("Missing FREESTYLE_API_KEY. Set it in your environment or .env file.");
  process.exit(1);
}

const api = new FreestyleSandboxes({ apiKey });

// Try to be robust to different SDK response shapes
function extractUrls(result: any): string[] {
  const urls = new Set<string>();

  const candidates = [
    ...(Array.isArray(result?.domains) ? result.domains : []),
    result?.domain,
    result?.url,
    result?.websiteUrl,
    result?.links?.url,
    result?.links?.website,
    result?.sandbox?.url,
    result?.deployment?.url,
    ...(Array.isArray(result?.deployment?.domains) ? result.deployment.domains : []),
  ].flat?.() ?? [];

  for (const v of candidates) {
    if (typeof v === "string" && v.trim()) urls.add(v.trim());
  }
  return [...urls];
}

(async () => {
  try {
    const result = await api.deployWeb(
      { kind: "git", url: "https://github.com/gracejanusz/aslcourse" },
      { domains: ["handsin.style.dev"], build: true }
    );

    const urls = extractUrls(result);
    if (urls.length) {
      console.log("Deployed website @", urls.join(", "));
    } else {
      console.log("Deploy succeeded but no URL field was found. Full response:");
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err: any) {
    // Show useful error info if available
    const payload = err?.response?.data ?? err?.message ?? err;
    console.error("Deploy failed:", payload);
    process.exit(1);
  }
})();

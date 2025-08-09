// deploy.ts
import 'dotenv/config';
import { FreestyleSandboxes } from "freestyle-sandboxes";

const apiKey = process.env.FREESTYLE_API_KEY;
if (!apiKey) {
  throw new Error("Missing FREESTYLE_API_KEY. Set it in your environment or .env file.");
}

const api = new FreestyleSandboxes({ apiKey });

api
  .deployWeb(
    {
      kind: "git",
      url: "https://github.com/gracejanusz/aslcourse",
    },
    {
      domains: ["handsinlearning.style.dev"],
      build: true,
    }
  )
  .then((result) => {
    console.log("Deployed website @", result.domains);
  })
  .catch((err) => {
    console.error("Deploy failed:", err);
    process.exit(1);
  });

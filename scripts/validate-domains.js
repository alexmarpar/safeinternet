import { execSync } from "child_process";

const PR_NUMBER = process.env.PR_NUMBER;
const GH_TOKEN = process.env.GH_TOKEN;
const REPO = "alexmarpar/safeinternet";

const diff = execSync("git diff origin/main...HEAD").toString();

const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/;

const lines = diff.split("\n");

let hasError = false;
let invalidDomains = [];

for (const line of lines) {
  if (line.startsWith("+") && !line.startsWith("+++")) {
    const domain = line.slice(1).trim().toLowerCase();

    if (!domainRegex.test(domain)) {
      hasError = true;
      invalidDomains.push(domain);
    }
  }
}

if (hasError) {
  await fetch(
    `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: `Invalid domains:\n${invalidDomains.join("\n")}`,
      }),
    }
  );

  process.exit(1);
}

await fetch(
  `https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments`,
  {
    method: "POST",
    headers: {
      Authorization: `token ${GH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: " All new domains are valid",
    }),
  }
);
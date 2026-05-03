const { execSync } = require("child_process");

const diff = execSync("git diff origin/main...HEAD").toString();

const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/;

const lines = diff.split("\n");

let hasError = false;

for (const line of lines) {
  if (line.startsWith("+") && !line.startsWith("+++")) {
    const domain = line.slice(1).trim();

    if (!domainRegex.test(domain)) {
      console.error("❌ Invalid domain:", domain);
      hasError = true;
      await fetch(
        `https://api.github.com/repos/alexmarpar/safeinternet/issues/${PR_NUMBER}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            body: "Error, invalid domain:",domain,
          }),
        },
      );
    }
  }
}

if (hasError) {
  process.exit(1);
}

await fetch(
  `https://api.github.com/repos/alexmarpar/safeinternet/issues/${PR_NUMBER}/comments`,
  {
    method: "POST",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: "✅ All new domains are valid",
    }),
  },
);

export function bumpVersion(version: string, type: "major" | "minor" | "patch") {
  let [major, minor, patch] = version.split(".").map(Number);

  if (type === "major") {
    major++;
    minor = 0;
    patch = 0;
  }

  if (type === "minor") {
    minor++;
    patch = 0;
  }

  if (type === "patch") {
    patch++;
  }

  return `${major}.${minor}.${patch}`;
}
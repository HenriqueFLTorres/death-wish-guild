export default {
  // Lint TS and JS files
  "**/*.(ts|tsx|js)": (filenames) => [
    `bun run eslint ${filenames.join(" ")}`,
    `bun run prettier --write ${filenames.join(" ")}`,
  ],
}

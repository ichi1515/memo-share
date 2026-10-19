// 使い方: node source/build.js  → ../worker.js を作り直す
const fs = require("fs");
const path = require("path");
const read = (p) => fs.readFileSync(path.join(__dirname, p), "utf8");
let worker = read("src/worker.js");

const marker = 'export default {\n  async fetch(req, env) {\n    const { pathname } = new URL(req.url);';
if (!worker.includes(marker)) throw new Error("worker.js の形が想定と違います");

worker = worker.replace(
  marker,
  `let tableReady = null;
function ensureTable(env) {
  tableReady ??= env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS notes (edit_id TEXT PRIMARY KEY, view_id TEXT NOT NULL UNIQUE, text TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)"
  ).run();
  return tableReady;
}

const SECURITY_HEADERS = {
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
  "x-robots-tag": "noindex, nofollow",
  "x-frame-options": "DENY",
  "content-security-policy":
    "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};

function asset(body, type) {
  return new Response(body, {
    headers: { "content-type": type + "; charset=utf-8", "cache-control": "no-cache", ...SECURITY_HEADERS },
  });
}

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);

    // 画面(HTML/CSS/JS)は Worker が直接返す
    if (!pathname.startsWith("/api/")) {
      if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
      if (pathname === "/style.css") return asset(CSS, "text/css");
      if (pathname === "/app.js") return asset(JS, "text/javascript");
      if (pathname === "/robots.txt") return asset("User-agent: *\\nDisallow: /\\n", "text/plain");
      return asset(HTML, "text/html");
    }

    try {
      await ensureTable(env);
    } catch {
      tableReady = null;
      return json({ error: "db_unavailable" }, 500);
    }`
);

const assets =
  `const HTML = ${JSON.stringify(read("public/index.html"))};\n` +
  `const CSS = ${JSON.stringify(read("public/style.css"))};\n` +
  `const JS = ${JSON.stringify(read("public/app.js"))};\n\n`;

fs.writeFileSync(
  path.join(__dirname, "..", "worker.js"),
  "// リンクメモ本体(自動生成)。編集するときは source/ を直して `node source/build.js`\n" + assets + worker
);
console.log("built worker.js");

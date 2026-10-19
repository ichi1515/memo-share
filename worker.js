const MAX_CHARS = 100_000;
const ID_RE = /^[A-Za-z0-9_-]{22}$/;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

// 暗号論的乱数 16byte -> base64url 22文字 (推測不可能なID)
function newId() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  return btoa(String.fromCharCode(...b))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export default {
  async fetch(req, env) {
    const { pathname } = new URL(req.url);
    const m = pathname.match(/^\/api\/notes(?:\/([^/]+))?$/);
    if (!m) return json({ error: "not_found" }, 404);

    const id = m[1];
    if (!id) {
      return req.method === "POST" ? create(env) : json({ error: "method_not_allowed" }, 405);
    }
    if (id === "batch") {
      return req.method === "POST" ? batch(req, env) : json({ error: "method_not_allowed" }, 405);
    }
    if (!ID_RE.test(id)) return json({ error: "not_found" }, 404);
    if (req.method === "GET") return read(env, id);
    if (req.method === "PUT") return write(req, env, id);
    if (req.method === "DELETE") return remove(env, id);
    return json({ error: "method_not_allowed" }, 405);
  },
};

// 一覧画面用: 手元にあるリンクのID(編集ID/閲覧ID)をまとめて渡し、タイトル用の情報を返す。
// 存在しない(削除済み)IDは null。
async function batch(req, env) {
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const ids = Array.isArray(body?.ids) ? [...new Set(body.ids)] : null;
  if (!ids || ids.length > 50 || !ids.every((x) => typeof x === "string" && ID_RE.test(x))) {
    return json({ error: "bad_request" }, 400);
  }
  const notes = {};
  for (const id of ids) notes[id] = null;
  if (ids.length) {
    const ph = ids.map((_, i) => `?${i + 1}`).join(",");
    const { results } = await env.DB.prepare(
      `SELECT edit_id, view_id, substr(text, 1, 400) AS head, updated_at FROM notes WHERE edit_id IN (${ph}) OR view_id IN (${ph})`
    )
      .bind(...ids)
      .all();
    for (const r of results) {
      // 編集IDで来た人にだけ「編集できる」と返す(閲覧IDからは編集権限は分からない)
      if (r.edit_id in notes) notes[r.edit_id] = { head: r.head, updatedAt: r.updated_at };
      if (r.view_id in notes) notes[r.view_id] = { head: r.head, updatedAt: r.updated_at };
    }
  }
  return json({ notes });
}

// 編集IDを知っている人だけが削除できる(閲覧IDでは消せない)
async function remove(env, id) {
  const r = await env.DB.prepare("DELETE FROM notes WHERE edit_id = ?1").bind(id).run();
  return r.meta.changes === 1 ? json({ ok: true }) : json({ error: "not_found" }, 404);
}

async function create(env) {
  const editId = newId();
  const viewId = newId();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO notes (edit_id, view_id, text, version, created_at, updated_at) VALUES (?1, ?2, '', 1, ?3, ?3)"
  )
    .bind(editId, viewId, now)
    .run();
  return json({ editId, viewId }, 201);
}

// id は「編集ID」でも「閲覧ID」でもよい。どちらかで権限が決まる。
async function read(env, id) {
  const asEditor = await env.DB.prepare(
    "SELECT text, version, view_id FROM notes WHERE edit_id = ?1"
  )
    .bind(id)
    .first();
  if (asEditor) {
    return json({
      text: asEditor.text,
      version: asEditor.version,
      canEdit: true,
      viewId: asEditor.view_id, // 閲覧リンクは編集者にだけ教える
    });
  }

  const asViewer = await env.DB.prepare("SELECT text, version FROM notes WHERE view_id = ?1")
    .bind(id)
    .first();
  if (asViewer) {
    return json({ text: asViewer.text, version: asViewer.version, canEdit: false });
  }
  return json({ error: "not_found" }, 404);
}

async function write(req, env, id) {
  const raw = await req.text();
  if (raw.length > MAX_CHARS * 4 + 1000) return json({ error: "too_large" }, 413);

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const { text, baseVersion } = body ?? {};
  if (typeof text !== "string" || !Number.isInteger(baseVersion)) {
    return json({ error: "bad_request" }, 400);
  }
  if (text.length > MAX_CHARS) return json({ error: "too_large" }, 413);

  // 楽観的ロック: 自分が見ていた version のままなら更新できる(アトミック)
  const r = await env.DB.prepare(
    "UPDATE notes SET text = ?1, version = version + 1, updated_at = ?2 WHERE edit_id = ?3 AND version = ?4"
  )
    .bind(text, Date.now(), id, baseVersion)
    .run();

  if (r.meta.changes === 1) return json({ version: baseVersion + 1 });

  // 0件 = 存在しない/閲覧ID、または他の人が先に更新した
  const cur = await env.DB.prepare("SELECT text, version FROM notes WHERE edit_id = ?1")
    .bind(id)
    .first();
  if (!cur) return json({ error: "not_found" }, 404);
  return json({ conflict: true, text: cur.text, version: cur.version }, 409);
}

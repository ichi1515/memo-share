"use strict";

const app = document.getElementById("app");
const PATH_RE = /^\/([ev])\/([A-Za-z0-9_-]{22})$/;

// ---------- 小物 ----------
const h = (tag, props = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v);
  }
  el.append(...kids); // 文字列は textContent 扱い → XSS 対策
  return el;
};

async function api(method, id, body, keepalive = false) {
  const payload = body ? JSON.stringify(body) : undefined;
  const res = await fetch(id ? `/api/notes/${id}` : "/api/notes", {
    method,
    headers: payload ? { "content-type": "application/json" } : {},
    body: payload,
    keepalive: keepalive && payload && payload.length < 60000,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}

const titleOf = (text) => {
  const line = text.split("\n").find((l) => l.trim());
  return line ? line.trim().slice(0, 30) : "無題のメモ";
};

const previewOf = (text) => {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (lines[1] || "").slice(0, 60);
};

// ---------- メモ一覧 (この端末の localStorage に保存。アカウントは無い) ----------
// 要素: { path: "/e/xxxx" | "/v/xxxx", title, preview, at(最終更新 ms), gone(削除済み) }
const NOTES_KEY = "linkmemo.notes";
const OLD_KEY = "linkmemo.recent";
const MAX_NOTES = 50;
const idOf = (path) => path.slice(3);

function loadNotes() {
  try {
    let list = JSON.parse(localStorage.getItem(NOTES_KEY));
    if (!Array.isArray(list)) {
      // 旧バージョン(最近開いたメモ)からの引き継ぎ
      const old = JSON.parse(localStorage.getItem(OLD_KEY)) || [];
      list = old.map((x) => ({ path: x.path, title: x.title, preview: "", at: x.at }));
    }
    return list.filter((x) => x && PATH_RE.test(x.path));
  } catch { return []; }
}
function saveNotes(list) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(list.slice(0, MAX_NOTES))); } catch {}
}
// 一覧に追加/更新。bump=true のときだけ「更新日時」を今にする
function remember(path, text, bump) {
  const list = loadNotes();
  const i = list.findIndex((x) => x.path === path);
  const prev = i >= 0 ? list[i] : null;
  const next = {
    path,
    title: titleOf(text),
    preview: previewOf(text),
    at: bump || !prev ? Date.now() : prev.at,
  };
  if (prev) list[i] = next;
  else list.unshift(next);
  saveNotes(list);
}
function forget(path) {
  saveNotes(loadNotes().filter((x) => x.path !== path));
}

function confirmDialog(message, okLabel) {
  return new Promise((resolve) => {
    const dlg = h("dialog", { class: "share" });
    const ok = h("button", { class: "btn danger" }, okLabel);
    const cancel = h("button", { class: "btn" }, "やめる");
    ok.addEventListener("click", () => { dlg.dataset.ok = "1"; dlg.close(); });
    cancel.addEventListener("click", () => dlg.close());
    dlg.append(h("h2", {}, message), h("div", { class: "row-actions end" }, cancel, ok));
    dlg.addEventListener("close", () => { resolve(dlg.dataset.ok === "1"); dlg.remove(); });
    document.body.append(dlg);
    dlg.showModal();
  });
}

async function deleteNote(path, title) {
  const yes = await confirmDialog(
    `「${title}」を削除しますか？ リンクを知っている全員が開けなくなります。元に戻せません。`,
    "削除する"
  );
  if (!yes) return false;
  const r = await api("DELETE", idOf(path)).catch(() => null);
  if (!r || (r.status !== 200 && r.status !== 404)) {
    alertDialog("削除できませんでした。通信を確認してもう一度試してください。");
    return false;
  }
  forget(path);
  return true;
}

function alertDialog(message) {
  const dlg = h("dialog", { class: "share" });
  const close = h("button", { class: "btn close" }, "閉じる");
  close.addEventListener("click", () => dlg.close());
  dlg.append(h("h2", {}, message), close);
  dlg.addEventListener("close", () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

function fmtDate(ms) {
  const d = new Date(ms);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  }
  const y = d.getFullYear() === now.getFullYear() ? {} : { year: "numeric" };
  return d.toLocaleDateString("ja-JP", { ...y, month: "numeric", day: "numeric" });
}

// ---------- 差分・マージ ----------
// a と b の共通の先頭/末尾を除いた「変更部分」を返す
function diffRegion(a, b) {
  const max = Math.min(a.length, b.length);
  let p = 0;
  while (p < max && a[p] === b[p]) p++;
  let s = 0;
  while (s < max - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;
  return { start: p, aEnd: a.length - s, bEnd: b.length - s, ins: b.slice(p, b.length - s) };
}

// 3-way マージ(簡易版): base→mine と base→theirs の変更箇所が重ならなければ両方取り込む
function merge(base, mine, theirs) {
  const m = diffRegion(base, mine);
  const t = diffRegion(base, theirs);
  if (m.aEnd <= t.start) {
    return base.slice(0, m.start) + m.ins + base.slice(m.aEnd, t.start) + t.ins + base.slice(t.aEnd);
  }
  if (t.aEnd <= m.start) {
    return base.slice(0, t.start) + t.ins + base.slice(t.aEnd, m.start) + m.ins + base.slice(m.aEnd);
  }
  // 同じ箇所を同時に編集: 相手の版を採用し、自分が書いた分は末尾に残す(消さない)
  return m.ins ? theirs + (theirs.endsWith("\n") ? "" : "\n") + m.ins : theirs;
}

// ---------- 一覧(ホーム) ----------
function home() {
  let editing = false;
  let notice = "";

  async function createNote(btn) {
    btn.disabled = true;
    const r = await api("POST").catch(() => null);
    if (r && r.status === 201) {
      const path = `/e/${r.data.editId}`;
      remember(path, "", true);
      location.href = path;
    } else {
      btn.disabled = false;
      notice = "作成できませんでした。通信を確認してもう一度試してください。";
      render();
    }
  }

  async function copyAllLinks() {
    const lines = loadNotes().filter((x) => !x.gone).map((x) => `${x.title}\n${location.origin}${x.path}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n\n"));
      notice = "リンクをコピーしました。メモ帳などに貼って保管してください。";
    } catch {
      notice = "コピーできませんでした。";
    }
    render();
  }

  function row(x) {
    const viewOnly = x.path.startsWith("/v/");
    const meta = [fmtDate(x.at), viewOnly ? "閲覧専用" : ""].filter(Boolean).join("  ");
    const body = x.gone
      ? [h("span", { class: "t gone" }, "削除されたメモ"), h("span", { class: "m" }, "このメモは作成者が削除しました")]
      : [
          h("span", { class: "t" }, x.title),
          h("span", { class: "p" }, x.preview || " "),
          h("span", { class: "m" }, meta),
        ];
    const main = editing || x.gone ? h("div", { class: "main" }, ...body) : h("a", { class: "main", href: x.path }, ...body);
    const li = h("li", { class: "item" }, main);
    if (editing) {
      // 自分のものは「削除」、閲覧専用/削除済みは「一覧から外す」だけ
      const canDelete = !viewOnly && !x.gone;
      const btn = h("button", { class: "btn" + (canDelete ? " danger" : "") }, canDelete ? "削除" : "外す");
      btn.addEventListener("click", async () => {
        if (canDelete) {
          if (!(await deleteNote(x.path, x.title))) return;
        } else {
          forget(x.path);
        }
        render();
      });
      li.append(btn);
    }
    return li;
  }

  function render() {
    const list = loadNotes().sort((a, b) => b.at - a.at);
    const create = h("button", { class: "btn primary" }, "新規メモ");
    create.addEventListener("click", () => createNote(create));

    const bar = h("header", { class: "bar" }, h("h1", { class: "title" }, "リンクメモ"));
    if (list.length) {
      const toggle = h("button", { class: "btn" }, editing ? "完了" : "編集");
      toggle.addEventListener("click", () => { editing = !editing; notice = ""; render(); });
      bar.append(toggle);
    }
    bar.append(create);

    const body = h("div", { class: "list-wrap" });
    if (notice) body.append(h("p", { class: "notice", role: "status" }, notice));

    if (!list.length) {
      body.append(
        h("div", { class: "empty" },
          h("h2", {}, "まだメモがありません"),
          h("p", {}, "「新規メモ」を押して書き始めましょう。アカウントは不要です。共有ボタンから、リンクを送るだけで一緒に書けます。")
        )
      );
    } else {
      body.append(h("ul", { class: "list" }, ...list.map(row)));
      if (editing) {
        const copy = h("button", { class: "btn" }, "リンクをまとめてコピー");
        copy.addEventListener("click", copyAllLinks);
        body.append(copy);
      }
    }
    body.append(
      h("p", { class: "note" },
        "この一覧は、この端末のブラウザにだけ保存されています。ブラウザのデータを消すと一覧も消えるので、大事なメモはリンクを控えておくか、ホーム画面に追加して使ってください。リンクを知っている人は誰でも開けます。住所やパスワードなどは書かないでください。")
    );
    app.replaceChildren(bar, body);
  }

  render();
  refresh();

  // サーバーから最新のタイトル・更新日時を取り、削除済みも検出する
  async function refresh() {
    const list = loadNotes();
    if (!list.length) return;
    const res = await fetch("/api/notes/batch", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: list.slice(0, MAX_NOTES).map((x) => idOf(x.path)) }),
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    if (!res || !res.notes) return;
    const fresh = loadNotes().map((x) => {
      const info = res.notes[idOf(x.path)];
      if (info === undefined) return x; // 51件目以降などは触らない
      if (info === null) return { ...x, gone: true };
      return { path: x.path, title: titleOf(info.head), preview: previewOf(info.head), at: info.updatedAt };
    });
    saveNotes(fresh);
    render();
  }
}

function message(title, body) {
  app.replaceChildren(
    h("div", { class: "page" }, h("h1", {}, title), h("p", {}, body), h("a", { href: "/" }, "メモ一覧へ戻る"))
  );
}

// ---------- メモ画面 ----------
async function openNote(id) {
  app.replaceChildren(h("div", { class: "page" }, h("p", {}, "読み込み中…")));
  const r = await api("GET", id).catch(() => null);
  if (!r) return message("つながりません", "通信を確認して、ページを再読み込みしてください。");
  if (r.status !== 200) return message("メモが見つかりません", "リンクが途中で切れていないか確認してください。");

  const note = r.data;
  const canEdit = note.canEdit;
  let version = note.version;
  let base = note.text; // サーバーと最後に同期できた本文
  let saving = false;
  let timer = null;

  const ta = h("textarea", {
    class: "sheet",
    spellcheck: "false",
    autocapitalize: "off",
    "aria-label": "メモ本文",
    placeholder: canEdit ? "ここに書く。共有ボタンからリンクを送ると、同じメモを一緒に書けます。" : "",
  });
  ta.value = note.text;
  if (!canEdit) ta.readOnly = true;

  const status = h("span", { class: "status", "aria-live": "polite" });
  const setStatus = (text, tone) => {
    status.textContent = text;
    status.dataset.tone = tone;
  };
  setStatus(canEdit ? "保存済み" : "閲覧専用", canEdit ? "ok" : "readonly");

  const origin = location.origin;
  const viewUrl = canEdit ? `${origin}/v/${note.viewId}` : `${origin}/v/${id}`;
  const editUrl = canEdit ? `${origin}/e/${id}` : null;

  const shareBtn = h("button", { class: "btn" }, "共有");
  shareBtn.addEventListener("click", () =>
    shareDialog(editUrl, viewUrl, canEdit && (() => deleteNote(location.pathname, titleOf(ta.value)).then((ok) => ok && (location.href = "/"))))
  );

  app.replaceChildren(
    h("header", { class: "bar" }, h("a", { class: "back", href: "/" }, "‹ メモ一覧"), status, shareBtn),
    ta
  );

  // 一覧に反映(bump=true のときだけ更新日時を進める)
  const touch = (bump = false) => {
    document.title = titleOf(ta.value);
    remember(location.pathname, ta.value, bump);
  };
  touch();

  // 相手の変更を反映するとき、カーソル位置がずれないようにする
  function setText(next) {
    const prev = ta.value;
    if (prev === next) return;
    const d = diffRegion(prev, next);
    const map = (p) => (p <= d.start ? p : p >= d.aEnd ? p + (d.bEnd - d.aEnd) : d.start);
    const [s, e] = [ta.selectionStart, ta.selectionEnd];
    const focused = document.activeElement === ta;
    ta.value = next;
    if (focused) ta.setSelectionRange(map(s), map(e));
  }

  const isDirty = () => ta.value !== base;

  async function save(keepalive = false) {
    clearTimeout(timer);
    if (!canEdit || saving || !isDirty()) return;
    saving = true;
    setStatus("保存中…", "busy");
    const text = ta.value;
    try {
      const res = await api("PUT", id, { text, baseVersion: version }, keepalive);
      if (res.status === 200) {
        base = text;
        version = res.data.version;
      } else if (res.status === 409) {
        // 他の人が先に保存していた → マージして取り込む
        setText(merge(base, ta.value, res.data.text));
        base = res.data.text;
        version = res.data.version;
      } else if (res.status === 413) {
        saving = false;
        return setStatus("長すぎて保存できません（10万文字まで）", "error");
      } else {
        throw new Error(String(res.status));
      }
    } catch {
      saving = false;
      setStatus("保存できません。再試行します", "error");
      timer = setTimeout(save, 4000);
      return;
    }
    saving = false;
    touch(true);
    if (isDirty()) timer = setTimeout(save, 300);
    else setStatus("保存済み", "ok");
  }

  ta.addEventListener("input", () => {
    if (!canEdit) return;
    setStatus("未保存", "dirty");
    clearTimeout(timer);
    timer = setTimeout(save, 1500);
  });

  // 3秒ごとに更新確認(画面が見えている時だけ)
  setInterval(async () => {
    if (document.hidden || saving || isDirty()) return; // 未保存があるなら save() 側で解決する
    const res = await api("GET", id).catch(() => null);
    if (!res || res.status !== 200 || res.data.version <= version) return;
    if (saving || isDirty()) return; // 取得中に入力された場合は何もしない
    base = res.data.text;
    version = res.data.version;
    setText(base);
    touch(true);
    setStatus(canEdit ? "保存済み" : "閲覧専用", canEdit ? "ok" : "readonly");
  }, 3000);

  // 画面を閉じる/アプリ切替の直前に保存
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) save(true);
  });
  window.addEventListener("pagehide", () => save(true));
}

// ---------- 共有ダイアログ ----------
function shareDialog(editUrl, viewUrl, onDelete) {
  const dlg = h("dialog", { class: "share" });
  const row = (label, note, url, warn) => {
    const copy = h("button", { class: "btn" }, "コピー");
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        copy.textContent = "コピーした";
      } catch {
        window.prompt("リンクをコピーしてください", url);
      }
      setTimeout(() => (copy.textContent = "コピー"), 1500);
    });
    const actions = h("div", { class: "row-actions" });
    if (navigator.share) {
      const send = h("button", { class: "btn primary" }, "送る");
      send.addEventListener("click", () => navigator.share({ url, title: "リンクメモ" }).catch(() => {}));
      actions.append(send);
    }
    actions.append(copy);
    return h(
      "div",
      { class: "row" },
      h("div", { class: "row-text" }, h("strong", {}, label), h("small", { class: warn ? "warn" : "" }, note)),
      actions
    );
  };

  dlg.append(h("h2", {}, "リンクを共有"));
  if (editUrl) {
    dlg.append(row("編集できるリンク", "このリンクを知っている人は全員、書き換えできます。信頼できる人にだけ送ってください。", editUrl, true));
  }
  dlg.append(row("閲覧専用リンク", "読むだけ。書き換えはできません。", viewUrl, false));
  const close = h("button", { class: "btn close" }, "閉じる");
  close.addEventListener("click", () => dlg.close());
  dlg.append(close);
  if (onDelete) {
    const del = h("button", { class: "btn danger close" }, "このメモを削除…");
    del.addEventListener("click", () => { dlg.close(); onDelete(); });
    dlg.append(del);
  }
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => dlg.remove());
  document.body.append(dlg);
  dlg.showModal();
}

// ---------- ルーティング ----------
const m = location.pathname.match(PATH_RE);
if (m) openNote(m[2]);
else home();

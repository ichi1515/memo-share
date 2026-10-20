// リンクメモ本体(自動生成)。編集するときは source/ を直して `node source/build.js`
const HTML = "<!doctype html>\n<html lang=\"ja\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n  <meta name=\"robots\" content=\"noindex, nofollow\">\n  <meta name=\"referrer\" content=\"no-referrer\">\n  <meta name=\"color-scheme\" content=\"light dark\">\n  <title>リンクメモ</title>\n  <link rel=\"stylesheet\" href=\"/style.css\">\n</head>\n<body>\n  <main id=\"app\"></main>\n  <script src=\"/app.js\" defer></script>\n</body>\n</html>\n";
const CSS = ":root {\n  --paper: #eef2f1;\n  --bar: #e3eae8;\n  --ink: #14201f;\n  --sub: #55655f;\n  --dot: #b7c6c2;\n  --line: #cbd7d4;\n  --accent: #0e7c66;\n  --on-accent: #ffffff;\n  --warn: #b4472c;\n  --grid: 28px;\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    --paper: #121816;\n    --bar: #19211f;\n    --ink: #e6eeeb;\n    --sub: #9bada7;\n    --dot: #2c3835;\n    --line: #2a3532;\n    --accent: #3fcfaa;\n    --on-accent: #06231c;\n    --warn: #ff8a6b;\n  }\n}\n\n* { box-sizing: border-box; }\nhtml, body { margin: 0; height: 100%; }\nbody {\n  background: var(--paper);\n  color: var(--ink);\n  font-family: \"Hiragino Sans\", \"Hiragino Kaku Gothic ProN\", \"Noto Sans JP\", \"Yu Gothic\", system-ui, sans-serif;\n  font-size: 17px;\n  -webkit-text-size-adjust: 100%;\n}\n#app { display: flex; flex-direction: column; height: 100dvh; }\nbutton, textarea { font: inherit; color: inherit; }\na { color: inherit; }\n:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }\n\n/* ---- エディタ ---- */\n.bar {\n  display: flex; align-items: center; gap: 12px;\n  padding: calc(8px + env(safe-area-inset-top)) 16px 8px;\n  background: var(--bar);\n  border-bottom: 1px solid var(--line);\n}\n.back { font-weight: 700; text-decoration: none; margin-right: auto; }\n.status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--sub); }\n.status::before {\n  content: \"\"; width: 8px; height: 8px; border-radius: 50%; background: var(--sub);\n}\n.status[data-tone=\"ok\"]::before { background: var(--accent); }\n.status[data-tone=\"busy\"]::before { background: var(--sub); }\n.status[data-tone=\"dirty\"]::before { background: var(--dot); outline: 1px solid var(--sub); }\n.status[data-tone=\"error\"] { color: var(--warn); }\n.status[data-tone=\"error\"]::before { background: var(--warn); }\n.status[data-tone=\"readonly\"]::before { border-radius: 2px; }\n\n.btn {\n  border: 1px solid var(--line); background: transparent; border-radius: 10px;\n  padding: 8px 14px; min-height: 40px; cursor: pointer;\n}\n.btn.primary { background: var(--accent); color: var(--on-accent); border-color: var(--accent); font-weight: 700; }\n.btn:disabled { opacity: .5; }\n\n/* 方眼(ドット)に文字が乗るシート。行高=グリッド幅 */\n.sheet {\n  flex: 1; width: 100%; border: 0; outline: 0; resize: none;\n  --pad: 14px;\n  padding: var(--pad) 20px calc(40dvh + env(safe-area-inset-bottom));\n  line-height: var(--grid);\n  background-color: var(--paper);\n  background-image: radial-gradient(circle, var(--dot) 1.2px, transparent 1.6px);\n  background-size: var(--grid) var(--grid);\n  background-position: 20px calc(var(--pad) + var(--grid) - 3px);\n  background-attachment: local;\n}\n.sheet::placeholder { color: var(--sub); }\n\n/* ---- 共有ダイアログ ---- */\ndialog.share {\n  margin: auto auto 0; width: min(100%, 520px); max-width: 100%;\n  border: 0; border-radius: 18px 18px 0 0; padding: 20px 20px calc(20px + env(safe-area-inset-bottom));\n  background: var(--paper); color: var(--ink);\n}\ndialog.share::backdrop { background: rgba(0, 0, 0, .45); }\ndialog.share h2 { margin: 0 0 12px; font-size: 18px; }\n.row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid var(--line); }\n.row-text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }\n.row-text small { color: var(--sub); font-size: 13px; line-height: 1.5; }\n.row-text small.warn { color: var(--warn); }\n.row-actions { display: flex; gap: 8px; }\n.close { width: 100%; margin-top: 8px; }\n\n/* ---- ホーム / メッセージ ---- */\n.page { padding: calc(32px + env(safe-area-inset-top)) 24px 32px; max-width: 520px; width: 100%; margin: 0 auto; }\n.page h1 { font-size: 28px; margin: 0 0 8px; }\n.page p { color: var(--sub); line-height: 1.7; margin: 0 0 24px; }\n.page .btn.primary { width: 100%; font-size: 18px; min-height: 52px; }\n.page .err { color: var(--warn); margin-top: 12px; min-height: 1.5em; }\n.note { font-size: 13px; color: var(--sub); line-height: 1.7; margin-top: 24px; }\n\n/* ---- メモ一覧 ---- */\n.bar .title { font-size: 18px; margin: 0 auto 0 0; }\n.list-wrap { flex: 1; overflow-y: auto; padding: 0 16px calc(32px + env(safe-area-inset-bottom)); max-width: 640px; width: 100%; margin: 0 auto; }\n.list { list-style: none; margin: 0; padding: 0; }\n.item { display: flex; align-items: center; gap: 12px; border-bottom: 1px solid var(--line); }\n.item .main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; padding: 14px 0; text-decoration: none; }\n.item .t { font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.item .t.gone { color: var(--sub); font-weight: 400; }\n.item .p { color: var(--sub); font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.item .m { color: var(--sub); font-size: 12px; }\n.btn.danger { color: var(--warn); border-color: var(--warn); }\ndialog.share .btn.danger.close { margin-top: 4px; }\n.row-actions.end { justify-content: flex-end; margin-top: 8px; }\n.notice { color: var(--accent); margin: 12px 0 0; font-size: 14px; }\n.empty { padding: 56px 8px 0; }\n.empty h2 { font-size: 20px; margin: 0 0 8px; }\n.empty p { color: var(--sub); line-height: 1.8; margin: 0; }\n.list-wrap > .btn { margin-top: 16px; }\n";
const JS = "\"use strict\";\n\nconst app = document.getElementById(\"app\");\nconst PATH_RE = /^\\/([ev])\\/([A-Za-z0-9_-]{22})$/;\n\n// ---------- 小物 ----------\nconst h = (tag, props = {}, ...kids) => {\n  const el = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === \"class\") el.className = v;\n    else if (k.startsWith(\"on\")) el.addEventListener(k.slice(2), v);\n    else el.setAttribute(k, v);\n  }\n  el.append(...kids); // 文字列は textContent 扱い → XSS 対策\n  return el;\n};\n\nasync function api(method, id, body, keepalive = false) {\n  const payload = body ? JSON.stringify(body) : undefined;\n  const res = await fetch(id ? `/api/notes/${id}` : \"/api/notes\", {\n    method,\n    headers: payload ? { \"content-type\": \"application/json\" } : {},\n    body: payload,\n    keepalive: keepalive && payload && payload.length < 60000,\n  });\n  let data = null;\n  try { data = await res.json(); } catch {}\n  return { status: res.status, data };\n}\n\nconst titleOf = (text) => {\n  const line = text.split(\"\\n\").find((l) => l.trim());\n  return line ? line.trim().slice(0, 30) : \"無題のメモ\";\n};\n\nconst previewOf = (text) => {\n  const lines = text.split(\"\\n\").map((l) => l.trim()).filter(Boolean);\n  return (lines[1] || \"\").slice(0, 60);\n};\n\n// ---------- メモ一覧 (この端末の localStorage に保存。アカウントは無い) ----------\n// 要素: { path: \"/e/xxxx\" | \"/v/xxxx\", title, preview, at(最終更新 ms), gone(削除済み) }\nconst NOTES_KEY = \"linkmemo.notes\";\nconst OLD_KEY = \"linkmemo.recent\";\nconst MAX_NOTES = 50;\nconst idOf = (path) => path.slice(3);\n\nfunction loadNotes() {\n  try {\n    let list = JSON.parse(localStorage.getItem(NOTES_KEY));\n    if (!Array.isArray(list)) {\n      // 旧バージョン(最近開いたメモ)からの引き継ぎ\n      const old = JSON.parse(localStorage.getItem(OLD_KEY)) || [];\n      list = old.map((x) => ({ path: x.path, title: x.title, preview: \"\", at: x.at }));\n    }\n    return list.filter((x) => x && PATH_RE.test(x.path));\n  } catch { return []; }\n}\nfunction saveNotes(list) {\n  try { localStorage.setItem(NOTES_KEY, JSON.stringify(list.slice(0, MAX_NOTES))); } catch {}\n}\n// 一覧に追加/更新。bump=true のときだけ「更新日時」を今にする\nfunction remember(path, text, bump) {\n  const list = loadNotes();\n  const i = list.findIndex((x) => x.path === path);\n  const prev = i >= 0 ? list[i] : null;\n  const next = {\n    path,\n    title: titleOf(text),\n    preview: previewOf(text),\n    at: bump || !prev ? Date.now() : prev.at,\n  };\n  if (prev) list[i] = next;\n  else list.unshift(next);\n  saveNotes(list);\n}\nfunction forget(path) {\n  saveNotes(loadNotes().filter((x) => x.path !== path));\n}\n\nfunction confirmDialog(message, okLabel) {\n  return new Promise((resolve) => {\n    const dlg = h(\"dialog\", { class: \"share\" });\n    const ok = h(\"button\", { class: \"btn danger\" }, okLabel);\n    const cancel = h(\"button\", { class: \"btn\" }, \"やめる\");\n    ok.addEventListener(\"click\", () => { dlg.dataset.ok = \"1\"; dlg.close(); });\n    cancel.addEventListener(\"click\", () => dlg.close());\n    dlg.append(h(\"h2\", {}, message), h(\"div\", { class: \"row-actions end\" }, cancel, ok));\n    dlg.addEventListener(\"close\", () => { resolve(dlg.dataset.ok === \"1\"); dlg.remove(); });\n    document.body.append(dlg);\n    dlg.showModal();\n  });\n}\n\nasync function deleteNote(path, title) {\n  const yes = await confirmDialog(\n    `「${title}」を削除しますか？ リンクを知っている全員が開けなくなります。元に戻せません。`,\n    \"削除する\"\n  );\n  if (!yes) return false;\n  const r = await api(\"DELETE\", idOf(path)).catch(() => null);\n  if (!r || (r.status !== 200 && r.status !== 404)) {\n    alertDialog(\"削除できませんでした。通信を確認してもう一度試してください。\");\n    return false;\n  }\n  forget(path);\n  return true;\n}\n\nfunction alertDialog(message) {\n  const dlg = h(\"dialog\", { class: \"share\" });\n  const close = h(\"button\", { class: \"btn close\" }, \"閉じる\");\n  close.addEventListener(\"click\", () => dlg.close());\n  dlg.append(h(\"h2\", {}, message), close);\n  dlg.addEventListener(\"close\", () => dlg.remove());\n  document.body.append(dlg);\n  dlg.showModal();\n}\n\nfunction fmtDate(ms) {\n  const d = new Date(ms);\n  const now = new Date();\n  if (d.toDateString() === now.toDateString()) {\n    return d.toLocaleTimeString(\"ja-JP\", { hour: \"2-digit\", minute: \"2-digit\" });\n  }\n  const y = d.getFullYear() === now.getFullYear() ? {} : { year: \"numeric\" };\n  return d.toLocaleDateString(\"ja-JP\", { ...y, month: \"numeric\", day: \"numeric\" });\n}\n\n// ---------- 差分・マージ ----------\n// a と b の共通の先頭/末尾を除いた「変更部分」を返す\nfunction diffRegion(a, b) {\n  const max = Math.min(a.length, b.length);\n  let p = 0;\n  while (p < max && a[p] === b[p]) p++;\n  let s = 0;\n  while (s < max - p && a[a.length - 1 - s] === b[b.length - 1 - s]) s++;\n  return { start: p, aEnd: a.length - s, bEnd: b.length - s, ins: b.slice(p, b.length - s) };\n}\n\n// 3-way マージ(簡易版): base→mine と base→theirs の変更箇所が重ならなければ両方取り込む\nfunction merge(base, mine, theirs) {\n  const m = diffRegion(base, mine);\n  const t = diffRegion(base, theirs);\n  if (m.aEnd <= t.start) {\n    return base.slice(0, m.start) + m.ins + base.slice(m.aEnd, t.start) + t.ins + base.slice(t.aEnd);\n  }\n  if (t.aEnd <= m.start) {\n    return base.slice(0, t.start) + t.ins + base.slice(t.aEnd, m.start) + m.ins + base.slice(m.aEnd);\n  }\n  // 同じ箇所を同時に編集: 相手の版を採用し、自分が書いた分は末尾に残す(消さない)\n  return m.ins ? theirs + (theirs.endsWith(\"\\n\") ? \"\" : \"\\n\") + m.ins : theirs;\n}\n\n// ---------- 一覧(ホーム) ----------\nfunction home() {\n  let editing = false;\n  let notice = \"\";\n\n  async function createNote(btn) {\n    btn.disabled = true;\n    const r = await api(\"POST\").catch(() => null);\n    if (r && r.status === 201) {\n      const path = `/e/${r.data.editId}`;\n      remember(path, \"\", true);\n      location.href = path;\n    } else {\n      btn.disabled = false;\n      notice = \"作成できませんでした。通信を確認してもう一度試してください。\";\n      render();\n    }\n  }\n\n  async function copyAllLinks() {\n    const lines = loadNotes().filter((x) => !x.gone).map((x) => `${x.title}\\n${location.origin}${x.path}`);\n    try {\n      await navigator.clipboard.writeText(lines.join(\"\\n\\n\"));\n      notice = \"リンクをコピーしました。メモ帳などに貼って保管してください。\";\n    } catch {\n      notice = \"コピーできませんでした。\";\n    }\n    render();\n  }\n\n  function row(x) {\n    const viewOnly = x.path.startsWith(\"/v/\");\n    const meta = [fmtDate(x.at), viewOnly ? \"閲覧専用\" : \"\"].filter(Boolean).join(\"  \");\n    const body = x.gone\n      ? [h(\"span\", { class: \"t gone\" }, \"削除されたメモ\"), h(\"span\", { class: \"m\" }, \"このメモは作成者が削除しました\")]\n      : [\n          h(\"span\", { class: \"t\" }, x.title),\n          h(\"span\", { class: \"p\" }, x.preview || \" \"),\n          h(\"span\", { class: \"m\" }, meta),\n        ];\n    const main = editing || x.gone ? h(\"div\", { class: \"main\" }, ...body) : h(\"a\", { class: \"main\", href: x.path }, ...body);\n    const li = h(\"li\", { class: \"item\" }, main);\n    if (editing) {\n      // 自分のものは「削除」、閲覧専用/削除済みは「一覧から外す」だけ\n      const canDelete = !viewOnly && !x.gone;\n      const btn = h(\"button\", { class: \"btn\" + (canDelete ? \" danger\" : \"\") }, canDelete ? \"削除\" : \"外す\");\n      btn.addEventListener(\"click\", async () => {\n        if (canDelete) {\n          if (!(await deleteNote(x.path, x.title))) return;\n        } else {\n          forget(x.path);\n        }\n        render();\n      });\n      li.append(btn);\n    }\n    return li;\n  }\n\n  function render() {\n    const list = loadNotes().sort((a, b) => b.at - a.at);\n    const create = h(\"button\", { class: \"btn primary\" }, \"新規メモ\");\n    create.addEventListener(\"click\", () => createNote(create));\n\n    const bar = h(\"header\", { class: \"bar\" }, h(\"h1\", { class: \"title\" }, \"リンクメモ\"));\n    if (list.length) {\n      const toggle = h(\"button\", { class: \"btn\" }, editing ? \"完了\" : \"編集\");\n      toggle.addEventListener(\"click\", () => { editing = !editing; notice = \"\"; render(); });\n      bar.append(toggle);\n    }\n    bar.append(create);\n\n    const body = h(\"div\", { class: \"list-wrap\" });\n    if (notice) body.append(h(\"p\", { class: \"notice\", role: \"status\" }, notice));\n\n    if (!list.length) {\n      body.append(\n        h(\"div\", { class: \"empty\" },\n          h(\"h2\", {}, \"まだメモがありません\"),\n          h(\"p\", {}, \"「新規メモ」を押して書き始めましょう。アカウントは不要です。共有ボタンから、リンクを送るだけで一緒に書けます。\")\n        )\n      );\n    } else {\n      body.append(h(\"ul\", { class: \"list\" }, ...list.map(row)));\n      if (editing) {\n        const copy = h(\"button\", { class: \"btn\" }, \"リンクをまとめてコピー\");\n        copy.addEventListener(\"click\", copyAllLinks);\n        body.append(copy);\n      }\n    }\n    body.append(\n      h(\"p\", { class: \"note\" },\n        \"この一覧は、この端末のブラウザにだけ保存されています。ブラウザのデータを消すと一覧も消えるので、大事なメモはリンクを控えておくか、ホーム画面に追加して使ってください。リンクを知っている人は誰でも開けます。住所やパスワードなどは書かないでください。\")\n    );\n    app.replaceChildren(bar, body);\n  }\n\n  render();\n  refresh();\n\n  // サーバーから最新のタイトル・更新日時を取り、削除済みも検出する\n  async function refresh() {\n    const list = loadNotes();\n    if (!list.length) return;\n    const res = await fetch(\"/api/notes/batch\", {\n      method: \"POST\",\n      headers: { \"content-type\": \"application/json\" },\n      body: JSON.stringify({ ids: list.slice(0, MAX_NOTES).map((x) => idOf(x.path)) }),\n    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);\n    if (!res || !res.notes) return;\n    const fresh = loadNotes().map((x) => {\n      const info = res.notes[idOf(x.path)];\n      if (info === undefined) return x; // 51件目以降などは触らない\n      if (info === null) return { ...x, gone: true };\n      return { path: x.path, title: titleOf(info.head), preview: previewOf(info.head), at: info.updatedAt };\n    });\n    saveNotes(fresh);\n    render();\n  }\n}\n\nfunction message(title, body) {\n  app.replaceChildren(\n    h(\"div\", { class: \"page\" }, h(\"h1\", {}, title), h(\"p\", {}, body), h(\"a\", { href: \"/\" }, \"メモ一覧へ戻る\"))\n  );\n}\n\n// ---------- メモ画面 ----------\nasync function openNote(id) {\n  app.replaceChildren(h(\"div\", { class: \"page\" }, h(\"p\", {}, \"読み込み中…\")));\n  const r = await api(\"GET\", id).catch(() => null);\n  if (!r) return message(\"つながりません\", \"通信を確認して、ページを再読み込みしてください。\");\n  if (r.status !== 200) return message(\"メモが見つかりません\", \"リンクが途中で切れていないか確認してください。\");\n\n  const note = r.data;\n  const canEdit = note.canEdit;\n  let version = note.version;\n  let base = note.text; // サーバーと最後に同期できた本文\n  let saving = false;\n  let timer = null;\n\n  const ta = h(\"textarea\", {\n    class: \"sheet\",\n    spellcheck: \"false\",\n    autocapitalize: \"off\",\n    \"aria-label\": \"メモ本文\",\n    placeholder: canEdit ? \"ここに書く。共有ボタンからリンクを送ると、同じメモを一緒に書けます。\" : \"\",\n  });\n  ta.value = note.text;\n  if (!canEdit) ta.readOnly = true;\n\n  const status = h(\"span\", { class: \"status\", \"aria-live\": \"polite\" });\n  const setStatus = (text, tone) => {\n    status.textContent = text;\n    status.dataset.tone = tone;\n  };\n  setStatus(canEdit ? \"保存済み\" : \"閲覧専用\", canEdit ? \"ok\" : \"readonly\");\n\n  const origin = location.origin;\n  const viewUrl = canEdit ? `${origin}/v/${note.viewId}` : `${origin}/v/${id}`;\n  const editUrl = canEdit ? `${origin}/e/${id}` : null;\n\n  const shareBtn = h(\"button\", { class: \"btn\" }, \"共有\");\n  shareBtn.addEventListener(\"click\", () =>\n    shareDialog(editUrl, viewUrl, canEdit && (() => deleteNote(location.pathname, titleOf(ta.value)).then((ok) => ok && (location.href = \"/\"))))\n  );\n\n  app.replaceChildren(\n    h(\"header\", { class: \"bar\" }, h(\"a\", { class: \"back\", href: \"/\" }, \"‹ メモ一覧\"), status, shareBtn),\n    ta\n  );\n\n  // 一覧に反映(bump=true のときだけ更新日時を進める)\n  const touch = (bump = false) => {\n    document.title = titleOf(ta.value);\n    remember(location.pathname, ta.value, bump);\n  };\n  touch();\n\n  // 相手の変更を反映するとき、カーソル位置がずれないようにする\n  function setText(next) {\n    const prev = ta.value;\n    if (prev === next) return;\n    const d = diffRegion(prev, next);\n    const map = (p) => (p <= d.start ? p : p >= d.aEnd ? p + (d.bEnd - d.aEnd) : d.start);\n    const [s, e] = [ta.selectionStart, ta.selectionEnd];\n    const focused = document.activeElement === ta;\n    ta.value = next;\n    if (focused) ta.setSelectionRange(map(s), map(e));\n  }\n\n  const isDirty = () => ta.value !== base;\n\n  async function save(keepalive = false) {\n    clearTimeout(timer);\n    if (!canEdit || saving || !isDirty()) return;\n    saving = true;\n    setStatus(\"保存中…\", \"busy\");\n    const text = ta.value;\n    try {\n      const res = await api(\"PUT\", id, { text, baseVersion: version }, keepalive);\n      if (res.status === 200) {\n        base = text;\n        version = res.data.version;\n      } else if (res.status === 409) {\n        // 他の人が先に保存していた → マージして取り込む\n        setText(merge(base, ta.value, res.data.text));\n        base = res.data.text;\n        version = res.data.version;\n      } else if (res.status === 413) {\n        saving = false;\n        return setStatus(\"長すぎて保存できません（10万文字まで）\", \"error\");\n      } else {\n        throw new Error(String(res.status));\n      }\n    } catch {\n      saving = false;\n      setStatus(\"保存できません。再試行します\", \"error\");\n      timer = setTimeout(save, 4000);\n      return;\n    }\n    saving = false;\n    touch(true);\n    if (isDirty()) timer = setTimeout(save, 300);\n    else setStatus(\"保存済み\", \"ok\");\n  }\n\n  ta.addEventListener(\"input\", () => {\n    if (!canEdit) return;\n    setStatus(\"未保存\", \"dirty\");\n    clearTimeout(timer);\n    timer = setTimeout(save, 1500);\n  });\n\n  // 3秒ごとに更新確認(画面が見えている時だけ)\n  setInterval(async () => {\n    if (document.hidden || saving || isDirty()) return; // 未保存があるなら save() 側で解決する\n    const res = await api(\"GET\", id).catch(() => null);\n    if (!res || res.status !== 200 || res.data.version <= version) return;\n    if (saving || isDirty()) return; // 取得中に入力された場合は何もしない\n    base = res.data.text;\n    version = res.data.version;\n    setText(base);\n    touch(true);\n    setStatus(canEdit ? \"保存済み\" : \"閲覧専用\", canEdit ? \"ok\" : \"readonly\");\n  }, 3000);\n\n  // 画面を閉じる/アプリ切替の直前に保存\n  document.addEventListener(\"visibilitychange\", () => {\n    if (document.hidden) save(true);\n  });\n  window.addEventListener(\"pagehide\", () => save(true));\n}\n\n// ---------- 共有ダイアログ ----------\nfunction shareDialog(editUrl, viewUrl, onDelete) {\n  const dlg = h(\"dialog\", { class: \"share\" });\n  const row = (label, note, url, warn) => {\n    const copy = h(\"button\", { class: \"btn\" }, \"コピー\");\n    copy.addEventListener(\"click\", async () => {\n      try {\n        await navigator.clipboard.writeText(url);\n        copy.textContent = \"コピーした\";\n      } catch {\n        window.prompt(\"リンクをコピーしてください\", url);\n      }\n      setTimeout(() => (copy.textContent = \"コピー\"), 1500);\n    });\n    const actions = h(\"div\", { class: \"row-actions\" });\n    if (navigator.share) {\n      const send = h(\"button\", { class: \"btn primary\" }, \"送る\");\n      send.addEventListener(\"click\", () => navigator.share({ url, title: \"リンクメモ\" }).catch(() => {}));\n      actions.append(send);\n    }\n    actions.append(copy);\n    return h(\n      \"div\",\n      { class: \"row\" },\n      h(\"div\", { class: \"row-text\" }, h(\"strong\", {}, label), h(\"small\", { class: warn ? \"warn\" : \"\" }, note)),\n      actions\n    );\n  };\n\n  dlg.append(h(\"h2\", {}, \"リンクを共有\"));\n  if (editUrl) {\n    dlg.append(row(\"編集できるリンク\", \"このリンクを知っている人は全員、書き換えできます。信頼できる人にだけ送ってください。\", editUrl, true));\n  }\n  dlg.append(row(\"閲覧専用リンク\", \"読むだけ。書き換えはできません。\", viewUrl, false));\n  const close = h(\"button\", { class: \"btn close\" }, \"閉じる\");\n  close.addEventListener(\"click\", () => dlg.close());\n  dlg.append(close);\n  if (onDelete) {\n    const del = h(\"button\", { class: \"btn danger close\" }, \"このメモを削除…\");\n    del.addEventListener(\"click\", () => { dlg.close(); onDelete(); });\n    dlg.append(del);\n  }\n  dlg.addEventListener(\"click\", (e) => { if (e.target === dlg) dlg.close(); });\n  dlg.addEventListener(\"close\", () => dlg.remove());\n  document.body.append(dlg);\n  dlg.showModal();\n}\n\n// ---------- ルーティング ----------\nconst m = location.pathname.match(PATH_RE);\nif (m) openNote(m[2]);\nelse home();\n";

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

let tableReady = null;
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
      if (pathname === "/robots.txt") return asset("User-agent: *\nDisallow: /\n", "text/plain");
      return asset(HTML, "text/html");
    }

    try {
      await ensureTable(env);
    } catch {
      tableReady = null;
      return json({ error: "db_unavailable" }, 500);
    }
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

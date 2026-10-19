# リンクメモ

アカウント不要で、リンクを送るだけで一緒に書ける共有メモ。
編集用リンクと閲覧専用リンクを分けて共有できます。

## スマホだけで公開する手順(GitHub + Cloudflare)

必要なもの: GitHubアカウント / Cloudflareアカウント(どちらも無料)

### 0. GitHubにファイルを置く
1. GitHubで「New repository」→ 名前は `link-memo`、**Private**(非公開)でOK → 作成
2. 「Add file」→「Upload files」で、**`worker.js` と `wrangler.toml` の2つ**をアップロードして「Commit changes」
   - ZIPのままでは置けません。中身のファイルを1つずつ選んでください
   - `source/` フォルダや `README.md` は無くても動きます

### 1. データベースを作る(Cloudflare)
1. `dash.cloudflare.com` にログイン
2. 「D1 SQL database」→「Create Database」→ 名前は `link-memo`
3. 作成後の画面にある **Database ID**(英数字とハイフンの長い文字列)をコピー

### 2. `wrangler.toml` にIDを書く(GitHub)
1. このリポジトリの `wrangler.toml` を開き、右上の鉛筆マーク(Edit)を押す
2. `database_id = "..."` の中身を、コピーしたIDに置き換える
3. 「Commit changes」を押す

### 3. GitHubとつなぐ(Cloudflare)
1. 「Workers & Pages」→「Create」→「Import a repository」(Git に接続)
2. GitHubを連携し、このリポジトリを選ぶ
3. Worker名は **`link-memo`**(`wrangler.toml` の name と同じ)のまま
4. Build command は空、Deploy command は `npx wrangler deploy` のままで「Save and Deploy」

終わると `https://link-memo.○○.workers.dev` が使えます。
以後は、GitHubで `worker.js` を更新するたびに自動で再デプロイされます。

※ メモ用の表(テーブル)は、最初にアクセスしたとき自動で作られます。SQLを自分で流す必要はありません。

## 使い方のメモ
- トップが**メモ一覧**。「新規メモ」で作成、「編集」で削除/一覧から外す/リンクのバックアップ
- 一覧は**その端末のブラウザにだけ**保存されます(アカウントが無いため)。ブラウザのデータを消すと一覧も消えるので、大事なメモは「リンクをまとめてコピー」で控えを取っておくか、ホーム画面に追加して使ってください
- 「削除」は、リンクを知っている全員から見えなくなります(元に戻せません)

## ファイル構成
- `worker.js` … 本体。画面とAPIを1ファイルにまとめたもの(**デプロイされるのはこれ**)
- `wrangler.toml` … 設定
- `source/` … 読みやすく分けた元のソース。`node source/build.js` で `worker.js` を作り直せる

## セキュリティの注意
- リンクを知っている人は誰でも開けます。編集リンクを知っている人は全員が書き換えできます
- パスワード・住所などの個人情報は書かないでください
- `database_id` は秘密情報ではないので、公開リポジトリに置いても問題ありません(APIトークン等は絶対にコミットしないこと)

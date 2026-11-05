# 公開プロフィールの更新

編集元は `content/experience.json`（案件・経歴・記事・出典）と `src/index.template.html`（プロフィールなどの共通部分）。`docs/index.html` と `docs/articles/*/index.html` は生成ファイルです。

```sh
python3 scripts/build_site.py
node --test tests/experience-model.test.mjs
python3 -m http.server 8781 --bind 127.0.0.1 --directory docs
```

生成処理はPythonの標準ライブラリだけで動きます。`docs/style.css` が共通スタイル、`docs/experience.mjs` がタグ・時系列・記事プレビューの操作、`docs/experience-model.mjs` がURLと絞り込み・並べ替え、`docs/site.js` が既存の作品再生と印刷処理です。

- `articles` の `summary` / `details` は仕事一覧、`sections` は詳細記事とホバープレビューに使います。
- `events` は出来事単位。入学・卒業など同じ記事に複数の出来事を関連づけられます。
- 日付は確認できた精度で記載します。年しか分からない出来事は、表示方向によらずその年の月が分かる項目の後に置きます。
- 技術タグはOR、分類・年はANDで絞り込みます。年は案件の開始年、または出来事の年です。
- 表示状態は `view` / `tag`（複数可）/ `category` / `year` / `sort` のクエリで共有・復元できます。
- 外部画像には `images` の出典・撮影年・ライセンスを記載し、本文で扱う内容に対応させます。架空の案件画面は掲載しません。
- 生成後はPC・スマートフォン、マウスとキーボード、絞り込み0件、URL復元、記事リンク、画像・出典、印刷を確認します。

GitHub Pagesの公開元は `master` ブランチの `docs/` です。生成物もコミットします。

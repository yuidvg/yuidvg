---
name: Yui Nishimura Public Profile
description: 写真と余白で、仕事と制作を読みやすく伝える公開プロフィール
colors:
  ink: "#0b0b0d"
  paper: "#fff"
  muted: "#666"
  wash: "#eee"
  blue: "#0171e3"
  blue-hover: "#0055b2"
typography:
  display:
    fontFamily: "YakuHanJP, 'Hiragino Sans', Meiryo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "clamp(40px, 4vw, 52px)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: ".04em"
  headline:
    fontFamily: "YakuHanJP, 'Hiragino Sans', Meiryo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: ".04em"
  title:
    fontFamily: "YakuHanJP, 'Hiragino Sans', Meiryo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.55
  body:
    fontFamily: "YakuHanJP, 'Hiragino Sans', Meiryo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "YakuHanJP, 'Hiragino Sans', Meiryo, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.85
  latin:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  image: "8px"
  card: "12px"
  control: "999px"
spacing:
  stack: "16px"
  content: "24px"
  heading: "40px"
  gutter: "clamp(24px, 3.75vw, 48px)"
  section: "clamp(64px, 6.25vw, 100px)"
  panel: "clamp(24px, 3.5vw, 48px)"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
    textColor: "{colors.paper}"
  text-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "62px"
  project-panel:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.panel}"
  disclosure:
    typography: "{typography.label}"
    padding: "8px 0"
  timeline-item:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "20px 24px"
---

# Design System: Yui Nishimura Public Profile

## Overview

**Creative North Star: "写真と余白のプロフィール"**

指定された既存サイトの、白地・黒い文字・薄いグレーの面・青い操作リンクを継承する。写真と余白を使い、仕事の説明を落ち着いて読める密度に整える。

日本語と欧文は既存のサンセリフスタックで揃える。写真と作品が視覚的な変化を担い、コンポーネントは平面的な角丸と控えめな状態変化で支える。

実装の出典は `docs/style.css`。要素と状態は `docs/index.html` と `docs/site.js` に基づく。ページ固有の構成は `.impeccable/surfaces/profile.md` に置く。

**Key Characteristics:**
- 白・黒・薄いグレーを基調に、操作へ青を使う。
- 写真と作品には既存の本人の素材を使う。
- 余白、文字の大きさ、面の明暗で階層を作る。
- 角丸のパネルとピル形の主要リンクを使う。

## Colors

ニュートラルな面と文字を中心に、青を操作の目印として使う。正確な色値は上記トークンを参照する。

### Primary

- **操作の青 / blue:** ヘッダーの連絡先と選択状態。
- **濃い操作の青 / blue-hover:** 主要リンクのホバー、再生リンク、フォーカス。

### Neutral

- **墨 / ink:** 本文、見出し、作品背景、フッター。
- **白 / paper:** ページとヘッダーの背景、暗い面の文字。
- **補助のグレー / muted:** 期間、写真注記、技術一覧など。
- **薄いグレー / wash:** 案件、技術、経歴、連絡先のパネル。

**The Action Blue Rule.** 青は主要な操作、再生リンク、フォーカスと選択状態に使う。本文の説明や見出しはニュートラル色で保つ。

## Typography

日本語は `--sans`、欧文の人名・ワードマーク・注記は `--latin` を使う。これは指定リファレンスの意図を引き継ぐ選択。YakuHanJPは日本語の約物を補い、本文は後続のシステム書体で表示する。

- **Display:** ヒーローの日本語名。
- **Headline:** セクション見出し。
- **Title:** 案件と技術紹介の見出し。その他の小見出しは（20px）。
- **Body:** 通常の本文。案件の説明は（15px）。
- **Label:** 本文リンクと開閉操作。
- **Latin:** ヒーローの欧文名。

見出しはバランス改行と詰め組み（`palt`）、段落は厳密な日本語改行を使う。期間は等幅数字。モバイルの本文・セクション見出し・案件見出しはそれぞれ（15px / 26px / 22px）。

## Layout

中央コンテナは最大（1120px）、左右余白は `gutter`、主要領域の上下余白は `section`。パネル内は `panel` を基本とする。ヘッダーは上端に固定追従し、高さ（62px）。アンカーのスクロール余白は（94px）。

デスクトップのヒーローは（.9fr / 1.1fr、間隔6%）、案件と技術紹介は（.85fr / 1.15fr、間隔8%）。作品は3列、経歴と受賞は2列。案件同士の間隔は `stack`。

- **900px以下:** 列間とナビゲーションの間隔を詰め、案件見出しを（22px）にする。
- **700px以下:** ヒーロー、説明パネル、経歴、作品を1列にする。ヘッダーはワードマークと連絡先を残す。案件の内側余白は（28px 24px）。
- **印刷:** A4、用紙余白（16mm）。装飾的なナビゲーションとフッターを隠し、実績詳細を開いて出力する。

## Elevation & Depth

影は使わない。薄いグレーのパネルと黒いフッターが領域を分け、写真が奥行きを担う。パネルはホバーで浮かせない。

**The Flat Surface Rule.** 通常の面とホバー状態に影を足さず、白・薄いグレー・黒の切り替えで領域を示す。

## Shapes

画像には `image`、説明パネル・経歴・フッターには `card`、主要操作には `control` の角丸を使う。画像の端はコンテナ内で切り抜く。通常のパネルに枠線はない。

矢印と開閉記号は線画SVG。通常サイズは（20px）、作品の操作は（16px）、線幅は（1.5）。文字の矢印やアイコンフォントへ置き換えない。

## Components

### Buttons

主要操作は青いピル形のリンク。デスクトップは（13px）の文字と（12px）のアイコン間隔、モバイルは文字（12px）、内側余白（10px 16px）。ホバーでは濃い青へ切り替え、下線を付けない。

### Text links

本文と同じ色、文字と矢印の間隔（14px）。ホバーで下線を表示する。操作の高さは最低（44px）。全てのキーボード操作には濃い青の輪郭（2px、オフセット5px）を表示する。

### Cards / Containers

薄いグレーの平面的な角丸パネル。案件は見出しと説明を横に並べ、モバイルで縦に積む。経歴は（20px 24px）の内側余白、項目間は（12px）。技術一覧はデスクトップ（32px）、900px以下（24px）の内側余白。

### Disclosure

ネイティブの `details` / `summary` で実績を開閉する。操作行は最低（44px）、上下余白（8px）。プラスの線画は開いたとき（45deg）回転し、変化は（.2s ease）。動きの軽減設定では遷移を止める。本文はJavaScriptなしでも開ける。

### Navigation

白い追従ヘッダーに、欧文ワードマーク、本文リンク、連絡先を並べる。通常リンクは下線、連絡先は背景色でホバーを示す。小さい画面では中間の本文リンクを隠す。キーボード用の本文スキップリンクはフォーカス時に表示する。

### Artwork and footer

作品は静止画を最初に表示し、操作時だけ動画画像を読み込む。読み込み・停止・再試行は既存の文字ラベルで伝える。フッターは黒い角丸の面とし、ページ外周から（16px）離す。

## Do's and Don'ts

### Do:
- Do 既存の日本語・欧文フォントスタックと、本文のゆとりある行間を引き継ぐ。
- Do 写真・作品・パネル・操作で、対応する角丸トークンを使い分ける。
- Do 操作にはキーボードフォーカスを表示し、動きの軽減設定を尊重する。
- Do モバイルでは説明の列を縦に並べ、実績の詳細をネイティブの開閉操作で読めるようにする。

### Don't:
- Don't 指定された白・黒・グレー・青の体系に、根拠のない装飾色や影を追加する。
- Don't 写真を生成画像へ置き換えたり、作品の自動再生を追加したりする。
- Don't JavaScriptの有無で本文や実績の詳細を読めなくする。

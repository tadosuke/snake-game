# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code) への指針を提供します。

## プロジェクト概要

これはHTML/CSS/JavaScriptで実装されたブラウザ上で動作するスネークゲームプロジェクトです。

## 開発セットアップ

このプロジェクトは以下の技術スタックを使用しています：

- HTML/CSS/JavaScript（バニラJS）
- Vitest（テスト）
- TypeScript（型チェック）
- Prettier（コードフォーマット）
- JSDOM（テスト環境）

## プロジェクト構造

```
.
├── index.html          # メインのHTMLファイル
├── style.css           # ゲームのスタイル
├── scripts/            # JavaScriptモジュール
│   ├── main.js         # エントリーポイント
│   ├── gameState.js    # ゲーム状態管理
│   ├── gameScreen.js   # ゲーム画面
│   ├── titleScreen.js  # タイトル画面
│   └── constants.js    # 定数定義
├── __tests__/          # テストファイル
├── package.json        # 依存関係とスクリプト
├── tsconfig.json       # TypeScript設定
└── vitest.config.js    # テスト設定
```

## コマンド

- `npm run test` - Vitestを使用してテストを実行
- `npm run tscheck` - TypeScriptで型チェック

## パッケージ管理

**重要**: 再現可能なビルドを確保するため、依存関係には常に正確なバージョンを使用してください（^や~プレフィックスは使用しない）。新しい依存関係を追加する際は：

1. パッケージをインストール: `npm install <package>`
2. package.jsonを編集してバージョンプレフィックス（^や~）を削除
3. package.jsonとpackage-lock.jsonの変更を一緒にコミット

## アーキテクチャノート

ゲームはモジュラー設計を採用しており、以下の構成になっています：

- **main.js**: アプリケーションのエントリーポイント
- **gameState.js**: ゲーム状態の管理（スネークの位置、食べ物、スコアなど）
- **gameScreen.js**: ゲーム画面の描画とゲームループ
- **titleScreen.js**: タイトル画面の表示と操作
- **constants.js**: ゲーム全体で使用する定数

描画にはHTML5 Canvasを使用し、各モジュールは明確な責任分離がされています。

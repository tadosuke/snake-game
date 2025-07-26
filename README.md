# Snake Game

Claude Code を使用してブラウザ上で動くスネークゲームを作るための検証プロジェクトです。

<img width="674" height="722" alt="image" src="https://github.com/user-attachments/assets/7cbbdcab-dff0-4d17-a22f-4dc428e3a9d6" />

## 特徴

- HTML5 Canvas を使用したスムーズなゲーム描画
- 影のトレイル効果による視覚的なフィードバック
- リアルタイムスコア表示
- キーボード操作（矢印キー + スペースキー）
- ゲームオーバー時の自動リスタート機能

## 技術スタック

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Testing**: Vitest + jsdom
- **Build Tools**: なし（バニラJSプロジェクト）

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（ブラウザでindex.htmlを開く）
open index.html
```

## テスト

```bash
# テストの実行
npm test

# テストの実行（一回のみ）
npm run test:run

# テストの監視モード
npm run test:watch
```

## ゲームの操作方法

- **矢印キー**: スネークの移動
- **スペースキー**: ゲームのリスタート

## プロジェクト構造

```
snake-game/
├── index.html          # メインのHTMLファイル
├── script.js           # ゲームロジック
├── style.css           # スタイルシート
├── package.json        # プロジェクト設定
├── vitest.config.js    # テスト設定
├── __tests__/          # テストファイル
│   └── script.test.js
└── CLAUDE.md           # Claude Code用の設定ファイル
```

## 実装された機能

- スネークの移動とサイズ拡張
- 食べ物の生成とランダム配置
- 衝突検出（壁・自分自身）
- スコアシステム
- 影のトレイル効果
- ゲームループと状態管理
- 包括的なテストスイート

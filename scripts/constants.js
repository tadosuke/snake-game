/** @type {number} 各グリッドセルのピクセルサイズ */
export const GRID_SIZE = 20;

/** @type {number} ゲームループの間隔（ミリ秒） */
export const GAME_LOOP_INTERVAL = 100;

/** @type {number} 食べ物を食べた時のスコア */
export const FOOD_SCORE = 10;

/** @type {number} 影の軌跡の最大長さ */
export const MAX_SHADOW_TRAIL_LENGTH = 5;

/** @type {number} 影の軌跡の透明度減衰率 */
export const SHADOW_OPACITY_DECAY = 0.2;

/** @type {string} ゲーム状態：タイトル画面 */
export const GAME_STATE_TITLE = 'title';

/** @type {string} ゲーム状態：プレイ中 */
export const GAME_STATE_PLAYING = 'playing';

/** @type {string} ゲーム状態：ゲームオーバー */
export const GAME_STATE_GAME_OVER = 'gameOver';

/** @type {{x: number, y: number}} プレイヤー1の初期位置 */
export const PLAYER1_INITIAL_POSITION = { x: 10, y: 10 };

/** @type {{x: number, y: number}} プレイヤー2の初期位置 */
export const PLAYER2_INITIAL_POSITION = { x: 20, y: 20 };

/** @type {string} プレイヤー1のスネークの色 */
export const PLAYER1_COLOR = 'lime';

/** @type {string} プレイヤー2のスネークの色 */
export const PLAYER2_COLOR = 'blue';

/** @type {string} 食べ物の色 */
export const FOOD_COLOR = 'red';

/** @type {string} 背景色 */
export const BACKGROUND_COLOR = 'black';

/** @type {string} プレイヤー1の影の軌跡の色（RGBA形式のベース） */
export const PLAYER1_SHADOW_COLOR_BASE = '0, 150, 0';

/** @type {string} プレイヤー2の影の軌跡の色（RGBA形式のベース） */
export const PLAYER2_SHADOW_COLOR_BASE = '0, 100, 255';

/** @type {number} グリッドセル間のボーダーサイズ */
export const GRID_BORDER_SIZE = 2;

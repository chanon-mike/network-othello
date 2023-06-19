# Online Othello

Welcome to the Online Othello project! This is a web-based implementation of the classic board game Othello, also known as Reversi. You can play Othello against other players online, create a lobby, and watch other games.

![online othello](https://github.com/chanon-mike/online-othello/assets/27944646/2d40787b-1f4b-40d0-9979-ffbaa66d0ec0)

## Features

- Real-time gameplay
- Multiple-game lobby
- Spectating

### Update plans (Maybe?)

- [ ] Spectating UI
- [ ] Chat functionality
- [ ] User profiles

### Bugs and problems found

- [x] Users cannot create a new lobby when they already create one or play in another lobby
- [x] Make 3rd player cannot join the lobby => Spectatable now
- [x] NO MORE MOVES modal should only appear when a player turn is a current turn (Remove)
- [x] When white end the game, the game restarts with white as a first turn.
- [x] When one player is in the game, they can move (should make it so that the modal wait for another player appear)
- [ ] Spectator sees turn order as "Your turn" or "Opponent turn" (Should display as a player name instead)
- [ ] Refresh page results in the player remove from the lobby. They need to go back to the lobby page and join the room by themselves
- [ ] Changing route by typing in the address bar will not show the confirm modal

Japanese for settings and installation below

<hr>

## 概論

フロントエンドは src ディレクトリの [Next.js](https://nextjs.org/) 、バックエンドは server ディレクトリの [frourio](https://frourio.com/) で構築された TypeScript で一気通貫開発が可能なモノレポサービス

## ローカル開発

### Node.js のインストール

ローカルマシンに直接インストールする

https://nodejs.org/ja/ の左ボタン、LTS をダウンロードしてインストール

### リポジトリのクローンと npm モジュールのインストール

フロントとバックエンドそれぞれに package.json があるので 2 回インストールが必要

```sh
$ npm i
$ npm i --prefix server
```

### 環境変数ファイルの作成

.env ファイルを 4 つ作成する  
prisma 用の.env には自分で起動した PostgreSQL の設定を書く

```sh
$ cp .env.example .env
$ cp server/.env.example server/.env
$ cp docker/dev/.env.example docker/dev/.env
$ echo "API_DATABASE_URL=postgresql://root:root@localhost:5432/online-othello" >> server/prisma/.env
```

### ミドルウェアのセットアップ

```sh
$ docker-compose up -d
```

#### Firebase Emulator

http://localhost:4000/auth

#### MinIO Console

http://localhost:9001/

#### PostgreSQL UI

```sh
$ cd server
$ npx prisma studio
```

### 開発サーバー起動

次回以降は以下のコマンドだけで開発できる

```sh
$ npm run notios
```

Web ブラウザで http://localhost:3000 を開く

開発時のターミナル表示は [notios](https://github.com/frouriojs/notios) で制御している

[Node.js モノレポ開発のターミナルログ混雑解消のための新作 CLI ツール notios](https://zenn.dev/luma/articles/nodejs-new-cli-tool-notios)

閉じるときは `Ctrl + C` を 2 回連続で入力

### 開発中のバグの早期発見

開発サーバー起動後のターミナルで `dev > [run-p] dev:* > dev:typecheckClient (あるいはtypecheckServer)` の順に開いて Enter を押すと型検査の結果が表示される  
ファイルを保存するたびに更新されるのでブラウザで動かす前に型エラーを解消するとほとんどのバグがなくなる

## デプロイ

フロントエンド・バックエンド・dbは[render](https://dashboard.render.com/)でデプロイした

### Firebase

[Firebase](https://console.firebase.google.com/u/0/)のAPIと連携は下記のように設定
1. プロジェクトを作成
2. プロジェクト設定に行く
3. アプリを追加（Web App）して、firebaseConfigを環境変数NEXT_PUBLIC_FIREBASE_CONFIGに追加
4. サービスアカウントのFirebase Admin SDKからプライベートキーをダウンロードし、環境変数FIREBASE_SERVER_KEYに追加

### Render

PostgreSQLのdbを作成して、Web Serviceでバックエンドをデプロイし、Static siteでフロントエンドをデプロイした

環境変数は下記のように設定
```
API_DATABASE_URL=PostgreSQLデータベースのURL
API_BASE_PATH=/api
API_ORIGIN=バックエンドサーバーのURL
CORS_ORIGIN=フロントエンドサーバーのURL
FIREBASE_SERVER_KEY=firebase_サービスアカウントの値
NEXT_PUBLIC_FIREBASE_CONFIG=firebaseConfigの値
```

#### ビルドコマンド
```
$ npm i; npm i --prefix server; npm run build:client; npm run build:server
```

#### スタートコマンド
フロントエンド
```
$ out/
```

バックエンド
```
$ npm start --prefix server
```


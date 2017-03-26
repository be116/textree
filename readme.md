# textree
- 過去に作成したWebページのソースです。
- サーバとしてnode.jsを、データベースとしてmongoDBを使用します。

# 概要
- ユーザ参加型のアドベンチャーゲーム作成Webサービスです。
- 既にある文章に対し、新たな分岐と文章を登録し、物語を深めていきます。

# 実行方法
- `npm install`
  - 依存パッケージをインストールします。
- `mongod`
  - mongoDBを起動します。
- `mongo --quiet localhost/textree config/db_init.js`
  - データベースに初期でデータを登録します。
- `node express.js`
  - サーバを起動します。


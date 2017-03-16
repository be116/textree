# textree
- 過去に作成したWebページのソースです。
- サーバとしてnode.jsを、データベースとしてmongoDBを使用します。

# 実行
- `npm install`
  - 依存パッケージをインストールします。
- `mongod`
  - mongoDBを起動します。
- `mongo --quiet localhost/textree config/db_init.js`
  - データベースに初期でデータを登録します。
- `node express.js`
  - サーバを起動します。
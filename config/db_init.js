db.log.remove({});
tuto_max = 100;
var logs = [
    { _id: 0, text: "まずは、「続きを読む」をクリックしてください。", brunch: [{ text: "続きを読む", next: 1 }, { text: "説明をとばす", next: 7}] },
    { _id: 1, text: "「続きを読む」をクリックしたことで、次の文章が表示されました。", brunch: [{ text: "続きを読む", next: 2}]},
    { _id: 2, text: "このような項目は1つだけに限らず、複数存在する場合があります。 これらの中から好きなものを選ぶと… ", brunch: [{ text: "1つ目の分岐", next: 3 }, { text: "2つ目の分岐", next: 4 }] },
    { _id: 3, text: "このように、1つ目の分岐に入ることができました。", brunch: [{ text: "続きを読む", next: 5 }] },
    { _id: 4, text: "このように、2つ目の分岐に入ることができました。", brunch: [{ text: "続きを読む", next: 5 }] },
    { _id: 5, text: "下のテキストボックスに適当な文章を入力することで、皆さんの手でこういった分岐を追加することができます。", brunch: [{ text: "続きを読む", next: 6 }] },
    { _id: 6, text: "ちなみに、それぞれの文頭にはその文章に対応するIDを表示しています。任意のIDを指定することでその文章にジャンプすることができます。", brunch: [{ text: "続きを読む", next: 7 }] },
    { _id: 7, text: "ここまでお読みいただき、ありがとうございます。ここからは、皆さんの手で文章の木が成長していくことを期待しています。", brunch: [] }
];
var counters = [
    {
        _id: "logs",
        seq: logs[logs.length-1]._id
    }
];

db.logs.remove({});
db.logs.insert(logs);
db.counters.remove({});
db.counters.insert(counters);
db.tutorials.remove({});
db.tutorials.insert(counters);
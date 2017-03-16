var mongoose = require('mongoose');
var Log = mongoose.model('Log');
var Counter = mongoose.model('Counter');
var twitter = require('twitter');
exports.load = function (req, res) {
    console.log(req.body.id);
    Log.findOneAndUpdate({ _id: req.body.id, "brunch.next": req.body.next }, { $inc: { 'brunch.$.access': 1 } }, function (err, data) {
        if (err) {
            console.log(err);
            res.send({ err: true, message: "指定の文章を読み込むことができません。" });
            return;
        }
        Log.findOne({ _id: req.body.next }, function (err, data) {
            if (err) {
                console.log(err);
                res.send({ err: true, message: "指定の文章を読み込むことができません。" });
                return;
            }
            res.send(data);
        });
    });
};
exports.jump = function (req, res) {
    Log.findOne({ _id: req.body.id }, function (err, data) {
        if (err) {
            console.log(err);
            res.send({ err: true, message: "指定の文章は存在しません。" });
            return;
        }
        res.send(data);
    });
};
exports.save = function (req, res) {
    if (req.body._id < 7) {
        console.log("save rejected!");
        res.send({ err: true });
        return;
    }
    Counter.getNextSequence("logs", function (err, seq) {
        if (err) {
            console.log(err);
            res.send({ err: true });
            return false;
        }
        Log.findOneAndUpdate({ _id: req.body._id }, {
            $push: {
                brunch: {
                    text: req.body.brunch,
                    next: seq.value.seq,
                    access: 1
                }
            }
        }, { new: true, upsert: true }, function (err, data) {
            if (err)
                return;
            console.log("Log Updated" + data);
            res.send(data);
            Log.create({
                _id: seq.value.seq,
                text: req.body.text,
            }, function (error, log) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Logs saved: " + log);
                    var client = new twitter({
                        consumer_key: 'J9pjK6bGqsIBGxtGmkAv30Vrm',
                        consumer_secret: 'akVrxbhUkI2gWfZucH9tzJLhqrUjzzynOfQwZAfgg9iUWgGzE1',
                        access_token_key: '724568077472391169-byU7j80Ytvl6Fb7a9dB61vKSQ4qmzqu',
                        access_token_secret: 'InlCGCt0NmKows0vKdllCjFTJg9Bv67z7KjbFXK82ZkBc'
                    });
                    var text = "次の文章が追加されました。\n\"" + log.text + "\" http://textree.xyz";
                    client.post('statuses/update', { status: text }, function (error, tweet, response) {
                        if (!error) {
                            console.log(tweet);
                        }
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=log.js.map
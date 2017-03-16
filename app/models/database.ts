var mongoose = require('mongoose');
var mURI = 'mongodb://localhost/textree';
mongoose.connect(mURI);
mongoose.connection.on('connected', function () {
    console.log('mongoose URI locates ' + mURI);
});
var LogSchema = new mongoose.Schema({
    _id: { type: Number, unique: true },
    text: String,
    brunch: [
        {
            text: { type: String, unique: true },
            next: Number,
            access: Number,
            date: Date
        }
    ]
});
var CounterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});
CounterSchema.statics.getNextSequence = function (name, callback) {
    return this.collection.findAndModify({ _id: name }, [], { $inc: { seq: 1 } }, { new: true, upsert: true }, callback);
};
var Log = mongoose.model('Log', LogSchema);
var Counter = mongoose.model('Counter', CounterSchema);
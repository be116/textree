function findup(id, prev) {
    db.logs.find({_id:id
        /*query: { _id: id }, 
        update: { $set: { prev: prev } },
        upsert: true,
        new: true*/
    }).forEach(function (d) {
        db.logs.update({ _id: d._id }, { $set :{ prev: prev } }, {new: true});
        print(d._id, prev, d.brunch);
        for (var i = 0; i < d.brunch.length; i++) {
            findup(d.brunch[i].next, id);
        }
    });
}
findup(0, -1);
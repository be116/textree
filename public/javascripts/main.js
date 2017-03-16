var _data = { _id: -1, text: null, brunch: [] };
var logn = 0;
var ume = 9;
var next_null_message = "～～この文章に続きはありません。お好きな文章を追加することができます。～～";
var _history = { index: -1, data: [] };
$(document).ready(function () {
    //$.removeCookie('_history');
    if ($.cookie("_history") != undefined) {
        _history = JSON.parse($.cookie("_history"));
    }
    if (_history.index == -1) {
        jump_log(0, function () { }, function () { });
    }
    else {
        var id = _history.data[_history.index]._id;
        undo_hist();
        jump_log(id, function () { }, function () { });
    }
    $('#save').on('click', save);
    $('#jump').on('click', function () {
        var id = $('#page').val();
        jump_log(id, function () {
            $('<p></p>', {
                text: "～～[" + id_slice(id, ume) + "]にジャンプします～～",
                addClass: "text-warning"
            }).appendTo('#log');
        }, function () {
        });
    });
    $("#undo").on("mouseup", function () {
        $('<p></p>', {
            text: "～～1つ前の文章に戻ります～～",
            addClass: "text-warning"
        }).appendTo('#log');
        undo_hist();
        show_log();
        show_brunch();
    });
    $("#redo").on("mouseup", function () {
        $('<p></p>', {
            text: "～～1つ先の文章に進みます～～",
            addClass: "text-warning"
        }).appendTo('#log');
        redo_hist();
        show_log();
        show_brunch();
    });
    $("#home").on("mouseup", function () {
        $('<p></p>', {
            text: "～～最初の文章に戻ります～～",
            addClass: "text-warning"
        }).appendTo('#log');
        jump_log(0, function () { }, function () { });
    });
    $(window).unload(function () {
        $.cookie("_history", JSON.stringify(_history));
    });
});
var push_hist = function (data) {
    _history.index++;
    _history.data.splice(_history.index);
    _history.data[_history.index] = data;
    if (_history.index > 0)
        $("#undo").prop("disabled", false);
    else
        $("#undo").prop("disabled", true);
    $("#redo").prop("disabled", true);
};
var undo_hist = function () {
    if (--_history.index < -1) {
        _history.index++;
    }
    if (_history.index <= 0) {
        $("#undo").prop("disabled", true);
    }
    $("#redo").prop("disabled", false);
};
var redo_hist = function () {
    if (++_history.index >= _history.data.length) {
        _history.index--;
    }
    if (_history.index + 1 >= _history.data.length) {
        $("#redo").prop("disabled", true);
    }
    $("#undo").prop("disabled", false);
};
var save = function () {
    var brunch = $('#brunch').val();
    var text = $("#text").val();
    text = text.replace(/\r?\n/g, "");
    if (brunch == "" || text == "") {
        alert("未記入の項目があります");
        return;
    }
    save_log(brunch, text);
};
var load_log = function (id, next, success, error) {
    var data = {
        id: id,
        next: next
    };
    post('log/load', data, function (data) {
        if (data.err == true) {
            console.log("load error!");
            alert(data.message);
            return false;
        }
        $("." + brunch_class(logn)).prop('disabled', true);
        push_hist(data);
        success();
        show_log();
        show_brunch();
    }, function (data) { error(); alert('該当する文章は存在しません'); });
};
var jump_log = function (id, success, error) {
    var data = {
        id: id
    };
    post('log/jump', data, function (data) {
        if (data.err == true) {
            console.log("load error!");
            alert(data.message);
            return false;
        }
        push_hist(data);
        success();
        show_log();
        show_brunch();
    }, function (data) { error(); alert('該当する文章は存在しません'); });
};
var log_id = function (n) {
    return "log" + n;
};
var id_slice = function (id, n) {
    var res = "";
    for (var i = 0; i < n; i++) {
        res += "0";
    }
    return (res + id).slice(-n);
};
var id_text = function () {
    var id = id_slice(_history.data[_history.index]._id, ume);
    return "[" + id + "] " + _history.data[_history.index].text;
};
var brunch_class = function (n) {
    return "brunch" + n;
};
var brunch_group_class = function (n) {
    return "brunch-group" + n;
};
var show_log = function () {
    $("." + brunch_class(logn)).prop('disabled', true);
    logn++;
    $('#' + log_id(logn)).remove();
    $('<div></div>', {
        attr: { 'id': log_id(logn) }
    }).appendTo('#log');
    var p = $('<p></p>').text(id_text());
    p.appendTo('#' + log_id(logn));
    insertText();
};
var brunch_text = function (text, access) {
    if (!access)
        access = 0;
    return text + " (" + access + ")";
};
var show_brunch = function () {
    $("." + brunch_class(logn)).remove();
    $("." + brunch_group_class(logn)).remove();
    var data = _history.data[_history.index];
    if (data.brunch.length == 0) {
        $('<p></p>', {
            text: next_null_message,
            addClass: "text-warning"
        }).appendTo("#" + log_id(logn));
        return;
    }
    for (var i = 0; i < data.brunch.length; i++) {
        var group = $("<div></div>", {
            addClass: brunch_group_class(logn) + " btn-group"
        }).appendTo("#" + log_id(logn));
        var data = _history.data[_history.index];
        var p = $("<button></button>", {
            addClass: brunch_class(logn) + " btn btn-default",
            text: brunch_text(data.brunch[i].text, data.brunch[i].access),
            val: i,
            on: {
                click: function (e) {
                    if (data.brunch[$(this).val()].next == null) {
                        return;
                    }
                    load_log(data._id, data.brunch[$(this).val()].next, function () { }, function () { });
                    $(this).addClass('btn btn-primary');
                }
            }
        });
        group.append(p);
    }
};
var save_log = function (brunch, text) {
    post('/log/save', {
        _id: _history.data[_history.index]._id,
        brunch: brunch,
        text: text
    }, function (data) {
        if (data.err) {
            alert('この文章はこれ以上分岐できません');
            return false;
        }
        push_hist(data);
        var d = _history.data[_history.index];
        $('#' + log_id(logn)).remove();
        show_log();
        show_brunch();
        $('#text').val("");
        $('#brunch').val("");
        $("." + brunch_class(logn)).eq(d.brunch.length - 1).addClass("btn-success");
        load_log(d._id, d.brunch[d.brunch.length - 1].next, function () { }, function () { });
    }, function () { console.log('save log error!'); alert('この文章はこれ以上分岐できません'); });
};
var post = function (url, data, success, error) {
    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(data),
        contentType: 'application/JSON',
        dataType: 'JSON',
        scriptCharset: 'utf-8',
        success: success,
        error: error
    });
};
var get = function (url, data, success, error) {
    $.ajax({
        type: 'get',
        url: url,
        data: data,
        dataType: 'text',
        scriptCharset: 'utf-8',
        success: success,
        error: error
    });
};
var insertText = function () {
    var text = $('#' + log_id(logn)).text();
    var button = '<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + text + '" data-lang="ja" data-related="TexTreeAd" data-hashtags="今読んでる">ツイート</a>';
    $('#twbtn').html(button);
    twttr.widgets.load();
};
//# sourceMappingURL=main.js.map
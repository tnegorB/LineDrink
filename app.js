/// 引用linebot SDK
var linebot = require('linebot');

let MAX_ROOM = 2;

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: '1653391367',
  channelSecret: '76a9583ba5ac1acee1ada779b86f076c',
  channelAccessToken: 'yHtPtrvjY4pFldCAgfCcr0RJmOv32Bqrw4iHfl2UPHXtR5QrzSPvCvjQTYZWJsJmA5lYuLOl6reGlpR/cEOt3FShi34MBnIt7K7PB+Qzt6KYVB0BFysYHBhtctxvzu9WZtxjaTu1udarDXHYMWHO4gdB04t89/1O/w1cDnyilFU='
});

var orderWhat = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{1,10}';
var hasSplit = "\\s+";
var type1_quantity = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{1,3}';
var type1 = "糖";
var type2_quantity = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{1,3}';
var type2 = "冰";
var type3_quantity = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{0,3}';
var type3 = "溫";

var checkRe = new RegExp(orderWhat 
  + hasSplit + type1_quantity + type1 
  + hasSplit 
  + type2_quantity + type2 + "|"
  + type3_quantity + type3
  );

var _lists = new Map();

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  // event.message.text是使用者傳給bot的訊息

  var _cmd = event.message.text + '';

  console.log(event.message.text);

  if(_cmd === 'l'){
    var replyMsg = "";
  
    console.log(`count=${_lists.size}`);
    for (var [key, value] of _lists) {
      replyMsg += value + "\n"; 
    }
    console.log(replyMsg);

    event.reply(replyMsg).then(function (data) {

    }).catch(function (error) {
        // 當訊息回傳失敗後的處理
        throw(error);
    });
  } else if (_cmd === 'h') {
    var replyMsg = "l: list \n h:cmd list";
    event.reply(replyMsg).then(function (data) {
        // 當訊息成功回傳後的處理
    }).catch(function (error) {
        // 當訊息回傳失敗後的處理
        throw(error);
    });

  } else if(checkRe.test(_cmd)) {
    console.log("parse ok");
    var userName = "";
    var userOrder = event.message.text + "";

    //get user profile
    event.source.profile()
    .then(function (profile) {
      userName = profile.displayName;
    })
    .then(() => {
      //parese data
      var list = userOrder.split(' ');
      console.log(event.source.userId + ": "+userName +" " + list);
      
      //add to list
      _lists.set(event.source.userId, userName + ' ' + list[0] + ' ' + list[1] + ' ' + list[2]);
    })

  } else {
    console.log("parse false");
    // 準備要回傳的內容
    var replyMsg = `看嘸:${event.message.text}`;

    event.reply(replyMsg).then(function (data) {
        // 當訊息成功回傳後的處理
    }).catch(function (error) {
        // 當訊息回傳失敗後的處理
        throw(error);
    });
  }

});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', process.env.PORT || 3000, function () {
    console.log('[BOT已準備就緒]');
});
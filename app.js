/// 引用linebot SDK
var linebot = require('linebot');

// 用於辨識Line Channel的資訊
var bot = linebot({
  channelId: '1653391367',
  channelSecret: '76a9583ba5ac1acee1ada779b86f076c',
  channelAccessToken: 'yHtPtrvjY4pFldCAgfCcr0RJmOv32Bqrw4iHfl2UPHXtR5QrzSPvCvjQTYZWJsJmA5lYuLOl6reGlpR/cEOt3FShi34MBnIt7K7PB+Qzt6KYVB0BFysYHBhtctxvzu9WZtxjaTu1udarDXHYMWHO4gdB04t89/1O/w1cDnyilFU='
});

// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  // event.message.text是使用者傳給bot的訊息

  console.log(event.message.text);

  // 準備要回傳的內容
  var replyMsg = `Hello你剛才說的是:${event.message.text}`;
  // 透過event.reply(要回傳的訊息)方法將訊息回傳給使用者
  event.reply(replyMsg).then(function (data) {
      // 當訊息成功回傳後的處理
  }).catch(function (error) {
      // 當訊息回傳失敗後的處理
      throw(error);
  });
});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', process.env.PORT || 3000, function () {
    console.log('[BOT已準備就緒]');
});
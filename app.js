/// 引用linebot SDK
var linebot = require('linebot');

let MAX_ROOM = process.env.MAX_ROOM || 2;
let replyMute = process.env.replyMute || false;
let OOMode = process.env.OOMode || false;

class _lists {
  constructor(roomId) {
    this.lists = new Map();
    console.log("_lists constructor!");
    return this;
  }
  
  ls() {
    for (var [key, value] of this.lists) {
      console.log(key + ', ' + value);
    }
  }

  getList() {
    return this.lists;
  }
}

class _allLists {
  constructor(){
    this.allLists = new Map();
    return this;
    console.log("_allLists constructor!");
  }

  newRoom(roomId) {
    if(this.allLists.size < MAX_ROOM) {
      // const hashListId = crypto.createHmac('sha256', roomId)
      //                   .update('I love Poling')
      //                   .digest('hex');
      // console.log(hashListId);
      this.allLists.set(roomId, new _lists(roomId));
      if(typeof(this.allLists.get(roomId) === "objects")) {
        return this.allLists.get(roomId);
      } else {
        return null;
      }
    } else {
      return null;
    };
  }

  ls() {
    for (var [key, value] of this.allLists) {
      console.log(key + ', ' + value);
    }
  }
  getListSize() {
    return this.allLists.size;
  }
  getRoom(roomId) {
    return this.allLists.get(roomId);
  }
  delRoom(roomId) {
    this.allLists.delete(roomId);
  }
}

console.log("start new _allLists()");
let alllines = new _allLists();
console.log("end new _allLists()");

var bot = linebot({
  channelId: process.env.channelId,
  channelSecret: process.env.channelSecret,
  channelAccessToken: process.env.channelAccessToken
});

var orderWhat = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{1,10}';
var hasSplit = "\\s+";
var type1_quantity = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{1,5}';
var type1 = "糖";
var type2_quantity = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{1,5}';
var type2 = "冰";
var type3_quantity = '[\\' + 'u4e00-' + '\\' + 'u9fa5]{0,3}';
var type3 = "溫";

var checkRe = new RegExp(orderWhat 
  + hasSplit + type1_quantity + type1 
  + hasSplit 
  + type2_quantity + type2 + "|"
  + type3_quantity + type3
  );

bot
.on('join', function (event) {
  console.log("join");
  if(alllines.newRoom(event.source.roomId) === null) {
    event.reply("Loading is full.");
    bot.leaveRoom(event.source.roomId);
  } else {
    event.reply(`Loading: ${alllines.getListSize()}`);
  }
})
.on('leave', function (event) {
  console.log("leave");
  alllines.delRoom(event.source.roomId);
})
.on('message', function (event) {
  // 當有人傳送訊息給Bot時
  // event.message.text是使用者傳給bot的訊息

  var _cmd = event.message.text + '';

  console.log(event.message.text);

  if (_cmd === 'h' || _cmd === '?') {
    var replyMsg = "l: list \n \
                  h:cmd list \n \
                  mo: mute on\n  \
                  mf: mute off \n \
                  oo: 滷肉飯 Mode on\n \
                  of: 滷肉飯 Mode off\n \
                  r: showOnlineRoom"
                  ;
    event.reply(replyMsg);

  } else if(_cmd === 'join') {
    console.log("cmd join");
    if(alllines.newRoom(event.source.roomId) === null) {
      event.reply("Loading is full.");
      bot.leaveRoom(event.source.roomId);
    } else {
      event.reply(`Loading: ${alllines.getListSize()}`);
    }
  } else if(_cmd === 'leave') {
    console.log(`cmd leave: ${event.source.roomId}`);
    alllines.delRoom(event.source.roomId);
    bot.leaveRoom(event.source.roomId);
  
  } else if(_cmd === 'showRoomId'){
    console.log(`roomId: ${event.source.roomId}`);

  } else if(_cmd === 'showOnlineRoom' || _cmd === 'r'){
    console.log(`rooms: ${alllines.getListSize()}`);
    event.reply(`rooms: ${alllines.getListSize()}`);

  } else if(_cmd === 'mo'){
    replyMute = true;
    event.reply("Bot mute on");

  } else if(_cmd === 'mf'){
    replyMute = false;
    event.reply("Bot mute off");

  } else if(_cmd === 'oo'){
    OOMode = true;
    event.reply("滷肉飯 Mode on");

  } else if(_cmd === 'of'){
    OOMode = false;
    event.reply("滷肉飯 Mode off");

  } else if(_cmd === 'l'){
    try{
      var replyMsg = "";
      var _lists = alllines.getRoom(event.source.roomId).getList();
  
      console.log(`count=${_lists.size}`);
      for (var [key, value] of _lists) {
        replyMsg += value + "\n"; 
      }
      console.log(replyMsg);
      event.reply(replyMsg);  
    } catch(e) {
      console.log(e);
    }
  } else if(OOMode === true) {
    var _lists = alllines.getRoom(event.source.roomId).getList();
    if(_lists === null) {
      if(alllines.newRoom(event.source.roomId) === null) {
        bot.reply("Loading is full.");
        bot.leaveRoom(event.source.roomId);
      } else {
        bot.reply(`Loading: ${alllines.getListSize()}`);
      }
    }

    event.source.profile()
    .then(function (profile) {
      userName = profile.displayName;
    })
    .then(() => {
      _lists.set(event.source.userId, userName + ' ' + _cmd);
      event.reply("已加入清單:" + userName + ' ' + _cmd);
    });

  } else if(checkRe.test(_cmd)) {
    console.log("parse ok");
    var userName = "";
    var userOrder = event.message.text + "";

    var _lists = alllines.getRoom(event.source.roomId).getList();
    if(_lists === null) {
      if(alllines.newRoom(event.source.roomId) === null) {
        bot.reply("Loading is full.");
        bot.leaveRoom(event.source.roomId);
      } else {
        bot.reply(`Loading: ${alllines.getListSize()}`);
      }
    }

    //get user profile
    event.source.profile()
    .then(function (profile) {
      userName = profile.displayName;
    })
    .then(() => {
      try {
        //parese data
        var list = userOrder.trim().split(/\s+/);
        console.log(event.source.userId + ": "+userName +" " + list);

        //add to list
        _lists.set(event.source.userId, userName + ' ' + list[0] + ' ' + list[1] + ' ' + list[2]);
        event.reply("已加入清單:" + userName + ' ' + list[0] + ' ' + list[1] + ' ' + list[2]);

      } 
      catch (e) {
        console.log(e);
      }
    });

  } else {
    console.log("parse false");

    if(replyMute === true || event.message.text === undefined) return;

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
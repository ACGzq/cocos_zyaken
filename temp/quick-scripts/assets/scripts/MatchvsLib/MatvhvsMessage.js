(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/MatchvsLib/MatvhvsMessage.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '325deqQeBJE6ZecBu6hYwGc', 'MatvhvsMessage', __filename);
// scripts/MatchvsLib/MatvhvsMessage.js

"use strict";

//定义了Matchvs网络事件
var msg = {

    MATCHVS_INIT: "MATCHVS_INIT",
    MATCHVS_REGISTER_USER: "MATCHVS_REGISTER_USER",
    MATCHVS_LOGIN: "MATCHVS_LOGIN",
    MATCHVS_RE_CONNECT: "MATCHVS_RE_CONNECT",
    MATCHVS_ERROE_MSG: "MATCHVS_ERROE_MSG",
    MATCHVS_JOIN_ROOM_RSP: "MATCHVS_JOIN_ROOM_RSP",
    MATCHVS_JOIN_ROOM_NOTIFY: "MATCHVS_JOIN_ROOM_NOTIFY",
    MATCHVS_LEAVE_ROOM: "MATCHVS_LEAVE_ROOM",
    MATCHVS_LEAVE_ROOM_NOTIFY: "MATCHVS_LEAVE_ROOM_NOTIFY",
    MATCHVS_JOIN_OVER_RSP: "MATCHVS_JOIN_OVER_RSP",
    MATCHVS_JOIN_OVER_NOTIFY: "MATCHVS_JOIN_OVER_NOTIFY",
    MATCHVS_JOIN_OPEN_RSP: "MATCHVS_JOIN_OPEN_RSP",
    MATCHVS_JOIN_OPEN_NOTIFY: "MATCHVS_JOIN_OPEN_NOTIFY",
    MATCHVS_ROOM_LIST_EX: "MATCHVS_ROOM_LIST_EX",
    MATCHVS_CREATE_ROOM: "MATCHVS_CREATE_ROOM",
    MATCHVS_ROOM_DETAIL: "MATCHVS_ROOM_DETAIL",
    MATCHVS_KICK_PLAYER: "MATCHVS_KICK_PLAYER",
    MATCHVS_KICK_PLAYER_NOTIFY: "MATCHVS_KICK_PLAYER_NOTIFY",
    MATCHVS_SET_ROOM_PROPETY: "MATCHVS_SET_ROOM_PROPETY",
    MATCHVS_SET_ROOM_PROPETY_NOTIFY: "MATCHVS_SET_ROOM_PROPETY_NOTIFY",
    MATCHVS_SEND_EVENT_RSP: "MATCHVS_SEND_EVENT_RSP",
    MATCHVS_SEND_EVENT_NOTIFY: "MATCHVS_SEND_EVENT_NOTIFY",
    MATCHVS_FRAME_UPDATE: "MATCHVS_FRAME_UPDATE",
    MATCHVS_WX_BINDING: "MATCHVS_WX_BINDING",
    MATCHVS_NETWORK_STATE_NOTIFY: "MATCHVS_NETWORK_STATE_NOTIFY",
    MATCHVS_SET_FRAME_SYNC_RSP: "MATCHVS_SET_FRAME_SYNC_RSP",
    MATCHVS_ROOM_USERLIST_CHANGE_NOTIFY: "MATCHVS_ROOM_USERLIST_CHANGE_NOTIFY",

    //对战类消息
    EVENT_GAME_START: "EVENT_GAME_START",
    NEW_STAR_POSITION: "NEW_STAR_POSITION",
    PLAYER_POSINTON: "PLAYER_POSINTON",

    PLAYER_DONE: "PLAYER_DONE",
    PLAYER_CANCLE: "PLAYER_CANCLE",
    PLAYER_LEAD: "Lead",
    NEW_ROUND: "NEW_ROUND",
    GAME_START_EVENT: "gameStart",
    EVENT_NEW_START: "newStar",
    PLAYER_MOVE_EVENT: "playerMove",
    EVENT_GAIN_SCORE: "gainScore",
    EVENT_PLAYER_POSINTON_CHANGED: "playerPosition",
    EVENT_BALL_POSINTON_CHANGED: "ballPosition",
    GAME_RECONNECT: "Reconnect"
};

module.exports = msg;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=MatvhvsMessage.js.map
        
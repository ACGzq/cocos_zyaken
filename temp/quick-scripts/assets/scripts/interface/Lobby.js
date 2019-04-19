(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/interface/Lobby.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8081eh5Q3RECZVLEwf0+6/C', 'Lobby', __filename);
// scripts/interface/Lobby.js

"use strict";

/**
 * 大厅页面
 */
var engine = require("../MatchvsLib/MatchvsDemoEngine");
var GLB = require("Glb");
var mvs = require("../MatchvsLib/Matchvs");
var msg = require("../MatchvsLib/MatvhvsMessage");

cc.Class({
    extends: cc.Component,

    properties: {
        randomMatch: cc.Node,
        roomList: cc.Node,
        joinCertainRoom: cc.Node,
        createRoom: cc.Node,
        returnLogin: cc.Node,

        nickName: {
            default: null,
            type: cc.Label
        },
        avatar111: {
            default: null,
            type: cc.Sprite
        }
    },

    onLoad: function onLoad() {
        var self = this;
        this.initEvent();
        this.nickName.string = "用户ID：" + GLB.name;
        console.log('avatar url', GLB.avatar);
        if (typeof wx !== 'undefined') {
            var image = wx.createImage();
            image.onload = function () {
                try {
                    var texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    self.avatar111.spriteFrame = new cc.SpriteFrame(texture);
                } catch (e) {
                    console.log('wx onload image error');
                }
            };
            image.src = GLB.avatar;
        } else {
            cc.loader.load(GLB.avatar, function (err, res) {
                if (err) {
                    console.error('load avatar image error', err);
                    return;
                }
                self.avatar111.spriteFrame = new cc.SpriteFrame(res);
            });
        }
        // 返回登录
        this.returnLogin.on(cc.Node.EventType.TOUCH_END, function () {
            engine.prototype.logout();
            cc.director.loadScene('Login');
        });

        // 随机匹配
        this.randomMatch.on(cc.Node.EventType.TOUCH_END, function () {
            GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
            GLB.syncFrame = false;
            // self.labelLog('开始随机匹配');
            cc.director.loadScene('Match');
        });

        // 自定义属性匹配
        /*this.selfDefMatch.on(cc.Node.EventType.TOUCH_END, function(){
            GLB.syncFrame = false;
            cc.director.loadScene("SelfDefMatch");
        });*/

        // 查看房间列表
        this.roomList.on(cc.Node.EventType.TOUCH_END, function () {
            GLB.syncFrame = false;
            cc.director.loadScene("RoomList");
        });

        // 加入指定房间
        this.joinCertainRoom.on(cc.Node.EventType.TOUCH_END, function () {
            GLB.syncFrame = false;
            cc.director.loadScene("JoinCertainRoom");
        });

        // 创建房间
        this.createRoom.on(cc.Node.EventType.TOUCH_END, function () {
            GLB.syncFrame = false;
            var create = new mvs.MsCreateRoomInfo();
            create.name = 'roomName';
            create.maxPlayer = GLB.MAX_PLAYER_COUNT;
            create.mode = 0;
            create.canWatch = 0;
            create.visibility = 1;
            create.roomProperty = '黑夜';
            engine.prototype.createRoom(create, "Matchvs");
        });

        /*   this.buttonSyncFrame.on(cc.Node.EventType.TOUCH_END, function(){
               GLB.syncFrame = true;
               GLB.matchType = GLB.RANDOM_MATCH; // 修改匹配方式为随机匹配
               cc.director.loadScene('Match');
           });*/
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent: function initEvent() {
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_CREATE_ROOM, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent, this);
    },


    /**
     * 接收事件
     * @param event
     */
    onEvent: function onEvent(event) {
        var eventData = event.data;
        if (event.type === msg.MATCHVS_ERROE_MSG) {
            cc.director.loadScene('Login');
        } else if (event.type === msg.MATCHVS_CREATE_ROOM) {
            GLB.roomID = eventData.rsp.roomID;
            cc.director.loadScene("CreateRoom");
        } else if (event.type === msg.MATCHVS_NETWORK_STATE_NOTIFY) {
            if (eventData.netNotify.userID === GLB.userID && eventData.netNotify.state === 1) {
                console.log("netNotify.userID :" + eventData.netNotify.userID + "netNotify.state: " + eventData.netNotify.state);
                cc.director.loadScene("Login");
            }
        }
    },


    /**
     * 移除监听
     */
    removeEvent: function removeEvent() {
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_CREATE_ROOM, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent);
    },


    /**
     * 生命周期，页面销毁
     */
    onDestroy: function onDestroy() {
        this.removeEvent();
        console.log("Lobby页面销毁");
    }

});

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
        //# sourceMappingURL=Lobby.js.map
        
(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Login/Login.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ba449oU8rFArqKhgBI6yqK1', 'Login', __filename);
// scripts/Login/Login.js

"use strict";

/**
 * 登录
 */

var GLB = require("../interface/Glb"); //GLB是用来存储用户参数的脚本
var engine = require("../MatchvsLib/MatchvsDemoEngine");
var msg = require("../MatchvsLib/MatvhvsMessage");
cc.Class({
    extends: cc.Component,

    properties: {
        gameIdInput: cc.Node,
        confirm: cc.Node,
        clear: cc.Node,
        quick: cc.Node,
        labelInfo: {
            default: null,
            type: cc.Label
        }
    },

    /**
     * load 显示页面
     */
    onLoad: function onLoad() {
        var self = this;
        this.initEvent();
        engine.prototype.init(GLB.channel, GLB.platform, GLB.gameID);
        this.confirm.on(cc.Node.EventType.TOUCH_END, function () {
            if (!GLB.isInit) return;
            // 获取用户输入的参数
            if (self.gameIdInput.getComponent(cc.EditBox).string !== "") {
                GLB.playerID = self.gameIdInput.getComponent(cc.EditBox).string;
                self.startLogin(GLB.playerID, self);
            } else {
                console.log("输入为空");
            }
        });
        this.clear.on(cc.Node.EventType.TOUCH_END, function () {
            if (LocalStore_Clear) {
                LocalStore_Clear();
            }
            console.log("clear user info cache");
        });
        this.quick.on(cc.Node.EventType.TOUCH_END, function () {
            if (!GLB.isInit) return;
            engine.prototype.registerUser();
        });
    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent: function initEvent() {
        cc.systemEvent.on(msg.MATCHVS_INIT, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_RE_CONNECT, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_REGISTER_USER, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_LOGIN, this.onEvent, this);
    },

    /**
     * 事件接收方法
     * @param event
     */
    onEvent: function onEvent(event) {
        var eventData = event.data;
        switch (event.type) {
            case msg.MATCHVS_INIT:
                this.labelLog('初始化成功');
                GLB.isInit = true;
                break;
            case msg.MATCHVS_REGISTER_USER:
                cc.sys.localStorage.setItem(GLB.playerID, JSON.stringify(eventData.userInfo));
                this.login(eventData.userInfo.id, eventData.userInfo.token);
                break;
            case msg.MATCHVS_LOGIN:
                if (eventData.MsLoginRsp.roomID != null && eventData.MsLoginRsp.roomID !== '0') {
                    console.log("开始重连" + eventData.MsLoginRsp.roomID);
                    engine.prototype.reconnect();
                } else {
                    cc.director.loadScene("Lobby");
                }
                break;
            case msg.MATCHVS_RE_CONNECT:
                GLB.roomID = eventData.roomUserInfoList.roomID;
                if (eventData.roomUserInfoList.owner === GLB.userID) {
                    GLB.isRoomOwner = true;
                } else {
                    GLB.isRoomOwner = false;
                }
                if (eventData.roomUserInfoList.state === 1) {
                    if (eventData.roomUserInfoList.roomProperty === "") {
                        engine.prototype.leaveRoom();
                        cc.director.loadScene("Lobby");
                    } else {
                        cc.director.loadScene('CreateRoom');
                    }
                } else {
                    cc.director.loadScene("zyankenGame");
                }
                break;
            case msg.MATCHVS_ERROE_MSG:
                this.labelLog("[Err]errCode:" + eventData.errorCode + " errMsg:" + eventData.errorMsg);
                break;
        }
    },

    startLogin: function startLogin(key, self) {
        try {
            var userData = JSON.parse(cc.sys.localStorage.getItem(key));
            console.log(userData);
            if (userData.name !== "") {
                GLB.name = userData.name;
            } else {
                GLB.name = userData.userID;
            }
            GLB.avatar = userData.avatar;
            GLB.userID = userData.userID;
            self.login(userData.id, userData.token);
        } catch (error) {
            console.warn("startLogin for error:" + error.message);
            engine.prototype.registerUser();
        }
    },

    /**
     * 登录
     * @param id
     * @param token
     */
    login: function login(id, token) {
        GLB.userID = id;
        this.labelLog('开始登录...用户ID:' + id + " gameID " + GLB.gameID);
        engine.prototype.login(id, token);
    },

    /**
     * 移除监听
     */
    removeEvent: function removeEvent() {
        cc.systemEvent.off(msg.MATCHVS_INIT, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_RE_CONNECT, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_REGISTER_USER, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LOGIN, this.onEvent);
    },

    /**
     * 页面log打印
     * @param info
     */
    labelLog: function labelLog(info) {
        this.labelInfo.string += '\n[LOG]: ' + info;
    },

    /**
     * 生命周期，页面销毁
     */
    onDestroy: function onDestroy() {
        this.removeEvent();
        console.log("Login页面销毁");
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
        //# sourceMappingURL=Login.js.map
        
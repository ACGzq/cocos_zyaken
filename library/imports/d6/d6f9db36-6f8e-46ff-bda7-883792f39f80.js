"use strict";
cc._RF.push(module, 'd6f9ds2b45G/72niDeS85+A', 'CreateRoom');
// scripts/interface/CreateRoom.js

"use strict";

var engine = require("../MatchvsLib/MatchvsDemoEngine");
var GLB = require("Glb");
var msg = require("../MatchvsLib/MatvhvsMessage");
cc.Class({
    extends: cc.Component,

    properties: {
        labelMyRoomID: {
            default: null,
            type: cc.Label
        },
        labelUserName: {
            default: null,
            type: cc.Label
        },
        labelUserName2: {
            default: null,
            type: cc.Label
        },

        nickName: {
            default: null,
            type: cc.Label
        },
        leaveRoom: cc.Node,
        btnStartGame: cc.Node,
        kickPlayer2: cc.Node,
        seleButton: cc.Node,
        mapString: {
            default: null,
            type: cc.Label
        },
        userList: [],
        labelUserID2: cc.Label,
        ownerLogo: cc.Node,
        ownerLogo2: cc.Node,
        userIDfontSize: 26
    },

    onLoad: function onLoad() {
        this.nameViewList = [this.labelUserName2];
        this.userIDViewList = [this.labelUserID2];
        this.userOwnewLogoList = [this.ownerLogo2];
        GLB.number1 = "";
        GLB.number2 = "";

        var self = this;
        self.nickName.string = '用户ID：' + GLB.userID;
        // roomID的全局赋值要慎重使用，离开房间记得置空
        if (GLB.roomID !== "") {
            engine.prototype.getRoomDetail(GLB.roomID);
        }
        this.initEvent();
        this.kickPlayer2.on(cc.Node.EventType.TOUCH_END, function () {
            var userID = self.labelUserID2.string;
            if (userID !== undefined && userID !== 2) {
                engine.prototype.kickPlayer(userID, self.labelUserName2.string);
                self.labelUserID2.string = 2;
                self.labelUserID2.fontSize = 80;
                self.labelUserName2.string = "待加入";
            }
        });

        this.leaveRoom.on(cc.Node.EventType.TOUCH_END, function () {
            engine.prototype.leaveRoom("");
            self.leaveRoom1();
        });
        this.btnStartGame.on(cc.Node.EventType.TOUCH_END, function () {
            if (self.userList.length === GLB.MAX_PLAYER_COUNT - 1) {
                var event = {
                    action: msg.EVENT_GAME_START
                };
                engine.prototype.sendEventEx(0, JSON.stringify(event));
                engine.prototype.joinOver();
            } else {
                // self.labelLog('房间人数小于' + GLB.MAX_PLAYER_COUNT);
            }
        });
        this.seleButton.on(cc.Node.EventType.TOUCH_END, function () {
            var mapType = self.mapString.string;
            if (mapType == "森林") {
                engine.prototype.setRoomProperty(GLB.roomID, "黑夜");
            } else {
                engine.prototype.setRoomProperty(GLB.roomID, "森林");
            }
        });
    },


    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent: function initEvent() {
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_KICK_PLAYER, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_KICK_PLAYER_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_RSP, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SET_ROOM_PROPETY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SET_ROOM_PROPETY_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_ROOM_DETAIL, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent, this);
    },


    /**
     * 时间接收
     * @param event
     */
    onEvent: function onEvent(event) {
        var eventData = event.data;
        console.log("onEvent:", eventData);
        switch (event.type) {
            case msg.MATCHVS_JOIN_ROOM_NOTIFY:
                this.userList.push(eventData.roomUserInfo);
                this.initUserView(eventData.roomUserInfo.userProfile, eventData.roomUserInfo.userID, 0);
                break;
            case msg.MATCHVS_KICK_PLAYER:
                this.removeView(eventData.kickPlayerRsp);
                break;
            case msg.MATCHVS_KICK_PLAYER_NOTIFY:
                this.removeView(eventData.kickPlayerNotify);
                break;
            case msg.MATCHVS_SET_ROOM_PROPETY:
                this.setRoomPropertyResponse(eventData.rsp);
                break;
            case msg.MATCHVS_SET_ROOM_PROPETY_NOTIFY:
                this.setRoomPropertyResponse(eventData.rsp);
                break;
            case msg.MATCHVS_ROOM_DETAIL:
                this.joinRoom(eventData.rsp);
                for (var i in eventData.rsp.userInfos) {
                    if (GLB.userID !== eventData.rsp.userInfos[i].userID) {
                        this.initUserView(eventData.rsp.userInfos[i].userProfile, eventData.rsp.userInfos[i].userID, eventData.rsp.owner);
                        this.userList.push(eventData.rsp.userInfos[i]);
                    }
                }
                break;
            case msg.MATCHVS_LEAVE_ROOM_NOTIFY:
                this.removeView(eventData.leaveRoomInfo);
                break;
            case msg.MATCHVS_SEND_EVENT_NOTIFY:
                var data = JSON.parse(eventData.eventInfo.cpProto);
                if (data.action == msg.EVENT_GAME_START) {
                    this.startGame();
                }
                break;
            case msg.MATCHVS_ERROE_MSG:
                if (eventData.errorCode !== 400) {
                    cc.director.loadScene('Login');
                }
                break;
            case msg.MATCHVS_NETWORK_STATE_NOTIFY:
                if (eventData.netNotify.state === 1) {
                    engine.prototype.kickPlayer(eventData.netNotify.userID, "你断线了，被提出房间");
                }
                break;
        }
    },


    setRoomPropertyResponse: function setRoomPropertyResponse(rsp) {
        if (rsp.roomProperty == '森林') {
            this.mapString.string = rsp.roomProperty;
            GLB.mapType = rsp.roomProperty;
            this.seleButton.getChildByName("Label").getComponent(cc.Label).string = '切换为黑夜';
        } else {
            this.mapString.string = rsp.roomProperty;
            GLB.mapType = rsp.roomProperty;
            this.seleButton.getChildByName("Label").getComponent(cc.Label).string = '切换为森林';
        }
    },

    /**
     * 房主是通过joinRoom和getRoomDetail获得房间信息 ,非房主玩家是通过getRoomDetail获得房间信息
     * @param rsp
     */
    joinRoom: function joinRoom(rsp) {
        if (rsp.owner === GLB.userID) {
            GLB.isRoomOwner = true;
            this.ownerLogo.active = true;
        } else {
            GLB.isRoomOwner = false;
            this.ownerLogo.active = false;
        }
        this.buttonIsShow(GLB.isRoomOwner);
        if (GLB.roomID !== "") {
            this.labelMyRoomID.string = GLB.roomID;
        } else {
            this.labelMyRoomID.string = rsp.roomID;
            GLB.roomID = rsp.roomID;
        }
        this.labelUserName.string = GLB.name;
        GLB.mapType = rsp.roomProperty;
        this.setRoomPropertyResponse(rsp);
    },

    /**
     * 展示玩家信息
     */
    initUserView: function initUserView(userProfile, userID, owner) {
        for (var i = 0; i < this.nameViewList.length; i++) {
            var info = JSON.parse(userProfile);
            if (this.nameViewList[i].string === "待加入") {
                this.userIDViewList[i].string = userID;
                this.userIDViewList[i].fontSize = this.userIDfontSize;
                this.nameViewList[i].string = info.name;
                if (userID === owner) {
                    this.userOwnewLogoList[i].active = true;
                }
                return;
            }
        }
    },

    /**
     * 玩家退出将玩家的信息从页面上消失
     * @param info
     */
    removeView: function removeView(info) {
        var userID = info.userID;
        for (var i = 0; i < this.userList.length; i++) {
            if (userID === this.userList[i].userID) {
                this.userList.splice(i, 1);
                this.nameViewList[i].string = "待加入";
                this.userIDViewList[i].string = i + 2;
                this.userIDViewList[i].fontSize = 80;
                this.userOwnewLogoList[i].active = false;
            }
        }
        if (userID === GLB.userID) {
            this.leaveRoom1();
        }
        for (var _i = 0; _i < this.userIDViewList.length; _i++) {
            if (info.owner === this.userIDViewList[_i].string) {
                this.userOwnewLogoList[_i].active = true;
            }
        }

        if (info.owner === GLB.userID) {
            this.ownerLogo.active = true;
            GLB.isRoomOwner = true;
            this.buttonIsShow(true);
        }
    },

    /**
     * 房主和非房主玩家的功能按键显示和隐藏
     * @param isShow
     */
    buttonIsShow: function buttonIsShow(isShow) {
        if (isShow) {
            this.seleButton.active = true;
            this.btnStartGame.active = true;
            this.kickPlayer2.active = true;
            // this.kickPlayer3.active = true;
        } else {
            this.seleButton.active = false;
            this.btnStartGame.active = false;
            this.kickPlayer2.active = false;
            // this.kickPlayer3.active = false;
        }
    },

    /**
     * 移除监听
     */
    removeEvent: function removeEvent() {
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_KICK_PLAYER, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_KICK_PLAYER_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_RSP, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SET_ROOM_PROPETY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SET_ROOM_PROPETY_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_ROOM_DETAIL, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent);
    },


    /**
     * 生命周期，销毁
     */
    onDestroy: function onDestroy() {
        this.removeEvent();
        console.log("create Room 页面销毁");
    },


    leaveRoom1: function leaveRoom1() {
        GLB.roomID = "";
        cc.director.loadScene('Lobby');
    },

    startGame: function startGame() {
        cc.director.loadScene('zyankenGame');
    }

});

cc._RF.pop();
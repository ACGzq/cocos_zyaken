(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/interface/zyankenGame.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a3655FK37JE9rDMQ/maSMsz', 'zyankenGame', __filename);
// scripts/interface/zyankenGame.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var mvs = require("../MatchvsLib/Matchvs");
var GLB = require("../interface/Glb");
var msg = require("../MatchvsLib/MatvhvsMessage");
var engine = require("../MatchvsLib/MatchvsDemoEngine");
cc.Class({
    extends: cc.Component,

    properties: {
        isStart: false,
        isOwner: false,
        scissors: cc.Prefab,
        hammer: cc.Prefab,
        cloth: cc.Prefab,
        background: cc.Node,
        // score label 的引用
        scoreDisplayA: {
            default: null,
            type: cc.Label
        },
        // score label 的引用
        scoreDisplayB: {
            default: null,
            type: cc.Label
        },
        unknowCard1: {
            default: null,
            type: cc.Node
        },
        unknowCard2: {
            default: null,
            type: cc.Node
        },
        unknowCard3: {
            default: null,
            type: cc.Node
        },
        cardS: {
            default: null,
            type: cc.Node
        },
        cardH: {
            default: null,
            type: cc.Node
        },
        cardC: {
            default: null,
            type: cc.Node
        },
        dialog: cc.Node,
        dialogButton: cc.Node,
        yes: cc.Node,
        cancle: cc.Node,
        label: {
            default: null,
            type: cc.Label
        },
        receiveCardType: "",
        localCardType: "",
        isLead: false,
        isOpponentDone: false,
        actionTime: 0.3,
        index: 0,
        unknowCardPosX: 0,
        unknowCardPosY: 0,
        origniPosX: 0,
        origniPosY: 0,
        buttonLeaveRoom: cc.Node,
        card: null,
        cards: null
    },
    // 地面节点，用于确定星星生成的高度


    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        var self = this;
        this.cards = new Array();
        this.cards["Cloth"] = this.cloth;
        this.cards["Hammer"] = this.hammer;
        this.cards["Scissors"] = this.scissors;
        this.isOwner = GLB.isRoomOwner;

        if (GLB.mapType == "森林") {
            cc.loader.loadRes("background", cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    console.error('load avatar image error', err);
                    return;
                }
                console.log("loadRes");
                self.background.spriteFrame = spriteFrame;
            });
        }
        engine.prototype.getRoomDetail(GLB.roomID);
        this.initEvent();
        console.log("房间号:" + GLB.roomID + "_用户id:" + GLB.userID);
        console.log("isOwner", this.isOwner);
        this.yes.active = false;
        this.cancle.active = false;
        this.scoreA = 0;
        this.scoreB = 0;
        this.hideButton();
        this.cardC.on(cc.Node.EventType.TOUCH_END, function () {
            if (!self.isLead) {
                self.localCardType = "Cloth";
                self.origniPosX = self.cardC.x;
                self.origniPosY = self.cardC.y;
                var action = cc.moveTo(self.actionTime, cc.v2(0, -60));
                self.cardC.runAction(action);
                self.showButtonAfter(0.3);
                self.sendEventEx(msg.PLAYER_LEAD);
            }
        });
        this.cardS.on(cc.Node.EventType.TOUCH_END, function () {
            if (!self.isLead) {
                self.localCardType = "Scissors";
                self.origniPosX = self.cardS.x;
                self.origniPosY = self.cardS.y;
                var action = cc.moveTo(self.actionTime, cc.v2(0, -60));
                self.cardS.runAction(action);
                self.showButtonAfter(0.3);
                self.sendEventEx(msg.PLAYER_LEAD);
            }
        });
        this.cardH.on(cc.Node.EventType.TOUCH_END, function () {
            if (!self.isLead) {
                self.localCardType = "Hammer";
                self.origniPosX = self.cardH.x;
                self.origniPosY = self.cardH.y;
                var action = cc.moveTo(self.actionTime, cc.v2(0, -60));
                self.cardH.runAction(action);
                self.showButtonAfter(0.3);
                self.sendEventEx(msg.PLAYER_LEAD);
            }
        });
        this.yes.on(cc.Node.EventType.TOUCH_END, function () {
            self.sendEventEx(msg.PLAYER_DONE);
            self.isLead = true;
            self.hideButton();
            if (self.isOpponentDone) {
                self.trial();
            }
        });
        this.cancle.on(cc.Node.EventType.TOUCH_END, function () {
            var action = cc.moveTo(self.actionTime, cc.v2(self.origniPosX, self.origniPosY));
            if (self.localCardType == "Cloth") {
                self.cardC.runAction(action);
            } else if (self.localCardType == "Hammer") {
                self.cardH.runAction(action);
            } else if (self.localCardType == "Scissors") {
                self.cardS.runAction(action);
            }
            self.sendEventEx(msg.PLAYER_CANCLE);
            self.hideButton();
        });
        this.buttonLeaveRoom.on(cc.Node.EventType.TOUCH_END, function () {
            self.gameOver();
        });
        this.dialogButton.on(cc.Node.EventType.TOUCH_END, this.reset, this);
    },

    reset: function reset() {
        this.hideDialog();
        this.hideButton();

        if (this.localCardType == "Cloth") {
            this.cardC.setPosition(cc.v2(this.origniPosX, this.origniPosY));
        } else if (this.localCardType == "Hammer") {
            this.cardH.setPosition(cc.v2(this.origniPosX, this.origniPosY));
        } else if (this.localCardType == "Scissors") {
            this.cardS.setPosition(cc.v2(this.origniPosX, this.origniPosY));
        }
        this.card.destroy();
        try {
            this.unknowCard1.setPosition(cc.v2(-200, 250));
        } catch (error) {
            console.error("setPosition fail", error);
        }

        this.isLead = false;
        this.isOpponentDone = false;
        this.localCardType = "";
        this.receiveCardType = "";
    },
    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent: function initEvent() {
        cc.systemEvent.on(msg.MATCHVS_ROOM_DETAIL, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SEND_EVENT_RSP, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_FRAME_UPDATE, this.onEvent, this);
        cc.systemEvent.on(msg.PLAYER_POSINTON, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent, this);
        cc.systemEvent.on(msg.MATCHVS_SET_FRAME_SYNC_RSP, this.onEvent, this);
    },
    onEvent: function onEvent(event) {
        var eventData = event.data;
        switch (event.type) {
            case msg.MATCHVS_ROOM_DETAIL:
                if (eventData.rsp.owner === GLB.userID) {
                    GLB.isRoomOwner = true;
                }
                console.log("MATCHVS_ROOM_DETAIL:", eventData);
                break;
            case msg.MATCHVS_SEND_EVENT_RSP:
                //console.log("MATCHVS_SEND_EVENT_RSP:",eventData);
                break;
            case msg.MATCHVS_SEND_EVENT_NOTIFY:
                this.onNewWorkGameEvent(eventData.eventInfo);
                break;
            case msg.MATCHVS_ERROE_MSG:
                console.log("[Err]errCode:" + eventData.errorCode + " errMsg:" + eventData.errorMsg);
                //cc.director.loadScene('Login');
                break;
            case msg.MATCHVS_LEAVE_ROOM_NOTIFY:
                console.log("leaveRoomNotify");
                this.gameOver();

                break;
            case msg.MATCHVS_NETWORK_STATE_NOTIFY:
                this.networkStateNotify(eventData.netNotify);
                break;
        }
    },

    spawnNewCard: function spawnNewCard(name) {
        var newCard = cc.instantiate(this.cardPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newCard);
        // 设置一个位置
        newCard.setPosition(0, 0);
        // 在组件上暂存 Game 对象的引用
        this.newCard = newCard.getComponent(name);
        this.newCard.game = this;
    },

    gainScoreA: function gainScoreA() {
        this.scoreA += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplayA.string = 'playerA: ' + this.scoreA;
    },
    gainScoreB: function gainScoreB() {
        this.scoreB += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplayB.string = 'playerB: ' + this.scoreB;
    },
    start: function start() {
        this.isStart = true;
    },
    update: function update(dt) {},
    sendEventEx: function sendEventEx(EX) {
        console.log("sendEventEx");
        var eventData = JSON.stringify({
            "action": EX,
            "card": this.localCardType
        });
        engine.prototype.sendEvent(eventData);
    },
    sendEventResponse: function sendEventResponse(sendEventRsp) {
        console.log("返回状态：", sendEventRsp.status);
        console.log("事件序号：", sendEventRsp.sequence);
    },


    // 游戏结束
    gameOver: function gameOver() {
        console.log("gameOver");
        GLB.isGameOver = true;
        this.cardC.destroy();
        this.cardS.destroy();
        this.cardH.destroy();
        this.unknowCard1.destroy();
        this.unknowCard2.destroy();
        this.unknowCard3.destroy();
        engine.prototype.leaveRoom();
        cc.director.loadScene('Lobby');
    },

    onNewWorkGameEvent: function onNewWorkGameEvent(eventInfo) {
        console.log("消息内容：", eventInfo);
        var event = JSON.parse(eventInfo.cpProto);
        switch (event.action) {
            case msg.PLAYER_DONE:
                this.isOpponentDone = true;
                if (this.isLead) this.scheduleOnce(this.trial, 0.5);
                break;
            case msg.PLAYER_CANCLE:
                this.receiveCardType = false;
                var action = cc.moveTo(this.actionTime, cc.v2(this.unknowCardPosX, this.unknowCardPosY));
                this.unknowCard1.runAction(action);
                /*  switch(this.index%3){
                      case 0:
                      this.unknowCard1.runAction(action);
                      case 1:
                      this.unknowCard2.runAction(action);
                      case 2:
                      this.unknowCard3.runAction(action);
                      default:
                      //this.unknowCard1.runAction(action);
                  }*/
                break;
            case msg.PLAYER_LEAD:
                this.receiveCardType = event.card;
                var action = cc.moveTo(this.actionTime, cc.v2(0, 100));
                this.unknowCardPosX = this.unknowCard1.x;
                this.unknowCardPosY = this.unknowCard1.y;
                this.unknowCard1.runAction(action);
                /*this.index +=1;
                switch(this.index%3){
                    case 0:
                    this.unknowCardPosX = this.unknowCard1.x;
                    this.unknowCardPosY = this.unknowCard1.y;
                    this.unknowCard1.runAction(action);
                    case 1:
                    this.unknowCardPosX = this.unknowCard2.x;
                    this.unknowCardPosY = this.unknowCard2.y;
                    this.unknowCard2.runAction(action);
                    case 2:
                    this.unknowCardPosX = this.unknowCard3.x;
                    this.unknowCardPosY = this.unknowCard3.y;
                    this.unknowCard2.runAction(action);
                    default:
                }*/

                break;
            default:
        }
    },
    trial: function trial() {
        console.log("a =" + this.localCardType + ",b=" + this.receiveCardType);
        this.card = cc.instantiate(this.cards[this.receiveCardType]);
        this.node.addChild(this.card);
        this.card.setPosition(cc.v2(0, 100));
        if (this.localCardType == this.receiveCardType) {
            this.label.string = "is draw";
        } else if (this.localCardType == "Cloth" && this.receiveCardType == "Hammer" || this.localCardType == "Hammer" && this.receiveCardType == "Scissors" || this.localCardType == "Scissors" && this.receiveCardType == "Cloth") {
            console.log("you win");
            this.gainScoreA();
            this.label.string = "you win";
        } else {
            console.log("you lost");
            this.gainScoreB();
            this.label.string = "you lost";
        }
        this.showDialogAfter(1);
    },
    showDialogAfter: function showDialogAfter(m) {
        var self = this;
        this.scheduleOnce(function () {
            self.dialog.setPosition(cc.v2(0, -80));
        }, m);
    },
    hideDialog: function hideDialog() {
        this.dialog.setPosition(cc.v2(3000, 3000));
    },
    showButtonAfter: function showButtonAfter(m) {
        var self = this;
        this.scheduleOnce(function () {
            self.yes.active = true;
            self.cancle.active = true;
        }, m);
    },
    hideButton: function hideButton() {
        this.yes.active = false;
        this.cancle.active = false;
    },
    networkStateNotify: function networkStateNotify(netNotify) {
        console.log("netNotify");
        console.log("netNotify.owner:" + netNotify.owner);
        if (netNotify.owner === GLB.userID) {
            GLB.isRoomOwner = true;
        }
        if (netNotify.userID === GLB.userID && netNotify.state === 1) {
            console.log("netNotify.userID :" + netNotify.userID + "netNotify.state: " + netNotify.state);
            cc.director.loadScene("Login");
        }

        console.log("玩家：" + netNotify.userID + " state:" + netNotify.state);
        if (netNotify.state === 2) {
            console.log("玩家已经重连进来");
            var event = {
                action: msg.GAME_RECONNECT
                //cpProto: this.userScores
            };
            setTimeout(function () {
                mvs.engine.sendEventEx(0, JSON.stringify(event), 0, [netNotify.userID]);
            }, 500);
        }
    },
    /**
     * 移除监听
     */
    removeEvent: function removeEvent() {
        cc.systemEvent.off(msg.MATCHVS_ROOM_DETAIL, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SEND_EVENT_RSP, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_FRAME_UPDATE, this.onEvent);
        cc.systemEvent.off(msg.PLAYER_POSINTON, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY, this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_SET_FRAME_SYNC_RSP, this.onEvent);
    },
    onDestroy: function onDestroy() {
        this.removeEvent();

        GLB.syncFrame = false;
        GLB.isGameOver = true;
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
        //# sourceMappingURL=zyankenGame.js.map
        
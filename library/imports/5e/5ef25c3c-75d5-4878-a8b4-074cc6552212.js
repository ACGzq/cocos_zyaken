"use strict";
cc._RF.push(module, '5ef25w8ddVIeKi0B0zGVSIS', 'Item');
// scripts/interface/Item.js

"use strict";

var engine = require("../MatchvsLib/MatchvsDemoEngine");
cc.Class({
    extends: cc.Component,

    properties: {
        roomName: {
            default: null,
            type: cc.Label
        },

        roomState: {
            default: null,
            type: cc.Label
        },
        roomPlayer: {
            default: null,
            type: cc.Label
        },
        roomMap: {
            default: null,
            type: cc.Label
        },
        startGame: cc.Node,
        itemID: 0

    },

    onLoad: function onLoad() {
        var self = this;
        this.node.on('touchend', function () {
            console.log("Item " + this.itemID + ' clicked');
        }, this);
        this.startGame.on(cc.Node.EventType.TOUCH_END, function (event) {
            //     cc.director.loadScene("lobby");
            engine.prototype.joinRoom(self.roomName.string, "china");
            console.log();
        });
    },

    updateItem: function updateItem(obj) {
        this.roomName.string = obj.roomID;
        console.log(obj.roomID);
        if (obj.state == 1) {
            this.roomState.string = "开放";
        } else {
            this.roomState.string = "关闭";
        }
        this.roomPlayer.string = obj.gamePlayer + "/" + obj.maxPlayer;
        this.roomMap.string = obj.roomProperty;
    }
});

cc._RF.pop();
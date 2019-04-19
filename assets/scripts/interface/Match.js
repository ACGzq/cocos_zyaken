let engine = require("../MatchvsLib/MatchvsDemoEngine");
let mvs = require("../MatchvsLib/Matchvs");
let GLB = require("Glb");
let msg = require("../MatchvsLib/MatvhvsMessage");
cc.Class({
    extends: cc.Component,

    properties: {
        playerNameOne: {
            default: null,
            type: cc.Label
        },
        playerNameTwo: {
            default: null,
            type: cc.Label
        },
        playerTwoLayout: cc.Layout,
        playerTwoLabel : cc.Label,
        
        labelRoomID: {
            default: null,
            type: cc.Label
        },
        matchingWay: {
            default: null,
            type: cc.Label
        },
        labelUserID2:cc.Label,
        back: cc.Node,
        joinopen: cc.Node,
        nickName:cc.Label,
        userList :[],
        nameViewList:[],
        userIDfontSize:26,
    },


    onLoad: function () {
        let self = this;
        this.initEvent();
        this.nameViewList = [[this.playerNameTwo,this.playerTwoLayout,this.playerTwoLabel]];
        this.userIDViewList = [this.labelUserID2];
        self.nickName.string = '用户ID：'+ GLB.userID;
        let matchinfo = new mvs.MsMatchInfo();
        if (GLB.syncFrame) {
            matchinfo.maxPlayer = GLB.MAX_PLAYER_COUNT;
            matchinfo.mode = 0;
            matchinfo.canWatch = 1;
            matchinfo.tags = GLB.frameInfo;
            self.matchingWay.string = "帧同步模式" ;
            engine.prototype.joinRoomWithProperties(matchinfo, "Matchvs帧同步模式");
        } else if (GLB.matchType === GLB.RANDOM_MATCH) {
            engine.prototype.joinRandomRoom(GLB.MAX_PLAYER_COUNT, "随机匹配");
        } else if (GLB.matchType === GLB.PROPERTY_MATCH) {
            matchinfo.maxPlayer = GLB.MAX_PLAYER_COUNT;
            matchinfo.mode = 0;
            matchinfo.canWatch = 1;
            matchinfo.tags =  GLB.tagsInfo;
            self.matchingWay.string = "自定义属性匹配" ;
            engine.prototype.joinRoomWithProperties(matchinfo,"自定义属性匹配");
        }

        this.back.on(cc.Node.EventType.TOUCH_END, function () {
            GLB.roomID = "";
            engine.prototype.leaveRoom();
        });
        let isOpen = true;
        this.joinopen.on(cc.Node.EventType.TOUCH_END, function () {
            isOpen = !isOpen;
            if(isOpen){
                engine.prototype.joinOpen();
            }else{
                engine.prototype.joinOver();
            }
        });


    },

    /**
     * 注册对应的事件监听和把自己的原型传递进入，用于发送事件使用
     */
    initEvent:function () {
        cc.systemEvent.on(msg.MATCHVS_ERROE_MSG,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OPEN_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OPEN_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OVER_RSP,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_JOIN_OVER_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_KICK_PLAYER,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_KICK_PLAYER_NOTIFY,this.onEvent,this);
        cc.systemEvent.on(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent,this);
    },

    /**
     * 事件接收方法
     * @param event
     */
    onEvent:function (event) {
        let eventData = event.data;
        let checkBox = this.joinopen.getComponent(cc.Toggle);
        switch (event.type) {
            case msg.MATCHVS_JOIN_ROOM_RSP:
                this.joinRoom(eventData.userInfoList);
                break;
            case msg.MATCHVS_JOIN_ROOM_NOTIFY:
                this.userList.push(eventData.roomUserInfo);
                this.initUserView(this.userList);
                break;
            case msg.MATCHVS_LEAVE_ROOM:
                cc.director.loadScene('Lobby');
                break;
            case msg.MATCHVS_LEAVE_ROOM_NOTIFY:
                this.removeView(eventData.leaveRoomInfo);
                break;
            case msg.MATCHVS_JOIN_OVER_NOTIFY:
                checkBox.isChecked = false;
                console.log("关闭");
                break;
            case msg.MATCHVS_JOIN_OVER_RSP:
                checkBox.isChecked = false;
                console.log("关闭");
                break;
            case msg.MATCHVS_JOIN_OPEN_RSP:
                checkBox.isChecked = true;
                console.log("打开");
                break;
            case msg.MATCHVS_JOIN_OPEN_NOTIFY:
                checkBox.isChecked = true;
                console.log("打开");
                break;
            case msg.MATCHVS_ERROE_MSG:
                GLB.roomID = "";
                if (eventData.errorCode !== 400) {
                    cc.director.loadScene('Login');
                }
                break;
            case msg.MATCHVS_KICK_PLAYER:
                this.removeView(eventData.kickPlayerRsp);
                break;
            case msg.MATCHVS_KICK_PLAYER_NOTIFY:
                this.removeView(eventData.kickPlayerNotify);
                break;
            case msg.MATCHVS_NETWORK_STATE_NOTIFY:
                if (eventData.netNotify.state === 1) {
                    engine.prototype.kickPlayer(eventData.netNotify.userID,"你断线了，被提出房间");
                }
                break;
        }

    },


    /**
     * 生命周期，页面销毁
     */
    onDestroy:function () {
        this.removeEvent();
        console.log("Match页面销毁");
    },


    /**
     * 取消事件监听
     */
    removeEvent:function () {
        cc.systemEvent.off(msg.MATCHVS_ERROE_MSG,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_ROOM_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_LEAVE_ROOM_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OPEN_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OPEN_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OVER_RSP,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_JOIN_OVER_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_KICK_PLAYER,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_KICK_PLAYER_NOTIFY,this.onEvent);
        cc.systemEvent.off(msg.MATCHVS_NETWORK_STATE_NOTIFY,this.onEvent);
    },

    /**
     * 进入房间业务逻辑
     * @param userInfoList
     */
    joinRoom: function (userInfoList) {
        this.labelRoomID.string = userInfoList.roomID;
        GLB.roomID = userInfoList.roomID;
        this.playerNameOne.string = GLB.name;
        this.userList = userInfoList;
        this.initUserView(this.userList);
        if (this.userList.length === GLB.MAX_PLAYER_COUNT-1) {
            engine.prototype.joinOver();
            this.startGame();
        }
    },

    /**
     * 展示玩家信息
     * @param userList
     */
    initUserView :function(userList){
        for(let i = 0; i < userList.length; i++) {
            let info = JSON.parse(userList[i].userProfile);
            if (this.nameViewList[i][0].string === "") {
                this.nameViewList[i][0].string = info.name;
                this.userIDViewList[i].string = userList[i].userID;
                this.userIDViewList[i].fontSize = this.userIDfontSize;
                // this.nameViewList[i][1].node.color = '#96E8B5';
            }
        }
        if (this.userList.length === GLB.MAX_PLAYER_COUNT-1) {
            engine.prototype.joinOver();
            this.startGame();
            //1 是游戏已经开始
        }
    },

    /**
     * 玩家退出将玩家的信息从页面上消失
     * @param info
     */
    removeView:function (info) {
        for(let i = 0; i < this.userList.length;i++ ) {
            if(info.userID === this.userList[i].userID) {
                this.userList.splice(i,1);
                this.nameViewList[i][0].string = "";
                this.userIDViewList[i].string = i+2;
                this.userIDViewList[i].fontSize = 80;
            }
        }
    },

    kickPlayerName :function (userID) {
        for (let i in  this.userList) {
            if(userID === this.userList[i].userID) {
                this.userList.splice(i,1);
            }
            let obj = JSON.parse(this.userList[i].userProfile);
            if (obj.userID === userID) {
                for(let i = 0; i < this.nameViewList.length; i++) {
                    if(this.userList[i].name === this.nameViewList[i][0].string) {
                        this.nameViewList[i][0].string = "";
                        return;
                    }
                }
            }
        }
    },


    startGame: function () {
        cc.director.loadScene('zyankenGame');
    },
});

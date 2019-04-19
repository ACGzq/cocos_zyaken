(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/interface/Glb.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '428f3elclpCmoTJ44iHyjQ5', 'Glb', __filename);
// scripts/interface/Glb.js

'use strict';

var obj = {
    RANDOM_MATCH: 1, // 随机匹配
    PROPERTY_MATCH: 2, // 属性匹配
    MAX_PLAYER_COUNT: 2,
    channel: 'Matchvs',
    platform: 'alpha',
    gameID: 215225,
    gameVersion: 1,
    appKey: '4e062ee45b8743aeaa34d51c3c49dd64#C',
    matchType: 1,
    tagsInfo: { "title": "A" },
    frameInfo: { "title": "frameInfo" },
    userID: 0,
    playerID: "",
    name: "",
    avatar: "",
    playerUserIds: [],
    isInit: false,
    isRoomOwner: false,
    syncFrame: true,
    FRAME_RATE: 20,
    roomID: 0,
    playertime: 60,
    isGameOver: false,
    mapType: "",
    FPS: 30 //数据帧每秒采样次数
};

module.exports = obj;

// window['obj'] = obj; //这步不能少

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
        //# sourceMappingURL=Glb.js.map
        
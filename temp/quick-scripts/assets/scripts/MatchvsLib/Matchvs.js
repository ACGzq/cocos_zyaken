(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/MatchvsLib/Matchvs.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '05271p8jQlJzKigt0eOwo2u', 'Matchvs', __filename);
// scripts/MatchvsLib/Matchvs.js

"use strict";

var engine = void 0;
var response = {};
var MsMatchInfo = void 0;
var MsCreateRoomInfo = void 0;
var MsRoomFilterEx = void 0;
var LocalStore_Clear = void 0;
try {
    engine = new window.MatchvsEngine();
    response = new window.MatchvsResponse();
    MsMatchInfo = window.MsMatchInfo;
    MsCreateRoomInfo = window.MsCreateRoomInfo;
    MsRoomFilterEx = window.MsRoomFilterEx;
    LocalStore_Clear = window.LocalStore_Clear;
} catch (e) {
    console.warn("load matchvs fail," + e.message);
}
module.exports = {
    engine: engine,
    response: response,
    MsMatchInfo: MsMatchInfo,
    MsCreateRoomInfo: MsCreateRoomInfo,
    MsRoomFilterEx: MsRoomFilterEx,
    LocalStore_Clear: LocalStore_Clear
};

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
        //# sourceMappingURL=Matchvs.js.map
        
"use strict";
cc._RF.push(module, '05271p8jQlJzKigt0eOwo2u', 'Matchvs');
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
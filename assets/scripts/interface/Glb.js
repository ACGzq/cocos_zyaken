let obj = {
    RANDOM_MATCH: 1,  // 随机匹配
    PROPERTY_MATCH: 2,  // 属性匹配
    MAX_PLAYER_COUNT: 2,
    channel: 'Matchvs',
    platform: 'alpha',
    gameID: 215225,
    gameVersion: 1,
    appKey: '4e062ee45b8743aeaa34d51c3c49dd64#C',
    matchType: 1,
    tagsInfo: {"title": "A"},
    frameInfo: {"title" : "frameInfo"},
    userID: 0,
    playerID:"",
    name: "",
    avatar: "",
    playerUserIds: [],
    isInit:false,
    isRoomOwner: false,
    syncFrame: true,
    FRAME_RATE: 20,
    roomID: 0,
    playertime: 60,
    isGameOver: false,
    mapType: "",
    FPS:30,//数据帧每秒采样次数
};

module.exports = obj;

// window['obj'] = obj; //这步不能少
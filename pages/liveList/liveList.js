import {request} from "../../request/request.js"
Page({
  data: {
    courseParams: {
      page: 1,
      pageSize: 10
    },
    liveList: []
  },
  onLoad() {
    this.getLiveList();
  },
  // 获取课程列表
  getLiveList(){
    request({
      url: "/api/live/list",
      data: this.data.courseParams
    })
    .then(res => {
      this.setData({
        liveList: res.data.data.list
      })
    })
  },
  toLivePlayer(e){
    let roomId = e.currentTarget.dataset.roomid;
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) // todo: 参数自定义
    wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${customParams}`
    })
  }
});

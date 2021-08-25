import {request} from "../../request/request.js"
Page({
  data: {
   rank: []
  },
  onLoad(options) {
   this.getRank(options.id);
  },
  // 获取课程列表
  getRank(id){
    request({
      url: "/api/event/detail",
      data: {id: id}
    })
    .then(res => {
      this.setData({
        rank: res.data.data.rank
      })
    })
  },
});

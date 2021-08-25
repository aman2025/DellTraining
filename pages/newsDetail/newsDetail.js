import {request} from "../../request/request.js"
Page({
  data: {
    newsData: {}
  },
  onLoad(options) {
    var id = options.id; // 课程id
    request({
      url: "/api/message/detail",
      data: {id: id}
    })
    .then(res => {
      this.setData({
        newsData: res.data.data.detail
      })
    })
  }
});

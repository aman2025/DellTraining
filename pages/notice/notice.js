import {request} from "../../request/request.js"
Page({
  data: {
    params: {
      page: 1,
      pageSize: 10
    },
    noticeList: []
  },
  onShow() {
    // 切换 tabbar时候请求, 后台切前台时也会触发
    request({
      url: "/api/message/list",
      data: this.data.params
    })
    .then(res => {
      console.log(res);
      this.setData({
        noticeList: res.data.data.list
      })
    })
  },
  toNewsDetail(e){
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/newsDetail/newsDetail?id=' + id,
    })
  }
});

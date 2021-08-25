import {request} from "../../request/request.js"
Page({
  data: {
    feedbackList: []
  },
  onLoad() {
    request({
      url: "/api/feedback/list"
    })
    .then(res => {
      this.setData({
        feedbackList: res.data.data.list
      })
    })
  },
  // 详情
  toFeedbackDetail(e){
    var fid = e.currentTarget.dataset.fid;
    wx.navigateTo({
      url: '/pages/feedbackDetail/feedbackDetail?id=' + fid,
    })
  },
});

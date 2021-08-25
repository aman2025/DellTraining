import {request} from "../../request/request.js"
Page({
  data: {
    feedbackDetail: {}
  },
  onLoad(options) {
    var id = options.id;
    this.showFeedbackDetail(id)
  },
  // 详情
  showFeedbackDetail(id){
    request({
      url: "/api/feedback/list"
    })
    .then(res => {
      var data = res.data.data.list

      data = data.filter((obj)=>{
        return obj.id == id
      })
    console.log(data[0]);

      this.setData({
        feedbackDetail: data[0]
      })
    })
  },
});

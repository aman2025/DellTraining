import {request} from "../../request/request.js"
Page({
  data: {
    courseParams: {
      page: 1,
      pageSize: 10
    },
    courseList: []
  },
  onLoad(options) {
    // 季度参数
     if(options.quarter){
      this.setData({
        "courseParams.quarter": options.quarter,
      });
     }
     // 类别
     if(options.category_id){
      this.setData({
        "courseParams.category_id": options.category_id
      });
     }
    // 接收参数
    
    this.getCouserList();
  },
  // 获取课程列表
  getCouserList(){
    request({
      url: "/api/index/list",
      data: this.data.courseParams
    })
    .then(res => {
      this.setData({
        courseList: res.data.data.list
      })
    })
  },
  // 立即学习
  doStudy(e){
    var cid = e.currentTarget.dataset.cid
    var cname = e.currentTarget.dataset.cname

    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?id=' + cid + '&name=' + cname,
    })
  }
});

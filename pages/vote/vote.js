import {request} from "../../request/request.js"
Page({
  data: {
    params:{
      page: 1,
      pageSize: 10
    },
    list: []
  },
  onLoad() {
   this.getVoteList();
  },
   // 获取课程列表
  getVoteList(){
    request({
      url: "/api/event/list",
      data: this.data.params
    })
    .then(res => {
      if(res.data.code == 2000){
        this.setData({
          list: res.data.data.list
        })
      }
    })
  },
});

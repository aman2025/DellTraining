import {request} from "../../request/request.js"
Page({
  data: {
    params: {
      search: '',
      page: 1,
      pageSize: 10
    },
    courseList: []
    
  },
  onLoad() {
   
  },
  handleInput(e){
    this.setData({
      "params.search": e.detail.value
    })
  },
  doSearch(e){
    request({
      url: "/api/index/list",
      data: this.data.params
    })
    .then(res => {
      this.setData({
        courseList: res.data.data.list
      })
    })
  }
});

import {request} from "../../request/request.js"
Page({
  data: {
    messageData: {}
  },
  onLoad(options) {
    var name = options.name; 
    var create_at = options.create_at; 
    var remark = options.remark; 
    var messageData = {
      name,
      create_at,
      remark
    }
    this.setData({
      messageData
    })
  }
});

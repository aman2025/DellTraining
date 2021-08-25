import {request} from "../../request/request.js"
const App = getApp();
Page({
  data: {
    user_score: '',
    pass_score: '',
    is_pass: 0,
    pid: 1,
    cid: 1,
    type: 0
  },
  onLoad(options) {
    var cid = options.cid;
    var pid = options.pid;
    var type = options.type;
    var is_pass = options.is_pass; 
    var user_score = options.user_score; 
    var pass_score = options.pass_score; 
    this.setData({
      user_score,
      pass_score,
      is_pass,
      type,
      pid,
      cid
    })
    console.log(this.data.is_pass);

    // 倒计时
    let count = 5;
    let timeout;
    timeout = setInterval(() => {
        count--;
        if (count == 0) {
            clearInterval(timeout);
            if(is_pass == 0 && type == 2){
              // 统计作答失败返回测试页
              wx.redirectTo({ // 关闭当前页面，避免重新返回到这里
                url: '/pages/courseTest/courseTest?pid=' + pid + '&type=' + type + '&cid=' + this.data.cid,
              })
            }else{
              // 答题成功返回课程页
              wx.redirectTo({
                url: '/pages/courseDetail/courseDetail?id=' + cid,
              })
            }
        }
    }, 1000);
  },
  onUnload(){
    // 手机物理返回键监听页面卸载
    this.resultBack()
  },
  resultBack(e){
    var type = this.data.type
    var cid = this.data.cid
    var is_pass = this.data.is_pass
    if(is_pass == 0 && type == 2){
      // 统计作答失败返回测试页
      wx.redirectTo({  // 关闭当前页面，避免重新返回到这里
        url: '/pages/courseTest/courseTest?pid=' + pid + '&type=' + type + '&cid=' + this.data.cid,
      })
    }else{
      // 答题成功返回课程页
      wx.redirectTo({
        url: '/pages/courseDetail/courseDetail?id=' + cid,
      })
    }
  }
});

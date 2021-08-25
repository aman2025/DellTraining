import {request} from "../../request/request.js"
const App = getApp();
Page({
  data: {
    userDetail: {},
    message: {}
  },
  onShow() {
    this.getNewAccount()
  },
  onLoad() {
    this.getNewAccount()
  },
  onTabItemTap(e){
    console.log(e);
    this.handleUserinfoDetail();
    
  },
  logout(){
    request({
      url: "/api/user/logout",
      method: "post"
    })
    .then(res => {
      if(res.data.code == 2000){
        wx.removeStorage({
          key: 'userinfoDetail',
          success: function(res) {
            console.log(res);
          }
        }) 
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    })
  },
  onShow(){
    // 修改昵称
    this.handleUserinfoDetail();
  },
  handleUserinfoDetail(){
    var userinfoDetail = wx.getStorageSync("userinfoDetail")
    this.setData({
      userDetail: userinfoDetail
    })
  },
  // mobile
  getNewAccount() {
    request({
      url: "/api/user/info"
    }).then((res) => {
      this.setData({
        message: res.data.data.message
      })
    });
  },
  // mobile
  toMessageDetail() {
    var name = this.data.message.name
    var remark = this.data.message.remark
    var create_at = this.data.message.create_at
    wx.navigateTo({
      url: '/pages/messageDetail/messageDetail?name=' + name + '&remark=' + remark + '&create_at=' +create_at,
    })
  }
})

import { request } from "../../request/request.js";
const App = getApp();
Page({
  data: {
    loginForm: {
      job_number: "",
      password: "",
      cache_name: "",
    },
    isShown: false,
    dialogData: {
      title: "提示",
      content: "内容",
      confirmText: "确定",
    },
    commonConfig: {},
    hasUserInfo: false,
    beforeUrl: ''
  },
  onShow(){
    // 监听app.js返回的异步数据common.config,避免未退出微信重新访问时，没有公共数据
    App.watch(this.watchBack);
  },
  onLoad(options) {
    this.setData({
      beforeUrl: options.beforeUrl
    })
    App.watch(this.watchBack);
  },
  doLogin() {
    var vals = this.formValidate();
    if (vals) {
      wx.showLoading();
      request({
        url: "/api/user/login",
        method: "post",
        data: this.data.loginForm,
      }).then((res) => {
        if (res.data.code == 2000) {
          wx.hideLoading();
          wx.setStorageSync("userinfoDetail", res.data.data);
          if(!this.data.beforeUrl || this.data.beforeUrl.indexOf('feedback') == -1){ 
            wx.switchTab({
              url: "/pages/index/index",
              success: (res) => {
                let page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              },
            });
          }else{
            // 从意见反馈入口登录后返回到意见反馈
            wx.navigateTo({
              url: '/pages/feedback/feedback',
            })
          }
          
        } else {
          wx.hideLoading();
          this.setData({
            isShown: true,
            "dialogData.content": res.data.msg,
          });
        }
      });
    }
  },
  // 工号
  handleUid(e) {
    this.setData({
      "loginForm.job_number": e.detail.value,
    });
  },
  // 密码
  handlePassword(e) {
    this.setData({
      "loginForm.password": e.detail.value,
    });
  },
  // 校验
  formValidate() {
    var errors = {
      job_number: "工号不能为空",
      password: "密码不能为空",
    };
    var errorsLog = [];
    var vals = Object.keys(errors).map((key) => {
      const val = this.data.loginForm[key];
      if (!val) {
        errorsLog.push(errors[key]);
      }
      return val;
    });
    if (vals.filter((v) => v).length === 2) {
      return vals;
    } else {
      this.setData({
        isShown: true,
        "dialogData.content": errorsLog[0],
      });
    }
    return null;
  },
  callConsumer() {
    wx.makePhoneCall({
      phoneNumber: this.data.commonConfig.forget_password,
    });
  },
  watchBack: function (globalConfig) {
    // 回调获取异步数据
    this.setData({
      commonConfig: globalConfig,
    });
  },
  // 授权
  doAuthorize() {
    var _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            // 不能用request.js，又会过滤并跳转到登录
            url: "https://daier.zaihukeji.cn/api/user/code2session",
            data: {
              code: res.code,
            },
            success: function (res) {
              if (res.data.code == 2000) {
                if (res.data.data.action == 1) {
                  wx.setStorageSync("userinfoDetail", res.data.data);
                  wx.switchTab({
                    url: "/pages/index/index",
                    success: (res) => {
                      let page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();
                    },
                  });
                } else {
                  // 未绑定
                  _this.setData({
                    isShown: true,
                    "dialogData.content": "账户不存在，请先去绑定",
                    cache_name: res.data.data.cache_name,
                  });
                }
              }
            },
          });
        }
      },
      fail: function (res) {
        console.log("Dell微信授权失败!");
      },
    });
  },
  getUserProfile: function(e){
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.doAuthorize();
        this.setData({
          hasUserInfo: true
        })
      }
    })
  }
});

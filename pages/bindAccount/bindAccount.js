import { request } from "../../request/request.js";
const App = getApp();
Page({
  data: {
    loginForm: {
      username: "",
      mobile: "",
    },
    isShown: false,
    dialogData: {
      title: "提示",
      content: "内容",
      confirmText: "确定",
    },
  },
  onShow() {
    this.getNewAccount()
  },
  onLoad() {},
  doBind() {
    var vals = this.formValidate();
    if (vals) {
      // 电话号码校验
      var numReg = /^[0-9]*$/;
      if (!numReg.test(vals[1]) || vals[1].length != 11) {
        var dialogData = {
          title: "提示",
          content: "电话号码格式错误，请重新输入！",
          confirmText: "确定",
        };
        this.setData({
          isShown: true,
          dialogData,
        });
        return null;
      }
      request({
        url: "/api/user/bind",
        method: "post",
        data: this.data.loginForm,
      }).then((res) => {
        if (res.data.code == 2000) {
          // 设置缓存中的nickname
          var  nameObj = {};
          var newUserinfoDetail = {};
          nameObj["nickname"] = this.data.loginForm.username;
          newUserinfoDetail = Object.assign(wx.getStorageSync("userinfoDetail"), nameObj);
          wx.setStorageSync("userinfoDetail", newUserinfoDetail)

          var dialogData = {
            title: "提示",
            content: "账号绑定成功",
            confirmText: "确定",
            confirmEvent: "_confirmEvent"
          };
          this.setData({
            isShown: true,
            dialogData,
          });
        }
      });
    }
  },
  // 返回 my
  _confirmEvent(e) {
    wx.navigateBack({
      data: 1,
    });
  },
  // username
  handleUsername(e) {
    this.setData({
      "loginForm.username": e.detail.value,
    });
  },
  // mobile
  handleMobile(e) {
    this.setData({
      "loginForm.mobile": e.detail.value,
    });
  },
  // 校验
  formValidate() {
    var errors = {
      username: "姓名不能为空",
      mobile: "电话不能为空",
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
  // mobile
  getNewAccount() {
    request({
      url: "/api/user/info"
    }).then((res) => {
      this.setData({
        'loginForm.username': res.data.data.username,
        'loginForm.mobile': res.data.data.mobile
      })
    });
  }
});

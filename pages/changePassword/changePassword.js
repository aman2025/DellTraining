import { request } from "../../request/request.js";
Page({
  data: {
    loginForm: { oldpassword: "", password: "", repassword: "" },
    isShown: false,
    dialogData: {
      title: "提示",
      content: "内容",
      confirmText: "确定",
    },
    isPassword01: true,
    isPassword02: true,
    isPassword03: true
  },
  // oldpassword
  handleOldpassword(e) {
    this.setData({
      "loginForm.oldpassword": e.detail.value,
    });
  },
  // password
  handlePassword(e) {
    this.setData({
      "loginForm.password": e.detail.value,
    });
  },
  // repassword
  handleRepassword(e) {
    this.setData({
      "loginForm.repassword": e.detail.value,
    });
  },
  // 校验
  formValidate() {
    var errors = {
      oldpassword: "原始密码不能为空",
      password: "新密码不能为空",
      repassword: "确认新密码不能为空"
    };
    var errorsLog = [];
    var vals = Object.keys(errors).map(key => {
      const val = this.data.loginForm[key];
      if (!val) {
        errorsLog.push(errors[key]);
      }
      return val;
    });
    console.log( errorsLog);

    if (vals.filter(v => v).length !== 3) {
      this.setData({
        isShown: true,
        'dialogData.content': errorsLog[0],
      });
      return null;
    }
    const [password, repassword] = ['password', 'repassword'].map(k => this.data.loginForm[k]);
    if (password !== repassword) {
      this.setData({
        isShown: true,
        'dialogData.content': '您输入的两次密码不相同',
      });
      return null;
    }
    return vals;
  },
  changePassword() {
    var vals = this.formValidate();
    var params = {
      password: this.data.loginForm.password,
      old_password: this.data.loginForm.oldpassword,
    }
    if (vals) {
      request({
        url: "/api/user/updatePWDByOld",
        method: "post",
        data: params,
      }).then((res) => {
        if (res.data.code == 2000) {
          var dialogData = {
            title: "提示",
            content: "密码修改成功",
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
   // 退出
  _confirmEvent(e) {
    this.logout();
  },
  // 退出
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
  togglePassword(e){
    // todo，优化
    var num = e.currentTarget.dataset.num;
    if(num == 1){
      if(this.data.isPassword01 == true){
        this.setData({
          isPassword01: false
        })
      }else{
        this.setData({
          isPassword01: true
        })
      }
    }else if(num == 2){
      if(this.data.isPassword02 == true){
        this.setData({
          isPassword02: false
        })
      }else{
        this.setData({
          isPassword02: true
        })
      }
    }else{
      if(this.data.isPassword03 == true){
        this.setData({
          isPassword03: false
        })
      }else{
        this.setData({
          isPassword03: true
        })
      }
    }

   

  }
});

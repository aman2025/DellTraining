// app.js
import { request } from "request/request.js";
App({
  onLaunch() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        let statusBarHeight = res.statusBarHeight,
            navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
            navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    });

    // 从后台切换到前台
    // 第一次加载
    this.globalData.first_load = true;

    // 异步获取,page中监听数据，
    this.getCommonConfig();

  },
  onShow(options){
    // 后台到前台
    // 排除第一次加载
    if (this.globalData.first_load  == false){
       this.globalData.load_ad = true
     }else{
       this.globalData.first_load  = false
    }  
    //说明是从后台切换到前台
    // var pages = getCurrentPages()
    // if (pages.length > 0 && options.scene != null){
    //   console.log("从后台切换到前台...");
    // }
  },
  // 这里这么写，是要在其他界面监听，而不是在app.js中监听，而且这个监听方法，需要一个回调方法。
  watch:function(method){
    var obj = this.globalData;
    Object.defineProperty(obj,"config", {  // 正式传给pages的数据this.globalData.config
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._config = value;
        method(value);
      },
      get:function(){
        return this._config
      }
    })
  },
  globalData: {
    load_ad:false,
    first_load:false,
    _config: {}  // 临时用于Object.defineProperty
  },
  getCommonConfig(){
    request({
      url: "/api/common/config"
    }).then((res) => {
      this.globalData.config = res.data.data
    })
  }
});

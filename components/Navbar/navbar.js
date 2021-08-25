const App = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageName:String,
    showNav:{
      type:Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   
  },
  lifetimes: {
    attached: function () {
      this.setData({
        navHeight: App.globalData.navHeight*2+10,
        navTop: App.globalData.navTop
      })
     }
  },
  /**
   * 组件的方法列表
   */
  methods: {
  //回退
  _navBack: function () {
    this.triggerEvent("backEvent"); 
      wx.navigateBack({
        delta: 1
      })      
  },
  }
})
// import {request} from "../../request/request.js"
const App = getApp();

Page({
  data: {
    articleId: 0,
    courseType: 'art',
    articleInfo: {},
    is_video: false
  },
  onLoad(options) {
    var cid = options.id; // 文章id
    var ctype = options.type; // 
    this.setData({
      articleId: cid,
      courseType: ctype,
    })
    this.getCourseArticle();
    this.changeRead();
  },
  // 获取课程详情
  getCourseArticle(){
    // 所有课程信息
    var articles = App.globalData.courseAllData.articles
    var videos = App.globalData.courseAllData.videos
    var type = this.data.courseType
    var contents = type == "art" ? App.globalData.courseAllData.articles : App.globalData.courseAllData.videos
    
    // 根据文章id，过滤当前文章
    contents = contents.filter((obj)=>{
      return obj.id == this.data.articleId
    })
    
    this.setData({
      articleInfo: contents[0]
    })
    
    if(type == "video"){
      this.setData({
        is_video: true
      })
    }
  },
  // 进入文章后就获取
  changeRead(){
    request({
      url: "/api/index/read",
      method: 'post',
      data: {id: this.data.articleId}
    })
    .then(res => {
      console.log("已阅读");
    })
  },
  onUnload(){
    // 手机物理返回键监听页面卸载 ,或按导航返回键
    this.goBack()
  },
  goBack(e){
     // 课程内容返回到课程详情，带上id
     wx.redirectTo({
      url: '/pages/courseDetail/courseDetail?id=' + this.data.articleId,
    })
  }
});

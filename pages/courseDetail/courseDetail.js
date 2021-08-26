import {request} from "../../request/request.js"
const App = getApp();
Page({
  data: {
    courseName: '',
    courseId: '',
    courseAllData: [],
    isShown: false,
    dialogData: {
      title: "恭喜你！",
      content: "证书领取成功请到我的证书列表查看",
      confirmText: "我知道了"
    },
    videoSliceParams: '?fops=avthumb/m3u8/noDomain/1/vb/500k/t/10'
  },
  onShow(options) {
    this.getCourseDetail();
  },
  onLoad(options) {
    var cid = options.id; // 课程id
    var cname = options.name; // 课程名字
    this.setData({
      courseName: cname,
      courseId: cid
    })
    this.getCourseDetail();
  },
  // 获取证书
  getCertificate(e){
    wx.navigateTo({
      url: '/pages/certificate/certificate',
    })
  },
  // 获取课程详情
  getCourseDetail(e){
    request({
      url: "/api/index/detail",
      data: {id: this.data.courseId}
    })
    .then(res => {
      this.setData({
        courseAllData: res.data.data
      })
      // 课程信息设置成全局变量
      App.globalData.courseAllData = res.data.data
    })
  },
  // 立即学习
  toLearn(e){
    var _this = this;
    var cid = e.currentTarget.dataset.cid;  // 注意：这是文章id，不是课程id
    var ctype = e.currentTarget.dataset.type;
   
    // 根据id，过滤当前课程
    // 如果是pdf直接打开, 不显示详情页，返回
    var contents = this.data.courseAllData.articles
    contents = contents.filter((obj)=>{  // 如果点击时video中的学习，content是undefined
      return obj.id == cid
    })
    if(contents && contents.length > 0){ // articles有数据
      var currentContent = contents[0].content;
      if(currentContent.indexOf('pdf') != -1){
        // 正在加载中
        wx.showLoading({
          title: "正在打开文件...",
          mask: true,
        });
        wx.downloadFile({
          url: currentContent, // pdf
          success: function (res) {                           
            if (res.statusCode === 200) {                     //成功
              var Path = res.tempFilePath                     //返回的文件临时地址，用于后面打开本地预览所用
              wx.openDocument({
                filePath: Path,                               //要打开的文件路径
                success: function (res) {
                  wx.hideLoading();
                  _this.changeRead(cid); // 传文章id
                  console.log('打开PDF成功');
                }
              })
            }
          },
          fail: function (res) {
            console.log(res);                                  //失败
          }
        })
        return;
      }
    }
    wx.navigateTo({
      url: '/pages/courseContent/courseContent?id=' + cid + "&type=" + ctype,
    })
  },
  // 立即测试
  toTest(e){
    var cid = e.target.dataset.cid;
    var pid = e.target.dataset.pid;
    wx.navigateTo({
      url: '/pages/courseTest/courseTest?cid=' + cid + "&pid=" + pid,
    })
  },
  // 未通过，点击提示
  showTip(){
    this.setData({
      isShown: true,
      'dialogData.title': '提示',
      'dialogData.content': '请先完成测试'
    })
  },
  // 进入文章或打开pdf后就post
  changeRead(artId){  // 传的是文章id
    request({
      url: "/api/index/read",
      method: 'post',
      data: {id: artId}
    })
    .then(res => {
      console.log("已阅读");
    })
  }
});

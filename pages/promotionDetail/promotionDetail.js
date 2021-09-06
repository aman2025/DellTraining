import { request } from "../../request/request.js";
Page({
  data: {
    isShown: false,
    dialogData: {},
    promotionDetail: {},
    promotionList: [],
    promotionId: 0,
    isFirst: true,
    customStyle: 'text-align: left;'
  },
  onLoad(options) {
    this.setData({
      promotionId: options.id
    });
    this.getPromotion();
  },
  // 获取课程列表
  getPromotion() {
    var id = this.data.promotionId;
    console.log(id);
    request({
      url: "/api/event/detail",
      data: { id: id },
    }).then((res) => {
      this.setData({
        promotionDetail: res.data.data.detail,
        promotionList: res.data.data.list
      });
      this.data.isFirst && this.showRules();
    });
  },
  onUnload(){
    this.setData({
      isFirst: true
    });
  },
  //投票
  doVote(e) {
    var vid = e.target.dataset.vid;
    request({
      url: "/api/event/vote",
      method: "post",
      data: { id: vid },
    }).then((res) => {
      if(res.data.code == 2000){
        // 投票成功提示
        let dialogData = {
          title: "提示",
          content: "投票成功",
          confirmText: "确定",
          closeEvent: "_confirmSuccessEvent",
          confirmEvent: "_confirmSuccessEvent",
        };
        this.setData({
          dialogData,
          isShown: true,
        });
      }else{
        let dialogData = {
          title: "提示",
          content: "今日投票次数已达上限",
          confirmText: "确定"
        };
        this.setData({
          dialogData,
          isShown: true,
        });
      }
      
    });
  },
  _confirmSuccessEvent(e) {
    this.setData({
      isShown: false,
      isFirst: false
    });
    this.getPromotion();
  },
  // 活动规则
  showRules() {
    let dialogData = {
      title: "活动规则",
      content: this.data.promotionDetail.content,
      confirmText: "我知道了"
    };
    this.setData({
      dialogData,
      isShown: true,
    });
  },
  toRank() {
    wx.navigateTo({
      url: '/pages/rank/rank?id=' + this.data.promotionId,
    })
  },
  pic_preview(e){
    var currentUrl = e.currentTarget.dataset.url
    let urlArr = []
    urlArr.push(currentUrl)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接,
      urls: urlArr, // 所有图片数组，这个参数需要添加，否则不能显示
    })
  }
});

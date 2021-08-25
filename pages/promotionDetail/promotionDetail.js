import { request } from "../../request/request.js";
Page({
  data: {
    isShown: false,
    dialogData: {},
    promotionDetail: {},
    promotionList: [],
    promotionId: 0,
  },
  onLoad(options) {
    this.showRules();
    this.setData({
      promotionId: options.id,
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
        promotionList: res.data.data.list,
      });
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
          closeEvent: "_closeEvent",
          confirmEvent: "_confirmEvent",
        };
        this.setData({
          dialogData,
          isShown: true,
        });
      }else{
        let dialogData = {
          title: "提示",
          content: "今日投票次数已达上限",
          confirmText: "确定",
          closeEvent: "_closeEvent",
          confirmEvent: "_closeEvent",
        };
        this.setData({
          dialogData,
          isShown: true,
        });
      }
      
    });
  },
  _closeEvent(e) {
    this.getPromotion();
    this.setData({
      isShown: false,
    });
  },
  _confirmEvent(e) {
    this.getPromotion();
    this.setData({
      isShown: false,
    });
  },
  // 活动规则
  showRules() {
    let dialogData = {
      title: "活动规则",
      content:
        "1、每队基础分为100分。2、比赛题型分个人必答和集体必答。 3、个人必答由选手按座次抽题独立作答，答对加10分，答错不扣分；队友不得提醒或补充，否则题目作废不予加分；答题时间为30秒，超过时间不加分。  4、集体必答题时间1分钟，答对加20分，答错不扣分；在规定时间内队友可以提醒或补充。",
      confirmText: "我知道了",
      closeEvent: "_closeEvent",
      confirmEvent: "_confirmEvent",
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

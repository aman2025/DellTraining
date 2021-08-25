import {request} from "../../request/request.js"

Page({
  data: {
    promotionList: [],
    promotionParams: {
      page: 1,
      pageSize: 10
    }
  },
  onLoad() {
   this.getPromotion();
  },
  // 获取课程列表
  getPromotion(){
    request({
      url: "/api/event/list",
      data: this.data.promotionParams
    })
    .then(res => {
      this.setData({
        promotionList: res.data.data.list
      })
    })
  },
  // 详情页
  toPromotionDetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/promotionDetail/promotionDetail?id=' + id,
    })
  },
});

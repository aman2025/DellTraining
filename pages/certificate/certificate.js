import {request} from "../../request/request.js"
Page({
  data: {
    certificate: [],
    certificateParams: {
      page: 1,
      pageSize: 10
    }
  },
  onLoad() {
    this.getCertificate();
  },
  // 获取证书列表
  getCertificate(){
    request({
      url: "/api/cert/list",
      data: this.data.certificateParams
    })
    .then(res => {
      this.setData({
       certificate: res.data.data.list
      })
    })
  },
  topic_preview(e){
    var currentUrl = e.currentTarget.dataset.url
    let certArr = this.data.certificate
    const urlArr = certArr.map(i => i.image)
    // var tempurl = 'https://daier.zaihukeji.cn/uploads/20210812/e440202cb07114aefe2cff7fc110f263.png'
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接,
      urls: urlArr, // 所有图片数组，这个参数需要添加，否则不能显示
    })
  }
});

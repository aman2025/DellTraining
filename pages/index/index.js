import {request} from "../../request/request.js"
const App = getApp();

Page({
  data: {
    morePosi: -106,
    courseParams: {
      page: 1,
      pageSize: 10
    },
    courseList: [],
    indexData: {},
    courseLen: 0,
    quarter: {},
    p1: 'right:-106rpx',
    p2: 'right:-106rpx',
    p3: 'right:-106rpx',
    p4: 'right:-106rpx',
    navTop: 0
  },
  onShow(){
    // 判断是后台切到前台刷新接口
    if (App.globalData.load_ad ==true){
        App.globalData.load_ad =false;
        this.getCouserList();
    }
  },
  onLoad() {
   this.getCouserList();
   this.setData({
     navTop: App.globalData.navTop
   })
  },
  // 显示查看更多
  changeLastItem(e){
    var lastItem = e.detail.current;
    var index = e.currentTarget.dataset.index;
   
    var swiperLen = this.data.quarter[index].length; //  当前季度的swiper-item个数
    var is_showtip = lastItem == parseInt(swiperLen/3)
    console.log(lastItem);
    console.log(swiperLen);
    if(index == 1){
      if(lastItem == 1){
        this.setData({
          p1: 'right:30rpx'
        })
      }else{
        this.setData({
          p1: 'right:-106rpx'
        })
      }
    }else if(index == 2){
      if(lastItem == 1){
        this.setData({
          p2: 'right:30rpx'
        })
      }else{
        this.setData({
          p2: 'right:-106rpx'
        })
      }
    }else if(index == 3){
      if(lastItem == 1){
        this.setData({
          p3: 'right:30rpx'
        })
      }else{
        this.setData({
          p3: 'right:-106rpx'
        })
      }
    }else{
      if(lastItem == 1){
        this.setData({
          p3: 'right:30rpx'
        })
      }else{
        this.setData({
          p3: 'right:-106rpx'
        })
      }
    }
    
  },
  // 获取课程列表
  getCouserList(){
    request({
      url: "/api/index/index"
    })
    .then(res => {
      var quarter = res.data.data.quarter; // 所有季度
      this.setData({
        quarter,
        indexData: res.data.data
      })
      // this.setData({
      //   courseList: quarter['1'],
      //   courseLen: parseInt(currentQuarter.length/3)
      // })
    })
  },
  // 点击更多跳转，带上季度参数
  getMore(e){
    let quarter = e.currentTarget.dataset.quarter
    wx.navigateTo({
      url: '/pages/courseList/courseList?quarter=' + quarter,
    })
  },
  // 立即学习
  doStudy(e){
    var cid = e.currentTarget.dataset.cid
    var cname = e.currentTarget.dataset.cname
    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?id=' + cid + '&name=' + cname,
    })
  },
  // 点击banner
  doBanner(e){
    var url = e.target.dataset.url
    wx.navigateTo({
      url: url,
    })
  }
})

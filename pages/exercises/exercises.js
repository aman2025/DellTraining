import {request} from "../../request/request.js"
Page({
  data: {
    tabList: [
      {
        id: 0,
        value: "未完成",
        isActive: true,
      },
      {
        id: 1,
        value: "已通过",
        isActive: false,
      }
    ],
    courseParams: {
      page: 1,
      pageSize: 10
    },
    passCourse: [],
    otherCourse: []
  },
  onLoad() {
    this.getCouserList();
  },
  changeTitleByIndex(index) {
    let { tabList } = this.data;
    tabList.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabList,
    });
  },
  tabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
  },
  // 获取课程列表
  getCouserList(){
    request({
      url: "/api/index/list",
      data: this.data.courseParams
    })
    .then(res => {
      var allData = res.data.data.list;
      var passCourse = [];
      var otherCourse = [];
      // 根据is_pass，过滤已通过
      passCourse = allData.filter((obj)=>{
        return obj.is_pass == 1
      })
      // 未通过
      otherCourse = allData.filter((obj)=>{
        return obj.is_pass != 1
      })
      this.setData({
        passCourse,
        otherCourse
      })
    })
  },
  // 立即学习
  doStudy(e){
    var cid = e.currentTarget.dataset.cid
    var cname = e.currentTarget.dataset.cname

    wx.navigateTo({
      url: '/pages/courseDetail/courseDetail?id=' + cid + '&name=' + cname,
    })
  }
});

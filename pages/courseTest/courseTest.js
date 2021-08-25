import {request} from "../../request/request.js"
const App = getApp();
Page({
  data: {
    testId: 0,
    cid: 0,
    testInfo: {},
    answer: {},
    dialogData: {},
    showFail: false,
    userAnswer: {},
    type: 1
  },
  
  onLoad(options) {
    var cid = options.cid; // 课程id
    var pid = options.pid; // 试卷id
    var type = options.type; // 统计作答错误返回
    this.setData({
      cid,
      testId: pid,
      type
    })
    this.getCourseQuestion();
  

  },
  // 获取测试详情
  getCourseQuestion(){
    // 所有课程信息
    var questions = App.globalData.courseAllData.questions

    // 根据id，过滤当前课程
    questions = questions.filter((obj)=>{
      return obj.id == this.data.testId
    })
   
    this.setData({
      testInfo: questions[0]
    })

  },
  // 点击每个题的选项
  checkboxChange(e) {
    const items = this.data.testInfo.config[e.currentTarget.dataset.index].select;
    for (let i = 0, len = items.length; i < len; ++i) {
      this.data.testInfo.config[e.currentTarget.dataset.index].istype = e.detail.value;
    }
    let arr = [];
    var tempAnswer = {}
    this.data.testInfo.config.forEach((items) => {
      var configType = items.type; //1-单选 2-多选
      var obj= {}
      var curAnswer  = items.istype;
      obj[items.id] = configType == 1 ? curAnswer : curAnswer.join(',')
      Object.assign(tempAnswer, obj)
      arr.push({
        id: items.id
      });
    });
    this.setData({
      isarr: arr,
      answer: tempAnswer
    });
  },
  
  //提交
  handleOk() {
    var pid = this.data.testId// 试卷id
    var len = this.data.testInfo.config.length
    var userAnswer = this.data.userAnswer;
    var testData = {
      cid: this.data.cid,
      pid: pid,
      answer: Object.assign(userAnswer, this.data.answer)
    }
    console.log(userAnswer);
    console.log(this.data.answer);
    
    var valAnswers = Object.values(this.data.answer)
    // 答案有一个为空
    var is_checkall = valAnswers.filter(v => !v).length;
    
    // 没有全部选中, 单选题是undefined， 多项题答案为空，提示
    if(!this.data.isarr || this.data.isarr.length != len || is_checkall){
      let dialogData = {
        title: "提示",
        content: "您还有未答题目请答完所有题目后再提交答案",
        confirmText: "立即答题",
        closeEvent: "_closeEvent",
        confirmEvent: "_confirmEvent"
      }
      this.setData({
        dialogData,
        isShown: true,
        isarr: []
      })
      return
    }
    // 题目的数量,必须全部填写好
    if (this.data.isarr.length == len) {
      request({
        url: "/api/index/exam",
        method: "post",
        data: testData
      })
      .then(res => {
        var is_pass = res.data.data.is_pass;
        var user_score = res.data.data.user_score || '';
        var pass_score = res.data.data.pass_score || '';
        var type = res.data.data.type || this.data.type; // 1无限作答，2统计作答
        if(type == 2){
          wx.navigateTo({
            url: '/pages/courseResult/courseResult?is_pass=' + is_pass + '&user_score=' + user_score + '&pass_score=' + pass_score + '&pid=' + this.data.testId + '&cid=' + this.data.cid + '&type=' + type,
          })
        }else{
          if(is_pass == 1){
            wx.navigateTo({
              url: '/pages/courseResult/courseResult?is_pass=' + is_pass + '&cid=' + this.data.cid,
            })
          }else{
            // 回到顶部
            this.goTop();
            // 显示错误信息
             // 所有select都加上checked，清空所有选择
             var error_list = res.data.data.error_list
             error_list.forEach((item)=>{
                item.select.forEach((o)=>{
                  o['checked'] = false
                })
              })
            this.setData({
              showFail: true,
              'testInfo.config': error_list// 测试答对题目自动隐藏
            })
            this.onLoad(); // todo: 可能options值没有
          }
        }
        // 第一次提交返回的user_answers
        this.setData({
          userAnswer: res.data.data.user_answers
        })
      })
    }
  },
  goTop: function (e) {  // 一键回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
});

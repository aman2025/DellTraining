import {request} from "../../request/request.js"
Page({
  data: {
    chooseImgs: [],
    textareaCount: 0,
    showSelect: false,
    companyOptions: [],
    classOptions: [],
    categoryOptions: [],
    datePickerValue: ['', '', ''],
    datePickerIsShow: false,
    feedbackForm: {
      start_time: '',
      name: '',
      company_id: "",
      class_id: "",
      type_id: "",
      content: "",
    },
    isShown: false,
  },
  uploadImgs: [], // 上传后返回的外链图片地址
  onReady() {
    this.dataPicker = this.selectComponent("#datePicker");
    this.selectCompany = this.selectComponent("#companySelect"); // 子组件id
    this.selectClass = this.selectComponent("#classSelect"); // 子组件id
    this.selectCategory = this.selectComponent("#categorySelect"); // 子组件id
  },
  onLoad() {
    console.log('back to feedback...');
    this.feedbackConfig()
  },
  chooseImg() {
    wx.chooseImage({
      // 最多上传一张
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        this.setData({
          chooseImgs: res.tempFilePaths, // 图片路径
        });
      },
    });
  },
  // 输入意见内容
  handleCount(e) {
    var value = e.detail.value;
    this.setData({
      "feedbackForm.content": value
    });
    var len = parseInt(value.length);
    if(len > 100) return;
    this.setData({
      textareaCount: len 
    });
  },
  // 输入名字
  handleName(e) {
    var value = e.detail.value;
    this.setData({
      "feedbackForm.name": value 
    });
  },
  // 删除图片
  removeImg(e) {
    const { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs,
    });
  },
  // 公司选择
  changeCompany(e) {
    this.setData({
      "feedbackForm.company_id": e.detail.id,
    });
  },
  // 班次选择
  changeClass(e) {
    this.setData({
      "feedbackForm.class_id": e.detail.id,
    });
  },
  // 反馈类别
  changeCategory(e) {
    this.setData({
      "feedbackForm.type_id": e.detail.id,
    });
  },
  // 提交
  submitFB() {
    var vals = this.formValidate();
    //this.data.feedbackForm 已获取所有表单内容
    if (vals) {
      const {  chooseImgs } = this.data;
      console.log(chooseImgs[0]);
      // 正在加载中
      wx.showLoading({
        title: "正在上传中...",
        mask: true,
      });
      // 上传图片
      if(!chooseImgs.length){
        this.pubReq(); // 没有选择图片
      }else{
        wx.uploadFile({
          url: "https://daier.zaihukeji.cn/api/common/upload", // 图片上传接口
          filePath: chooseImgs[0],
          name: "file",
          formData: {},
          success: (res) => {
            let url = JSON.parse(res.data).data.url;
            // this.uploadImgs.push(url); // 多张图片
            // request提交,表单数据和图片，
            // 成功回调
            this.setData({
              chooseImgs: [],
              "feedbackForm.image": url
            });
            this.pubReq();
          },
        });
      }
    }
  },
  // request，post
  pubReq: function (e) {
    // 提交
    request({
      url: "/api/feedback/pub",
      method: "post",
      data: this.data.feedbackForm
    }).then((res) => {
      if(res.data.code == 2000){
        wx.hideLoading();
        // 投票成功提示
        let dialogData = {
          title: "提示",
          content: "反馈提交成功",
          confirmText: "确定",
          closeEvent: "_closeEvent",
          confirmEvent: "_confirmEvent_success"
        }
        this.setData({
          dialogData,
          isShown: true
        })
      }
    });
  },
  // 反馈成功点击确定
  _confirmEvent_success(e) {
    this.setData({
        isShown: false
    })
    // 返回上一个页面
    wx.navigateBack({
      data: 1,
    });
  },
  // 日期选择
  showDatePicker: function (e) {
    // this.data.datePicker.show(this);
    this.setData({
      datePickerIsShow: true,
    });
  },
  datePickerOnSureClick: function (e) {
    console.log('datePickerOnSureClick');
    console.log(e);
    this.setData({
      "feedbackForm.start_time": `${e.detail.value[0]}-${e.detail.value[1]}-${e.detail.value[2]}`,
      datePickerValue: e.detail.value,
      datePickerIsShow: false,
    });
  },
  datePickerOnCancelClick: function (event) {
    console.log('datePickerOnCancelClick');
    console.log(event);
    this.setData({
      datePickerIsShow: false,
    });
  },
  // 校验
  formValidate() {
    var errors = {
      start_time: "日期不能为空",
      name: "姓名不能为空",
      company_id: "Company不能为空",
      class_id: "班次不能为空",
      type_id: "反馈类别不能为空",
      content: "意见内容不能为空",
    };
    var errorsLog = [];
    var vals = Object.keys(errors).map(key => {
      const val = this.data.feedbackForm[key];
      if (!val) {
        errorsLog.push(errors[key]);
      }
      return val;
    });
    if (vals.filter(v => v).length === 6) {
      return vals;
    } else {
      // 反馈错误提示
      let dialogData = {
        title: "提示",
        content: errorsLog[0],
        confirmText: "确定",
        closeEvent: "_closeEvent",
        confirmEvent: "_confirmEvent"
      }
      this.setData({
        dialogData,
        isShown: true
      })
    }
    return null;
  },
  // 下拉选项配置config
  feedbackConfig(id){
    request({
      url: "/api/feedback/config"
    })
    .then(res => {
      var companys = res.data.data.company
      var classes = res.data.data.class
      var categorys = res.data.data.type
      var newCompanys = []
      var newClasses = []
      var newCategorys = []
      for(let key in companys){
        var obj = {}
        obj["c_id"] = key
        obj["c_name"] = companys[key]
        newCompanys.push(obj)
      }
      for(let key in classes){
        var obj = {}
        obj["cls_id"] = key
        obj["cls_name"] = classes[key]
        newClasses.push(obj)
      }
      for(let key in categorys){
        var obj = {}
        obj["g_id"] = key
        obj["g_name"] = categorys[key]
        newCategorys.push(obj)
      }
      this.setData({
        companyOptions: newCompanys,
        classOptions: newClasses,
        categoryOptions: newCategorys
      })
    })
  },
  closeSelect(){
    this.selectCompany.close();
    this.selectClass.close();
    this.selectCategory.close();
    // this.dataPicker.close()
  }
});

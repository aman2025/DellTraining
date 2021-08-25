Page({
  data: {
    publicUrl: ''
  },
  onLoad(options) {
    var url = options.publicUrl;
    console.log(url);
    this.setData({
      publicUrl: url
    })
  }
  
});

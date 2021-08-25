export const request = (params) => {
  // https://mockapi.eolinker.com/kVz8QgIe8560ae37d9fb1c8f39fa4526f6db303143b8057
  const baseUrl = "https://daier.zaihukeji.cn"; // https://daier.zaihukeji.cn
  const header = {
    'content-type': 'application/json;charset=UTF-8',
    token: wx.getStorageSync("userinfoDetail")['token']
  }
  return new Promise((resolve,reject) => {
    // 没有token，返回登录页面
    // 过滤掉login请求
    if(!header.token && params.url.indexOf('login') == -1 && params.url.indexOf('common') == -1){
      wx.navigateTo({
        url: '/pages/login/login?beforeUrl=' + params.url,
      })
    }
    wx.request({
      ...params,
      url: baseUrl + params.url,
      header,
      method: params.method,
      data: params.method === 'post' ? JSON.stringify(params.data) : params.data,
      success: (result)=>{
        // 多点登录token失效, 删除token
         if(result.data.code == 6001){
            wx.removeStorage({
              key: 'userinfoDetail',
              success: function(res) {
                console.log("多点登录，删除token");
              }
            }) 
            wx.navigateTo({
               url: '/pages/login/login',
            })
           }else{
             resolve(result);
          }
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
  // todo:拦截器
}
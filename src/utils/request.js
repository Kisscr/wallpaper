// 封装网络请求
export default function (params) {
  // 发送请求前弹出加载中
  uni.showLoading({
    title: '加载中',
    mask: true
  });

  return new Promise ((reslove, reject) => {
    wx.request({
      ...params,
      success: (result) => {
        reslove(result.data)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    });
      
  })
}
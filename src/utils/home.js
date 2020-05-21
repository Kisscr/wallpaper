import request from "./request"

const baseUrl1 = "http://157.122.54.189:9088/image"
const baseUrl2 = "https://service.picasso.adesk.com"

// 获取首页推荐数据
export function getHomeData(options) {
  return request({
    url: baseUrl2 + '/v3/homepage/vertical',
    ...options
  }
  )
}

// 获取首页专辑数据
export function getAlbumData(options) {
  return request({
    url: baseUrl1 + '/v1/wallpaper/album',
    ...options
  }
  )
}


// 获取专辑详情数据
export const getAlbumDetails = (options) => {
  return request({
    url : `${baseUrl1}/v1/wallpaper/album/${options.id}/wallpaper`,
    ...options
  })
}

// 获取图片评论
export const getComments = (options) => {
  return request ({
    url: `${baseUrl2}/v2/wallpaper/wallpaper/${options.id}/comment`
  })
}

// 获取分类页面数据
export const getCategory = () => {
  return request ({
    url: `${baseUrl2}/v1/vertical/category`
  })
}

// 获取分类页面图片详情
export const getImgCategory = (options) => {
  return request ({
    url: `${baseUrl2}/v1/vertical/category/${options.id}/vertical`,
    ...options
  })
}

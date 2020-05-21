import request from "./request"

const baseUrl = "http://157.122.54.189:9088/videoimg/v1/videowp"

// 获取视频数据
export function getVideoData(options) {
  return request({
    url: baseUrl + options.path,
    ...options
  }
  )
}

// 获取视频分类数据
export function getVideoCate(options) {
  return request({
    url: baseUrl + '/category',
    ...options
  }
  )
}
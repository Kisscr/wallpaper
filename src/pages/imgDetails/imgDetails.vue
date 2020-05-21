<template>
  <view class="container">
    <!-- 上半部分 -->
    <view class="img_details_wrap">
      <!-- 1. 当前图片详情部分 -->
      <view class="user_info_wrap">
        <view class="user_avatar">
          <image :src="currentImg.img" mode="widthFix" />
        </view>
        <view class="user_info">
          <view class="user_name">{{currentImg.user.name}}</view>
          <view class="publish_time">{{currentImg.fromNow}}</view>
        </view>
      </view>

      <!-- 2. 图片部分-->
      <view class="img_wrap">
        <swiperAction @swiperAction="handleSwiperAction">
          <image :src="currentImg.thumb" mode="widthFix" />
        </swiperAction>
      </view>

      <!-- 3. 点赞和收藏 -->
      <view class="rank">
        <view class="count rank_item">
          <view class="iconfont icondianzan"></view>
          <view class="txt">{{currentImg.rank}}</view>
        </view>
        <view class="collect rank_item">
          <view class="iconfont iconshoucang"></view>
          <view class="txt">收藏</view>
        </view>
      </view>
    </view>

    <!-- 4. 相关专辑部分 -->
    <view class="img_about_wrap">
      <view class="img_about_txt">相关</view>
      <block v-for="item in album" :key="item.id">
        <view class="img_about_info">
          <view class="about_img">
            <image class="img" :src="item.cover" mode="aspectFill" />
          </view>
          <view class="about_title">
            <view class="about_type">专辑</view>
            <view class="about_name">{{item.name}}</view>
          </view>
          <view class="iconfont iconiconfontjiantou4"></view>
        </view>
      </block>
    </view>

    <!-- 5. 图片评论部分 -->
    <view class="comments_container">
      <!-- 最热评论 -->
      <view v-if="hots.length" class="hots_wrap comments_item">
        <view class="hots_title comments_title">
          <view class="iconfont iconhot1"></view>
          <view class="title_txt">最热评论</view>
        </view>
        <block v-for="item in hots" :key="item.id">
          <view class="comment_item">
            <view class="user_info">
              <view class="avatar">
                <image class="avatar_img" :src="item.user.avatar" />
              </view>
              <view class="name_time">
                <view class="name">{{item.user.name}}</view>
                <view class="time">{{item.atime}}</view>
              </view>
            </view>
            <view class="user_comment">
              <view class="comment_txt">{{item.content}}</view>
              <view class="size">
                <view class="iconfont icondianzan"></view>
                <view class="num">{{item.size}}</view>
              </view>
            </view>
          </view>
        </block>
      </view>

      <!-- 最新评论 -->
      <view v-if="news.length" class="news_wrap comments_item">
        <view class="news_title comments_title">
          <view class="iconfont iconpinglun"></view>
          <view class="title_txt">最新评论</view>
        </view>
        <block v-for="item in news" :key="item.id">
          <view class="comment_item">
            <view class="user_info">
              <view class="avatar">
                <image class="avatar_img" :src="item.user.avatar" />
              </view>
              <view class="name_time">
                <view class="name">{{item.user.name}}</view>
                <view class="time">{{item.atime}}</view>
              </view>
            </view>
            <view class="user_comment">
              <view class="comment_txt">{{item.content}}</view>
              <view class="size">
                <view class="iconfont icondianzan"></view>
                <view class="num">{{item.size}}</view>
              </view>
            </view>
          </view>
        </block>
      </view>

      <!-- 暂无评论 -->
      <view v-else class="no_comments">暂无评论，还不快来抢沙发~</view>
    </view>

    <!-- 6. 下载图片 -->
    <view class="download">
      <view class="download_btn" @click="handleDownloadImg">下载图片</view>
    </view>
  </view>
</template>

<script>
import moment from "moment";
import { getComments } from "../../utils/home";
import swiperAction from "@/components/swiperAction/swiperAction";

moment.locale("zh-cn");
export default {
  components: {
    swiperAction
  },
  data() {
    return {
      // 当前图片的数据
      currentImg: {},
      // 当前专辑的数据
      imgList: [],
      // 当前图片的id
      id: -1,
      // 专辑详情
      album: [],
      // 图片的索引
      imgIndex: 0,
      // 最新评论
      news: [],
      // 最热评论
      hots: []
    };
  },
  onLoad() {
    // 接收全局变量
    const { imgIndex } = getApp().globalData;
    this.imgIndex = imgIndex;

    this.getData();
  },

  methods: {
    // 获取图片数据的方法
    getData() {
      const { imgList } = getApp().globalData;

      this.imgList = imgList;
      this.currentImg = imgList[this.imgIndex];
      this.id = this.currentImg.id;

      // 处理图片路劲格式
      // this.currentImg.imgUrl =
      //   this.currentImg.thumb + this.currentImg.rule.replace("$<Height>", 360);

      // 处理日期格式
      this.currentImg.fromNow = moment(this.currentImg.atime * 1000)
        .startOf("day")
        .fromNow();

      this._getComments();
    },

    // 获取图片详情的方法
    async _getComments() {
      const res = await getComments({ id: this.id });

      this.album = res.res.album;
      this.news = res.res.comment;
      this.news.map(item => {
        item.atime = moment(item.atime * 1000)
          .startOf("day")
          .fromNow();
      });

      this.hots = res.res.hot;
      this.hots.map(item => {
        item.atime = moment(item.atime * 1000)
          .startOf("day")
          .fromNow();
      });
    },

    // 滑动事件
    handleSwiperAction(e) {
      if (e.direction === "left" && this.imgIndex < this.imgList.length - 1) {
        this.imgIndex++;
        this.getData();
      } else if (e.direction === "right" && this.imgIndex > 0) {
        this.imgIndex--;
        this.getData();
      } else {
        uni.showToast({
          title: "没有图片啦~~",
          icon: "none"
        });
      }
    },

    // 点击下载图片
    async handleDownloadImg() {
      // 点击后弹出下载中
      await uni.showLoading({
        title: '下载中...'
      })

      // 1. 先将图片下载到小程序内 tempFilePath
      const res1 = await uni.downloadFile({
        url: this.currentImg.img
      });
      const { tempFilePath } = res1[1]

      // 2. 通过 tempFilePath 将图片保存到本地
      const res2 = await uni.saveImageToPhotosAlbum({
        filePath: tempFilePath
      })
      // console.log(res2)

      // 3. 下载成功后，隐藏loading，弹出下载成功
      uni.hideLoading()

      await uni.showToast({
        title: '下载成功'
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  // 1. 当前图片详情部分
  .img_details_wrap {
    .user_info_wrap {
      display: flex;
      padding: 30rpx;
      align-items: center;
      .user_avatar {
        width: 90rpx;
        height: 90rpx;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 30rpx;
      }
      .user_info {
        .user_name {
          font-weight: 700;
        }
        .publish_time {
          font-size: 24rpx;
          color: #ccc;
        }
      }
    }
  }

  // 2. 点赞和收藏
  .rank {
    display: flex;
    padding: 20rpx 0;
    border: 4rpx solid #eee;
    .count {
      border-right: 2rpx solid #eee;
    }
    .rank_item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;

      .iconfont {
        margin-right: 10rpx;
      }
      .txt {
        font-size: 30rpx;
      }
    }
  }

  // 3. 专辑部分
  .img_about_wrap {
    border-bottom: 10rpx solid #eee;
    .img_about_txt {
      padding: 20rpx 10rpx;
      font-weight: 700;
      font-size: 36rpx;
    }
    .img_about_info {
      padding: 0 10rpx 10rpx;
      position: relative;
      display: flex;
      .about_img {
        width: 200rpx;
        height: 200rpx;
        margin-right: 20rpx;
        .img {
          height: 100%;
        }
      }
      .about_title {
        .about_type {
          width: 100rpx;
          height: 50rpx;
          border-radius: 5rpx;
          background: $theme-color;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .about_name {
          color: #000;
          font-size: 32rpx;
          font-weight: 600;
        }
      }
    }
    .iconfont {
      position: absolute;
      font-size: 34rpx;
      right: 12%;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  // 4. 评论部分
  .comments_container {
    .hots_wrap {
      border-bottom: 30rpx solid #eee;
    }
    .comments_item {
      .comments_title {
        display: flex;
        padding: 20rpx;
        align-items: center;
        .iconfont {
          font-size: 44rpx;
          margin-right: 20rpx;
          color: $theme-color;
        }
        .title_txt {
          font-size: 28rpx;
          font-weight: 700;
        }
      }
      .comment_item {
        padding-bottom: 36rpx;
        border-bottom: 10rpx solid #eee;
        .user_info {
          display: flex;
          padding: 20rpx 10rpx;
          .avatar {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            overflow: hidden;
            .avatar_img {
              height: 100%;
            }
          }
          .name_time {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            margin-left: 20rpx;
            .name {
              color: #ccc;
            }
            .time {
              color: #888;
            }
          }
        }
        .user_comment {
          display: flex;
          padding-left: 125rpx;
          justify-content: space-between;
          .comment_txt {
            color: #000;
            font-size: 30rpx;
            font-weight: 700;
          }
          .size {
            display: flex;
            align-items: center;
            color: #666;
            padding-right: 10rpx;
            .iconfont {
              font-size: 30rpx;
              margin-right: 5rpx;
            }
          }
        }
      }
    }
    .news_wrap {
      .news_title {
        .iconfont {
          color: #9dc1e1;
        }
      }
    }
    .no_comments {
      padding: 20rpx;
      font-size: 30rpx;
      color: #666;
    }
  }

  // 5. 下载按钮
  .download {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120rpx;
    .download_btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80%;
      width: 95%;
      color: #fff;
      background-color: $theme-color;
      font-size: 46rpx;
      font-weight: 700;
    }
  }
}
</style>
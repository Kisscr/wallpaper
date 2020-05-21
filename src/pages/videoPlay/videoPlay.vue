<template>
  <view class="play_container">
    <image class="play_bg" :src="video.img" />
    <view class="icon">
      <view @click="handleMuted" :class="['iconfont', muted? 'iconjingyin' : 'iconshengyin']"></view>
      <view class="iconfont iconzhuanfa">
        <button class="share_btn" open-type="share"></button>
      </view>
    </view>
    <view class="video_wrap">
      <video class="player" :muted="muted" :src="video.video" controls object-fit="fill" />
    </view>
    <view class="download" @click="handleDownload">
      <view class="download_btn">下载高清</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      video: {},
      muted: false
    };
  },
  onLoad() {
    const { video } = getApp().globalData;
    this.video = video;
  },

  methods: {
    handleMuted() {
      this.muted = !this.muted;
    },

    // 下载视频
    async handleDownload() {
      await uni.showLoading({
        title: "下载中"
      });
      const { tempFilePath } = (
        await uni.downloadFile({ url: this.video.video })
      )[1];

      await uni.saveImageToPhotosAlbum({
        filePath: tempFilePath
      });
      uni.hideLoading();
      await uni.showToast({
        title: "下载成功",
        icon: "success"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.play_container {
  position: relative;
  .play_bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    filter: blur(20px);
  }
  .icon {
    display: flex;
    justify-content: flex-end;
    height: 80rpx;

    .iconfont {
      background: rgba(0, 0, 0, 0.3);
      width: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 50rpx;
    }
    .iconzhuanfa {
      position: relative;
      .share_btn {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
  .video_wrap {
    display: flex;
    justify-content: center;
    .player {
      width: 360rpx;
      height: 600rpx;
    }
  }
  .download {
    width: 360rpx;
    margin: 20rpx auto;
    height: 90rpx;
    .download_btn {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid #fff;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 34rpx;
      font-weight: 600;
      color: #fff;
      border-radius: 45rpx;
    }
  }
}
</style>
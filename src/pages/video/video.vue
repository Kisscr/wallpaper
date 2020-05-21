<template>
  <view>
    <!-- 1. 使用分段器制作tab栏 -->
    <view class="tab_control">
      <uni-segmented-control
        :current="current"
        :values="items.map((item) => item.title)"
        @clickItem="onClickItem"
        style-type="text"
        active-color="#d93373"
      ></uni-segmented-control>
    </view>

    <!-- 2. 视频预览图 -->
    <view class="video_main" v-if="current < 4">
      <scroll-view scroll-y enable-flex @scrolltolower="handleToLower" class="video_img">
        <block v-for="item in videowp" :key="item._id">
          <view class="video_item" @click="handleGoPlay(item)">
            <image mode="widthFix" :src="item.img" />
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import { getVideoData, getVideoCate } from "@/utils/video";
export default {
  data() {
    return {
      items: [
        {
          title: "推荐",
          urlObj: {
            path: "/featured",
            params: { limit: 30, skip: 0, order: "hot" }
          }
        },
        {
          title: "娱乐",
          urlObj: {
            path: "/category/59b25abbe7bce76bc834198a",
            params: { limit: 30, skip: 0, order: "new" }
          }
        },
        {
          title: "最新",
          urlObj: {
            path: "/videowp",
            params: { limit: 30, skip: 0, order: "new" }
          }
        },
        {
          title: "热门",
          urlObj: {
            path: "/videowp",
            params: { limit: 30, skip: 0, order: "hot" }
          }
        }
      ],
      current: 0,
      // 视频的数据
      videowp: [],
      // 是否还有分页数据
      hasMore: true
    };
  },

  onLoad() {
    this._getVideoData();
  },

  components: {
    uniSegmentedControl
  },

  methods: {
    // 点击tab栏时
    onClickItem(e) {
      // 1. 切换标题栏
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }

      // 2.清空当前的视频数组
      this.videowp = [];
      this._getVideoData();

      if (this.current === 4) {
        this._getVideoCate();
      }
    },

    // 页面滚动到底部
    handleToLower() {
      // 如果还有数据
      if (this.hasMore) {
        // 1. 更改当前的skip值
        this.items[this.current].urlObj.params.skip += this.items[
          this.current
        ].urlObj.params.limit;

        // 2. 发送请求获取数据
        this._getVideoData();
      } else {
        uni.showToast({
          title: "别滑啦！没有更多的视频啦~~~",
          icon: "none"
        });
        return;
      }
    },

    // 点击图片跳转到视频播放页面，并将当前视频的信息存储到全局变量中
    handleGoPlay(item) {
      // 存储数据
      getApp().globalData.video = item;
      // 跳转页面
      uni.navigateTo({
        url: "/pages/videoPlay/videoPlay"
      });
    },

    // 请求视频数据的方法
    async _getVideoData() {
      const res = await getVideoData({
        path: this.items[this.current].urlObj.path,
        data: this.items[this.current].urlObj.params
      });
      if (!res.res.videowp.length) {
        this.hasMore = false;
        uni.showToast({
          title: "别滑啦！没有更多的视频啦~~~",
          icon: "none"
        });
        return;
      }
      this.videowp = [...this.videowp, ...res.res.videowp];
    },

    // 获取视频分类的方法
    async _getVideoCate() {
      const res = await getVideoCate();
      console.log(res);
    },

    onShareAppMessage() {
        
    }
  }
};
</script>

<style lang="scss" scoped>
.tab_control {
  width: 70%;
  margin: 0 auto;
  padding: 10rpx 0;
}

.video_img {
  height: calc(100vh - 36px);
  display: flex;
  flex-wrap: wrap;
  .video_item {
    width: 33.33%;
    border: 5rpx solid #fff;
  }
}
</style>
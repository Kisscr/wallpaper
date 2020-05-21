<template>
  <view class="album_container">
    <!-- 1. 专辑封面 -->
    <view class="album_cover">
      <image mode="widthFix" class="img" :src="album.lcover" />
      <view class="album_title">
        <view class="album_name">{{ album.name }}</view>
        <view class="album_follow">关注专辑</view>
      </view>
    </view>
    <!-- 2. 作者信息 -->
    <view class="album_author">
      <view class="user_info">
        <image class="user_img" :src="album.user.avatar" />
        <view class="user_name">{{ album.user.name }}</view>
      </view>
      <view class="album_desc">
        <text>{{album.desc}}</text>
      </view>
    </view>
    <!-- 3. 专辑图片列表 -->
    <view class="album_list">
      <block v-for="(item, index) in wallpaper" :key="item.id">
        <view class="img_wrap">
          <go-details :list="wallpaper" :index="index" class="go_details">
            <image
              class="img"
              :src="item.thumb + item.rule.replace('$<Height>', 360)"
              mode="aspectFill"
            />
          </go-details>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { getAlbumDetails } from "../../utils/home";
import goDetails from "../../components/goDetails/goDetails";

export default {
  data() {
    return {
      params: {
        limit: 15,
        order: "new",
        skip: 0,
        first: 1
      },
      id: -1,
      // 专辑详情
      album: {},
      // 专辑图片数组
      wallpaper: [],
      // 是否还有数据
      hasMore: true
    };
  },

  components: {
    goDetails
  },

  onLoad(options) {
    this.id = options.id;
    // this.id = "5d5f8e45e7bce75ae7fb8278";
    this._getAlbumDetails();
  },

  // 触底事件
  onReachBottom() {
    if (this.hasMore) {
      this.params.first = 0;
      this.params.skip += this.params.limit;
      this._getAlbumDetails();
    } else {
      uni.showToast({
        title: "没有更多的图片啦~~~",
        icon: "none"
      });
    }
  },

  methods: {
    async _getAlbumDetails() {
      const res = await getAlbumDetails({
        id: this.id,
        data: this.params
      });
      // console.log(res)
      if (this.params.skip === 0) {
        this.album = res.res.album;
      }

      // 如果分页没有数据了
      if (res.res.wallpaper.length === 0) {
        this.hasMore = false;
        uni.showToast({
          title: "没有更多的图片啦~~~",
          icon: "none"
        });
      }
      this.wallpaper = [...this.wallpaper, ...res.res.wallpaper];
    }
  }
};
</script>

<style lang="scss" scoped>
// 专辑封面部分
.album_container {
  padding-bottom: 30rpx;
}

.album_cover {
  position: relative;

  .album_title {
    position: absolute;
    left: 0;
    bottom: 20rpx;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20rpx;

    .album_name {
      color: #fff;
      font-size: 40rpx;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .album_follow {
      background-color: $theme-color;
      color: #fff;
      width: 150rpx;
      height: 70rpx;
      border-radius: 10rpx;
      font-size: 30rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

// 作者信息
.album_author {
  padding: 20rpx;

  .user_info {
    display: flex;
    align-items: center;

    .user_img {
      width: 80rpx;
      height: 80rpx;
    }

    .user_name {
      color: #000;
      font-size: 30rpx;
      padding-left: 20rpx;
    }
  }

  .album_desc {
    padding: 20rpx 0;
  }
}

// 专辑图片列表
.album_list {
  display: flex;
  flex-wrap: wrap;

  .img_wrap {
    width: 33.33%;
    height: 240rpx;
    border: 2rpx solid #fff;

    .img {
      width: 100%;
      height: 240rpx;
    }
  }
}
</style>

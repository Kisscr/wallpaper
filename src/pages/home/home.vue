<template>
  <view class="tab_container">
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
    <!-- 2. 分段器内容部分 -->
    <view class="content">
      <view v-if="current === 0">
        <home-recommend :recommend="homeRecommend"></home-recommend>
      </view>
      <view v-if="current === 1">
        <home-cate></home-cate>
      </view>
      <view v-if="current === 2">
        <home-album></home-album>
      </view>
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import homeRecommend from "./homeRecommend/homeRecommend";
import homeCate from "./homeCate/homeCate";
import homeNew from "./homeNew/homeNew";
import homeAlbum from "./homeAlbum/homeAlbum";

export default {
  data() {
    return {
      items: [
        {
          title: "推荐"
        },
        {
          title: "分类"
        },
        {
          title: "专辑"
        }
      ],
      current: 0
    };
  },

  components: {
    uniSegmentedControl,
    homeRecommend,
    homeCate,
    homeNew,
    homeAlbum
  },

  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },

    onShareAppMessage() {
        
    }
  }
};
</script>

<style lang="scss" scoped>
.tab_container {
  .tab_control {
    width: 70%;
    margin: 0 auto;
    padding: 10rpx 0;
  }
}
</style>

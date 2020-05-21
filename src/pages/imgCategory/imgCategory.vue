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
    <!-- 2. 图片部分 -->
    <scroll-view
      scroll-y
      enable-flex
      @scrolltolower="handleToLower"
      scroll-top="scrollTop"
      class="img_container"
    >
      <block v-for="(item, index) in vertical" :key="item.id">
        <view class="img_item">
          <goDetails :list="vertical" :index="index">
            <image class="img" :src="item.thumb" mode="widthFix" />
          </goDetails>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
import { getImgCategory } from "@/utils/home";
import goDetails from "@/components/goDetails/goDetails";
export default {
  data() {
    return {
      items: [
        { title: "最新", order: "new" },
        { title: "热门", order: "hot" }
      ],
      current: 0,
      params: {
        limit: 30,
        skip: 0,
        order: "new"
      },
      id: -1,
      // 图片数组
      vertical: [],
      // 是否还有图片
      hasMoreImg: true,
      // 滚动条的距离
      scrollTop: 0
    };
  },

  components: {
    uniSegmentedControl,
    goDetails
  },

  onLoad(option) {
    this.id = option.id;
    this._getImgCategory();
  },

  methods: {
    // 点击tab栏
    onClickItem(e) {
      // 1. 点击切换tab栏标题
      // console.log(e)
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      } else {
        // 如果点击了同一个tab栏，则直接返回
        return;
      }
      // 2. 切换图片分类
      this.params.order = this.items[e.currentIndex].order;
      this.params.skip = 0;
      // 每次切换分类重置数组
      this.vertical = [];
      this._getImgCategory();

      // 3. 将滚动条滚到最顶端
      this.scrollTop = 0;
    },

    // 滚动到页面底部
    handleToLower() {
      if (this.hasMoreImg) {
        // 滚动到底部后，改变skip的值
        this.params.skip += this.params.limit;
        this._getImgCategory();
      } else {
        uni.showToast({
          title: "没有图片啦~~~",
          icon: "none"
        });
        return;
      }
    },

    // 获取图片分类的方法
    async _getImgCategory() {
      const res = await getImgCategory({ id: this.id, data: this.params });
      // 如果数组为空，则弹出提示
      if (!res.res.vertical.length) {
        this.hasMoreImg = false;
        uni.showToast({
          title: "没有图片啦~~~",
          icon: "none"
        });
        return;
      }
      this.vertical = [...this.vertical, ...res.res.vertical];
    }
  }
};
</script>

<style lang="scss" scoped>
// 分段器
.tab_container {
  .tab_control {
    width: 50%;
    margin: 0 auto;
    padding: 10rpx 0;
  }
}

.img_container {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 92rpx);
  .img_item {
    width: 33.33%;
    border: 5rpx solid #fff;
  }
}
</style>
<template>
  <scroll-view scroll-y enable-flex class="container">
    <block v-for="item in category" :key="item.id">
      <navigator class="cate_item" :url="`/pages/imgCategory/imgCategory?id=${item.id}`">
        <image :src="item.cover" class="cate_img" mode="aspectFill" />
        <view class="cate_name">{{item.name}}</view>
      </navigator>
    </block>
  </scroll-view>
</template>

<script>
import { getCategory } from "@/utils/home";
export default {
  data() {
    return {
      category: []
    };
  },
  mounted() {
    // 设置标题
    uni.setNavigationBarTitle({
      title: "分类"
    });
    // 获取缓存中的分类数据
    const cate = uni.getStorageSync("cate");
    // 判断缓存中是否有分类的数据
    if (cate.length) {
      // 如果有数据，则直接赋值
      this.category = cate;
    } else {
      // 没有数据就调用获取分类数据的方法
      this._getCategory();
    }
  },

  methods: {
    // 获取分类数据的方法
    async _getCategory() {
      const res = await getCategory();
      this.category = res.res.category;
      // 将数据存到缓存中，就不用每次都发送请求了
      uni.setStorageSync("cate", res.res.category);
      //   console.log(this.category);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 36px);

  .cate_item {
    width: 33.33%;
    height: 240rpx;
    border: 5rpx solid #fff;
    position: relative;
    .cate_img {
      height: 100%;
    }
    .cate_name {
      position: absolute;
      width: 100%;
      height: 50rpx;
      bottom: 0;
      left: 0;
      padding-left: 20rpx;
      color: #fff;
      font-size: 36rpx;
      font-weight: 500;
      background-image: linear-gradient(to right top,rgba(0,0,0,.2), rgba(0,0,0,0));
    }
  }
}
</style>

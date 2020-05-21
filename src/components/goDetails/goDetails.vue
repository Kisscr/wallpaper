<template>
  <view @click="handleClick">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    list: Array,
    index: Number
  },

  mounted() {
    // console.log(this.list);
    // console.log(this.index);
  },

  methods: {
    handleClick() {
      // 1. 将数据缓存下来
      getApp().globalData.imgList = this.list
      getApp().globalData.imgIndex = this.index

      // 2. 跳转到图片详情页面
      uni.navigateTo({
        url: '/pages/imgDetails/imgDetails?id=' + this.list[this.index].id
      })
    }
  }
};
</script>

<style></style>

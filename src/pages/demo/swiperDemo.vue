<template>
  <view class="con" @touchstart="handleTouchStart" @touchend="handleTouchEnd"></view>
</template>

<script>
export default {
  data() {
    return {
      // 手指按下的时间
      startTime: 0,
      // 开始位置
      startX: 0,
      startY: 0
    };
  },
  methods: {
    handleTouchStart(event) {
      // console.log("手指接触屏幕");
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
      this.startTime = Date.now();
    },

    handleTouchEnd(event) {
      // console.log("手指离开屏幕");
      // console.log(event.changedTouches[0].clientX);
      // console.log(event.changedTouches[0].clientY);

      const endTime = Date.now();
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;

      // 如果手指停留时间大于2秒，则直接返回，不执行下面的操作
      if (endTime - this.startTime > 2000) {
        return;
      }

      // 判断手指移动的距离，取绝对值,大于10px，则移动有效
      if (Math.abs(endX - this.startX) > 10) {
        let direction = endX - this.startX > 0 ? "right" : "left";
        console.log(direction);
      }
    }
  }
};
</script>

<style scoped>
.con {
  width: 100%;
  height: 500rpx;
  background-color: pink;
}
</style>
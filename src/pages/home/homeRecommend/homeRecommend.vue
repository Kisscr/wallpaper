<template>
  <scroll-view @scrolltolower="handleToLower" class="container" scroll-y v-if="recommend.length">
    <!-- 1. 推荐头部区域 -->
    <view class="recommend_wrap">
      <block v-for="item in recommend" :key="item.id">
        <navigator
          class="recommend_item"
          :url="`/pages/album-details/album-details?id=${item.target}`"
        >
          <image class="recommend_img" :src="item.thumb" mode="widthFix" />
        </navigator>
      </block>
    </view>

    <!-- 2. 月份列表 -->
    <view class="month_wrap">
      <view class="month_left">
        <view class="months">
          <text class="day">{{ month.DD }}</text>
          <text class="month">/ {{ month.MM }}月</text>
        </view>
        <view class="month_title">{{ month.title }}</view>
      </view>
      <view class="month_right">
        <text class="more">更多</text>
        <text class="iconfont iconiconfontjiantou4"></text>
      </view>
    </view>
    <!-- 每日图片 -->
    <view class="today_img">
      <block v-for="(item, index) in monthImg" :key="item.id">
        <view class="img_wrap">
          <go-details :list="monthImg" :index="index">
            <image mode="aspectFill" class="img" :src="item.imgUrl" />
          </go-details>
        </view>
      </block>
    </view>

    <!-- 3. 热门列表 -->
    <view class="hot">
      <view class="hot_title">热门</view>
      <view class="hot_container">
        <block v-for="(item, index) in hots" :key="index">
          <view class="hot_item">
            <go-details :list="hots" :index="index">
              <image class="hot_img" mode="widthFix" :src="item.thumb" />
            </go-details>
          </view>
        </block>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { getHomeData } from "../../../utils/home";
import moment from "moment";
import goDetails from "../../../components/goDetails/goDetails";

export default {
  data() {
    return {
      // 推荐数据
      recommend: [],
      // 时间和标题对象
      month: {},
      // 每日图片精选数据
      monthImg: [],
      // 热门数据
      hots: [],
      // 请求参数
      params: {
        limit: 30,
        order: "hot",
        skip: 0
      }
    };
  },

  components: {
    goDetails
  },

  mounted() {
    this._getHomeData();
    uni.setNavigationBarTitle({
      title: "首页"
    });
  },

  methods: {
    // 获取首页数据的方法
    _getHomeData() {
      getHomeData({
        data: this.params
      }).then(res => {
        // 当skip值为0时，说明是第一次发送请求，需要请求所有数据，否则只用请求热门数据即可
        if (this.params.skip === 0) {
          // 获取推荐区域数据
          this.recommend = res.res.homepage[1].items;
          // 使用moment.js对时间进行格式化
          this.month.MM = moment(res.res.homepage[2].stime).format("MM");
          this.month.DD = moment(res.res.homepage[2].stime).format("DD");
          this.month.title = res.res.homepage[2].title;
          // 获取每日图片数据
          this.monthImg = res.res.homepage[2].items;
          this.monthImg.map(item => {
            item.imgUrl = (item.thumb + item.rule).replace("$<Height>", 360);
          });
        }
        // 获取热门数据
        this.hots = [...this.hots, ...res.res.vertical];
      });
    },

    // 滚动条触底事件
    handleToLower() {
      // 每次触底则跳过30条数据
      this.params.skip += this.params.limit;
      this._getHomeData(this.params);
    }
  }
};
</script>

<style lang="scss" scoped>
// 1. 推荐头部区域
.recommend_wrap {
  display: flex;
  flex-wrap: wrap;

  .recommend_item {
    width: 50%;
    border: 5rpx solid #fff;
    box-sizing: border-box;

    .recommend_img {
      width: 100%;
    }
  }
}

// 2. 月份部分
.container {
  height: calc(100vh - 36px);
}

.month_wrap {
  margin-top: 15rpx;
  display: flex;
  justify-content: space-between;

  .month_left {
    flex: 1;
    display: flex;
    padding: 20rpx;
    font-weight: 700;

    .months {
      color: $theme-color;

      .day {
        font-size: 36rpx;
      }

      .month {
        font-size: 30rpx;
      }
    }

    .month_title {
      padding-left: 20rpx;
      font-size: 34rpx;
      color: #666;
    }
  }

  .month_right {
    color: #666;
    padding: 20rpx;
    font-weight: 700;

    .iconfont {
      font-size: 20rpx;
    }
  }
}

.today_img {
  display: flex;
  flex-wrap: wrap;

  .img_wrap {
    width: 33.33%;
    border: 5rpx solid #fff;
  }
}

// 3. 热门部分
.hot {
  .hot_title {
    padding: 5rpx;
    padding-left: 15rpx;
    margin: 15rpx;
    border-left: 20rpx solid $theme-color;
    font-size: 36rpx;
    font-weight: 700;
  }

  .hot_container {
    display: flex;
    flex-wrap: wrap;

    .hot_item {
      width: 33.33%;
      border: 3rpx solid #fff;
    }
  }
}
</style>

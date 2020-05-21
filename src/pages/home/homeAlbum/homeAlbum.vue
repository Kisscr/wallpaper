<template>
    <scroll-view class="container" scroll-y @scrolltolower="handleToLower">
        <!-- 1. 轮播图部分 -->
        <swiper
            indicator-dots
            indicator-active-color="#d93373"
            autoplay
            circular
        >
            <block v-for="item in banner" :key="item.id">
                <swiper-item class="swiper_wrap">
                    <image
                        class="swiper_img"
                        :src="item.thumb"
                        mode="widthFix"
                    ></image>
                </swiper-item>
            </block>
        </swiper>

        <!-- 2. 专辑列表部分 -->
        <view class="album">
            <block v-for="item in album" :key="item.id">
                <navigator
                    class="album_wrap"
                    :url="`/pages/album-details/album-details?id=${item.id}`"
                >
                    <view class="album_img">
                        <image
                            class="img"
                            :src="item.cover"
                            mode="aspectFill"
                        ></image>
                    </view>
                    <view class="album_content">
                        <view class="album_name">{{ item.name }}</view>
                        <view class="album_desc">{{ item.desc }}</view>
                        <view class="btn">
                            <text class="follow">+ 关注</text>
                        </view>
                    </view>
                </navigator>
            </block>
        </view>
    </scroll-view>
</template>

<script>
import { getAlbumData } from "../../../utils/home";

export default {
    data() {
        return {
            // 请求的参数
            params: {
                limit: 30,
                order: "new",
                skip: 0,
            },
            // 轮播图数据
            banner: [],
            // 专辑数据
            album: [],
            // 是否有分页数据
            hasMore: true,
        };
    },
    mounted() {
        uni.setNavigationBarTitle({
            title: "专辑",
        });

        this._getAlbumData();
    },

    methods: {
        // 获取专辑数据的方法
        async _getAlbumData() {
            const res = await getAlbumData({ data: this.params });
            console.log(res.res);

            if (this.banner.length === 0) {
                this.banner = res.res.banner;
            }
            if (res.res.album.length === 0) {
                this.hasMore = false;
                return;
            }
            this.album = [...this.album, ...res.res.album];
        },

        // 触底事件
        handleToLower() {
            if (this.hasMore) {
                this.params.skip += this.params.limit;
                this._getAlbumData(this.params);
            } else {
                uni.showToast({
                    title: "没有更多的数据啦",
                    icon: "none",
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.container {
    height: calc(100vh - 72rpx);
}

// 轮播图 原图比例 640*284
.swiper_wrap {
    height: 375rpx * (640/284);
}

// 专辑列表
.album {
    .album_wrap {
        display: flex;
        padding: 10rpx;
        .album_img {
            flex: 1;
            width: 200rpx;
            height: 200rpx;
            .img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .album_content {
        flex: 2;
        padding: 10rpx 20rpx;
        overflow: hidden;
        .album_name {
            color: #000;
            font-size: 32rpx;
            padding: 10rpx 0;
        }
        .album_desc {
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .btn {
        display: flex;
        justify-content: flex-end;
        .follow {
            margin-top: 30rpx;
            padding: 5rpx 10rpx;
            color: $theme-color;
            border: 2rpx solid currentColor;
        }
    }
}
</style>

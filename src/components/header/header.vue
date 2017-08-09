<template>
  <div>
    <div class="header">
      <div class="content-wrapper">
        <!-- 头像 -->
        <div class="avatar">
          <img width="64" height="64" :src="seller.avatar">
        </div>
        <!-- name/description/support -->
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div class="support" v-if="seller.supports">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div class="support-count" v-if="seller.supports" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <!-- 公告栏 -->
      <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <!-- 底部背景图片 -->
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%" />
      </div>
      <!-- 浮层 -->
      <transition name="fade">
        <div v-show="detailShow" class="detail">
          <div class="detail-wrapper clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <!-- 评分组件 -->
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"></star>
              </div>

              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="supports" v-if="seller.supports">
                <li class="support-item" v-for="(item,index) in seller.supports">
                  <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                  <span class="text">{{seller.supports[index].description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideDetail">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import star from '../star/star';

  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  @import "../../common/stylus/mixin.styl";

  .header{
    position: relative;
    color:#fff;
    background: rgba(1,17,27,0.5);
    overflow: hidden;
  }
  .content-wrapper{
    position: relative;
    font-size:0;
    font-weight:bold;
    padding:24px 12px 18px 24px
  }
  .avatar{
    display:inline-block;
    vertical-align: top;
  }
  .avatar img{
    border-radius: 2px;
  }
  .content-wrapper .content{
    display:inline-block;
    font-size:14px;
    margin-left:16px
  }
  .title{
    margin:2px 0 8px 0
  }
  .brand{
    display:inline-block;
    vertical-align: top;
    width:30px;
    height:18px;
    bg-image('brand');
    background-size:30px 18px;
    background-repeat:no-repeat
  }
  .name{
    margin-left:6px;
    font-size:16px;
    line-height:18px;
  }
  .star-wrapper{
    margin-top: 18px;
    text-align: center;
    padding: 2px 0;
  }
  .description{
    margin-bottom: 10px;
    line-height: 12px;
    font-size: 12px;
  }
  .support .icon{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 4px;
    background-size: 12px;
    background-repeat: no-repeat;
  }
  .support .decrease{
    bg-image('decrease_1')
  }
  .support .discount{
    bg-image('discount_1')
  }
  .support .guarantee{
    bg-image('guarantee_1')
  }
  .support .invoice{
    bg-image('invoice_1')
  }
  .support .special{
    bg-image('special_1')
  }
  .support .text{
    line-height: 12px;
    vertical-align: top;
    font-size: 12px;
  }
  .support-count{
    position: absolute;
    right:12px;
    bottom:14px;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    border-radius: 14px;
    background-color: rgba(0,0,0,0.2);
    text-align: center;
  }
  .support-count .count{
    vertical-align: top;
    font-size: 10px;
  }
  .support-count .icon-keyboard_arrow_right{
    margin-left: 2px;
    line-height: 24px;
    font-size: 10px;
  }
  .bulletin-wrapper{
    position: relative;
    height: 28px;
    line-height: 28px;
    padding:0 22px 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(7,17,27,0.2);
  }
  .bulletin-title{
    display: inline-block;
    vertical-align: top;
    margin-top: 8.5px;
    width: 22px;
    height: 12px;
    bg-image('bulletin');
    background-size: 22px 12px;
    background-repeat: no-repeat;
  }
  .bulletin-text{
    margin: 0 4px;
    font-size: 12px;
  }
  .bulletin-wrapper .icon-keyboard_arrow_right{
    position: absolute;
    font-size: 12px;
    right:12px;
    top:10px;
  }
  .background{
    position:absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter:blur(10px);
  }
  .detail{
    position: fixed;
    z-index: 100;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7,17,27,0.8);
    backdrop-filter: blur(10px);
  }
  .fade-enter-active,.fade-leave-active{
    transition: all 1s ease;
  }
 .fade-enter,.fade-leave-active{
    opacity: 0;
  }
  .detail-wrapper{
    width:100%;
    min-height: 100%;
  }
  .detail-main{
    margin-top: 64px;
    padding-bottom: 64px;
  }
  .detail-main .name{
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
  }
  .detail-main .title{
    display: flex;
    width: 80%;
    margin: 28px auto 24px auto;
  }
  .detail-main .title .line{
    flex:1;
    position: relative;
    top:-6px;
    border-bottom:1px solid rgba(255,255,255,0.2);
  }
  .detail-main .title .text{
    padding: 0 12px;
    font-weight: 700;
    font-size: 14px;
  }
  .detail-main .supports{
    width:80%;
    margin: 0 auto;
  }
  .detail-main .supports .support-item{
    padding:0 12px;
    margin-bottom: 12px;
    font-size: 0;
  }
  .detail-main .supports .support-item:last-child{
    margin-bottom: 0;
  }
  .detail-main .supports .support-item .icon{
    display: inline-block;
    width:16px;
    height: 16px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 16px;
    background-repeat: no-repeat;
  }
  .detail-main .supports .support-item .decrease{
    bg-image('decrease_2')
  }
  .detail-main .supports .support-item .discount{
    bg-image('discount_2')
  }
  .detail-main .supports .support-item .guarantee{
    bg-image('guarantee_2')
  }
  .detail-main .supports .support-item .invoice{
    bg-image('invoice_2')
  }
  .detail-main .supports .support-item .special{
    bg-image('special_2')
  }
  .detail-main .supports .support-item .text{
    line-height: 16px;
    font-size: 12px;
  }
  .detail-main .bulletin{
    width:80%;
    margin: 0 auto;
  }
  .detail-main .bulletin .content{
    padding:0 12px;
    line-height: 24px;
    font-size: 12px;
  }
  .detail-close{
    position: relative;
    width:32px;
    height: 32px;
    margin: -64px auto 0 auto;
    clear: both;
    font-size: 32px;
  }
</style>

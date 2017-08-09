<template>
  <transition name="rightMove">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-countent">
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fadeBuy">
            <div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @selectType="ratingType" @toggle="contentToggle" :selec-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px" v-for="rating in food.ratings">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </div>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import {formatDate} from '../../common/js/date';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import split from '../split/split';
  import ratingselect from '../ratingselect/ratingselect';

//  const POSITIVE = 0;
//  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('cartFirst', event.target);
        Vue.set(this.food, 'count', 1);
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      ratingType(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      contentToggle() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  @import "../../common/stylus/mixin.styl";

  .food{
    position: fixed;
    top:0;
    left:0;
    bottom:46px;
    z-index:30;
    width:100%;
    background: #fff;
  }
  .rightMove-enter-active,.rightMove-leave-active{
    transition: all 0.4s ease;
  }
  .rightMove-enter,.rightMove-leave-active{
    opacity: 0;
    transform: translate3d(100%,0,0);
  }
  .image-header{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
  }
  .image-header img{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left: 0;
  }
  .back{
    position: absolute;
    left:0;
    top:10px;
  }
  .back .icon-arrow_lift{
    display: block;
    padding: 10px;
    font-size: 20px;
    color: #fff;
  }
  .content{
    padding: 18px;
    position: relative;
  }
  .title{
    line-height: 14px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 700;
    color: rgb(7,17,27);
  }
  .detail{
    margin-bottom: 18px;
    line-height: 10px;
    font-size: 0;
  }
  .sell-count,.rating{
    font-size: 10px;
    color:rgb(147,153,159);
  }
  .sell-count{
    margin-right: 12px;
  }
  .food-item .content .price{
    font-weight: 700;
    line-height: 24px;
  }
  .content .price .now{
    margin-right: 8px;
    font-size: 14px;
    color: rgb(240,153,159);
  }
  .content .price .old{
    text-decoration: line-through;
    font-size: 10px;
    color:rgb(147,153,159);
  }
  .cartcontrol-wrapper{
    position: absolute;
    right: 12px;
    bottom:12px;
  }
  .buy{
    position: absolute;
    right: 18px;
    bottom:18px;
    z-index: 10;
    height: 26px;
    line-height: 26px;
    padding: 0 12px;
    box-sizing: border-box;
    font-size: 10px;
    background: rgb(0,160,220);
    border-radius: 12px;
  }
  .fadeBuy-enter-active,.fadeBuy-leave-active{
    transition: all 0.4s ease;
  }
  .fadeBuy-enter,.fadeBuy-leave-active{
    opacity: 0;
  }
  .info{
    padding:18px;

  }
  .info .title{
    line-height: 14px;
    margin-bottom: 6px;
    font-size: 14px;
    color: rgb(7,17,27);
  }
  .info .text{
    line-height: 24px;
    padding: 0 8px;
    font-size: 12px;
    color:rgb(77,85,93);
  }
  .rating{
    padding-top: 18px;
  }
  .rating .title{
    line-height: 14px;
    margin-left: 18px;
  }
  .rating-wrapper{
    padding: 0 18px;
  }
  .rating-wrapper .rating-item{
    position: relative;
    padding: 16px 0;
    border-1px(rgba(7,17,27,0.1));
  }
  .rating-item .user{
    position: absolute;
    right:0;
    top:16px;
    line-height: 12px;
    font-size: 0;
  }
  .rating-item .user .name{
    display: inline-block;
    vertical-align: top;
    font-size: 10px;
    margin-right: 4px;
    color:rgb(147,153,159);
  }
  .rating-item .user .avatar{
    border-radius: 50%;
  }
  .rating-item .time{
    margin-bottom: 6px;
    line-height: 12px;
    font-size: 10px;
    color:rgb(147,153,159);
  }
  .rating-item .text{
    line-height: 16px;
    font-size: 12px;
    color:rgb(7,17,27);
  }
  .text .icon-thumb_up,.text .icon-thumb_down{
    margin-right: 4px;
    line-height: 16px;
    font-size: 12px;
  }
  .text .icon-thumb_up{
    color:rgb(0,160,220);
  }
  .text .icon-thumb_down{
    color:rgb(147,153,159);
  }
  .no-rating{
    padding: 16px 0;
    font-size: 12px;
    color:rgb(147,153,159);
  }
</style>

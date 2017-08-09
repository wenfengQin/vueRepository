<template>
  <div class="shopCart">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight:totalCount>0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight:totalPrice>0}">{{totalPrice}}元</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <!-- 下落的小球 -->
    <div class="ball-container">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <!-- 购物车清单 -->
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food border-1px" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">

  import BScroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol';

  export default {
    props: {
      // 接收传过来的选中的商品
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        // 小球下落初始
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        // 已下落的小球
        dropBalls: [],
        // 购物车折叠状态
        fold: true
      };
    },
    computed: {
      // 添加到购物车中的商品总价
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      // 添加到购物车中的商品总数
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      // 根据总价与起送价的差异来显示描述
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      // 根据总价与起送价的差异来显示样式
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      // 绑定购物车的v-show
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      // 购物车时候显示
      toggleList() {
        if (!this.totalCount) {
          return;
        } else {
          this.fold = !this.fold;
        }
      },
      // 清空购物车
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert('去支付');
      },
      // 小球下落动画
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 小球开始下落动画
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 22;
            let y = -(window.innerHeight - rect.top - 32);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      // 小球下落中动画
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.display = '';
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      // 小球下落完成动画
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  @import "../../common/stylus/mixin.styl";

  .shopCart{
    position: fixed;
    left:0;
    bottom:0;
    z-index: 50;
    width: 100%;
    height: 46px;
  }
  .shopCart .content{
    display: flex;
    background: #141d27;
    font-size: 0;
    color:rgba(255,255,255,0.4);
  }
  .content .content-left{
    flex: 1;
  }
  .content-left .logo-wrapper{
    display: inline-block;
    position: relative;
    top:-10px;
    margin: 0 12px;
    padding: 6px;
    width: 56px;
    height: 56px;
    box-sizing: border-box;
    vertical-align: top;
    border-radius: 50%;
    background: #141d27;
  }
  .logo-wrapper .logo{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #2b343c;
    text-align: center;
  }
  .logo-wrapper .highlight{
    background: rgb(0,160,220);
  }
  .logo-wrapper .logo .icon-shopping_cart{
    line-height: 44px;
    font-size: 24px;
    color: #80858a;
  }
  .logo-wrapper .highlight .icon-shopping_cart{
    color: #fff;
  }
  .logo-wrapper .num{
    position: absolute;
    top:0;
    right: 0;
    height: 16px;
    line-height: 16px;
    width: 24px;
    text-align: center;
    border-radius: 16px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: #f00;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
  }
  .content-left .price{
    display: inline-block;
    vertical-align: top;
    margin-top: 12px;
    line-height: 24px;
    padding-right: 12px;
    box-sizing: border-box;
    border-right:1px solid rgba(255,255,255,0.1);
    font-size: 14px;
    font-weight: 700;
  }
  .content-left .highlight{
    color:#fff;
  }
  .content-left .desc{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    font-weight: 700;
    margin: 12px 0 0 12px;
    line-height: 24px;
  }
  .content .content-right{
    flex: 0 0 105px;
    width: 105px;
  }
  .content-right .pay{
    height:46px;
    line-height: 46px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    background: #2b333b;
  }
  .content-right .not-enough{
    background: #2b333b;
  }
  .content-right .enough{
    background: #00b43c;
    color:#fff;
  }
  .ball-container .ball{
    position: fixed;
    left:32px;
    bottom: 22px;
    z-index: 200;
    transition: all 0.4s cubic-bezier(0.68,-0.55,1,0.75);
  }
  .ball-container .inner{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgb(0,160,220);
    transition: all 0.4s linear;
  }
  .shopcart-list{
    position: absolute;
    bottom: 46px;
    left:0;
    z-index: -1;
    width:100%;
  }
  .fold-enter-active,.fold-leave-active{
    transition: all 0.5s linear;
  }
  .fold-enter,.fold-leave-active{
    opacity: 0;
    bottom:-100%;
  }
  .shopcart-list .list-header{
    height: 40px;
    line-height: 40px;
    padding: 0 18px;
    background: #f3f5f7;
    border-bottom:1px solid rgba(7,17,27,0.1);
  }
  .list-header .title{
    float:left;
    font-size: 14px;
    color:rgb(7,17,27);
    margin: 0;
  }
  .list-header .empty{
    float:right;
    font-size: 12px;
    color: rgb(0,160,220);
  }
  .list-content{
    padding: 0 18px;
    max-height: 217px;
    background: #fff;
    overflow: hidden;
  }
  .list-content .food{
    position: relative;
    padding: 12px 0;
    box-sizing: border-box;
    border-1px(rgba(7,17,27,0.2))
  }
  .list-content .food .name{
    line-height: 24px;
    font-size: 14px;
    color:rgb(7,17,27);
  }
  .list-content .food .price{
    position: absolute;
    right:90px;
    bottom:12px;
    line-height: 24px;
    font-size: 14px;
    font-weight: 700;
    color:rgb(240,20,20);
  }
  .list-content .food .cartcontrol-wrapper{
    position: absolute;
    right: 0;
    bottom:6px;
  }
  .list-mask{
    position: fixed;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    z-index: -2;
    background: rgba(7,17,27,0.6);
    backdrop-filter: blur(10px);
  }
</style>

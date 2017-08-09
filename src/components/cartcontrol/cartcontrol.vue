<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart($event)">
        <i class="inner icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add" @click="addCart($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {},
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        console.log(event.target);
        // 把选中的元素返回给父组件
        this.$emit('cart', event.target);
      },
      decreaseCart() {
        // 判断事件是否自己定义的，如果不是跳过
        if (!event._constructed) {
          return;
        }
        if (this.food.count > 0) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .cartcontrol{
    font-size: 0;
  }
  .cartcontrol .cart-decrease{
    display: inline-block;
    padding: 6px;
  }
  .cartcontrol .inner{
    display: inline-block;
    font-size: 24px;
    line-height: 24px;
    color:rgb(0,160,220);
  }
  .move-enter-active,.move-leave-active{
    transition: all 0.5s linear;
  }
  .move-enter,.move-leave-active{
    opacity: 0;
    transform: translate3D(24px,0,0);
  }
  .inner-enter-active,.inner-leave-active{
    transition: all 0.5s linear;
  }
  .inner-enter,.inner-leave-active{
    opacity: 0;
    transform: rotate(180deg);
  }
  .cartcontrol .cart-count{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147,153,159);
  }
  .cartcontrol .cart-add{
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    line-height: 24px;
    color:rgb(0,160,220);
  }
</style>

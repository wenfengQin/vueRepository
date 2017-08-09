<template>
  <div class="goods">
    <!-- 左栏菜单布局 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <span v-show="item.type>0" :class="classMap[item.type]" class="icon"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 右栏商品布局 -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px">
              <div class="icon" @click="selectFood(food, $event)">
                <img :src="food.icon" width="57" height="57" />
              </div>
              <div class="content">
                <h2 class="name" @click="selectFood(food, $event)">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart="_drop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopCart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>
    <food :food="selectedFood" ref="food" @cartFirst="_drop"></food>
  </div>
</template>

<script type="text/ecmascript-6">

  import BScroll from 'better-scroll';
  import shopCart from '../shopCart/shopCart';
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      // 计算右侧商品栏滑过的距离来对应左侧菜单栏的样式
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      // 选中的商品
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calulateHeight();
          });
        }
      });
    },
    methods: {
      // 点击左侧菜单栏，右侧商品栏滑动到对应位置
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      // 初始化左右栏的滚动，并拿到右侧栏滚过的距离进行监听
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // 计算每一类商品栏的高度
      _calulateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _drop(target) {
        // 体验优化，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopCart.drop(target);
        });
      }
    },
    components: {
      shopCart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

  @import "../../common/stylus/mixin.styl";

  .goods{
    display: flex;
    position: absolute;
    top:174px;
    bottom:46px;
    width: 100%;
    overflow: hidden;
  }
  .menu-wrapper{
    flex:0 0 80px;
    width: 80px;
    background: #f3f5f7;
  }
  .menu-item{
    display: table;
    height: 54px;
    width: 56px;
    padding: 0 12px 0 12px;
    line-height: 14px;
  }
  .menu-item .icon{
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    background-size: 12px;
    background-repeat: no-repeat;
  }
  .menu-item .decrease{
    bg-image('decrease_3')
  }
  .menu-item .discount{
    bg-image('discount_3')
  }
  .menu-item .guarantee{
    bg-image('guarantee_3')
  }
  .menu-item .invoice{
    bg-image('invoice_3')
  }
  .menu-item .special{
    bg-image('special_3')
  }
  .menu-item .text{
    display: table-cell;
    font-size: 12px;
    width: 56px;
    vertical-align: middle;
    border-1px(rgba(0,0,0,1));
  }
  .current{
    position: relative;
    margin-top: -1px;
    z-index: 10;
    background: #fff;
    font-weight: 700;
  }
  .current .text{
    border-none();
  }
  .foods-wrapper{
    flex: 1;
  }
  .foods-wrapper .title{
    padding-left: 14px;
    height: 26px;
    line-height: 26px;
    border-left:2px solid #d9dde1;
    color:rgb(147,153,159);
    background: #f3f5f7;
  }
  .foods-wrapper .food-item{
    display: flex;
    margin: 18px;
    padding-bottom: 18px;
    border-1px(rgba(7,17,27,0.1));
  }
  .foods-wrapper .food-item:last-child{
    border-none();
    /*padding-bottom: 0;*/
  }
  .food-item .icon{
    flex: 0 0 57px;
    margin-right: 10px;
  }
  .food-item .content{
    flex: 1;
  }
  .food-item .content .name{
    margin: 2px 0 8px 0;
    /*height: 14px;*/
    line-height: 16px;
    font-size: 14px;
    color:rgb(7,17,27);
  }
  .food-item .content .desc{
    margin-bottom: 8px;
    line-height: 12px;
    font-size: 10px;
    color: rgb(147,153,159);
  }
  .food-item .content .extra{
    line-height: 12px;
    font-size: 10px;
    color: rgb(147,153,159);
  }
  .extra .count{
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
    right:0;
    bottom:12px;
  }
</style>

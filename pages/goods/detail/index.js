const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: {
            item: {}
        },
        itemNum: 1
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    onLoad(option) {
        this.goods = App.HttpResource('/goods/:id', {id: '@id'})
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    addCart(e) {
        const goods = this.data.goods.item._id
        const total = this.data.itemNum
        App.HttpService.addCartByUser(goods,total)
        .then(res => {
            const data = res.data
            console.log(data)
            if (data.meta.code == 0) {
                this.showToast(data.meta.message)
            }
        })
    },
    previewImage(e) {
        const urls = this.data.goods && this.data.goods.item.images.map(n => n.path)
        const index = e.currentTarget.dataset.index
        const current = urls[Number(index)]
        
        App.WxService.previewImage({
            current: current, 
            urls: urls, 
        })
    },
    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
    	// App.HttpService.getDetail(id)
        this.goods.getAsync({id: id})
        .then(res => {
            const data = res.data
            console.log(data)
        	if (data.meta.code == 0) {
                data.data.images.forEach(n => n.path = App.renderImage(n.path))
        		this.setData({
                    'goods.item': data.data, 
                    total: data.data.images.length, 
                })
        	}
        })
    },
    bindKeyInput(e) {
      const num = Math.abs(e.value)
      if (num < 0 || num > 100) 
        this.setData({
          itemNum: num
        })
    },
    decrease(e) {
      const num = Math.abs(e.currentTarget.dataset.value)
      if (num != 1) 
        this.setData({
          itemNum: num - 1
        })
    },
    increase(e) {
      const num = Math.abs(e.currentTarget.dataset.value)
      if (num != 100)
      this.setData ({
        itemNum: num + 1
      })
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var seperator3 = ".";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if(month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      + "T" + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds() + seperator3 + date.getMilliseconds() + "Z";
      return currentdate;
    },
    check() {
      const items = {
        item: [],
      }
      items.item.push(
        {
          //id: this.data.goods._id,
          goods: this.data.goods.item,
          amount: this.data.goods.item.price,
          totalAmount: this.data.goods.item.price * this.data.itemNum,
          create_at : this.getNowFormatDate(),
          total: this.data.itemNum
        }
      )
      App.WxService.setStorageSync('confirmOrder', items.item)
      App.WxService.navigateTo('/pages/order/confirm/index')
    }
})
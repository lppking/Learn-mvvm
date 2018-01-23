## Learn-mvvm

双向数据绑定原理解析。参考地址：https://zhuanlan.zhihu.com/p/27028242

---

双向数据绑定的功能就是通过一个中间层，将DOM与数据联系起来，当数据改变时可以自动刷新DOM，当DOM改变时可以自动刷新数据。省略这中间的人工成本。我们不需要再像以前那样在JS中手动操作DOM。

---

### Observer实现原理简析

Observer的作用就是实现对数据层的监听。我们需要当数据发生变化时我们可以实时被告知数据变化并且执行相关的操作。可以把这种手段叫做“数据劫持”。

为了能够监听（劫持）数据变化，我们可以使用[Object.defineProperty()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)方法为需要监听的数据属性添加set和get方法。

```
function observer(data) {
  if (!data || typeof data !== 'object') return;
  Object.keys(data).forEach(key => {
    observerProperty(data, key, data[key]); // 执行数据劫持操作
  })
}

function observerProperty(obj, key, val) {
  observer(val);  // 如果val还是个对象，递归调用
  Object.defineProperty(obj, key, {
    /**
     * 如果一个描述符同时有(value或writable)和(get或set)关键字,将会产生一个异常
     */
    enumerable: false,
    configurable: true,
    get: () => {    // 当获取值时触发
      return val;
    },
    set: (newVal) => {  // 当值被修改时触发
      if (val === newVal) { // 如果值没有发生变化
        return;
      }
      console.log('执行数据更新：', val, '=>', newVal);
      val = newVal;
    }
  });
}
```

如上所示的代码实现了监听数据值被修改或获取的功能。基于set和get两个方法，我们就可以在数据发生改变时通知到我们想要通知的对象（观察者）。

---

### 观察者实现原理简析

如果把数据想象成一支股票，那么观察者就是这支股票的股东。股东需要实时了解这支股票价格的变化。所以观察者对象需要包含以下几个功能：

- 可以添加观察者
- 可以删除观察者
- 可以通知所有观察者

基础代码如下所示：

```
let uid = 0;
function Dep() {
  this.id = uid++; // 每个观察者有一个唯一的id
  this.subs = []; // 存储观察者
}
Dep.prototype = {

  // 添加观察者
  addSub: (sub) => {
    this.subs.push(sub);
  },

  // 删除观察者
  removeSub: (sub) => {
    let index = this.subs.indexOf(sub); // 获取观察者在数组中的下标
    if (index !== -1) {
      this.subs.splice(index, 1); // 将观察者从数组中移除
    }
  },

  // 通知数据变更
  notify: () => {
    this.subs.forEach(sub => {  // 遍历所有观察者
      sub.update(); // 执行观察者的update方法
    });
  }
}
```



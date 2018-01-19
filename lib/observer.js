/**
 * Observer除了需要劫持数据的set和get行为
 * 还需要维护一个观察者队列，在数据发生改变时通知观察者
 */
function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  return new Observer(value); // 调用Observer，并返回一个对象
}

function Observer(value) {
  this.value = value;
  this.go(value);
}

Observer.prototype = {
  go: (obj) => {  // 数据劫持代理
    Object.keys(obj).forEach( key => {
      this.observeProperty(obj, key, obj[key]);
    });
  },
  observeProperty: (obj, key, val) => { // 数据劫持核心方法
    let dep = new Dep();  // 观察者队列
    let childOb = observe(val);
    
    Object.defineProperty(obj, key, {
      enumerable: false,
      configurable: false,
      get: () => {
        return val;
      },
      set: (newVal) => {
        if (val === newVal) return;
        childOb = observe(newVal);  // 如果newVal是一个对象，则监听其属性
        dep.notify(); // 通知观察者
      }
    })
  }
}

/**
 * 观察者 Dep
 */
let uid = 0;
function Dep() {
  this.id = uid ++; // 每个观察者有一个唯一的id
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
    this.subs.forEach(sub => {
      sub.update(); // 执行观察者的update方法
    });
  }
}

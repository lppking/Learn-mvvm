/**
 * 观察者 Dep实现原理
 */
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
    this.subs.forEach(sub => {
      sub.update(); // 执行观察者的update方法
    });
  }
}
/**
 * Observer数据劫持原理
 */
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
     * 摘自MDN
     */
    enumerable: false,
    configurable: true,
    get: () => {
      return val;
    },
    set: (newVal) => {
      if (val === newVal) { // 如果值没有发生变化
        return;
      }
      console.log('执行数据更新：', val, '=>', newVal);
      val = newVal;
    }
  });
}
/**
 * Compile实现原理
 */
function Compile (el, value) {
  this.$val = value;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);
  if (this.$el) {
    this.compileElement(this.$el);
  }
}

Compile.prototype = {
  
  // 判断是否为元素节点
  isElementNode: function isElementNode (node) {
    return node.nodeType === 1;
  },

  // 判断是否为文本节点
  isTextNode: function isTextNode (node) {
    return node.nodeType === 3;
  },

  // 判断是否包含指令
  isDirective: function isDirective (attr) {
    return attr.indexOf('x-') === 0;
  },

  // 匹配 {{ test }} 变量test
  compileText: function compileText (node, exp) {
    node.textContent = typeof this.$val[exp] === 'undefined' ? '' : this.$val[exp]; 
  },

  // 指令解析
  compile: function compile (node) {
    let nodeAttrs = node.attributes;  // 获取节点node的属性集合，类型为对象
    let self = this;

    [].slice.call(nodeAttrs).forEach( attr => {  // 返回一个包含所有属性的数组
      let attrName = attr.name; //获取属性名称，字符串
      if (self.isDirective(attrName)) { // 过滤指令
        let exp = attr.value; // 拿到指令的value值
        node.innerHTML = typeof this.$val[exp] === 'undefined' ? '' : this.$val[exp]; // 根据指令值获取相应的值插入到node节点
        node.removeAttribute(attrName); // 删除已处理的指令属性
      }
    });
  },

  // DOM解析
  compileElement: function compileElement (el) {
    let self = this;
    let childNodes = el.childNodes; // 获取子节点列表 NodeList
    [].slice.call(childNodes).forEach( node => {  // 将NodeList转为Array 
      let text = node.textContent;  // 获取文本内容(包含后代元素)
      let reg = /\{\{((?:.|\n)+?)\}\}/; // 匹配{{ test }}

      // 处理元素节点
      if (self.isElementNode(node)) {
        self.compile(node);
      }

      // 如果是文本节点
      if (self.isTextNode(node) && reg.test(text)) {
        self.compileText(node, RegExp.$1.trim()); // 获取第一个匹配项进行处理
      }

      // 如果childNodes非空，继续处理子元素
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    })
  }
}
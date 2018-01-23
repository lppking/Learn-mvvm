/**
 * Compile解析类
 */
function Compile (el, vm) {
  this.$vm = vm;
  this.$el = this.isElementNode(el) ? el : document.querySelector(el);

  if (this.$el) {
    this.$fragment = this.nodeFragment(this.$el);
    this.compileElement(this.$fragment);
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype = {
  
}
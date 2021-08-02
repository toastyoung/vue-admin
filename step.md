点击添加 增加数据 绑定点击事件 push  input
自动聚焦
input 实例ref focus方法

更新是异步的 
this.$nextTick
  内部的回调实在更新DOM之后触发

  将内部的回调添加到回调队列中 等待执行
  1.如果先更新数据 再调用$nextTick
    更新数据对应更新用户界面的方法先进队列 $nextTick的回调后进队列才能保证 更新DOM之后触发$nextTick回调

  2.如果先调用$nextTick 再更新数据 
    $nextTick的回调先进队列 更新数据对应更新用户界面的方法后进入队列
    问题:$nextTick的回调调用时 此时DOM还未更新 操作不了

  总结:$nextTick往往实在更新数据之后调用


  span input切换
  绑定双向数据 
  作用域插槽 row,$index  获取当前行
  绑定失去焦点
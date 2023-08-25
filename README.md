# v-calendar-picker

### calendar picker, with rollup, vue, scss

![display](/public/display.png)

# 功能

✅ 目前只支持范围选择  
✅ 可支持超出当前日期不可选  
✅ 点击右上角日期，日历跳转到指定位置  
[ ] 设置周起始日  
[ ] 滑动翻页  
[ ] 拓展勾选类型(选择单个、多个日期)  
[ ] typescript + Vue3

# 运行

```js
npm run dev // 可在 example/index.html 下进行开发|生产环境测试
npm run build
```

# 使用

```html
<v-calender-pick
  :exceed="true"
  title="日期"
  :value="[]"
  :isVisible="true"
  @confirm="handleConfirm"
/>
```

# API

### Props

| 参数      | 说明                               | 类型            | 默认值   |
| --------- | ---------------------------------- | --------------- | -------- |
| title     | 日期标题                           | String          | 日期选择 |
| value     | 初始化日期                         | Array（Date[]） | []       |
| isVisible | 是否展示日期组件                   | Boolean         | true     |
| exceed    | 是否可以选择超出当前时间范围的日期 | Boolean         | true     |

### Events

| 参数    | 说明                 | 回调参数      |
| ------- | -------------------- | ------------- |
| confirm | 每次点击日期都会触发 | value: Date[] |

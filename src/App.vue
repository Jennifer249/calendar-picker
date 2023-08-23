<template>
  <div class="calender-picker">
    <div class="calender-picker__custom">
      <span class="calender-picker__custom--text">自定义日期</span>
      <span class="calender-picker__custom--value">
        <span v-if="dateData.length" v-html="dateText"></span>
        <span v-else>请选择日期</span>
      </span>
    </div>
    <div class="calender-picker__header" v-if="loading">
      <div class="calender-picker__header-prev">
        <span class="calender-picker__btn calender-picker__btn-prev--year">&lt;&lt;</span>
        <span class="calender-picker__btn calender-picker__btn-prev--month">&lt;</span>
      </div>

      <div class="calender-picker__header-middle">{{ year }} 年 {{ month }} 月</div>

      <div class="calender-picker__header-next">
        <span class="calender-picker__btn calender-picker__btn-next--month">&gt;</span>
        <span class="calender-picker__btn calender-picker__btn-next--year">&gt;&gt;</span>
      </div>
    </div>
    <div class="calender-picker__body">
      <div class="calender-picker__weeks">
        <div class="calender-picker__week" v-for="i in week" :key="i">{{ i }}</div>
      </div>
      <div class="calender-picker__month" v-if="loading">
        <div :class="['calender-picker__day', i.date < i.showDate && 'prev-month', i.date > i.showDate && 'next-month']" v-for="i in monthData" :key="i.date">
          {{ i.showDate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calender-picker',
  props: {
    selectData: { // 初始化时间
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'date'
    },
    isOpen: { // 初始化面板
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      monthData: [],
      week: ['日', '一', '二', '三', '四', '五', '六'],
      year: '',
      month: '',
      start: null,
      end: null,
      dateData: [],
      loading: true
    }
  },
  watch: {
    isOpen: {
      handler(val) {
        if (val) {
          this.dateData = this.selectData
          const [startDateArr, endDateArr] = [this.dateData?.[0]?.split('-'), this.dateData?.[1]?.split('-')]
          this.start = startDateArr == null ? null : new Date(startDateArr[0], startDateArr[1] - 1, startDateArr[2])
          this.end = endDateArr == null ? null : new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2])
          this.init()
        }
      },
      immediate: true
    }
  },
  computed: {
    dateText() {
      return `<span class="start-date">${this.dateData?.[0]}${
        this.dateData?.[1] == null ? '</span>' : '</span> 至 <span class="end-date">' + this.dateData?.[1]
      }`
    }
  },
  mounted() {
    this.addEvent()
  },
  methods: {
    addEvent() {
      const $datePickerDom = document.querySelector('.calender-picker')
      $datePickerDom.addEventListener(
        'click',
        e => {
          e.stopPropagation()
          const $target = e.target
          const targetClassList = $target.classList
          if (
            (!targetClassList.contains('calender-picker__btn') &&
              !targetClassList.contains('calender-picker__day') &&
              !targetClassList.contains('start-date') &&
              !targetClassList.contains('end-date')) ||
            targetClassList.contains('calender-picker__btn--disabled') ||
            targetClassList.contains('calender-picker__day--disabled')
          ) {
            return
          }

          if (targetClassList.contains('calender-picker__btn') || targetClassList.contains('start-date') || targetClassList.contains('end-date')) {
            let fixDate = null
            if (targetClassList.contains('calender-picker__btn-prev--year')) {
              fixDate = this.fixMonthToYear(this.year - 1, this.month)
            } else if (targetClassList.contains('calender-picker__btn-prev--month')) {
              fixDate = this.fixMonthToYear(this.year, this.month - 1)
            } else if (targetClassList.contains('calender-picker__btn-next--month')) {
              fixDate = this.fixMonthToYear(this.year, this.month + 1)
            } else if (targetClassList.contains('calender-picker__btn-next--year')) {
              fixDate = this.fixMonthToYear(this.year + 1, this.month)
            } else {
              // 点击日期跳转到对应日期
              const dateArr = $target.innerHTML.split('-')
              fixDate = this.fixMonthToYear(+dateArr[0], +dateArr[1])
            }
            this.setMonthDate(fixDate.year, fixDate.month)
          } else if (targetClassList.contains('calender-picker__day')) {
            const dayType = this.judgeDayType(targetClassList)
            // 设置日期开始和结束时间，并返回设置的状态
            this.setStartEndDate(dayType, $target)
            this.dateData = [this.formatDate(this.start), this.formatDate(this.end)]
          }

          this.reRender()
        },
        false
      )
    },
    swipeRight() {
      const fixDate = this.fixMonthToYear(this.year, this.month - 1)
      this.setMonthDate(fixDate.year, fixDate.month)
      this.reRender()
    },
    swipeLeft() {
      const fixDate = this.fixMonthToYear(this.year, this.month + 1)
      this.setMonthDate(fixDate.year, fixDate.month)
      this.reRender()
    },
    // 重新渲染
    reRender() {
      // 通过开关 loading，来清空已点击选项
      this.clearUI()
      this.$nextTick().then(() => {
        this.renderUI()
        this.renderClickUI()
      })
    },
    init(year = this.start?.getFullYear(), month = this.start?.getMonth() + 1) {
      this.setMonthDate(year, month)
      this.reRender()
    },
    // 渲染未来时间不可选
    renderUI() {
      const fixDate = this.fixMonthToYear(this.year, this.month + 1)
      const date = new Date(fixDate.year, fixDate.month - 1)
      const today = new Date()
      // 下一年、下一月
      if (date - today > 0) {
        const monthDomClassList = document.getElementsByClassName('calender-picker__btn-next--month')[0].classList
        const yearDomClassList = document.getElementsByClassName('calender-picker__btn-next--year')[0].classList
        monthDomClassList.add('calender-picker__btn--disabled')
        yearDomClassList.add('calender-picker__btn--disabled')
      }
      // 下一天
      const dateDoms = document.getElementsByClassName('calender-picker__day')
      const dateDomsLength = dateDoms.length
      for (let i = 0; i < dateDomsLength; i++) {
        const dateData = this.monthData[i]
        const date = new Date(dateData?.year, dateData?.month - 1, dateData?.showDate)
        if (date - today > 0) {
          while (i < dateDomsLength) {
            const domClassList = dateDoms[i].classList
            domClassList.add('calender-picker__day--disabled')
            i++
          }
        }
      }
    },
    // 通过开始和结束时间，设置页面点击样式
    renderClickUI() {
      // 没点击，则无需渲染
      if (!this.start) {
        return
      }

      // 获取当前渲染日期界面的第一个和最后一个日期
      const [first, last] = [this.monthData[0], this.monthData[this.monthData.length - 1]]
      // 当点击的时间不在开始和结束的范围内,则无需渲染
      const firstDate = new Date(first.year, first.month - 1, first.showDate)
      const lastDate = new Date(last.year, last.month - 1, last.showDate)
      if (this.start - lastDate > 0 || (this.end && this.end - firstDate < 0)) {
        return
      }

      // 赋值新的点击、包括中间状态、开始和结束
      // 遍历每个日期
      const dateDoms = document.getElementsByClassName('calender-picker__day')
      for (let i = 0; i < dateDoms.length; i++) {
        const dateData = this.monthData[i]
        const date = new Date(dateData.year, dateData.month - 1, dateData.showDate)
        const domClassList = dateDoms[i].classList
        // 只有开始，给开始设置样式
        if (!this.end && this.start - date === 0) {
          domClassList.add('calender-picker__day--start')
          break
        }
        // 开始和结束都有
        // 设置开始
        if (this.start - date === 0) {
          // 当点击相同的
          if (this.end === this.start) {
            domClassList.remove('calender-picker__day--start')
            this.start = null
            this.end = null
            this.dateData = []
            break
          } else {
            // 给开始添加范围样式
            domClassList.add('calender-picker__day--start', 'select-both')
          }
          continue
        } else if (this.start - date < 0 && date - this.end < 0) {
          // 渲染中间的样式
          domClassList.add('calender-picker__day--middle')
          continue
        } else if (this.end - date === 0) {
          // 渲染结束的样式
          domClassList.add('calender-picker__day--end', 'select-both')
          break
        }
      }
    },
    // 判断当前点击的日期是上个月，这个月，还是当前月份的
    judgeDayType(classList) {
      let dayType = 'currMonth'
      if (classList.contains('prev-month')) {
        dayType = 'prevMonth'
      } else if (classList.contains('next-month')) {
        dayType = 'nextMonth'
      }
      return dayType
    },
    // 设置开始和结束日期
    setStartEndDate(dayType, dom) {
      const day = dom.innerHTML

      let clickDate = null
      let fixDate = null
      switch (dayType) {
        case 'currMonth':
          fixDate = this.fixMonthToYear(this.year, this.month)
          break
        case 'prevMonth':
          fixDate = this.fixMonthToYear(this.year, this.month - 1)
          break
        case 'nextMonth':
          fixDate = this.fixMonthToYear(this.year, this.month + 1)
          break
      }
      clickDate = new Date(fixDate.year, fixDate.month - 1, day)

      // 清空已选的开始和结束，只点击了开始
      if (!this.start || (this.start && this.end)) {
        this.start = clickDate
        this.end = null
      } else if (this.start - clickDate === 0) {
        // 开始和结束都在同一天
        this.end = this.start
      } else if (this.start - clickDate > 0) {
        // 交换结束和开始
        this.end = this.start
        this.start = clickDate
      } else {
        // 设置结束
        this.end = clickDate
      }
    },
    setMonthDate(year, month) {
      // 若没有传入年月，则默认选择当前年月
      if (!year || !month) {
        const today = new Date()
        year = today.getFullYear()
        month = today.getMonth() + 1 // 例如想要的是12月，getMonth() 会返回 11（js 里的 month 总是会比实际的少 1）
      }

      // 当月第一天相关
      let firstDateOfCurrMonth = new Date(year, month - 1, 1) // 获取当月第一天
      let weekOfFirstDate = firstDateOfCurrMonth.getDay() // 当月第一天是一周的星期几。那么之前的时间是上个月的

      // 周日
      if (weekOfFirstDate === 0) {
        weekOfFirstDate = 7
      }

      // 上个月最后一天相关
      let lastDateOfLastMonth = new Date(year, month - 1, 0) // 上个月最后一天 年月日
      let lastDayOfLastMonth = lastDateOfLastMonth.getDate() // 上个月最后一天 日

      let preMonthDayCount = weekOfFirstDate // 本月第一行，留有上个月的天数。因为是从周日开始的。若 1 号为周二，那么留有上个月的天数为 2（周日、周一）

      let lastDateOfCurrMonth = new Date(year, month, 0) // 本月的最后一天 年月日
      let lastDayOfCurrMonth = lastDateOfCurrMonth.getDate() // 本月的最后一天 日

      // 设置月的范围
      let range = 5 * 7
      let allDayCount = lastDayOfCurrMonth + preMonthDayCount
      if (allDayCount > range) {
        // 会有 6 行
        range += 7
      } else if (allDayCount <= range - 7) {
        // 只有 4 行
        range -= 7
      }

      this.monthData = this.getMonthData(range, year, month, preMonthDayCount, lastDayOfLastMonth, lastDayOfCurrMonth)

      this.year = year
      this.month = month
    },
    getMonthData(range, year, month, preMonthDayCount, lastDayOfLastMonth, lastDayOfCurrMonth) {
      const ret = []
      let date, showDate, currMonth

      for (let i = 0; i < range; i++) {
        date = i + 1 - preMonthDayCount // 本月的几号
        showDate = date
        currMonth = month

        // 上个月
        if (date <= 0) {
          currMonth = month - 1
          showDate = lastDayOfLastMonth + date // 上个月的第几号
        } else if (date > lastDayOfCurrMonth) {
          // 下一个月
          currMonth = month + 1
          showDate = showDate - lastDayOfCurrMonth // 下个月的第几号
        }

        const fixDate = this.fixMonthToYear(year, currMonth)

        ret.push({
          year: fixDate.year,
          month: fixDate.month,
          date,
          showDate
        })
      }
      return ret
    },
    fixMonthToYear(year, month) {
      // 若本月为 1 月，则上一月为 12 月
      if (month === 0) {
        month = 12
        year -= 1
      }
      // 若本月为 12 月，则下一月为 1 月
      if (month === 13) {
        month = 1
        year += 1
      }

      year = year || 0

      return { year, month }
    },
    formatDate(date) {
      if (!date) {
        return date
      }
      return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      }`
    },
    // 重新渲染日历
    clearUI() {
      this.loading = false
      this.$nextTick(() => {
        this.loading = true
      })
    },
    cancel() {
      // 日期重置回当月
      this.dateData = []
      this.start = null
      this.end = null
      this.setMonthDate()
      this.reRender()
    },
    confirm(type) {
      this.confirmData(type, this.dateData)
    },
    confirmData(type, dateData) {
      const value = dateData[1] ? [dateData[0], dateData[1]] : dateData[0] ? [dateData[0]] : []
      this.$emit('confirm', type, value)
    }
  }
}
</script>

<style lang="scss" scoped>
.justify-content--space-between {
  display: flex;
  justify-content: space-between;
}

.calender-picker {
  height: 60vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 16px 16px 0;
  color: #00000a;
  border-radius: 0 0 16px 16px;

  &__custom {
    @extend .justify-content--space-between;
    &--text {
      font-weight: 600;
      font-size: 16px;
    }
    &--value {
      color: #393a51;
    }
  }

  &__header {
    @extend .justify-content--space-between;
    align-items: center;
    padding: 24px 5px 11px;
    color: #393a51;

    .calender-picker__btn {
      font-family: serif; // 更像箭头
      &-prev--month {
        padding-left: 20px;
      }

      &-next--month {
        padding-right: 20px;
      }

      &--disabled {
        color: #b3b5c5;
      }
    }

    &-middle {
      color: #000000;
      font-size: 16px;
      font-weight: 600;
    }
  }

  &__body {
    overflow: auto;
    .calender-picker__weeks {
      @extend .justify-content--space-between;
      height: 36px;
      line-height: 36px;
      padding-bottom: 4px;
      .calender-picker__week {
        flex: 1;
        font-size: 12px;
        text-align: center;
        color: #393a51;
      }
    }

    .calender-picker__month {
      display: grid;

      grid-template-columns: repeat(7, auto);

      .calender-picker__day {
        text-align: center;
        height: 40px;
        line-height: 40px;

        &--start,
        &--end,
        &--start-end,
        &--middle {
          color: white !important;
          position: relative;
          z-index: 1;
          &::after {
            position: absolute;
            content: '';
            height: 32px;
            width: 32px;
            border-radius: 50%;
            background-color: #1a53ff;
            z-index: -1;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
          }
        }
        &--middle {
          color: #00000a !important;
          &::after {
            width: inherit;
            border-radius: unset;
            background-color: #e9eeff;
          }
        }

        &--start.select-both {
          height: 32px;
          line-height: 32px;
          margin: auto 0;
          background: linear-gradient(to right, transparent 0%, transparent 50%, #e9eeff 51%, #e9eeff 100%);
        }
        &--end.select-both {
          height: 32px;
          line-height: 32px;
          margin: auto 0;
          background: linear-gradient(to right, rgb(233, 238, 255) 0%, rgb(233, 238, 255) 50%, transparent 51%, transparent 100%) !important;
        }

        &.prev-month,
        &.next-month {
          color: #b3b5c5;
        }

        &--disabled {
          color: #b3b5c5;
        }
      }
    }
  }
}

</style>
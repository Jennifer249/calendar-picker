<template>
  <div class="calender-picker" v-click v-if="isVisible">
    <div class="calender-picker__custom">
      <span class="calender-picker__custom--text">{{ title }}</span>
      <span class="calender-picker__custom--value">
        <span v-html="dateText"></span>
      </span>
    </div>
    <div class="calender-picker__header">
      <div class="calender-picker__header-prev">
        <span class="calender-picker__btn calender-picker__btn-prev--year"
          >&lt;&lt;</span
        >
        <span class="calender-picker__btn calender-picker__btn-prev--month"
          >&lt;</span
        >
      </div>

      <div class="calender-picker__header-middle">
        {{ time.year }} 年 {{ time.month + 1 }} 月
      </div>

      <div class="calender-picker__header-next">
        <span
          class="calender-picker__btn calender-picker__btn-next--month"
          ref="nextMonth"
          >&gt;</span
        >
        <span
          class="calender-picker__btn calender-picker__btn-next--year"
          ref="nextYear"
          >&gt;&gt;</span
        >
      </div>
    </div>
    <div class="calender-picker__body">
      <div class="calender-picker__weeks">
        <div class="calender-picker__week" v-for="i in week" :key="i">
          {{ i }}
        </div>
      </div>
      <div class="calender-picker__month">
        <div
          ref="day"
          :class="[
            'calender-picker__day',
            getDayTypeClass(i),
            getChooseTypeClass(i),
          ]"
          v-for="i in days"
          :key="i.toString()"
        >
          {{ i.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "./utils.js";
export default {
  name: "calender-picker",
  directives: {
    click: {
      bind(el, _, vnode) {
        el.handler = vnode.context.clickEvent;
        el.addEventListener("click", el.handler);
      },
      unbind(el) {
        el.removeEventListener("click", el.handler);
      },
    },
  },
  props: {
    title: {
      type: String,
      default: "日期选择",
    },
    value: {
      // 初始化时间 Date[]
      type: Array,
      default: () => [],
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    exceed: {
      // 是否可以选择超出当前时间范围的日期
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      time: null,
      week: ["日", "一", "二", "三", "四", "五", "六"],
      start: null,
      end: null,
      prefixClass: "calender-picker__",
    };
  },
  watch: {
    value: {
      handler(val) {
        const { year, month } = utils.getYearMonthDay(
          this.value[0] ? new Date(this.value[0]) : new Date()
        );
        this.time = { year, month };

        if (!val[0]) {
          return;
        }
        const {
          year: sYear,
          month: sMonth,
          day: sDay,
        } = utils.getYearMonthDay(new Date(val[0]));
        this.start = utils.getDate(sYear, sMonth, sDay);

        if (!val[1]) {
          return;
        }
        const {
          year: eYear,
          month: eMonth,
          day: eDay,
        } = utils.getYearMonthDay(new Date(val[1]));
        this.end = utils.getDate(eYear, eMonth, eDay);
      },
      immediate: true,
    },
  },
  computed: {
    dateText() {
      let text = "请选择日期";
      const { formatStart, formatEnd } = this;
      if (formatStart) {
        text = `<span class="start-date" style="cursor: pointer">${formatStart}</span>`;
        text += formatEnd
          ? ` 至 <span class="end-date" style="cursor: pointer"> ${formatEnd}`
          : "";
      }
      return text;
    },
    days() {
      const { year, month } = this.time;
      // 当月第一天
      const firstDayOfCurrMonth = new Date(year, month, 1);
      // 当月第一天是周几, 意味着日历展示的当月第一天之前还有上个月的几天。例如 1 号为周二，那么留有上个月的天数也为 2（周日、周一）
      const week = firstDayOfCurrMonth.getDay();

      const dayTime = 24 * 60 * 60 * 1000;
      // 从倒退回去的时间算是第一天，再从第一天开始遍历
      const startDate = firstDayOfCurrMonth - week * dayTime;

      const days = [];

      // 42 刚好日历全部展示
      for (let i = 0; i < 42; i++) {
        days.push(new Date(startDate + i * dayTime));
      }

      return days;
    },
    formatStart() {
      return this.start ? utils.getFormatDate(this.start) : null;
    },
    formatEnd() {
      return this.end ? utils.getFormatDate(this.end) : null;
    },
  },
  methods: {
    checkClickDom(targetClassList) {
      if (
        (!targetClassList.contains(`${this.prefixClass}btn`) &&
          !targetClassList.contains(`${this.prefixClass}day`) &&
          !targetClassList.contains("start-date") &&
          !targetClassList.contains("end-date")) ||
        targetClassList.contains(`${this.prefixClass}btn--disabled`) ||
        targetClassList.contains(`${this.prefixClass}day--disabled`)
      ) {
        return false;
      }
      return true;
    },
    clickEvent(e) {
      e.stopPropagation();
      const $target = e.target;
      const targetClassList = $target.classList;

      if (!this.checkClickDom(targetClassList)) {
        return;
      }

      if (
        targetClassList.contains(`${this.prefixClass}btn`) ||
        targetClassList.contains("start-date") ||
        targetClassList.contains("end-date")
      ) {
        const { year, month } = this.time;
        let date = null;
        if (targetClassList.contains(`${this.prefixClass}btn-prev--year`)) {
          date = utils.getDate(year - 1, month);
        } else if (
          targetClassList.contains(`${this.prefixClass}btn-prev--month`)
        ) {
          date = utils.getDate(year, month - 1);
        } else if (
          targetClassList.contains(`${this.prefixClass}btn-next--month`)
        ) {
          date = utils.getDate(year, month + 1);
        } else if (
          targetClassList.contains(`${this.prefixClass}btn-next--year`)
        ) {
          date = utils.getDate(year + 1, month);
        } else {
          // 点击日期跳转到对应日期
          const dateArr = $target.innerHTML.split("-");
          date = utils.getDate(+dateArr[0], +dateArr[1] - 1);
        }

        this.time = utils.getYearMonthDay(date);
      } else if (targetClassList.contains(`${this.prefixClass}day`)) {
        // 设置日期开始和结束时间
        this.setStartOrEndDate(+$target.innerHTML, targetClassList);
        this.confirm();
      }
    },
    getDayTypeClass(date) {
      const { year, month } = this.time;
      if (!this.exceed && new Date() < date) {
        return `${this.prefixClass}day--disabled`;
      } else if (utils.getDate(year, month, 1) > date) {
        return `${this.prefixClass}day--prev`;
      } else if (utils.getDate(year, month + 1, 0) < date) {
        return `${this.prefixClass}day--next`;
      } else {
        return null;
      }
    },
    getChooseTypeClass(date) {
      if (!this.start) {
        return;
      }

      if (this.start - date === 0) {
        return `${this.prefixClass}day--start${
          this.end && this.start - this.end !== 0 ? " select-both" : ""
        }`;
      }

      if (!this.end) {
        return;
      }

      if (this.end - date === 0) {
        return `${this.prefixClass}day--end`;
      }

      if (this.start < date && date < this.end) {
        return `${this.prefixClass}day--middle`;
      }
    },
    // 设置开始和结束日期
    setStartOrEndDate(day, classList) {
      let classListStr = classList.toString();
      let { year, month } = this.time;
      if (classListStr.includes("prev")) {
        month = month - 1;
      } else if (classListStr.includes("next")) {
        month = month + 1;
      }

      const clickDate = utils.getDate(year, month, day);

      // 只点击了开始 || 开始和结束都有，那么都重选
      if (!this.start || (this.start && this.end)) {
        this.start = clickDate;
        this.end = null;
      } else if (this.start - clickDate === 0) {
        // 开始和结束都在同一天
        this.end = this.start = null;
      } else if (this.start - clickDate > 0) {
        // 交换结束和开始
        this.end = this.start;
        this.start = clickDate;
      } else {
        // 设置结束
        this.end = clickDate;
      }
    },
    confirm() {
      const { formatStart, formatEnd } = this;
      let value = [];
      if (formatEnd) {
        value = [formatStart, formatEnd];
      } else if (formatStart) {
        value = [formatStart];
      }
      this.$emit("confirm", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.justify-content--space-between {
  display: flex;
  justify-content: space-between;
}

.calender-picker {
  width: 300px;
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
      cursor: pointer;
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
        &--middle {
          color: white !important;
          position: relative;
          z-index: 1;
          &::after {
            position: absolute;
            content: "";
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
          background: linear-gradient(
            to right,
            transparent 0%,
            transparent 50%,
            #e9eeff 51%,
            #e9eeff 100%
          );
        }

        &--end {
          height: 32px;
          line-height: 32px;
          margin: auto 0;
          background: linear-gradient(
            to right,
            rgb(233, 238, 255) 0%,
            rgb(233, 238, 255) 50%,
            transparent 51%,
            transparent 100%
          ) !important;
        }

        &--prev,
        &--next {
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


(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var getYearMonthDay = function getYearMonthDay(date) {
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  return {
    year: year,
    month: month,
    day: day
  };
};
var getDate = function getDate(year, month) {
  var day = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  return new Date(year, month, day);
};
var getFormatDate = function getFormatDate(date) {
  if (!date) {
    return date;
  }
  var _getYearMonthDay = getYearMonthDay(date),
    year = _getYearMonthDay.year,
    month = _getYearMonthDay.month,
    day = _getYearMonthDay.day;
  month = month + 1;
  return "".concat(year, "-").concat(paddingDateZero(month), "-").concat(paddingDateZero(day));
};
var paddingDateZero = function paddingDateZero(num) {
  return num < 10 ? "0".concat(num) : num;
};
var utils = {
  getYearMonthDay: getYearMonthDay,
  getDate: getDate,
  getFormatDate: getFormatDate
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
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

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.isVisible
    ? _c(
        "div",
        {
          directives: [{ name: "click", rawName: "v-click" }],
          staticClass: "calender-picker",
        },
        [
          _c("div", { staticClass: "calender-picker__custom" }, [
            _c("span", { staticClass: "calender-picker__custom--text" }, [
              _vm._v(_vm._s(_vm.title)),
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "calender-picker__custom--value" }, [
              _c("span", { domProps: { innerHTML: _vm._s(_vm.dateText) } }),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "calender-picker__header" }, [
            _vm._m(0),
            _vm._v(" "),
            _c("div", { staticClass: "calender-picker__header-middle" }, [
              _vm._v(
                "\n      " +
                  _vm._s(_vm.time.year) +
                  " 年 " +
                  _vm._s(_vm.time.month + 1) +
                  " 月\n    "
              ),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "calender-picker__header-next" }, [
              _c(
                "span",
                {
                  ref: "nextMonth",
                  staticClass:
                    "calender-picker__btn calender-picker__btn-next--month",
                },
                [_vm._v(">")]
              ),
              _vm._v(" "),
              _c(
                "span",
                {
                  ref: "nextYear",
                  staticClass:
                    "calender-picker__btn calender-picker__btn-next--year",
                },
                [_vm._v(">>")]
              ),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "calender-picker__body" }, [
            _c(
              "div",
              { staticClass: "calender-picker__weeks" },
              _vm._l(_vm.week, function (i) {
                return _c(
                  "div",
                  { key: i, staticClass: "calender-picker__week" },
                  [_vm._v("\n        " + _vm._s(i) + "\n      ")]
                )
              }),
              0
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "calender-picker__month" },
              _vm._l(_vm.days, function (i) {
                return _c(
                  "div",
                  {
                    key: i.toString(),
                    ref: "day",
                    refInFor: true,
                    class: [
                      "calender-picker__day",
                      _vm.getDayTypeClass(i),
                      _vm.getChooseTypeClass(i),
                    ],
                  },
                  [_vm._v("\n        " + _vm._s(i.getDate()) + "\n      ")]
                )
              }),
              0
            ),
          ]),
        ]
      )
    : _vm._e()
};
var __vue_staticRenderFns__ = [
  function () {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "calender-picker__header-prev" }, [
      _c(
        "span",
        { staticClass: "calender-picker__btn calender-picker__btn-prev--year" },
        [_vm._v("<<")]
      ),
      _vm._v(" "),
      _c(
        "span",
        {
          staticClass: "calender-picker__btn calender-picker__btn-prev--month",
        },
        [_vm._v("<")]
      ),
    ])
  },
];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-70211bdf_0", { source: ".justify-content--space-between[data-v-70211bdf], .calender-picker__body .calender-picker__weeks[data-v-70211bdf], .calender-picker__header[data-v-70211bdf], .calender-picker__custom[data-v-70211bdf] {\n  display: flex;\n  justify-content: space-between;\n}\n.calender-picker[data-v-70211bdf] {\n  width: 300px;\n  height: 60vh;\n  display: flex;\n  flex-direction: column;\n  background-color: white;\n  padding: 16px 16px 0;\n  color: #00000a;\n  border-radius: 0 0 16px 16px;\n}\n.calender-picker__custom--text[data-v-70211bdf] {\n  font-weight: 600;\n  font-size: 16px;\n}\n.calender-picker__custom--value[data-v-70211bdf] {\n  color: #393a51;\n}\n.calender-picker__header[data-v-70211bdf] {\n  align-items: center;\n  padding: 24px 5px 11px;\n  color: #393a51;\n}\n.calender-picker__header .calender-picker__btn[data-v-70211bdf] {\n  cursor: pointer;\n  font-family: serif;\n}\n.calender-picker__header .calender-picker__btn-prev--month[data-v-70211bdf] {\n  padding-left: 20px;\n}\n.calender-picker__header .calender-picker__btn-next--month[data-v-70211bdf] {\n  padding-right: 20px;\n}\n.calender-picker__header .calender-picker__btn--disabled[data-v-70211bdf] {\n  color: #b3b5c5;\n}\n.calender-picker__header-middle[data-v-70211bdf] {\n  color: #000000;\n  font-size: 16px;\n  font-weight: 600;\n}\n.calender-picker__body[data-v-70211bdf] {\n  overflow: auto;\n}\n.calender-picker__body .calender-picker__weeks[data-v-70211bdf] {\n  height: 36px;\n  line-height: 36px;\n  padding-bottom: 4px;\n}\n.calender-picker__body .calender-picker__weeks .calender-picker__week[data-v-70211bdf] {\n  flex: 1;\n  font-size: 12px;\n  text-align: center;\n  color: #393a51;\n}\n.calender-picker__body .calender-picker__month[data-v-70211bdf] {\n  display: grid;\n  grid-template-columns: repeat(7, auto);\n}\n.calender-picker__body .calender-picker__month .calender-picker__day[data-v-70211bdf] {\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--start[data-v-70211bdf], .calender-picker__body .calender-picker__month .calender-picker__day--end[data-v-70211bdf], .calender-picker__body .calender-picker__month .calender-picker__day--middle[data-v-70211bdf] {\n  color: white !important;\n  position: relative;\n  z-index: 1;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--start[data-v-70211bdf]::after, .calender-picker__body .calender-picker__month .calender-picker__day--end[data-v-70211bdf]::after, .calender-picker__body .calender-picker__month .calender-picker__day--middle[data-v-70211bdf]::after {\n  position: absolute;\n  content: \"\";\n  height: 32px;\n  width: 32px;\n  border-radius: 50%;\n  background-color: #1a53ff;\n  z-index: -1;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--middle[data-v-70211bdf] {\n  color: #00000a !important;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--middle[data-v-70211bdf]::after {\n  width: inherit;\n  border-radius: unset;\n  background-color: #e9eeff;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--start.select-both[data-v-70211bdf] {\n  height: 32px;\n  line-height: 32px;\n  margin: auto 0;\n  background: linear-gradient(to right, transparent 0%, transparent 50%, #e9eeff 51%, #e9eeff 100%);\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--end[data-v-70211bdf] {\n  height: 32px;\n  line-height: 32px;\n  margin: auto 0;\n  background: linear-gradient(to right, rgb(233, 238, 255) 0%, rgb(233, 238, 255) 50%, transparent 51%, transparent 100%) !important;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--prev[data-v-70211bdf], .calender-picker__body .calender-picker__month .calender-picker__day--next[data-v-70211bdf] {\n  color: #b3b5c5;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--disabled[data-v-70211bdf] {\n  color: #b3b5c5;\n}\n\n/*# sourceMappingURL=App.vue.map */", map: {"version":3,"sources":["/Users/mac/Documents/study-workspace/calendar-picker/src/App.vue","App.vue"],"names":[],"mappings":"AAoTA;EACA,aAAA;EACA,8BAAA;ACnTA;ADsTA;EACA,YAAA;EACA,YAAA;EACA,aAAA;EACA,sBAAA;EACA,uBAAA;EACA,oBAAA;EACA,cAAA;EACA,4BAAA;ACnTA;ADuTA;EACA,gBAAA;EACA,eAAA;ACrTA;ADuTA;EACA,cAAA;ACrTA;ADyTA;EAEA,mBAAA;EACA,sBAAA;EACA,cAAA;ACxTA;AD0TA;EACA,eAAA;EACA,kBAAA;ACxTA;ADyTA;EACA,kBAAA;ACvTA;AD0TA;EACA,mBAAA;ACxTA;AD2TA;EACA,cAAA;ACzTA;AD6TA;EACA,cAAA;EACA,eAAA;EACA,gBAAA;AC3TA;AD+TA;EACA,cAAA;AC7TA;AD8TA;EAEA,YAAA;EACA,iBAAA;EACA,mBAAA;AC7TA;AD8TA;EACA,OAAA;EACA,eAAA;EACA,kBAAA;EACA,cAAA;AC5TA;ADgUA;EACA,aAAA;EAEA,sCAAA;AC/TA;ADiUA;EACA,kBAAA;EACA,YAAA;EACA,iBAAA;AC/TA;ADiUA;EAGA,uBAAA;EACA,kBAAA;EACA,UAAA;ACjUA;ADkUA;EACA,kBAAA;EACA,WAAA;EACA,YAAA;EACA,WAAA;EACA,kBAAA;EACA,yBAAA;EACA,WAAA;EACA,MAAA;EACA,SAAA;EACA,OAAA;EACA,QAAA;EACA,YAAA;AChUA;ADoUA;EACA,yBAAA;AClUA;ADmUA;EACA,cAAA;EACA,oBAAA;EACA,yBAAA;ACjUA;ADqUA;EACA,YAAA;EACA,iBAAA;EACA,cAAA;EACA,iGAAA;ACnUA;AD4UA;EACA,YAAA;EACA,iBAAA;EACA,cAAA;EACA,kIAAA;AC1UA;ADmVA;EAEA,cAAA;AClVA;ADqVA;EACA,cAAA;ACnVA;;AAEA,kCAAkC","file":"App.vue","sourcesContent":["<template>\n  <div class=\"calender-picker\" v-click v-if=\"isVisible\">\n    <div class=\"calender-picker__custom\">\n      <span class=\"calender-picker__custom--text\">{{ title }}</span>\n      <span class=\"calender-picker__custom--value\">\n        <span v-html=\"dateText\"></span>\n      </span>\n    </div>\n    <div class=\"calender-picker__header\">\n      <div class=\"calender-picker__header-prev\">\n        <span class=\"calender-picker__btn calender-picker__btn-prev--year\"\n          >&lt;&lt;</span\n        >\n        <span class=\"calender-picker__btn calender-picker__btn-prev--month\"\n          >&lt;</span\n        >\n      </div>\n\n      <div class=\"calender-picker__header-middle\">\n        {{ time.year }} 年 {{ time.month + 1 }} 月\n      </div>\n\n      <div class=\"calender-picker__header-next\">\n        <span\n          class=\"calender-picker__btn calender-picker__btn-next--month\"\n          ref=\"nextMonth\"\n          >&gt;</span\n        >\n        <span\n          class=\"calender-picker__btn calender-picker__btn-next--year\"\n          ref=\"nextYear\"\n          >&gt;&gt;</span\n        >\n      </div>\n    </div>\n    <div class=\"calender-picker__body\">\n      <div class=\"calender-picker__weeks\">\n        <div class=\"calender-picker__week\" v-for=\"i in week\" :key=\"i\">\n          {{ i }}\n        </div>\n      </div>\n      <div class=\"calender-picker__month\">\n        <div\n          ref=\"day\"\n          :class=\"[\n            'calender-picker__day',\n            getDayTypeClass(i),\n            getChooseTypeClass(i),\n          ]\"\n          v-for=\"i in days\"\n          :key=\"i.toString()\"\n        >\n          {{ i.getDate() }}\n        </div>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script>\nimport utils from \"./utils.js\";\nexport default {\n  name: \"calender-picker\",\n  directives: {\n    click: {\n      bind(el, _, vnode) {\n        el.handler = vnode.context.clickEvent;\n        el.addEventListener(\"click\", el.handler);\n      },\n      unbind(el) {\n        el.removeEventListener(\"click\", el.handler);\n      },\n    },\n  },\n  props: {\n    title: {\n      type: String,\n      default: \"日期选择\",\n    },\n    value: {\n      // 初始化时间 Date[]\n      type: Array,\n      default: () => [],\n    },\n    isVisible: {\n      type: Boolean,\n      default: true,\n    },\n    exceed: {\n      // 是否可以选择超出当前时间范围的日期\n      type: Boolean,\n      default: true,\n    },\n  },\n  data() {\n    return {\n      time: null,\n      week: [\"日\", \"一\", \"二\", \"三\", \"四\", \"五\", \"六\"],\n      start: null,\n      end: null,\n      prefixClass: \"calender-picker__\",\n    };\n  },\n  watch: {\n    value: {\n      handler(val) {\n        const { year, month } = utils.getYearMonthDay(\n          this.value[0] ? new Date(this.value[0]) : new Date()\n        );\n        this.time = { year, month };\n\n        if (!val[0]) {\n          return;\n        }\n        const {\n          year: sYear,\n          month: sMonth,\n          day: sDay,\n        } = utils.getYearMonthDay(new Date(val[0]));\n        this.start = utils.getDate(sYear, sMonth, sDay);\n\n        if (!val[1]) {\n          return;\n        }\n        const {\n          year: eYear,\n          month: eMonth,\n          day: eDay,\n        } = utils.getYearMonthDay(new Date(val[1]));\n        this.end = utils.getDate(eYear, eMonth, eDay);\n      },\n      immediate: true,\n    },\n  },\n  computed: {\n    dateText() {\n      let text = \"请选择日期\";\n      const { formatStart, formatEnd } = this;\n      if (formatStart) {\n        text = `<span class=\"start-date\" style=\"cursor: pointer\">${formatStart}</span>`;\n        text += formatEnd\n          ? ` 至 <span class=\"end-date\" style=\"cursor: pointer\"> ${formatEnd}`\n          : \"\";\n      }\n      return text;\n    },\n    days() {\n      const { year, month } = this.time;\n      // 当月第一天\n      const firstDayOfCurrMonth = new Date(year, month, 1);\n      // 当月第一天是周几, 意味着日历展示的当月第一天之前还有上个月的几天。例如 1 号为周二，那么留有上个月的天数也为 2（周日、周一）\n      const week = firstDayOfCurrMonth.getDay();\n\n      const dayTime = 24 * 60 * 60 * 1000;\n      // 从倒退回去的时间算是第一天，再从第一天开始遍历\n      const startDate = firstDayOfCurrMonth - week * dayTime;\n\n      const days = [];\n\n      // 42 刚好日历全部展示\n      for (let i = 0; i < 42; i++) {\n        days.push(new Date(startDate + i * dayTime));\n      }\n\n      return days;\n    },\n    formatStart() {\n      return this.start ? utils.getFormatDate(this.start) : null;\n    },\n    formatEnd() {\n      return this.end ? utils.getFormatDate(this.end) : null;\n    },\n  },\n  methods: {\n    checkClickDom(targetClassList) {\n      if (\n        (!targetClassList.contains(`${this.prefixClass}btn`) &&\n          !targetClassList.contains(`${this.prefixClass}day`) &&\n          !targetClassList.contains(\"start-date\") &&\n          !targetClassList.contains(\"end-date\")) ||\n        targetClassList.contains(`${this.prefixClass}btn--disabled`) ||\n        targetClassList.contains(`${this.prefixClass}day--disabled`)\n      ) {\n        return false;\n      }\n      return true;\n    },\n    clickEvent(e) {\n      e.stopPropagation();\n      const $target = e.target;\n      const targetClassList = $target.classList;\n\n      if (!this.checkClickDom(targetClassList)) {\n        return;\n      }\n\n      if (\n        targetClassList.contains(`${this.prefixClass}btn`) ||\n        targetClassList.contains(\"start-date\") ||\n        targetClassList.contains(\"end-date\")\n      ) {\n        const { year, month } = this.time;\n        let date = null;\n        if (targetClassList.contains(`${this.prefixClass}btn-prev--year`)) {\n          date = utils.getDate(year - 1, month);\n        } else if (\n          targetClassList.contains(`${this.prefixClass}btn-prev--month`)\n        ) {\n          date = utils.getDate(year, month - 1);\n        } else if (\n          targetClassList.contains(`${this.prefixClass}btn-next--month`)\n        ) {\n          date = utils.getDate(year, month + 1);\n        } else if (\n          targetClassList.contains(`${this.prefixClass}btn-next--year`)\n        ) {\n          date = utils.getDate(year + 1, month);\n        } else {\n          // 点击日期跳转到对应日期\n          const dateArr = $target.innerHTML.split(\"-\");\n          date = utils.getDate(+dateArr[0], +dateArr[1] - 1);\n        }\n\n        this.time = utils.getYearMonthDay(date);\n      } else if (targetClassList.contains(`${this.prefixClass}day`)) {\n        // 设置日期开始和结束时间\n        this.setStartOrEndDate(+$target.innerHTML, targetClassList);\n        this.confirm();\n      }\n    },\n    getDayTypeClass(date) {\n      const { year, month } = this.time;\n      if (!this.exceed && new Date() < date) {\n        return `${this.prefixClass}day--disabled`;\n      } else if (utils.getDate(year, month, 1) > date) {\n        return `${this.prefixClass}day--prev`;\n      } else if (utils.getDate(year, month + 1, 0) < date) {\n        return `${this.prefixClass}day--next`;\n      } else {\n        return null;\n      }\n    },\n    getChooseTypeClass(date) {\n      if (!this.start) {\n        return;\n      }\n\n      if (this.start - date === 0) {\n        return `${this.prefixClass}day--start${\n          this.end && this.start - this.end !== 0 ? \" select-both\" : \"\"\n        }`;\n      }\n\n      if (!this.end) {\n        return;\n      }\n\n      if (this.end - date === 0) {\n        return `${this.prefixClass}day--end`;\n      }\n\n      if (this.start < date && date < this.end) {\n        return `${this.prefixClass}day--middle`;\n      }\n    },\n    // 设置开始和结束日期\n    setStartOrEndDate(day, classList) {\n      let classListStr = classList.toString();\n      let { year, month } = this.time;\n      if (classListStr.includes(\"prev\")) {\n        month = month - 1;\n      } else if (classListStr.includes(\"next\")) {\n        month = month + 1;\n      }\n\n      const clickDate = utils.getDate(year, month, day);\n\n      // 只点击了开始 || 开始和结束都有，那么都重选\n      if (!this.start || (this.start && this.end)) {\n        this.start = clickDate;\n        this.end = null;\n      } else if (this.start - clickDate === 0) {\n        // 开始和结束都在同一天\n        this.end = this.start = null;\n      } else if (this.start - clickDate > 0) {\n        // 交换结束和开始\n        this.end = this.start;\n        this.start = clickDate;\n      } else {\n        // 设置结束\n        this.end = clickDate;\n      }\n    },\n    confirm() {\n      const { formatStart, formatEnd } = this;\n      let value = [];\n      if (formatEnd) {\n        value = [formatStart, formatEnd];\n      } else if (formatStart) {\n        value = [formatStart];\n      }\n      this.$emit(\"confirm\", value);\n    },\n  },\n};\n</script>\n\n<style lang=\"scss\" scoped>\n.justify-content--space-between {\n  display: flex;\n  justify-content: space-between;\n}\n\n.calender-picker {\n  width: 300px;\n  height: 60vh;\n  display: flex;\n  flex-direction: column;\n  background-color: white;\n  padding: 16px 16px 0;\n  color: #00000a;\n  border-radius: 0 0 16px 16px;\n\n  &__custom {\n    @extend .justify-content--space-between;\n    &--text {\n      font-weight: 600;\n      font-size: 16px;\n    }\n    &--value {\n      color: #393a51;\n    }\n  }\n\n  &__header {\n    @extend .justify-content--space-between;\n    align-items: center;\n    padding: 24px 5px 11px;\n    color: #393a51;\n\n    .calender-picker__btn {\n      cursor: pointer;\n      font-family: serif; // 更像箭头\n      &-prev--month {\n        padding-left: 20px;\n      }\n\n      &-next--month {\n        padding-right: 20px;\n      }\n\n      &--disabled {\n        color: #b3b5c5;\n      }\n    }\n\n    &-middle {\n      color: #000000;\n      font-size: 16px;\n      font-weight: 600;\n    }\n  }\n\n  &__body {\n    overflow: auto;\n    .calender-picker__weeks {\n      @extend .justify-content--space-between;\n      height: 36px;\n      line-height: 36px;\n      padding-bottom: 4px;\n      .calender-picker__week {\n        flex: 1;\n        font-size: 12px;\n        text-align: center;\n        color: #393a51;\n      }\n    }\n\n    .calender-picker__month {\n      display: grid;\n\n      grid-template-columns: repeat(7, auto);\n\n      .calender-picker__day {\n        text-align: center;\n        height: 40px;\n        line-height: 40px;\n\n        &--start,\n        &--end,\n        &--middle {\n          color: white !important;\n          position: relative;\n          z-index: 1;\n          &::after {\n            position: absolute;\n            content: \"\";\n            height: 32px;\n            width: 32px;\n            border-radius: 50%;\n            background-color: #1a53ff;\n            z-index: -1;\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n            margin: auto;\n          }\n        }\n\n        &--middle {\n          color: #00000a !important;\n          &::after {\n            width: inherit;\n            border-radius: unset;\n            background-color: #e9eeff;\n          }\n        }\n\n        &--start.select-both {\n          height: 32px;\n          line-height: 32px;\n          margin: auto 0;\n          background: linear-gradient(\n            to right,\n            transparent 0%,\n            transparent 50%,\n            #e9eeff 51%,\n            #e9eeff 100%\n          );\n        }\n\n        &--end {\n          height: 32px;\n          line-height: 32px;\n          margin: auto 0;\n          background: linear-gradient(\n            to right,\n            rgb(233, 238, 255) 0%,\n            rgb(233, 238, 255) 50%,\n            transparent 51%,\n            transparent 100%\n          ) !important;\n        }\n\n        &--prev,\n        &--next {\n          color: #b3b5c5;\n        }\n\n        &--disabled {\n          color: #b3b5c5;\n        }\n      }\n    }\n  }\n}\n</style>\n",".justify-content--space-between, .calender-picker__body .calender-picker__weeks, .calender-picker__header, .calender-picker__custom {\n  display: flex;\n  justify-content: space-between;\n}\n\n.calender-picker {\n  width: 300px;\n  height: 60vh;\n  display: flex;\n  flex-direction: column;\n  background-color: white;\n  padding: 16px 16px 0;\n  color: #00000a;\n  border-radius: 0 0 16px 16px;\n}\n.calender-picker__custom--text {\n  font-weight: 600;\n  font-size: 16px;\n}\n.calender-picker__custom--value {\n  color: #393a51;\n}\n.calender-picker__header {\n  align-items: center;\n  padding: 24px 5px 11px;\n  color: #393a51;\n}\n.calender-picker__header .calender-picker__btn {\n  cursor: pointer;\n  font-family: serif;\n}\n.calender-picker__header .calender-picker__btn-prev--month {\n  padding-left: 20px;\n}\n.calender-picker__header .calender-picker__btn-next--month {\n  padding-right: 20px;\n}\n.calender-picker__header .calender-picker__btn--disabled {\n  color: #b3b5c5;\n}\n.calender-picker__header-middle {\n  color: #000000;\n  font-size: 16px;\n  font-weight: 600;\n}\n.calender-picker__body {\n  overflow: auto;\n}\n.calender-picker__body .calender-picker__weeks {\n  height: 36px;\n  line-height: 36px;\n  padding-bottom: 4px;\n}\n.calender-picker__body .calender-picker__weeks .calender-picker__week {\n  flex: 1;\n  font-size: 12px;\n  text-align: center;\n  color: #393a51;\n}\n.calender-picker__body .calender-picker__month {\n  display: grid;\n  grid-template-columns: repeat(7, auto);\n}\n.calender-picker__body .calender-picker__month .calender-picker__day {\n  text-align: center;\n  height: 40px;\n  line-height: 40px;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--start, .calender-picker__body .calender-picker__month .calender-picker__day--end, .calender-picker__body .calender-picker__month .calender-picker__day--middle {\n  color: white !important;\n  position: relative;\n  z-index: 1;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--start::after, .calender-picker__body .calender-picker__month .calender-picker__day--end::after, .calender-picker__body .calender-picker__month .calender-picker__day--middle::after {\n  position: absolute;\n  content: \"\";\n  height: 32px;\n  width: 32px;\n  border-radius: 50%;\n  background-color: #1a53ff;\n  z-index: -1;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--middle {\n  color: #00000a !important;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--middle::after {\n  width: inherit;\n  border-radius: unset;\n  background-color: #e9eeff;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--start.select-both {\n  height: 32px;\n  line-height: 32px;\n  margin: auto 0;\n  background: linear-gradient(to right, transparent 0%, transparent 50%, #e9eeff 51%, #e9eeff 100%);\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--end {\n  height: 32px;\n  line-height: 32px;\n  margin: auto 0;\n  background: linear-gradient(to right, rgb(233, 238, 255) 0%, rgb(233, 238, 255) 50%, transparent 51%, transparent 100%) !important;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--prev, .calender-picker__body .calender-picker__month .calender-picker__day--next {\n  color: #b3b5c5;\n}\n.calender-picker__body .calender-picker__month .calender-picker__day--disabled {\n  color: #b3b5c5;\n}\n\n/*# sourceMappingURL=App.vue.map */"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = "data-v-70211bdf";
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  const __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export { __vue_component__ as default };

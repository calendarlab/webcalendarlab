/**
 * @file 基于 vue.js 实现的全天提醒弹出框组件
 * @author BuptStEve <stevesasuke@139.com>
 * @version 1.0
 */

/**
 * 全天提醒弹出框组件类
 *
 * @author BuptStEve <stevesasuke@139.com>
 * @constructor AllDayAlertSelect
 * @since version 1.0
 * @property {String}  el                           - 作为组件的 html 的模板
 * @property {Object}  data                         - 作为 Vue 组件的数据
 * @property {Boolean} data.isShow                  - 作为是否显示组件的标志
 * @property {Boolean} data.isDIY                   - 作为是否自定义输入的标志
 * @property {String}  data.timeTXT                 - 动态显示自定义时间
 * @property {Number}  data.dayCount                - 保存提前几天的数据
 * @property {Number}  data.hourCount               - 保存提前几小时的数据
 * @property {Number}  data.modalZ                  - 保存遮罩层的 z-index 值
 * @property {String}  data.timeDayTXT              - 文本
 * @property {String}  data.timeHourTXT             - 文本
 * @property {Object}  components                   - 保存 Vue 组件的内部组件
 * @property {Object}  components.time_count_comp   - 内部复用的时间选择器组件
 * @property {Object}  computed                     - 保存 Vue 组件的动态计算的监听函数
 * @property {Object}  methods                      - 保存 Vue 组件的内部方法
 * @example
    <div id="allDayAlertSelectWrapper">
        <div class="modalDisable" :style="{zIndex: modalZ}" @click="modalDisableClick"></div>
        <div id="allDayAlertSelect" v-show="isShow">
            <ul class="allDayAlertSelect_content">
                <li @click = "isDIY = false;" :class = "{'active': !isDIY}">无</li>
                <li @click = "isDIY = true;"  :class = "{'active': isDIY}">
                    自定义
                    <span class="allDayAlertSelect_timeTXT">{{timeTXT}}</span>
                </li>
            </ul>

            <div class="allDayAlertSelect_time" v-show="isDIY">
                <time_count_comp :count.sync="dayCount" :time_txt.sync="timeDayTXT" count_type="day"></time_count_comp>
                <time_count_comp :count.sync="hourCount" :time_txt.sync="timeHourTXT" count_type="hour"></time_count_comp>
            </div>
        </div>
    </div>
 */
var AllDayAlertSelect = new Vue({
    el: '#allDayAlertSelectWrapper',
    data: {
        isShow     : false,
        isDIY      : false,
        timeTXT    : '',
        dayCount   : 0,
        hourCount  : 0,
        modalZ     : -1,
        timeDayTXT : '天前',
        timeHourTXT: '时',
    },
    components: {
        /**
         * 时间选择器组件
         *
         * @author BuptStEve <stevesasuke@139.com>
         * @since version 1.0
         * @property {String} template         - 作为组件的 html 的模板
         * @property {Object} prop             - 作为组件的传入参数
         * @property {Number} prop.count       - 保存时间的数值(双向绑定)
         * @property {String} prop.time_txt    - 保存时间显示的文本
         * @property {String} prop.count_type  - 保存时间选择器的类型(hour/day)
         * @example
            <time_count_comp :count.sync="dayCount" :time_txt.sync="timeDayTXT" count_type="day"></time_count_comp>
         */
        time_count_comp: {
            template: "#time-count-comp-tmpl",
            props: {
                // 传入参数
                count: {
                    type: Number,
                    twoWay: true,
                },
                time_txt: String,
                count_type: String,
            },
            filters: {
                // 过滤器
                numberDisplay: {
                    // 利用timeLimit函数保证合法范围，parseInt过滤小数,write表示将过滤后的变量保存
                    // (由于双向绑定，input中的内容是过滤后的正确值)
                    write: function(val, oldval) {
                        return this.timeLimit(val, this.count_type) ? parseInt(val) : 0;
                    },
                },
            },
            methods: {
                // 增加时间需要验证范围
                addTime: function() {
                    this.count = this.timeLimit(this.count+1, this.count_type) ? this.count+1 : this.count;
                },
                timeLimit: function(val, countType) {
                    /**
                     * 功能：根据countType验证val是否在范围内(非数字不在范围内)
                     * 输入：val: count值,
                     *      countType: 当前组件的类型,
                     * 输出：无
                     */
                    if (countType === 'hour') {
                        return val >= 0 && val < 24;
                    }
                    else if (countType === 'day') {
                        return val >= 0 && val < 100;
                    }
                    else {
                        return val >= 0;
                    }
                },
            },
        },
    },
    computed: {
        timeTXT: function() {
            return this.dayCount + this.timeDayTXT + this.hourCount + this.timeHourTXT;
        }
    },
    methods: {
        /**
         * 点击遮罩层后，将已有的数据保存下来。
         *
         * @event AllDayAlertSelect#modalDisableClick
         */
        modalDisableClick: function() {
            if (this.isDIY && (this.dayCount || this.hourCount)) {
                $('#alertTxt').html(AllDayAlertSelect.timeTXT);
                $('#alertTxt').attr('value', AllDayAlertSelect.dayCount + ',' + AllDayAlertSelect.hourCount + ',0');
            }
            else {
                $('#alertTxt').html('无');
                $('#alertTxt').attr('value', '-1,-1,-1');
            }

            this.isShow = false;
            this.modalZ = -1;
        },
    },
});

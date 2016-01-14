/**
 * @file 基于 vue.js 实现的日历选择组件
 * @author BuptStEve <stevesasuke@139.com>
 * @version 1.0
 */

/**
 * 日历选择组件中的单个日历组件类，暂时仅被 CalendarSelectWrapper 调用。其中「var calendarLiComponent = 」部分仅仅为了生成文档
 *
 * @author BuptStEve <stevesasuke@139.com>
 * @class VC.calendar-li-component (VC 表示 Vue Component)
 * @since version 1.0
 * @property {String}   template         - 作为组件的 html 的模板
 * @property {Object}   prop             - 作为组件的传入参数
 * @property {Number}   prop.num         - 作为组件数据在数组中的下标编号
 * @property {String}   prop.uid         - 作为是否需要重绘界面的判断标志
 * @property {Boolean}  prop.isActive    - 作为是否被激活的标志
 * @property {String}   prop.color       - 作为组件的颜色
 * @property {String}   prop.title       - 作为组件的名称
 * @property {Boolean}  prop.isShare     - 作为是否是共享日历的标志
 * @property {Object}   methods          - 保存实例方法
 * @example
    <component
        is = "calendar-li-component"
        v-for = "item in calendarLiItems"
        track-by = "uid"
        :num = "$index"
        :uid = "item.uid"
        :is-active.sync = "item.isActive"
        :color = "item.color"
        :title = "item.title"
        :is-share = "item.isShare"
    />
 */
var calendarLiComponent = Vue.component('calendar-li-component', {
    template: "#cal-li-comp-tmpl",
    props: {
        num: { type: Number, },
        uid: { type: String, },
        isActive: {
            type: Boolean,
            default: true,
            twoWay: true
        },
        color: { type: String },
        title: { type: String, },
        isShare: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        /**
         * 当前日历被点击，调用 dispatch 方法发送 liClick 消息， 同时将 num 传给 parent
         *
         * @event calendarLiComponent#calendarLiClick
         */
        calendarLiClick: function() {
            this.$dispatch('liClick', this.num)
        }
    },
});

/**
 * 日历选择组件类
 * @author BuptStEve <stevesasuke@139.com>
 * @constructor CalendarSelectWrapper
 * @since version 1.0
 * @property {String}  el                    - 作为组件的 html 的模板
 * @property {Object}  data                  - 作为 Vue 组件的数据
 * @property {Boolean} data.isShow           - 作为是否显示组件的标志
 * @property {Number}  data.modalZ           - 保存遮罩层的 z-index 值
 * @property {Number}  data.activeNum        - 保存已激活的下标
 * @property {Array}   data.calendarLiItems  - 保存日历选择下拉框的日历内容数组
 * @property {Object}  methods               - 保存实例方法
 * @property {Object}  events                - 保存监听的各个事件，键是监听的事件，值是相应的回调。
 * @example
    <ol id="calendarSelectWrapper" class="settingMy" v-show="isShow">
        <div class="modalDisable" :style="{zIndex: modalZ}" @click="modalDisableClick"></div>
        <component
            is = "calendar-li-component"
            v-for = "item in calendarLiItems"
            track-by = "uid"
            :num = "$index"
            :uid = "item.uid"
            :is-active.sync = "item.isActive"
            :color = "item.color"
            :title = "item.title"
            :is-share = "item.isShare"
        />
    </ol>
 */
var CalendarSelectWrapper = new Vue({
    el: '#calendarSelectWrapper',
    data: {
        isShow   : false,
        modalZ   : -1,
        activeNum: -1,
        calendarLiItems: [
            // {
            //     uid: 'http://user08@ip:port/calendars/__uids__/10000000-0000-0000-0000-000000000008/EEBF5256-5596-40A5-9D92-B2A4B87BD705/',
            //     isActive: false,
            //     color: '#0ff',
            //     title: '互联网电话会议',
            //     isShare: true,
            // },
        ],
    },
    methods: {
        modalDisableClick: function() {
            this.isShow = false;
            this.modalZ = -1;
        },
    },
    events: {
        /**
         * 更改默认日历：接收到子组件发出的关于当前日历被点击的消息，将该子组件设置为默认日历。
         *
         * @event CalendarSelectWrapper#liClick
         */
        'liClick': function(liNum) {
            this.calendarLiItems[this.activeNum].isActive = false;
            this.activeNum = liNum;
            var theActiveLi = this.calendarLiItems[this.activeNum];
            theActiveLi.isActive = true;

            globalDefaultCalendar = globalResourceCalDAVList.getCollectionByUID(theActiveLi.uid);
            $('.defaultCalendar span').css('background', globalDefaultCalendar.ecolor); // 默认日历的颜色
            $('.defaultCalendar p').html(globalDefaultCalendar.displayvalue); // 默认日历的名称
            if (!globalDefaultCalendar.isShared) {
                // 当前日历不是共享日历，不显示共享日历
                $('.defaultCalendar strong').css('visibility', 'hidden');
            } else {
                $('.defaultCalendar strong').css('visibility', 'visible');
            }

            this.isShow = false;
        },
    },
});






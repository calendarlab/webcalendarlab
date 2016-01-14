/**
 * @file 基于 vue.js 实现的事件提醒组件
 * @author BuptStEve <stevesasuke@139.com>
 * @version 1.0
 */

/**
 * 事件提醒组件中的单个事件提醒框类，暂时仅被 AlertWrapper 调用。其中「var alertComponent = 」部分仅仅为了生成文档
 *
 * @author BuptStEve <stevesasuke@139.com>
 * @class VC.alert-component (VC 表示 Vue Component)
 * @since version 1.0
 * @property {String}   template         - 作为组件的 html 的模板
 * @property {Object}   prop             - 作为组件的传入参数
 * @property {Boolean}  prop.isShow      - 作为是否被显示的标志
 * @example
    <component
        is = "alert-component"
        v-show = "item.isShow">

        <span class="alertColor" :style = "{backgroundColor: item.color};"></span>
        <span class="alertTitle">{{item.title}}</span>
        <span class="alertDetail">{{item.detail}}</span>
    </component>
 */
var alertComponent = Vue.component('alert-component', {
    template: "#alert-comp-tmpl",
    props: {
        isShow: {
            type: Boolean,
            default: true,
            twoWay: true
        },
    },
})

/**
 * 事件提醒组件类
 *
 * @author BuptStEve <stevesasuke@139.com>
 * @constructor AlertWrapper
 * @since version 1.0
 * @property {String} el                   - 作为组件的 html 的模板
 * @property {Object} data                 - 作为 Vue 组件的数据
 * @property {Boolean} data.isShow         - 作为是否显示组件的标志
 * @property {Array} data.alertItems       - 保存日事件提醒中各项提醒的内容数组
 * @example
    <div id="alertWrapper" v-show="isShow">
        <div v-for = "item in alertItems">
            <component
                is = "alert-component"
                v-show = "item.isShow">

                <span class="alertColor" :style = "{backgroundColor: item.color};"></span>
                <span class="alertTitle">{{item.title}}</span>
                <span class="alertDetail">{{item.detail}}</span>
            </component>
        </div>
    </div>
 */
var AlertWrapper = new Vue({
    el: '#alertWrapper',
    data: {
        isShow: true,
        alertItems: [
            // {
            //     isShow: true,
            //     color: '#0ff',
            //     title: '互联网电话会议',
            //     detail: '2015年1月8日 11:00 - 12:00',
            // },
        ],
    },
});

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






/**
 * @file 基于 vue.js 实现的联系人组件
 * @author BuptStEve <stevesasuke@139.com>
 * @version 1.0
 */

/**
 * 联系人组件中的单个人员组件类(搜索后的显示结果)，暂时仅被 Contacts 调用。其中「var contactUserComponent = 」部分仅仅为了生成文档
 *
 * @author BuptStEve <stevesasuke@139.com>
 * @class VC.contact-user-component (VC 表示 Vue Component)
 * @since version 1.0
 * @property {String}   template         - 作为组件的 html 的模板
 * @property {Object}   prop             - 作为组件的传入参数
 * @property {String}   prop.uid         - 作为是否需要重绘界面的判断标志
 * @property {String}   prop.mode        - 保存组件模式：1.subscribe 2.invite
 * @property {String}   prop.name        - 保存联系人的姓名(中文)。
 * @property {String}   prop.email       - 保存联系人的 e-mail。
 * @property {String}   prop.title       - 保存联系人的职位。
 * @property {String}   prop.mobile      - 保存联系人的手机号。
 * @property {String}   prop.telephone   - 保存联系人的固话号码。
 * @property {Object}   data             - 作为 Vue 组件的数据
 * @property {Boolean}  data.isActive    - 标志是否已被激活(显示√)
 * @property {Object}   methods          - 保存实例方法
 * @property {Object}   events           - 保存监听的各个事件，键是监听的事件，值是相应的回调。
 * @example
   <component
       v-for = "item in userData | filterBy searchQuery in searchFields"
       track-by = "uid"
       is = "contact-user-component"
       :mode = "mode"
       :uid = "item.uid"
       :email = "item.e_mail"
       :name = "item.name"
       :title = "item.title"
       :mobile = "item.mobile"
       :telephone = "item.telephone">
   </component>
 */
var contactUserComponent = Vue.component('contact-user-component', {
    template: "#contact-user-comp-tmpl",
    props: {
        uid      : { type: String, },
        mode     : { type: String, },
        name     : { type: String, },
        email    : { type: String, },
        title    : { type: String, },
        moblile  : { type: String, },
        telephone: { type: String, },
    },
    data: function() {
        return {
            isActive: false,
        }
    },
    methods: {
        /**
         * 当前联系人被点击，根据 mode 分两种情况：
         * 1. 订阅他人日历：调用 netSearchCalendar 函数查询该用户的日历，查询成功后弹出他人日历列表对话框。「待完成：在日历列表对话框中显示正在查询的标志。
         * 2. 邀请他人参与事件：根据激活状态(isActive)，调用 dispatch 方法发送 inviteUser 或 removeInviteUser 消息，同时将 uid 传给 parent。
         *
         * @event contactUserComponent#oneUserClick
         */
        oneUserClick: function() {
            if (this.mode === 'subscribe') {
                // 当前操作焦点在联系人对话框(不是添加邀请人状态)
                this.isActive = true
                netSearchCalendar(this.email);
                $('#addOthersCalendarDetail').css({
                    'top': $('#contacts').offset().top,
                    'left': $('#contacts').offset().left - 403,
                });
                $('#addOthersCalendarDetail').fadeIn('slow');
                $('.ezz').css('z-index', 31);
            }
            else if(this.mode === 'invite') {
                if (!this.isActive) {
                    this.$dispatch('inviteUser', this.uid)
                }
                else {
                    this.$dispatch('removeInviteUser', this.uid)
                }
                this.isActive = !this.isActive
            }
            else {
                alert('error mode')
            }
        },
        /**
         * 名片展示，待开发╮(╯_╰)╭
         *
         * @event contactUserComponent#userDetailClick
         */
        userDetailClick: function() {
            alert("名片展示，待开发╮(╯_╰)╭")
        },
    },
    events: {
        /**
         * 接收来自 parent 的消息，将取消激活状态。(可能场景例如订阅他人日历后返回)
         *
         * @event contactUserComponent#removeUserActive
         */
        'removeUserActive': function() {
            this.isActive = false
        },
        /**
         * 接收来自 parent 的消息，对比 theUID 匹配成功则置为激活状态。(可能场景例如读取某事件的邀请人后)
         *
         * @event contactUserComponent#addUserActive
         */
        'addUserActive': function(theUID) {
            if (this.uid === theUID) {
                this.isActive = true
            }
        },
    },
})

/**
 * 联系人选择和搜索组件类
 * @author BuptStEve <stevesasuke@139.com>
 * @constructor Contacts
 * @since version 1.0
 * @property {String}  el                        - 作为组件的 html 的模板
 * @property {Object}  data                      - 作为 Vue 组件的数据
 * @property {String}  data.mode                 - 保存组件模式：1.subscribe 2.invite
 * @property {Boolean} data.isShow               - 作为是否显示组件的标志
 * @property {Boolean} data.showQuery            - 作为是否显示查询结果的标志
 * @property {Number}  data.modalZ               - 保存遮罩层的 z-index 值
 * @property {String}  data.searchQuery          - 保存搜索词
 * @property {Array}   data.userData             - 保存用户数据
 * @property {Array}   data.groupData            - 保存部门数据
 * @property {Array}   data.inviteUser           - 保存已有邀请人数据
 * @property {Object}  components                - 保存 Vue 组件的内部组件
 * @property {Object}  components.departmentComp - 内部复用的部门-人员二级菜单组件
 * @property {Object}  methods                   - 保存实例方法
 * @property {Object}  events                    - 保存监听的各个事件，键是监听的事件，值是相应的回调。
 * @example
    <!-- 联系人对话框 -->
    <div id = "contacts" v-show = "isShow">
        ...代码太长见 index.html
    </div>
 */
var Contacts = new Vue({
    el: '#contacts',
    data: {
        mode        : '',
        isShow      : false,
        showQuery   : false,
        modalZ      : -1,
        searchQuery : '',
        searchFields: ['e_mail', 'name'],
        userData: [
            // {
            //     uid: 'cn=chenfeifei',
            //     e_mail: 'chenfeifei@example.com',
            //     name: '陈菲菲',
            //     title: 'N/A',
            //     mobile: '111 xxxx xxxx',
            //     telephone: '010 xxxxxx'
            // },
        ],
        groupData: [
            // {
            //     uid: '2210',
            //     name: '业务所',
            //     userID: ['0', '67'],
            // },
        ],
        inviteUser: [],
    },
    components: {
        /**
         * 部门-人员二级菜单组件
         *
         * @author BuptStEve <stevesasuke@139.com>
         * @since version 1.0
         * @property {String}  template         - 作为组件的 html 的模板
         * @property {Object}  prop             - 作为组件的传入参数
         * @property {String}  prop.uid         - 作为是否需要重绘界面的判断标志
         * @property {String}  prop.mode        - 保存组件模式：1.subscribe 2.invite
         * @property {String}  prop.name        - 保存部门名称
         * @property {Array}   prop.users       - 人员数组和 userData 相同
         * @property {Array}   prop.userID      - 保存部门下的人员(userData 中的下标)
         * @property {Object}  data             - 作为 Vue 组件的数据
         * @property {String}  data.title       - 保存部门名称和人数
         * @property {Boolean} data.isShowUser  - 作为部门是否展开的标志
         * @property {Object}  computed         - 保存 Vue 组件的动态计算的监听函数
         * @property {Object}  methods          - 保存实例方法
         * @property {Object}  events           - 保存监听的各个事件，键是监听的事件，值是相应的回调。
         * @example
            <component
                v-for = "group in groupData"
                track-by = "$index"
                v-show = "!showQuery"
                is = "departmentComp"
                :mode = "mode"
                :uid = "group.uid"
                :name = "group.name"
                :user-id = "group.userID"
                :users = "userData">
            </component>
         */
        departmentComp: {
            template: "#contact-department-comp-tmpl",
            props: {
                uid   : { type: String, },
                mode  : { type: String, },
                name  : { type: String, },
                users : { type: Array, },
                userID: { type: Array, },
            },
            data: function() {
                return {
                    title: '',
                    isShowUser: false,
                }
            },
            computed: {
                title: function() {
                    return this.name + '(' + this.userID.length + ')'
                }
            },
            methods: {
                /**
                 * 点击部门标题后，如果已显示了人员则将下拉列表收起，否则显示下拉列表并调用 dispatch 方法发送 oneHeaderClick 消息，同时将 uid 传给 parent。(将其他部门的下拉列表收起)
                 *
                 * @event departmentComp#groupHeaderClick
                 */
                groupHeaderClick: function() {
                    if (this.isShowUser) {
                        this.isShowUser = false
                    }
                    else {
                        this.isShowUser = true
                        this.$dispatch('oneHeaderClick', this.uid)
                    }
                }
            },
            events: {
                /**
                 * 接收来自 parent 的消息，对比 theUID 匹配不成功则收起下拉列表。(确保最多只显示一个部门的人员)
                 *
                 * @event departmentComp#closeHeader
                 */
                'closeHeader': function(theUID) {
                    if (this.uid !== theUID) {
                        this.isShowUser = false
                    }
                }
            },
        },
    },
    computed: {
        showQuery: function() {
            return this.searchQuery !== ''
        },
    },
    methods: {
        /**
         * 点击遮罩层后，保存当前状态并恢复初始状态。
         *
         * @event Contacts#modalDisableClick
         */
        modalDisableClick: function() {
            this.isShow = false;
            this.modalZ = -1;

            if (this.mode === 'subscribe') {
                this.searchQuery = ''
            }
            else if(this.mode === 'invite') {
                // 当前操作焦点在联系人对话框(添加邀请人状态)，将选中的联系人加入邀请名单
                this.searchQuery = ''
                var tmp_html     = "";
                var tmp_dataId   = "";

                for (var i = 0; i < this.inviteUser.length; i++) {
                    // 有勾选的联系人，加入 #addPartnerTxt 中
                    var userNum = this.inviteUser[i]

                    tmp_html   += "," + this.userData[userNum].name
                    tmp_dataId += "," + userNum
                }

                if (tmp_html != "") {
                    $('#addPartnerTxt').html(tmp_html.slice(1));
                    $('#addPartnerTxt').attr('data-id', tmp_dataId.slice(1));
                }
                else {
                    $('#addPartnerTxt').html('添加被邀请人...');
                    $('#addPartnerTxt').attr('data-id', '');
                }
                this.$broadcast('removeUserActive')
            }
            else {
                alert('error mode')
            }
        },
        /**
         * 供外部调用的方法，向子组件广播 removeUserActive 消息，将所有 contactUserComponent 组件置为非激活状态。
         *
         * @event Contacts#removeActive
         */
        removeActive: function() {
            this.$broadcast('removeUserActive')
        },
        /**
         * 读取已有邀请人的事件时，根据 inviteUser 中的已邀请人设置为 active。
         *
         * @event Contacts#addActive
         */
        addActive: function() {
            for (var i = 0; i < this.inviteUser.length; i++) {
                var userNum = this.inviteUser[i]
                this.$broadcast('addUserActive', this.userData[userNum].uid)
            }
        },
    },
    events: {
        /**
         * 收到子组件的 oneHeaderClick 消息后，向子组件广播 closeHeader 消息，将所有非 theUID 的部门都收起。
         *
         * @event Contacts#oneHeaderClick
         */
        'oneHeaderClick': function(theUID) {
            this.$broadcast('closeHeader', theUID)
        },
        /**
         * 将被邀请人在 userData 数组中的下标加入 inviteUser 数组
         *
         * @event Contacts#inviteUser
         */
        'inviteUser': function(theUID) {
            var isFound = false;
            var i = 0;
            for (i = 0; i < this.inviteUser.length; i += 1) {
                if (this.userData[this.inviteUser[i]].uid === theUID) {
                    isFound = true;
                    break;
                }
            }
            if (!isFound) {
                this.inviteUser.push(searchObjectArrayByProp(this.userData, theUID, 'uid'))
            }
        },
        /**
         * 将被邀请人从 inviteUser 数组中删除
         *
         * @event Contacts#removeInviteUser
         */
        'removeInviteUser': function(theUID) {
            var isFound = false;
            var i = 0;
            for (i = 0; i < this.inviteUser.length; i += 1) {
                if (this.userData[this.inviteUser[i]].uid === theUID) {
                    isFound = true;
                    break;
                }
            }
            if (isFound) {
                this.inviteUser.splice(i, 1);
            }
        },
    },
});



/**
 * @file 基于 vue.js 实现的邀请事件提醒展示组件
 * @author BuptStEve <stevesasuke@139.com>
 * @version 1.0
 */

/**
 * 邀请事件提醒展示组件中的按钮组件类(搜索后的显示结果)，共有4种模式：invitation/response/agreed/declined。被 invitationComp、responseComp、oldInvitationComp 组件调用。其中「var invitationInputBoxComponent = 」部分仅仅为了生成文档
 * 1. invitation: 拒绝、同意
 * 2. response:         好
 * 3. agreed:   拒绝，已同意
 * 4. declined: 已拒绝，同意
 *
 * @author BuptStEve <stevesasuke@139.com>
 * @class VC.invitation-inputbox-component (VC 表示 Vue Component)
 * @since version 1.0
 * @property {String} template         - 作为组件的 html 的模板
 * @property {Object} prop             - 作为组件的传入参数
 * @property {String} prop.compMode    - 保存组件模式
 * @property {Object} data             - 作为 Vue 组件的数据
 * @property {String} data.leftBtnTxt  - 左边的按钮显示的文字
 * @property {String} data.rightBtnTxt - 右边的按钮显示的文字
 * @property {Object} computed         - 保存 Vue 组件的动态计算的监听函数
 * @property {Object} methods          - 保存实例方法
 * @example
   <component
       is = "invitation-inputbox-component"
       :comp-mode = "mode">
   </component>
 */
var invitationInputBoxComponent = Vue.component('invitation-inputbox-component', {
    template: "#invitation-inputbox-comp-tmpl",
    props: {
        compMode: { type: String, },
    },
    data: function() {
        return {
            leftBtnTxt : '',
            rightBtnTxt: '',
        }
    },
    computed: {
        leftBtnTxt: function() {
            if (this.compMode == 'invitation' || this.compMode == 'agreed') {
                return '拒绝'
            }
            else if(this.compMode == 'response') {
                return ''
            }
            else if(this.compMode == 'declined') {
                return '已拒绝'
            }
            else {
                alert('compMode error!')
            }
        },
        rightBtnTxt: function() {
            if (this.compMode == 'invitation' || this.compMode == 'declined') {
                return '同意'
            }
            else if(this.compMode == 'response') {
                return '好'
            }
            else if(this.compMode == 'agreed') {
                return '已同意'
            }
            else {
                alert('compMode error!')
            }
        },
    },
    methods: {
        /**
         * 左侧按钮被点击
         *
         * @event invitationInputBoxComponent#leftBtnClick
         */
        leftBtnClick: function() {
            switch(this.compMode) {
                case 'invitation':
                case 'agreed':
                    this.$dispatch('declineComp')
                    break;
                case 'declined':
                case 'response':
                    console.log('btn error')
                    break;
                default:
                    alert('compMode error!')
                    break;
            }
        },
        /**
         * 右侧按钮被点击
         *
         * @event invitationInputBoxComponent#rightBtnClick
         */
        rightBtnClick: function() {
            switch(this.compMode) {
                case 'response':
                    this.$dispatch('deleteComp')
                    break;
                case 'invitation':
                case 'declined':
                    this.$dispatch('agreeComp')
                    break;
                case 'agreed':
                    console.log('btn error')
                    break;
                default:
                    alert('compMode error!')
                    break;
            }
        },
    },
});

/**
 * 联系人选择和搜索组件类
 * @author BuptStEve <stevesasuke@139.com>
 * @constructor Contacts
 * @since version 1.0
 * @property {String}  el                        - 作为组件的 html 的模板
 * @property {Object}  data                      - 作为 Vue 组件的数据
 * @property {Boolean} data.isShow               - 作为是否显示组件的标志
 * @property {Boolean} data.showNew              - 作为当前是否显示左侧的新事件邀请的标志
 * @property {Array}   data.partNewItems         - 保存新事件邀请中的数据
 * @property {Array}   data.partOldItems         - 保存已回复邀请中的数据
 * @property {Object}  components                - 保存 Vue 组件的内部组件
 * @property {Object}  components.invitationEventBoxPartNew - 内部复用的新事件邀请组件
 * @property {Object}  components.invitationEventBoxPartOld - 内部复用的已回复邀请组件
 * @property {Object}  events                    - 保存监听的各个事件，键是监听的事件，值是相应的回调。
 * @example
    <!-- 联系人对话框 -->
    <div id="invitationEventBox" v-show="isShow">
        ...代码太长见 index.html
    </div>
 */
var InvitationEventBox = new Vue({
    el: '#invitationEventBox',
    data: {
        isShow : false,
        showNew: true,
        partNewItems: [
            // {
            //     compView: 'invitationComp',
            //     uid: 'http://user08@ip:port/calendars/__uids__/10000000-0000-0000-0000-000000000008/EEBF5256-5596-40A5-9D92-B2A4B87BD705/',
            //     title: '互联网电话会议',
            //     time: '2015年8月15日 12:00 - 14:00',
            //     user: 'user 100',
            //     head: true,
            //     color: '#00f',
            //     obj: eventObj
            // },
        ],
        partOldItems: [
            // {
            //     uid: 'http://user08@ip:port/calendars/__uids__/10000000-0000-0000-0000-000000000008/EEBF5256-5596-40A5-9D92-B2A4B87BD708/',
            //     title: '互联网电话会议',
            //     time: '2015年8月15日 12:00 - 16:00',
            //     user: 'user 102',
            //     color: '#f00',
            //     mode: 'agreed',
            // },
        ],
    },
    components: {
        /**
         * 左侧新事件邀请组件
         *
         * @author BuptStEve <stevesasuke@139.com>
         * @since version 1.0
         * @property {String}  template                  - 作为组件的 html 的模板
         * @property {Object}  prop                      - 作为组件的传入参数
         * @property {Array}   prop.items                - 保存新事件邀请中的数据
         * @property {Object}  components                - 保存 Vue 组件的内部组件
         * @property {Object}  components.invitationComp - 内部复用的他人发起的邀请组件
         * @property {Object}  components.responseComp   - 内部复用的被邀请人的回复组件
         * @example
            <component
                is = "invitationEventBoxPartNew"
                :items = "partNewItems">
            </component>
         */
        invitationEventBoxPartNew: {
            template: "#invite-part-new-comp-tmpl",
            props:{
                items: { type: Array, },
            },
            components:{
                /**
                 * 单条新事件邀请组件（拒绝、同意）
                 *
                 * @author BuptStEve <stevesasuke@139.com>
                 * @since version 1.0
                 * @property {String}  template   - 作为组件的 html 的模板
                 * @property {Object}  prop       - 作为组件的传入参数
                 * @property {Boolean} prop.head  - 作为是否显示头部的标志
                 * @property {String}  prop.uid   - 作为是否需要重绘界面的判断标志
                 * @property {String}  prop.time  - 保存新事件邀请中的时间
                 * @property {String}  prop.user  - 保存新事件邀请中的邀请人
                 * @property {String}  prop.title - 保存新事件邀请中的标题
                 * @property {String}  prop.color - 保存新事件邀请中的颜色
                 * @property {Object}  events     - 保存监听的各个事件，键是监听的事件，值是相应的回调。
                 * @example
                    <component
                        :is = "item.compView"
                        :head = "item.head"
                        :uid = "item.uid"
                        :title = "item.title"
                        :time = "item.time"
                        :user = "item.user"
                        :color = "item.color"
                    />
                 */
                invitationComp: {
                    template: "#invitation-comp-tmpl",
                    props:{
                        head: {
                            type: Boolean,
                            default: true,
                        },
                        uid  : { type: String, },
                        time : { type: String, },
                        user : { type: String, },
                        title: { type: String, },
                        color: {
                            type: String,
                            default: '#66cbff',
                        },
                    },
                    events: {
                        /**
                         * 接收来自子组件 invitationInputBoxComponent 的 agreeComp 消息，继续向上传递
                         *
                         * @event invitationComp#agreeComp
                         */
                        'agreeComp': function() {
                            this.$dispatch('agreeNew', this.uid)
                        },
                        /**
                         * 接收来自子组件 invitationInputBoxComponent 的 declineComp 消息，继续向上传递
                         *
                         * @event invitationComp#declineComp
                         */
                        'declineComp': function() {
                            this.$dispatch('declineNew', this.uid)
                        },
                    },
                },
                /**
                 * 单条新事件回复组件（好）
                 *
                 * @author BuptStEve <stevesasuke@139.com>
                 * @since version 1.0
                 * @property {String}  template      - 作为组件的 html 的模板
                 * @property {Object}  prop          - 作为组件的传入参数
                 * @property {Boolean} prop.showHead - 作为是否显示头部的标志
                 * @property {String}  prop.uid      - 作为是否需要重绘界面的判断标志
                 * @property {String}  prop.time     - 保存新事件邀请中的时间
                 * @property {String}  prop.user     - 保存新事件邀请中的邀请人
                 * @property {String}  prop.title    - 保存新事件邀请中的标题
                 * @property {String}  prop.color    - 保存新事件邀请中的颜色
                 * @property {Object}  events        - 保存监听的各个事件，键是监听的事件，值是相应的回调。
                 * @example
                    <component
                        :is = "item.compView"
                        :head = "item.head"
                        :uid = "item.uid"
                        :title = "item.title"
                        :time = "item.time"
                        :user = "item.user"
                        :color = "item.color"
                    />
                 */
                responseComp: {
                    template: "#response-comp-tmpl",
                    props:{
                        showHead: {
                            type: Boolean,
                            default: true,
                        },
                        uid:   { type: String, },
                        time:  { type: String, },
                        user:  { type: String, },
                        title: { type: String, },
                        color: {
                            type: String,
                            default: '#66cbff',
                        },
                    },
                    events: {
                        /**
                         * 接收来自子组件 invitationInputBoxComponent 的 deleteComp 消息，继续向上传递
                         *
                         * @event responseComp#deleteComp
                         */
                        'deleteComp': function() {
                            this.$dispatch('deleteNew', this.uid)
                        },
                    },
                },
            },
        },
        /**
         * 右侧已回复邀请组件
         *
         * @author BuptStEve <stevesasuke@139.com>
         * @since version 1.0
         * @property {String}  template                     - 作为组件的 html 的模板
         * @property {Object}  prop                         - 作为组件的传入参数
         * @property {Array}   prop.items                   - 保存新事件邀请中的数据
         * @property {Object}  components                   - 保存 Vue 组件的内部组件
         * @property {Object}  components.oldInvitationComp - 内部复用的单条已回复邀请组件
         * @example
            <component
                is = "invitationEventBoxPartOld"
                :items = "partOldItems">
            </component>
         */
        invitationEventBoxPartOld: {
            template: "#invite-part-old-comp-tmpl",
            props: {
                items: { type: Array, },
            },
            components: {
                /**
                 * 单条已回复邀请组件（已同意 拒绝 、 同意 已拒绝）
                 *
                 * @author BuptStEve <stevesasuke@139.com>
                 * @since version 1.0
                 * @property {String}  template      - 作为组件的 html 的模板
                 * @property {Object}  prop          - 作为组件的传入参数
                 * @property {String}  prop.uid      - 作为是否需要重绘界面的判断标志
                 * @property {String}  prop.time     - 保存已回复邀请中的时间
                 * @property {String}  prop.user     - 保存已回复邀请中的邀请人
                 * @property {String}  prop.mode     - 保存已回复邀请中的模式
                 * @property {String}  prop.title    - 保存已回复邀请中的标题
                 * @property {String}  prop.color    - 保存已回复邀请中的颜色
                 * @property {Object}  events        - 保存监听的各个事件，键是监听的事件，值是相应的回调。
                 * @example
                    <component
                        is = "oldInvitationComp"
                        :uid = "item.uid"
                        :title = "item.title"
                        :time = "item.time"
                        :user = "item.user"
                        :color = "item.color"
                        :mode = "item.mode">
                    </component>
                 */
                oldInvitationComp: {
                    template: "#old-invitation-comp-tmpl",
                    props: {
                        uid  : { type: String, },
                        time : { type: String, },
                        user : { type: String, },
                        mode : { type: String, },
                        title: { type: String, },
                        color: { type: String, },
                    },
                    events: {
                        /**
                         * 接收来自子组件 invitationInputBoxComponent 的 agreeComp 消息，继续向上传递
                         *
                         * @event oldInvitationComp#agreeComp
                         */
                        'agreeComp': function() {
                            this.$dispatch('agreeOld', this.uid)
                        },
                        /**
                         * 接收来自子组件 invitationInputBoxComponent 的 declineComp 消息，继续向上传递
                         *
                         * @event oldInvitationComp#declineComp
                         */
                        'declineComp': function() {
                            this.$dispatch('declineOld', this.uid)
                        },
                    },
                },
            },
        },
    },
    events: {
        /**
         * 接收来自子组件的 deleteNew 消息，将该事件邀请提醒删除。(可能场景例如点击“好”)
         *
         * @event InvitationEventBox#deleteNew
         */
        'deleteNew': function(theUID) {
            var userNum = searchObjectArrayByProp(this.partNewItems, theUID, 'uid'); // 默认找得到_(:зゝ∠)_
            this.partNewItems.splice(userNum, 1);
            displayNewInvitationNumber(this.partNewItems.length);
        },
        /**
         * 接收来自子组件的 agreeNew 消息，同意他人的新事件邀请。(可能场景例如点击“同意”)
         *
         * @event InvitationEventBox#agreeNew
         */
        'agreeNew': function(theUID) {
            var userNum = searchObjectArrayByProp(this.partNewItems, theUID, 'uid'); // 默认找得到_(:зゝ∠)_
            changeVcalendarInvitation(this.partNewItems[userNum].obj, true);
            this.partNewItems.splice(userNum, 1);
            displayNewInvitationNumber(this.partNewItems.length);
        },
        /**
         * 接收来自子组件的 declineNew 消息，拒绝他人的新事件邀请。(可能场景例如点击“拒绝”)
         *
         * @event InvitationEventBox#declineNew
         */
        'declineNew': function(theUID) {
            var userNum = searchObjectArrayByProp(this.partNewItems, theUID, 'uid'); // 默认找得到_(:зゝ∠)_
            changeVcalendarInvitation(this.partNewItems[userNum].obj, false);
            this.partNewItems.splice(userNum, 1);
            displayNewInvitationNumber(this.partNewItems.length);
        },
        /**
         * 接收来自子组件的 agreeOld 消息，再次同意他人的事件邀请（已拒绝）。(可能场景例如点击“同意”)
         *
         * @event InvitationEventBox#agreeOld
         */
        'agreeOld': function(theUID) {
            var userNum = searchObjectArrayByProp(this.partOldItems, theUID, 'uid'); // 默认找得到_(:зゝ∠)_
            changeVcalendarInvitation(this.partOldItems[userNum].obj, true);
            this.partOldItems.splice(userNum, 1);
        },
        /**
         * 接收来自子组件的 declineOld 消息，再次拒绝他人的事件邀请（已同意）。(可能场景例如点击“拒绝”)
         *
         * @event InvitationEventBox#declineOld
         */
        'declineOld': function(theUID) {
            var userNum = searchObjectArrayByProp(this.partOldItems, theUID, 'uid'); // 默认找得到_(:зゝ∠)_
            changeVcalendarInvitation(this.partOldItems[userNum].obj, false);
            this.partOldItems.splice(userNum, 1);
        },
    },
});

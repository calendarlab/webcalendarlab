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

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



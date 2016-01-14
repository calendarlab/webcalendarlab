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

Vue.component('alert-component', {
    template: "#alert-comp-tmpl",
    props: {
        isShow: {
            type: Boolean,
            default: true,
            twoWay: true
        },
        type: {
            type: String
        },
        dismissable: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
            default: 0
        },
    },
    watch: {
        show: function(val) {
            if (this._timeout) {
                clearTimeout(this._timeout)
            }
            if (val && !!this.duration) {
                this._timeout = setTimeout(function() {
                    this.show = false
                }, this.duration)
            }
        }
    },
})

var AlertWrapper = new Vue({
    el: '#AlertWrapper',
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
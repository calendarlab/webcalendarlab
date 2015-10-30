

// 勾选全天时，设置提醒的弹出框
var AllDayAlertSelect = new Vue({
    el: '#allDayAlertSelectWrapper',
    data: {
        isShow: false,      // 自身是否显示
        isDIY: false,       // 无/自定义
        timeTXT: '',        // 动态显示自定义时间
        dayCount: 0,        // 提前几天
        timeDayTXT: '天前', // 文本
        hourCount: 0,       // 提前几小时
        timeHourTXT: '时',  // 文本
        modalZ: -1,         // 遮罩层z-index
    },
    computed: {
        timeTXT: function() {
            return this.dayCount + this.timeDayTXT + this.hourCount + this.timeHourTXT;
        }
    },
    methods: {
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
    components: {
        // 复用的时间选择组件
        time_count_comp: {
            props: {
                // 传入参数
                count: {
                    type: Number, 
                    twoWay: true,
                },
                time_txt: String, 
                count_type: String,
            },
            template: "#time-count-comp-tmpl",
            filters: {
                // 过滤器
                numberDisplay: {
                    // 利用timeLimit函数保证合法范围，parseInt过滤小数,write表示将过滤后的变量保存
                    // （由于双向绑定，input中的内容是过滤后的正确值）
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
                    /* 功能：根据countType验证val是否在范围内(非数字不在范围内)
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
});
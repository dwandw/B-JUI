/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/b-jui)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-core.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/b-jui/blob/master/BJUI/js/bjui-core.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    var BJUI = {
        JSPATH     : 'BJUI/',
        PLUGINPATH : 'BJUI/plugins/',
        IS_DEBUG   : false,
        keyCode: {
            ENTER : 13, ESC  : 27, END: 35, HOME: 36,
            SHIFT : 16, TAB  : 9,
            LEFT  : 37, RIGHT: 39, UP : 38, DOWN: 40,
            DELETE: 46, BACKSPACE: 8
        },
        eventType: {
            initUI         : 'bjui.initUI',         // When document load completed or ajax load completed, B-JUI && Plugins init 
            beforeInitUI   : 'bjui.beforeInitUI',   // If your DOM do not init [add to DOM attribute 'data-noinit="true"']
            afterInitUI    : 'bjui.afterInitUI',    // 
            ajaxStatus     : 'bjui.ajaxStatus',     // When performing ajax request, display or hidden progress bar
            resizeGrid     : 'bjui.resizeGrid',     // When the window or dialog resize completed
            beforeAjaxLoad : 'bjui.beforeAjaxLoad', // When perform '$.fn.ajaxUrl', to do something...
            
            beforeLoadNavtab  : 'bjui.beforeLoadNavtab',
            beforeLoadDialog  : 'bjui.beforeLoadDialog',
            afterLoadNavtab   : 'bjui.afterLoadNavtab',
            afterLoadDialog   : 'bjui.afterLoadDialog',
            beforeCloseNavtab : 'bjui.beforeCloseNavtab',
            beforeCloseDialog : 'bjui.beforeCloseDialog',
            afterCloseNavtab  : 'bjui.afterCloseNavtab',
            afterCloseDialog  : 'bjui.afterCloseDialog'
        },
        pageInfo: {pageCurrent:'pageCurrent', pageSize:'pageSize', orderField:'orderField', orderDirection:'orderDirection'},
        ajaxTimeout: 3000,
        statusCode: {ok:200, error:300, timeout:301},
        keys: {statusCode:'statusCode', message:'message'},
        ui: {
            showSlidebar: true, // After the B-JUI initialization, display slidebar
            hideMode: 'display' // Hidden mode when switching Navtab, optional values ​​are ’display’ or ’offsets’, 'display' is default.
        },
        debug: function(msg) {
            if (this.IS_DEBUG) {
                if (typeof(console) != 'undefined') console.log(msg)
                else alert(msg)
            }
        },
        loginInfo: {
            url    : 'login.html',
            title  : 'Login',
            width  : 420,
            height : 260,
            mask   : true
        },
        loadLogin: function() {
            var login = this.loginInfo
            
            $('body').dialog({id:'bjui-login', url:login.url, title:login.title, width:login.width, height:login.height, mask:login.mask})
        },
        init: function(options) {
            var op = $.extend({}, options)
            
            $.extend(BJUI.statusCode, op.statusCode)
            $.extend(BJUI.pageInfo, op.pageInfo)
            $.extend(BJUI.loginInfo, op.loginInfo)
            $.extend(BJUI.ui, op.ui)
            
            if (op.ajaxTimeout) this.ajaxTimeout = op.ajaxTimeout
            if (!op.ui.showSlidebar) $('#bjui-leftside').slidebar('hide')
            
            this.IS_DEBUG = op.debug || false
            this.initEnv()
            
            if ((!$.cookie || !$.cookie('bjui_theme')) && op.theme) $(this).theme('setTheme', op.theme)
        },
        initEnv: function() {
            if ($('#bjui-hnav')) {
                var h = $('#bjui-hnav').height() + $('#bjui-header').outerHeight() + 5
                
                $('#bjui-leftside, #bjui-container, #bjui-splitBar, #bjui-splitBarProxy').css({top:h})
            }
            
            $(window).resize(function() {
                BJUI.initLayout()
                $(this).trigger(BJUI.eventType.resizeGrid)
            })

            setTimeout(function() {
                BJUI.initLayout()
                $(document).initui()
            }, 10)
        },
        initLayout: function() {
            var iContentW = $(window).width() - (BJUI.ui.showSlidebar ? $('#bjui-sidebar').width() + 10 : 31) - 5
            var iContentH = $(window).height() - $('#bjui-header').height() - $('#bjui-hnav').outerHeight() - 31
            var topH      = $('#bjui-hnav').height() + $('#bjui-header').outerHeight() + 5
            var collH     = $('#bjui-hnav').find('.navbar-collapse').height()
            
            $('#bjui-leftside, #bjui-container, #bjui-splitBar, #bjui-splitBarProxy').css({top:topH})
            $('#bjui-container').width(iContentW)
            $('#bjui-container .tabsPageContent').height(iContentH - 31).find('[data-layout-h]').layoutH()
            $('#bjui-sidebar, #bjui-sidebar-s .collapse, #bjui-splitBar, #bjui-splitBarProxy').height(iContentH - 5)
            $('#bjui-taskbar').css({top: iContentH + $('#bjui-header').height() + 5, width:$(window).width()})
        },
        regional: {},
        setRegional: function(key, value) {
            BJUI.regional[key] = value
        }
    }
    
    window.BJUI = BJUI
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-regional.zh-CN.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-regional.zh-CN.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    $(function() {
        
        /* 消息提示框 */
        BJUI.setRegional('alertmsg', {
            title  : {error : '错误提示', info : '信息提示', warn : '警告信息', correct : '成功信息', confirm : '确认信息'},
            btnMsg : {ok    : '确定', yes  : '是',   no   : '否',   cancel  : '取消'}
        })
        
        /* dialog */
        BJUI.setRegional('dialog', {
            close    : '关闭',
            maximize : '最大化',
            restore  : '还原',
            minimize : '最小化',
            title    : '弹出窗口'
        })
        
        /* order by */
        BJUI.setRegional('orderby', {
            asc  : '升序',
            desc : '降序'
        })
        
        /* 分页 */
        BJUI.setRegional('pagination', {
            first  : '首页',
            last   : '末页',
            prev   : '上一页',
            next   : '下一页',
            jumpto : '跳转页号',
            jump   : '跳转'
        })
        
        /* ajax加载提示 */
        BJUI.setRegional('progressmsg', '正在努力加载数据，请稍等...')
        
        /* 日期选择器 */
        BJUI.setRegional('datepicker', {
            close      : '关闭',
            prev       : '上月',
            next       : '下月',
            clear      : '清空',
            ok         : '确定',
            dayNames   : ['日', '一', '二', '三', '四', '五', '六'],
            monthNames : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        })
        
        /* navtab右键菜单  */
        BJUI.setRegional('navtabCM', {
            refresh    : '刷新本标签',
            close      : '关闭本标签',
            closeother : '关闭其他标签',
            closeall   : '关闭所有标签'
        })
        
        /* dialog右键菜单 */
        BJUI.setRegional('dialogCM', {
            refresh    : '刷新本窗口',
            close      : '关闭本窗口',
            closeother : '关闭其他窗口',
            closeall   : '关闭所有窗口'
        })
        
        /* upload按钮提示 */
        BJUI.setRegional('upload', {
            upConfirm    : '开始上传',
            upPause      : '暂停上传',
            upCancel     : '取消上传'
        })
    
        /* 503错误提示 */
        BJUI.setRegional('statusCode_503', '服务器当前负载过大或者正在维护！')
        
        /* timeout提示 */
        BJUI.setRegional('sessiontimeout', '会话超时，请重新登陆！')
        
        /* 占位符对应选择器无有效值提示 */
        BJUI.setRegional('plhmsg', '占位符对应的选择器无有效值！')
        
        /* 未定义复选框组名提示 */
        BJUI.setRegional('nocheckgroup', '未定义选中项的组名[复选框的"data-group"]！')
        
        /* 未选中复选框提示 */
        BJUI.setRegional('notchecked', '未选中任何一项！')
        
        /* 未选中下拉菜单提示 */
        BJUI.setRegional('selectmsg', '请选择一个选项！')
        
        /* 表单验证错误提示信息 */
        BJUI.setRegional('validatemsg', '提交的表单中 [{0}] 个字段有错误，请更正后再提交！')
        
        /* 框架名称 */
        BJUI.setRegional('uititle', 'B-JUI')
        
        /* 主navtab标题 */
        BJUI.setRegional('maintab', '我的主页')
        
        /**
         * 
         *  Plugins regional setting
         * 
         */
        /* nice validate - Global configuration */
        $.validator.config({
            //stopOnError: false,
            //theme: 'yellow_right',
            defaultMsg: "{0}格式不正确",
            loadingMsg: "正在验证...",
            
            // Custom rules
            rules: {
                digits: [/^\d+$/, '请输入整数']
                ,number: [/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/, '请输入有效的数字']
                ,letters: [/^[a-z]+$/i, '{0}只能输入字母']
                ,tel: [/^(?:(?:0\d{2,3}[\- ]?[1-9]\d{6,7})|(?:[48]00[\- ]?[1-9]\d{6}))$/, '电话格式不正确']
                ,mobile: [/^1[3-9]\d{9}$/, '手机号格式不正确']
                ,email: [/^[\w\+\-]+(\.[\w\+\-]+)*@[a-z\d\-]+(\.[a-z\d\-]+)*\.([a-z]{2,4})$/i, '邮箱格式不正确']
                ,qq: [/^[1-9]\d{4,}$/, 'QQ号格式不正确']
                //,date: [/^\d{4}-\d{1,2}-\d{1,2}$/, '请输入正确的日期,例:yyyy-mm-dd']
                ,date:[/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/, '请输入正确的日期，例：yyyy-MM-dd']
                //,time: [/^([01]\d|2[0-3])(:[0-5]\d){1,2}$/, '请输入正确的时间,例:14:30或14:30:00']
                ,time: [/^(2[0123]|(1|0?)[0-9]){1}:([0-5][0-9]){1}:([0-5][0-9]){1}$/, '请输入正确的时间，例：HH:mm:ss']
                ,datetime: [/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(2[0123]|(1|0?)[0-9]){1}:([0-5][0-9]){1}:([0-5][0-9]){1}$/,
                            '请输入正确的日期时间，例：yyyy-MM-dd HH:mm:ss']
                ,ID_card: [/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/, '请输入正确的身份证号码']
                ,url: [/^(https?|ftp):\/\/[^\s]+$/i, '网址格式不正确']
                ,postcode: [/^[1-9]\d{5}$/, '邮政编码格式不正确']
                ,chinese: [/^[\u0391-\uFFE5]+$/, '请输入中文']
                ,username: [/^\w{3,12}$/, '请输入3-12位数字、字母、下划线']
                ,password: [/^[0-9a-zA-Z]{6,16}$/, '密码由6-16位数字、字母组成']
                ,accept: function (element, params){
                    if (!params) return true
                    
                    var ext = params[0]
                    
                    return (ext === '*') ||
                           (new RegExp('.(?:' + (ext || 'png|jpg|jpeg|gif') + ')$', 'i')).test(element.value) ||
                           this.renderMsg('只接受{1}后缀', ext.replace('|', ','))
                }
                
            }
        })

        /* nice validate - Default error messages */
        $.validator.config({
            messages: {
                required: '{0}不能为空',
                remote: '{0}已被使用',
                integer: {
                    '*': '请输入整数',
                    '+': '请输入正整数',
                    '+0': '请输入正整数或0',
                    '-': '请输入负整数',
                    '-0': '请输入负整数或0'
                },
                match: {
                    eq: '{0}与{1}不一致',
                    neq: '{0}与{1}不能相同',
                    lt: '{0}必须小于{1}',
                    gt: '{0}必须大于{1}',
                    lte: '{0}必须小于或等于{1}',
                    gte: '{0}必须大于或等于{1}'
                },
                range: {
                    rg: '请输入{1}到{2}的数',
                    gte: '请输入大于或等于{1}的数',
                    lte: '请输入小于或等于{1}的数'
                },
                checked: {
                    eq: '请选择{1}项',
                    rg: '请选择{1}到{2}项',
                    gte: '请至少选择{1}项',
                    lte: '请最多选择{1}项'
                },
                length: {
                    eq: '请输入{1}个字符',
                    rg: '请输入{1}到{2}个字符',
                    gte: '请至少输入{1}个字符',
                    lte: '请最多输入{1}个字符',
                    eq_2: '',
                    rg_2: '',
                    gte_2: '',
                    lte_2: ''
                }
            }
        })
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-frag.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.frag.xml (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-frag.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';

    BJUI.setRegional('alertmsg', {
        title  : {error : 'Error', info : 'Info', warn : 'Warning', correct : 'Correct', confirm : 'Confirm'},
        btnMsg : {ok    : 'OK',    yes  : 'YES',  no   : 'NO',      cancel  : 'Cancel'}
    })
    
    BJUI.setRegional('dialog', {
        close    : 'Close',
        maximize : 'Maximize',
        restore  : 'Restore',
        minimize : 'Minimize',
        title    : 'Popup window'
    })
    
    BJUI.setRegional('orderby', {
        asc  : 'Asc',
        desc : 'Desc'
    })
    
    BJUI.setRegional('pagination', {
        first  : 'First page',
        last   : 'Last page',
        prev   : 'Prev page',
        next   : 'Next page',
        jumpto : 'Jump page number',
        jump   : 'Jump'
    })
    
    BJUI.setRegional('progressmsg', 'Data loading, please waiting...')
    
    BJUI.setRegional('datepicker', {
        close      : 'Close',
        prev       : 'Prev month',
        next       : 'Next month',
        clear      : 'Clear',
        ok         : 'OK',
        dayNames   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNames : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    })
    
    BJUI.setRegional('navtabCM', {
        refresh    : 'Refresh navtab',
        close      : 'Close navtab',
        closeother : 'Close other navtab',
        closeall   : 'Close all navtab'
    })
    
    BJUI.setRegional('dialogCM', {
        refresh    : 'Refresh dialog',
        close      : 'Close dialog',
        closeother : 'Close other dialog',
        closeall   : 'Close all dialog'
    })
    
    BJUI.setRegional('upload', {
        upConfirm    : 'Start upload',
        upPause      : 'Pause upload',
        upCancel     : 'Cancel upload'
    })
    
    BJUI.setRegional('statusCode_503', 'The current server load is too large or is down for maintenance!')
    
    BJUI.setRegional('sessiontimeout', 'Session timeout, please login!')
    
    BJUI.setRegional('plhmsg', 'Placeholder corresponding selector None Valid!')
    
    BJUI.setRegional('nocheckgroup', 'Undefined group name selected item [check box "data-group"]!')
    
    BJUI.setRegional('notchecked', 'Unchecked any one!')
    
    BJUI.setRegional('selectmsg', 'Please select one option!')
    
    BJUI.setRegional('validatemsg', 'Submitted form data has [{0}] field an error, please after modified submitting!')
    
    BJUI.setRegional('uititle', 'B-JUI')
    
    BJUI.setRegional('maintab', 'My home')
    
    
    window.FRAG = {
        dialog: '<div class="bjui-dialog bjui-dialog-container" style="top:150px; left:300px;">' +
                '    <div class="dialogHeader" onselectstart="return false;" oncopy="return false;" onpaste="return false;" oncut="return false;">' +
                '        <a class="close" href="#close" title="#close#"><i class="fa fa-times-circle"></i></a>' +
                '        <a class="maximize" href="#maximize" title="#maximize#"><i class="fa fa-plus-circle"></i></a>' +
                '        <a class="restore" href="#restore" title="#restore#"><i class="fa fa-circle"></i></a>' +
                '        <a class="minimize" href="#minimize" title="#minimize#"><i class="fa fa-minus-circle"></i></a>' +
                '        <h1><span><i class="fa fa-th-large"></i></span> <span class="title">#title#</span></h1>' +
                '    </div>' +
                '    <div class="dialogContent layoutBox unitBox"></div>' +
                '    <div class="resizable_h_l" tar="nw"></div>' +
                '    <div class="resizable_h_r" tar="ne"></div>' +
                '    <div class="resizable_h_c" tar="n"></div>' +
                '    <div class="resizable_c_l" tar="w" style="height:100%;"></div>' +
                '    <div class="resizable_c_r" tar="e" style="height:100%;"></div>' +
                '    <div class="resizable_f_l" tar="sw"></div>' +
                '    <div class="resizable_f_r" tar="se"></div>' +
                '    <div class="resizable_f_c" tar="s"></div>' +
                '</div>'
        ,
        dialogProxy: '<div id="bjui-dialogProxy" class="bjui-dialog dialogProxy" style="display:none;">' +
                     '    <div class="dialogHeader">' +
                     '        <a class="close" href="#close" title="#close#"><i class="fa fa-times-circle"></i></a>' +
                     '        <a class="maximize" href="#maximize" title="#maximize#"><i class="fa fa-plus-circle"></i></a>' +
                     '        <a class="minimize" href="#minimize" title="#minimize#"><i class="fa fa-minus-circle"></i></a>' +
                     '        <h1><span><i class="fa fa-th-large"></i></span> <span class="title">#title#</span></h1>' +
                     '    </div>' +
                     '    <div class="dialogContent"></div>' +
                     '</div>'
        ,
        taskbar: '<div id="bjui-taskbar" style="left:0px; display:none;">' +
                 '    <div class="taskbarContent">' +
                 '        <ul></ul>' +
                 '    </div>' +
                 '    <div class="taskbarLeft taskbarLeftDisabled"><i class="fa fa-angle-double-left"></i></div>' +
                 '    <div class="taskbarRight"><i class="fa fa-angle-double-right"></i></div>' +
                 '</div>'
        ,
        splitBar: '<div id="bjui-splitBar"></div>',
        splitBarProxy: '<div id="bjui-splitBarProxy"></div>',
        resizable: '<div id="bjui-resizable" class="bjui-resizable"></div>',
        alertBackground: '<div class="bjui-alertBackground"></div>',
        maskBackground: '<div class="bjui-maskBackground"></div>',
        maskProgress: '<div class="bjui-maskProgress"><i class="fa fa-cog fa-spin"></i>&nbsp;&nbsp;#msg#</div>',
        progressBar_custom: '<div id="bjui-progressBar-custom" class="progressBar"><i class="fa fa-cog fa-spin"></i> <span></span></div>',
        dialogMask: '<div class="bjui-dialogBackground"></div>',
        orderby: '<a href="javascript:;" class="order asc" data-order-direction="asc" title="#asc#"><i class="fa fa-angle-up"></i></a>' +
                 '<a href="javascript:;" class="order desc" data-order-direction="desc" title="#desc#"><i class="fa fa-angle-down"></i></a>'
        ,
        pagination: '<ul class="pagination">' +
                    '    <li class="j-first">' +
                    '        <a class="first" href="javascript:;"><i class="fa fa-step-backward"></i> #first#</a>' +
                    '        <span class="first"><i class="fa fa-step-backward"></i> #first#</span>' +
                    '    </li>' +
                    '    <li class="j-prev">' +
                    '        <a class="previous" href="javascript:;"><i class="fa fa-backward"></i> #prev#</a>' +
                    '        <span class="previous"><i class="fa fa-backward"></i> #prev#</span>' +
                    '    </li>' +
                    '    #pageNumFrag#' +
                    '    <li class="j-next">' +
                    '        <a class="next" href="javascript:;">#next# <i class="fa fa-forward"></i></a>' +
                    '        <span class="next">#next# <i class="fa fa-forward"></i></span>' +
                    '    </li>' +
                    '    <li class="j-last">' +
                    '        <a class="last" href="javascript:;">#last# <i class="fa fa-step-forward"></i></a>' +
                    '        <span class="last">#last# <i class="fa fa-step-forward"></i></span>' +
                    '    </li>' +
                    '    <li class="jumpto"><span class="p-input"><input class="form-control input-sm-pages" type="text" size="2.6" value="#pageCurrent#" title="#jumpto#"></span><a class="goto" href="javascript:;" title="#jump#"><i class="fa fa-chevron-right"></i></a></li>' +
                    '</ul>'
        ,
        alertBoxFrag: '<div id="bjui-alertMsgBox" class="bjui-alert"><div class="alertContent"><div class="#type#"><div class="alertInner"><h1><i class="fa #fa#"></i>#title#</h1><div class="msg">#message#</div></div><div class="toolBar"><ul>#btnFragment#</ul></div></div></div></div>',
        alertBtnFrag: '<li><button class="btn btn-#class#" rel="#callback#" type="button">#btnMsg#</button></li>',
        calendarFrag: '<div id="bjui-calendar">' +
                      '    <div class="main">' +
                      '        <a class="close" href="javascript:;" title="#close#"><i class="fa fa-times-circle"></i></a>' +
                      '        <div class="head">' +
                      '            <table width="100%" border="0" cellpadding="0" cellspacing="2">' +
                      '                <tr>' +
                      '                    <td width="20"><a class="prev" href="javascript:;" title="#prev#"><i class="fa fa-arrow-left"></i></a></td>' +
                      '                    <td><select name="year"></select></td>' +
                      '                    <td><select name="month"></select></td>' +
                      '                    <td width="20"><a class="next" href="javascript:;" title="#next#"><i class="fa fa-arrow-right"></i></a></td>' +
                      '                </tr>' +
                      '            </table>' +
                      '        </div>' +
                      '        <div class="body">' +
                      '            <dl class="dayNames"><dt>7</dt><dt>1</dt><dt>2</dt><dt>3</dt><dt>4</dt><dt>5</dt><dt>6</dt></dl>' +
                      '            <dl class="days"><!-- date list --></dl>' +
                      '            <div style="clear:both;height:0;line-height:0"></div>' +
                      '        </div>' +
                      '        <div class="foot">' +
                      '            <table class="time">' +
                      '                <tr>' +
                      '                    <td>' +
                      '                        <input type="text" class="hh" maxlength="2" data-type="hh" data-start="0" data-end="23">:<input' +
                      '                         type="text" class="mm" maxlength="2" data-type="mm" data-start="0" data-end="59">:<input' +
                      '                         type="text" class="ss" maxlength="2" data-type="ss" data-start="0" data-end="59">' +
                      '                    </td>' +
                      '                    <td><ul><li class="up" data-add="1">&and;</li><li class="down">&or;</li></ul></td>' +
                      '                </tr>' +
                      '            </table>' +
                      '            <button type="button" class="clearBtn btn btn-orange">#clear#</button>' +
                      '            <button type="button" class="okBtn btn btn-default">#ok#</button>' +
                      '        </div>' +
                      '        <div class="tm">' +
                      '            <ul class="hh">' +
                      '                <li>0</li>' +
                      '                <li>1</li>' +
                      '                <li>2</li>' +
                      '                <li>3</li>' +
                      '                <li>4</li>' +
                      '                <li>5</li>' +
                      '                <li>6</li>' +
                      '                <li>7</li>' +
                      '                <li>8</li>' +
                      '                <li>9</li>' +
                      '                <li>10</li>' +
                      '                <li>11</li>' +
                      '                <li>12</li>' +
                      '                <li>13</li>' +
                      '                <li>14</li>' +
                      '                <li>15</li>' +
                      '                <li>16</li>' +
                      '                <li>17</li>' +
                      '                <li>18</li>' +
                      '                <li>19</li>' +
                      '                <li>20</li>' +
                      '                <li>21</li>' +
                      '                <li>22</li>' +
                      '                <li>23</li>' +
                      '            </ul>' +
                      '            <ul class="mm">' +
                      '                <li>0</li>' +
                      '                <li>5</li>' +
                      '                <li>10</li>' +
                      '                <li>15</li>' +
                      '                <li>20</li>' +
                      '                <li>25</li>' +
                      '                <li>30</li>' +
                      '                <li>35</li>' +
                      '                <li>40</li>' +
                      '                <li>45</li>' +
                      '                <li>50</li>' +
                      '                <li>55</li>' +
                      '            </ul>' +
                      '            <ul class="ss">' +
                      '                <li>0</li>' +
                      '                <li>10</li>' +
                      '                <li>20</li>' +
                      '                <li>30</li>' +
                      '                <li>40</li>' +
                      '                <li>50</li>' +
                      '            </ul>' +
                      '        </div>' +
                      '    </div>' +
                      '</div>'
        ,
        spinnerBtn: '<ul class="bjui-spinner"><li class="up" data-add="1">&and;</li><li class="down">&or;</li></ul>',
        lookupBtn: '<a class="bjui-lookup" href="javascript:;" data-toggle="lookupbtn"><i class="fa fa-search"></i></a>',
        dateBtn: '<a class="bjui-lookup" href="javascript:;" data-toggle="datepickerbtn"><i class="fa fa-calendar"></i></a>',
        navtabCM: '<ul id="bjui-navtabCM">' +
                  '    <li rel="reload">#refresh#</li>' +
                  '    <li rel="closeCurrent">#close#</li>' +
                  '    <li rel="closeOther">#closeother#</li>' +
                  '    <li rel="closeAll">#closeall#</li>' +
                  '</ul>'
        ,
        dialogCM: '<ul id="bjui-dialogCM">' +
                  '    <li rel="reload">#refresh#</li>' +          
                  '    <li rel="closeCurrent">#close#</li>' +
                  '    <li rel="closeOther">#closeother#</li>' +
                  '    <li rel="closeAll">#closeall#</li>' +
                  '</ul>'
        ,
        externalFrag: '<iframe src="{url}" style="width:100%;height:{height};" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>',
        uploadTemp: '<div id="{fileId}" class="item">' +
                    '    <div class="info">' + 
                    '        <span class="up_filename">{fileName}</span><span class="up_confirm" title="#upConfirm#"><i class="fa fa-play-circle-o"></i></span><span class="up_pause" title="#upPause#"><span class="glyphicon glyphicon-pause"></span></span><span class="up_cancel" title="#upCancel#"><i class="fa fa-times-circle-o"></i></span>' +
                    '    </div>' +
                    '    <div class="preview"><span class="img"></span></div>' +
                    '    <div class="progress"><div class="bar"></div></div>' +
                    '    <span class="percent">{percent}</span>' +
                    '    <span class="filesize"><span class="uploadedsize">{uploadedSize}</span>/<span class="totalsize">{fileSize}</span></span>' +
                    '</div>'
        ,
        uploadFrag: '<input class="bjui-upload-select-file" style="display:none;" type="file" name="fileselect[]" #multi# accept="#accept#">'+
                    '<a href="javascript:void(0)" class="btn btn-default bjui-upload-select">#btnTxt#</a>' +
                    '<div class="queue"></div>'
        ,
        statusCode_503: 'HTTP status 503, #statusCode_503#',
        sessionTimout: '#sessiontimeout#',
        alertPlhMsg: '#plhmsg#',
        alertNoCheckGroup: '#nocheckgroup#',
        alertNotChecked: '#notchecked#',
        alertSelectMsg: '#selectmsg#',
        validateErrorMsg: '#validatemsg#',
        uiTitle: '#uititle#',
        mainTabTitle: '#mynavtab#'
    }
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-extends.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-extends.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    $.fn.extend({
        /**
         * @param {Object} op: {type:GET/POST, url:ajax请求地址, data:ajax请求参数列表, callback:回调函数 }
         */
        ajaxUrl: function(op) {
            var $this = $(this)
            
            $this.trigger(BJUI.eventType.beforeAjaxLoad).trigger(BJUI.eventType.ajaxStatus)
            
            $.ajax({
                type     : op.type || 'GET',
                url      : op.url,
                data     : op.data || {},
                cache    : false,
                dataType : 'text',
                timeout  : BJUI.ajaxTimeout,
                success  : function(response) {
                    var json = response.toJson()
                    
                    if (json[BJUI.keys.statusCode] == BJUI.statusCode.error) {
                        if (json[BJUI.keys.message]) $this.alertmsg('error', json[BJUI.keys.message])
                    } else {
                        $this.html(response).initui()
                        if ($.isFunction(op.callback)) op.callback(response)
                    }
                    if (json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) {
                        $this.alertmsg('error', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout),
                            { okCall:function() { BJUI.loadLogin() } }
                        )
                    }
                },
                error      : BJUI.ajaxError,
                statusCode : {
                    503: function(xhr, ajaxOptions, thrownError) {
                        alert(FRAG.statusCode_503.replace('#statusCode_503#', BJUI.regional.statusCode_503) || thrownError)
                    }
                }
            })
        },
        loadUrl: function(url,data,callback) {
            $(this).ajaxUrl({url:url, data:data, callback:callback})
        },
        /**
         * adjust component inner reference box height
         * @param {Object} refBox: reference box jQuery Obj
         */
        layoutH: function($refBox) {
            return this.each(function() {
                var $this     = $(this)
                var $target   = null
                var $fixedBox = null
                var $unitBox  = null
                
                if ($refBox && $refBox.length) $this.data('bjui.layout', ($target = $refBox))
                else $target  = $this.data('bjui.layout') || $this.closest('div.layoutBox')
                
                var iRefH     = $target.height()
                var iLayoutH  = parseInt($this.data('layoutH')) || 0
                var iH        = 0
                
                if (!iLayoutH) {
                    $unitBox = $this.closest('div.bjui-layout')
                    if (!$unitBox.length) $unitBox = $this.closest('div.unitBox')
                    $fixedBox  = $unitBox.find('.bjui-tablefixed')
                    
                    var fixedH     = 0
                    var fixedBoxH  = 0
                    var fixedTh    = 0
                    
                    $unitBox.find('[data-layout-fixed]').each(function(i) {
                        var $fixed = $(this)
                        
                        if (!$fixed.closest('.bjui-layout').length || $target.hasClass('bjui-layout')) {
                            fixedH = fixedH + $fixed.outerHeight() || 0
                        }
                    })
                    
                    if (!$fixedBox.hasClass('fixedH') && $fixedBox.length && (!$fixedBox.closest('.bjui-layout').length || $target.hasClass('bjui-layout'))) {
                        if ($fixedBox[0].scrollWidth > $fixedBox[0].clientWidth || $fixedBox[0].scrollWidth > $fixedBox[0].offsetWidth) {
                            fixedBoxH = $fixedBox[0].offsetHeight - $fixedBox[0].clientHeight
                        }
                        fixedTh = $fixedBox.find('.fixedtableHeader').outerHeight() || 0
                    }
                    iH = iRefH - fixedH - fixedBoxH - fixedTh
                } else {
                    iH = iRefH - iLayoutH > 50 ? iRefH - iLayoutH : 50
                }
                if ($this.isTag('table') && !$this.parent('[data-layout-h]').length) {
                    $this.removeAttr('data-layout-h').wrap('<div data-layout-h="'+ iLayoutH +'" style="overflow:auto;width:100%;height:'+ iH +'px"></div>')
                } else {
                    $this.height(iH).css('overflow','auto')
                }
                if ($fixedBox && $fixedBox.length) {
                    if ($this[0].scrollWidth != $this[0].offsetWidth)
                        $fixedBox.tablefixed('resetWidth')
                }
            })
        },
        getMaxIndexObj: function($elements) {
            var zIndex = 0, index = 0
            
            $elements.each(function(i) {
                var newZIndex = parseInt($(this).css('zIndex')) || 1
                
                if (zIndex < newZIndex) {
                    zIndex = newZIndex
                    index  = i
                }
            })
            
            return $elements.eq(index)
        },
        /**
         * 将表单数据转成JSON对象 用法：$(form).serializeJson() Author: K'naan
         */
        serializeJson: function () {
            var o = {}
            var a = this.serializeArray()
            
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]]
                    }
                    o[this.name].push(this.value || '')
                } else {
                   o[this.name] = this.value || ''
                }
            })
            
            return o
        },
        isTag: function(tn) {
            if(!tn) return false
            return $(this)[0].tagName.toLowerCase() == tn ? true : false
        },
        /**
         * 判断当前元素是否已经绑定某个事件
         * @param {Object} type
         */
        isBind: function(type) {
            var _events = $(this).data('events')
            return _events && type && _events[type]
        },
        /**
         * 输出firebug日志
         * @param {Object} msg
         */
        log: function(msg) {
            return this.each(function() {
                if (console) console.log('%s: %o', msg, this)
            })
        }
    })
    
    /**
     * 扩展String方法
     */
    $.extend(String.prototype, {
        isPositiveInteger: function() {
            return (new RegExp(/^[1-9]\d*$/).test(this))
        },
        isInteger: function() {
            return (new RegExp(/^\d+$/).test(this))
        },
        isNumber: function(value, element) {
            return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this))
        },
        trim: function() {
            return this.replace(/(^\s*)|(\s*$)|\r|\n/g, '')
        },
        startsWith: function (pattern) {
            return this.indexOf(pattern) === 0
        },
        endsWith: function(pattern) {
            var d = this.length - pattern.length
            return d >= 0 && this.lastIndexOf(pattern) === d
        },
        replaceSuffix: function(index) {
            return this.replace(/\[[0-9]+\]/,'['+index+']').replace('#index#',index)
        },
        replaceSuffix2: function(index) {
            return this.replace(/\-(i)([0-9]+)$/, '-i'+ index).replace('#index#', index)
        },
        trans: function() {
            return this.replace(/&lt;/g, '<').replace(/&gt;/g,'>').replace(/&quot;/g, '"')
        },
        encodeTXT: function() {
            return (this).replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>', '&gt;').replaceAll(' ', '&nbsp;')
        },
        replaceAll: function(os, ns) {
            return this.replace(new RegExp(os,'gm'), ns)
        },
        /*替换占位符为对应选择器的值*/ //{^(.|\#)[A-Za-z0-9_-\s]*}
        replacePlh: function($box) {
            $box = $box || $(document)
            return this.replace(RegExp('{.*}', 'g'), function($1) {
                var $input = $box.find($1.replace(/[{}]+/g, ''))
                return $input.val() ? $input.val() : $1
            })
        },
        replaceMsg: function(holder) {
            return this.replace(new RegExp('({.*})', 'g'), holder)
        },
        replaceTm: function($data) {
            if (!$data) return this
            
            return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})','g'), function($1) {
                return $data[$1.replace(/[{}]+/g, '')]
            })
        },
        replaceTmById: function(_box) {
            var $parent = _box || $(document)
            
            return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})','g'), function($1) {
                var $input = $parent.find('#'+ $1.replace(/[{}]+/g, ''))
                return $input.val() ? $input.val() : $1
            })
        },
        isFinishedTm: function() {
            return !(new RegExp('{.*}').test(this))
        },
        skipChar: function(ch) {
            if (!this || this.length===0) return ''
            if (this.charAt(0)===ch) return this.substring(1).skipChar(ch)
            return this
        },
        isValidPwd: function() {
            return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this))
        },
        isValidMail: function() {
            return(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()))
        },
        isSpaces: function() {
            for (var i = 0; i < this.length; i += 1) {
                var ch = this.charAt(i)
                
                if (ch!=' '&& ch!='\n' && ch!='\t' && ch!='\r') return false
            }
            return true
        },
        isPhone:function() {
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this))
        },
        isUrl:function() {
            return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this))
        },
        isExternalUrl:function() {
            return this.isUrl() && this.indexOf('://'+ document.domain) == -1
        },
        toBool: function() {
            return (this.toLowerCase() === 'true') ? true : false
        },
        toJson: function() {
            try {
                if (typeof this === 'string') return $.parseJSON(this)
                else return this
            } catch (e) {
                return {}
            }
        },
        /**
         * String to Function
         * 参数(方法字符串或方法名)： 'function(){...}' 或 'getName' 或 'USER.getName' 均可
         * Author: K'naan
         */
        toFunc: function() {
            if (!this || this.length == 0) return undefined
            //if ($.isFunction(this)) return this
            
            if (this.startsWith('function')) {
                return (new Function('return '+ this))()
            }
            
            var m_arr = this.split('.')
            var fn    = window
            
            for (var i = 0; i < m_arr.length; i++) {
                fn = fn[m_arr[i]]
            }
            
            if (typeof fn === 'function') {
                return fn
            }
            
            return undefined
        }
    })
    
    $.extend(Function.prototype, {
        //to fixed String.prototype -> toFunc
        toFunc: function() {
            return this
        }
    })
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-basedrag.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.drag.js (author:Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-basedrag.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';

    // BASEDRAG CLASS DEFINITION
    // ======================
    
    var Basedrag = function(element, options) {
        this.$element = $(element)
        this.options  = options
    }
    
    Basedrag.prototype.init = function() {
        var that = this
        
        this.options.$obj = this.$element
        if (this.options.obj) this.options.$obj = this.options.obj
        if (this.options.event)
            this.start(this.options.event)
        else
            this.$element.find(this.options.selector).bind('mousedown', function(e) { that.start.apply(that, [e]) })
    }
    
    Basedrag.prototype.start = function(e) {
        document.onselectstart = function(e) { return false } //禁止选择
        var that = this
        
        this.options.oleft = parseInt(this.$element.css('left')) || 0
        this.options.otop  = parseInt(this.$element.css('top')) || 0
        $(document).bind('mouseup.bjui.basedrag', function(e) { that.stop.apply(that, [e]) })
            .bind('mousemove.bjui.basedrag', function(e) { that.drag.apply(that, [e]) })
    }
    
    Basedrag.prototype.drag = function(e) {
        if (!e) e = window.event
        var options = this.options
        var left    = (options.oleft + (e.pageX || e.clientX) - options.event.pageX)
        var top     = (options.otop + (e.pageY || e.clientY) - options.event.pageY)
        
        if (top < 1) top = 0
        if (options.move == 'horizontal') {
            if ((options.minW && left >= parseInt(this.options.$obj.css('left')) + options.minW) && (options.maxW && left <= parseInt(this.options.$obj.css('left')) + options.maxW)) {
                this.$element.css('left', left)
            } else if (options.scop) {
                if (options.relObj) {
                    if ((left - parseInt(options.relObj.css('left'))) > options.cellMinW)
                        this.$element.css('left', left)
                    else
                        this.$element.css('left', left)
                }
            }
        } else if (options.move == 'vertical') {
            this.$element.css('top', top)
        } else {
            var $selector = options.selector ? this.options.$obj.find(options.selector) : this.options.$obj
            
            if (left >= -$selector.outerWidth() * 2 / 3 && top >= 0 && (left + $selector.outerWidth() / 3 < $(window).width()) && (top + $selector.outerHeight() < $(window).height())) {
                this.$element.css({left:left, top:top})
            }
        }
        if (options.drag)
            options.drag.apply(this.$element, [this.$element, e])
        
        return this.preventEvent(e)
    }
    
    Basedrag.prototype.stop = function(e) {
        $(document).unbind('mousemove.bjui.basedrag').unbind('mouseup.bjui.basedrag')
        if (this.options.stop)
            this.options.stop.apply(this.$element, [this.$element, e])
        if (this.options.event)
            this.destroy()
        document.onselectstart = function(e) { return true } //启用选择
        return this.preventEvent(e)
    }
    
    Basedrag.prototype.preventEvent = function(e) {
        if (e.stopPropagation) e.stopPropagation()
        if (e.preventDefault) e.preventDefault()
        return false
    }
    
    Basedrag.prototype.destroy = function() {
        this.$element.removeData('bjui.basedrag').unbind('mousedown')
    }
    
    // BASEDRAG PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.basedrag')
            
            if (!data) $this.data('bjui.basedrag', (data = new Basedrag(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.basedrag

    $.fn.basedrag             = Plugin
    $.fn.basedrag.Constructor = Basedrag
    
    // BASEDRAG NO CONFLICT
    // =================
    
    $.fn.basedrag.noConflict = function () {
        $.fn.basedrag = old
        return this
    }
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-slidebar.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.barDrag.js (author:Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-slidebar.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';

    // SLIDEBAR CLASS INSTANCE
    // ======================
    $(function() {
        $('body').append('<!-- Adjust the width of Left slide -->').append(FRAG.splitBar).append(FRAG.splitBarProxy)
        
        $('#bjui-leftside').slidebar({minW:150, maxW:700})
    })
    
    // SLIDEBAR CLASS DEFINITION
    // ======================
    
    var Slidebar = function(element, options) {
        this.$element   = $(element)
        this.$bar       = this.$element.find('#bjui-sidebar')
        this.$sbar      = this.$element.find('#bjui-sidebar-s')
        this.$toggle    = this.$bar.find('.toggleCollapse div')
        this.$stoggle   = this.$sbar.find('.toggleCollapse div')
        this.$collapse  = this.$sbar.find('.collapse')
        this.$split     = $('#bjui-splitBar')
        this.$split2    = $('#bjui-splitBarProxy')
        this.$container = $('#bjui-container')
        
        this.options    = options
    }
    
    Slidebar.prototype.hide = function() {
        this.$toggle.trigger('click')
    }
    
    Slidebar.prototype.init = function() {
        var that = this
        
        this.$toggle.click(function() {
            that.$split.hide()
            BJUI.ui.showSlidebar = false
            var sbarwidth = parseInt(that.$sbar.css('left')) + that.$sbar.outerWidth()
            var barleft   = sbarwidth - that.$bar.outerWidth()
            var cleft     = parseInt(that.$container.css('left')) - (that.$bar.outerWidth() - that.$sbar.outerWidth())
            var cwidth    = that.$bar.outerWidth() - that.$sbar.outerWidth() + that.$container.outerWidth()
            
            that.$container.animate({left:cleft, width:cwidth}, 50, function() {
                that.$bar.animate({left: barleft}, 500, function() {
                    that.$bar.hide()
                    that.$sbar.show().css('left', -50).animate({left:5}, 200)
                    $(window).trigger(BJUI.eventType.resizeGrid)
                })
            })
            that.$collapse.on('click', function() {
                var sbarwidth = parseInt(that.$sbar.css('left')) + that.$sbar.outerWidth()
                var _hideBar  = function() {
                    if (!BJUI.ui.showSlidebar) {
                        that.$bar.animate({left: barleft}, 500, function() {
                            that.$bar.hide()
                        })
                    }
                    that.$container.off('click')
                }
                
                if (that.$bar.is(':hidden')) {
                    that.$toggle.hide()
                    that.$bar.show().animate({left: sbarwidth}, 500)
                    that.$container.on('click', _hideBar)
                } else {
                    that.$bar.animate({left: barleft}, 500, function() {
                        that.$bar.hide()
                    })
                }
                return false
            })
            return false
        })
        this.$stoggle.click(function() {
            BJUI.ui.showSlidebar = true
            
            that.$sbar.animate({left: -25}, 200, function() {
                that.$bar.show()
            })
            that.$bar.animate({left: 5}, 800, function() {
                that.$split.show()
                that.$toggle.show()
                
                var cleft = 5 + that.$bar.outerWidth() + that.$split.outerWidth()
                var cwidth = that.$container.outerWidth() - (cleft - parseInt(that.$container.css('left')))
                
                that.$container.css({left:cleft, width:cwidth})
                that.$collapse.off('click')
                $(window).trigger(BJUI.eventType.resizeGrid)
            })
            
            return false
        })
        this.$split.mousedown(function(e) {
            that.$split2.each(function() {
                var $spbar2 = $(this)
                
                setTimeout(function() { $spbar2.show() }, 100)
                $spbar2
                    .css({visibility:'visible', left: that.$split.css('left')})
                    .basedrag($.extend(that.options, {obj:that.$bar, move:'horizontal', event:e, stop: function() {
                        $(this).css('visibility', 'hidden')
                        var move      = parseInt($(this).css('left')) - parseInt(that.$split.css('left'))
                        var sbarwidth = that.$bar.outerWidth() + move
                        var cleft     = parseInt(that.$container.css('left')) + move
                        var cwidth    = that.$container.outerWidth() - move
                        
                        that.$bar.css('width', sbarwidth)
                        that.$split.css('left', $(this).css('left'))
                        that.$container.css({left:cleft, width:cwidth})
                    }}))
                
                return false                    
            })
        })
    }
    
    // SLIDEBAR PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.slidebar')
            
            if (!data) $this.data('bjui.slidebar', (data = new Slidebar(this, options)))
            
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.slidebar

    $.fn.slidebar             = Plugin
    $.fn.slidebar.Constructor = Slidebar
    
    // SLIDEBAR NO CONFLICT
    // =================
    
    $.fn.basedrag.noConflict = function () {
        $.fn.slidebar = old
        return this
    }
    
    // SLIDEBAR DATA-API
    // ==============
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-contextmenu.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.contextmenu.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-contextmenu.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // CONTEXTMENU GLOBAL ELEMENTS
    // ======================
    
    var $menu, $shadow, hash
    
    $(function() {
        var INIT_CONTEXTMENU = function() {
            $menu   = $('<div id="bjui-contextmenu"></div>').hide()
            $shadow = $('<div id="bjui-contextmenuShadow"></div>').hide()
            hash    = []
            
            $('body').append('<!-- contextmenu -->').append($menu).append($shadow)
        }
        
        INIT_CONTEXTMENU()
    })
    
    // CONTEXTMENU CLASS DEFINITION
    // ======================
    var Contextmenu = function(element, options) {
        this.$element = $(element)
        this.options  = options
    }
    
    Contextmenu.DEFAULTS = {
        id       : undefined,
        shadow   : true,
        bindings : {},
        ctrSub   : null
    }
    
    Contextmenu.prototype.init = function() {
        var $this = this
        var op    = this.options
        
        if (!op.id) return
        hash.push({
            id       : op.id,
            shadow   : op.shadow,
            bindings : op.bindings || {},
            ctrSub   : op.ctrSub
        })
        
        var index = hash.length - 1
        
        this.$element.on('contextmenu', function(e) {
            $this.display(index, this, e, op)
            return false
        })
    }
    
    Contextmenu.prototype.display = function(index, trigger, e, options) {
        var $this   = this
        var cur     = hash[index]
        var cp      = BJUI.regional[cur.id]
        var content = FRAG[cur.id]
        
        $.each(cp, function(i, n) {
            content = content.replace('#'+ i +'#', cp[i])
        })
        
        // Send the content to the menu
        $menu.html(content)
        $.each(cur.bindings, function(id, func) {
            $('[rel="'+ id +'"]', $menu).on('click', function(e) {
                $this.hide()
                func($(trigger), $('#bjui-'+ cur.id))
            })
        })
        
        var posX = e.pageX
        var posY = e.pageY
        
        if ($(window).width() < posX + $menu.width())   posX -= $menu.width()
        if ($(window).height() < posY + $menu.height()) posY -= $menu.height()

        $menu.css({'left':posX, 'top':posY}).show()
        if (cur.shadow)
            $shadow.css({width:$menu.width(), height:$menu.height(), left:posX + 3, top:posY + 3}).show()
        $(document).one('click', $this.hide)
        
        if ($.isFunction(cur.ctrSub))
            cur.ctrSub($(trigger), $('#bjui-'+ cur.id))
    }
    
    Contextmenu.prototype.hide = function() {
        $menu.hide()
        $shadow.hide()
    }
    
    // CONTEXTMENU PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Contextmenu.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.contextmenu')
            
            if (!data) $this.data('bjui.contextmenu', (data = new Contextmenu(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.contextmenu

    $.fn.contextmenu             = Plugin
    $.fn.contextmenu.Constructor = Contextmenu
    
    // CONTEXTMENU NO CONFLICT
    // =================
    
    $.fn.contextmenu.noConflict = function () {
        $.fn.contextmenu = old
        return this
    }
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-navtab.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.navTab.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-navtab.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // NAVTAB GLOBAL ELEMENTS
    // ======================
    
    var currentIndex, $currentTab, $currentPanel, $box, $tabs, $panels, $prevBtn, $nextBtn, $moreBtn, $moreBox, $main, $mainLi
    
    $(function() {
        var INIT_NAVTAB = function() {
            currentIndex = 1
            $box         = $('#bjui-navtab')
            $tabs        = $box.find('.navtab-tab')
            $panels      = $box.find('.navtab-panel')
            $prevBtn     = $box.find('.tabsLeft')
            $nextBtn     = $box.find('.tabsRight')
            $moreBtn     = $box.find('.tabsMore')
            $moreBox     = $box.find('.tabsMoreList')
            $main        = $tabs.find('li.main')
            $mainLi      = $moreBox.find('li:first')
            
            $prevBtn.click(function() { $(this).navtab('scrollPrev') })
            $nextBtn.click(function() { $(this).navtab('scrollNext') })
            $moreBtn.click(function() { $moreBox.show() })
            
            $(document).on('click.bjui.navtab.switchtab', function(e) {
                var $target = e.target.tagName == 'I' ? $(e.target).parent() : $(e.target)
                
                if ($moreBtn[0] != $target[0]) $moreBox.hide()
            })
            
            $main
                .navtab('contextmenu', $main)
                .click(function() { $(this).navtab('switchTab', 'main') })
                .find('> a').html(function(n, c) { return c.replace('#maintab#', BJUI.regional.maintab) })
            
            $mainLi
                .click(function() {
                    if ($(this).hasClass('active')) $moreBox.hide()
                    else $(this).navtab('switchTab', 'main')
                })
                .find('> a').html(function(n, c) { return c.replace('#maintab#', BJUI.regional.maintab) })
        }
        
        INIT_NAVTAB()
    })
    
    // NAVTAB CLASS DEFINITION
    // ======================
    
    var Navtab = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Navtab.DEFAULTS = {
        id       : undefined,
        title    : 'New tab',
        url      : undefined,
        type     : 'GET',
        data     : {},
        fresh    : false
    }
    
    Navtab.prototype.TOOLS = function() {
        var that = this
        var tools = {
            getDefaults: function() {
                return Navtab.DEFAULTS
            },
            getTabs: function() {
                return $tabs.find('> li')
            },
            getPanels: function() {
                return $panels.find('> div')
            },
            getMoreLi: function() {
                return $moreBox.find('> li')
            },
            getTab: function(tabid) {
                var index = this.indexTabId(tabid)
                
                if (index >= 0) return this.getTabs().eq(index)
            },
            getPanel: function(tabid) {
                var index = this.indexTabId(tabid)
                
                if (index >= 0) return this.getPanels().eq(index)
            },
            getTabsW: function(iStart, iEnd) {
                return this.tabsW(this.getTabs().slice(iStart, iEnd))
            },
            tabsW: function($tabs) {
                var iW = 0
                $tabs.each(function() {
                    iW += $(this).outerWidth(true)
                })
                
                return iW
            },
            indexTabId: function(tabid) {
                if (!tabid) return -1
                var iOpenIndex = -1
                
                this.getTabs().each(function(index) {
                    if ($(this).data('tabid') == tabid) {
                        iOpenIndex = index
                        return
                    }
                })
                return iOpenIndex
            },
            getLeft: function() {
                return $tabs.position().left
            },
            getScrollBarW: function() {
                return $box.width() - 55
            },
            visibleStart: function() {
                var iLeft = this.getLeft(), iW = 0
                var $tabs = this.getTabs()
                
                for (var i = 0; i < $tabs.size(); i++) {
                    if (iW + iLeft >= 0) return i
                    iW += $tabs.eq(i).outerWidth(true)
                }
                
                return 0
            },
            visibleEnd: function() {
                var iLeft = this.getLeft(), iW = 0
                var $tabs = this.getTabs()
                
                for (var i = 0; i < $tabs.size(); i++) {
                    iW += $tabs.eq(i).outerWidth(true)
                    if (iW + iLeft > this.getScrollBarW()) return i
                }
                
                return $tabs.size()
            },
            scrollPrev: function() {
                var iStart = this.visibleStart()
                
                if (iStart > 0)
                    this.scrollTab(-this.getTabsW(0, iStart - 1))
            },
            scrollNext: function() {
                var iEnd = this.visibleEnd()
                
                if (iEnd < this.getTabs().size())
                    this.scrollTab(-this.getTabsW(0, iEnd + 1) + this.getScrollBarW())
            },
            scrollTab: function(iLeft, isNext) {
                var $tools = this
                
                $tabs.animate({ left: iLeft }, 200, function() { $tools.ctrlScrollBtn() })
            },
            scrollCurrent: function() { // auto scroll current tab
                var iW = this.tabsW(this.getTabs())
                
                if (iW <= this.getScrollBarW())
                    this.scrollTab(0)
                else if (this.getLeft() < this.getScrollBarW() - iW)
                    this.scrollTab(this.getScrollBarW()-iW)
                else if (currentIndex < this.visibleStart())
                    this.scrollTab(-this.getTabsW(0, currentIndex))
                else if (currentIndex >= this.visibleEnd())
                    this.scrollTab(this.getScrollBarW() - this.getTabs().eq(currentIndex).outerWidth(true) - this.getTabsW(0, currentIndex))
            },
            ctrlScrollBtn: function() {
                var iW = this.tabsW(this.getTabs())
                
                if (this.getScrollBarW() > iW) {
                    $prevBtn.hide()
                    $nextBtn.hide()
                    $tabs.parent().removeClass('tabsPageHeaderMargin')
                } else {
                    $prevBtn.show().removeClass('tabsLeftDisabled')
                    $nextBtn.show().removeClass('tabsRightDisabled')
                    $tabs.parent().addClass('tabsPageHeaderMargin')
                    if (this.getLeft() >= 0)
                        $prevBtn.addClass('tabsLeftDisabled')
                    else if (this.getLeft() <= this.getScrollBarW() - iW)
                        $nextBtn.addClass('tabsRightDisabled')
                }
            },
            switchTab: function(iTabIndex) {
                var $tab = this.getTabs().removeClass('active').eq(iTabIndex).addClass('active'), $panels = this.getPanels(), $panel = $panels.eq(iTabIndex)
                
                if ($tab.data('reloadFlag')) {
                    $panels.hide()
                    $panel.removeClass('fade').show()
                    that.refresh($tab.data('tabid'))
                } else {
                    if (BJUI.ui.hideMode == 'offsets') {
                        $panels.css({position: 'absolute', top:'-100000px', left:'-100000px'}).eq(iTabIndex).css({position: '', top:'', left:''})
                    } else {
                        $panels.addClass('fade').removeClass('in').hide()
                        $panel.show()
                        
                        if ($.support.transition)
                            $panel.one('bsTransitionEnd', function() { $panel.addClass('in') }).emulateTransitionEnd(100)
                        else
                            $panels.removeClass('fade')
                    }
                }
                
                this.getMoreLi().removeClass('active').eq(iTabIndex).addClass('active')
                currentIndex  = iTabIndex
                this.scrollCurrent()
                $currentTab     = $tab
                $.CurrentNavtab = $currentPanel = $panel
                $.CurrentNavtab.data('id', $tab.data('tabid'))
            },
            closeTab: function(index, openTabid) {
                this.getTabs().eq(index).remove()
                this.getPanels().eq(index).trigger(BJUI.eventType.beforeCloseNavtab).remove()
                this.getMoreLi().eq(index).remove()
                
                if (currentIndex >= index) currentIndex--
                if (openTabid) {
                    var openIndex = this.indexTabId(openTabid)
                    if (openIndex > 0) currentIndex = openIndex
                }
                
                this.scrollCurrent()
                this.switchTab(currentIndex)
            },
            closeOtherTab: function(index) {
                index = index || currentIndex
                
                if (index > 0) {
                    var str$ = ':eq('+ index +')'
                    
                    this.getTabs().not(str$).filter(':gt(0)').remove()
                    this.getPanels().not(str$).filter(':gt(0)').trigger(BJUI.eventType.beforeCloseNavtab).remove()
                    this.getMoreLi().not(str$).filter(':gt(0)').remove()
                    currentIndex = 1
                    this.scrollCurrent()
                } else {
                    that.closeAllTab()
                }
            },
            loadUrlCallback: function($panel) {
                $panel.find(':button.btn-close').click(function() { that.closeCurrentTab() })
            },
            reload: function($tab, flag, type) {
                flag = flag || $tab.data('reloadFlag')
                
                var url = $tab.data('url')
                var $tools = this
                
                if (flag && url) {
                    $tab.data('reloadFlag', false)
                    var $panel = this.getPanel($tab.data('tabid'))
                    
                    if ($tab.hasClass('external')) {
                        that.openExternal(url, $panel)
                    } else {
                        //get pagerForm parameters
                        var $pagerForm = $panel.find('#pagerForm')
                        var args = $pagerForm.size() > 0 ? $pagerForm.serializeArray() : {}
                        
                        $tools.reloadTab($panel, {type:(type || $pagerForm.attr('method') || 'GET'), url:url, data:args})
                    }
                }
            },
            reloadTab: function($panel, op) {
                var $tools = this
                
                $panel
                    .trigger(BJUI.eventType.beforeLoadNavtab)
                    .data('bjui.layoutBox', $panel.closest('div.layoutBox'))
                    .ajaxUrl({
                        type:(op.type || 'GET'), url:op.url, data:op.data, callback:function(response) {
                            $tools.loadUrlCallback($panel)
                        }
                    })
            }
        }
        
        return tools
    }
    
    Navtab.prototype.contextmenu = function($obj) {
        var that = this
        $obj.contextmenu({
            id: 'navtabCM',
            bindings: {
                reload: function(t, m) {
                    that.tools.reload(t, true)
                },
                closeCurrent: function(t, m) {
                    var tabId = t.data('tabid')
                    
                    if (tabId) that.closeTab(tabId)
                    else that.closeCurrentTab()
                },
                closeOther: function(t, m) {
                    var index = that.tools.indexTabId(t.data('tabid'))
                    
                    that.tools.closeOtherTab(index > 0 ? index : currentIndex)
                },
                closeAll: function(t, m) {
                    that.closeAllTab()
                }
            },
            ctrSub: function(t, m) {
                var mReload = m.find('[rel="reload"]')
                var mCur    = m.find('[rel="closeCurrent"]')
                var mOther  = m.find('[rel="closeOther"]')
                var mAll    = m.find('[rel="closeAll"]')
                var $tabLi  = that.tools.getTabs()
                
                if (t.data('tabid') == 'main') {
                    mCur.addClass('disabled')
                    mReload.addClass('disabled')
                }
            }
        })
    }
    
    // if found tabid replace tab, else create a new tab.
    Navtab.prototype.openTab = function() {
        var that = this, $element = this.$element, options = this.options, tools = this.tools
        
        if (!(options.url)) {
            BJUI.debug('Navtab Plugin: Error trying to open a navtab, url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('Navtab Plugin: The new navtab\'s url is incorrect, url: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        var iOpenIndex = tools.indexTabId(this.options.id)
        
        if (iOpenIndex >= 0) {
            var $tab   = tools.getTabs().eq(iOpenIndex)
            var $panel = tools.getPanels().eq(iOpenIndex)
            
            if (options.fresh || $tab.data('url') != options.url) {
                $tab.data('url', options.url)
                
                var $pagerForm = $panel.find('#pagerForm')
                var type = options.type || $pagerForm.attr('method')
                var _reload = function() {
                    $tab.find('> a').attr('title', options.title).find('> span').html(options.title)
                    tools.reload($tab, true, type)
                }
                
                if (options.reloadWarn) {
                    this.$element.alertmsg('confirm', options.reloadWarn, {
                        okCall: function() {
                            _reload()
                        }
                    })
                } else {
                    _reload()
                }
            }
            currentIndex = iOpenIndex
        } else {
            var tabFrag = '<li><a href="javascript:" title="#title#"><span>#title#</span></a><span class="close">&times;</span></li>'
            var $tab = $(tabFrag.replaceAll('#title#', options.title))
            var $panel = $('<div class="page unitBox"></div>')
            var $more  = $('<li><a href="javascript:" title="#title#">#title#</a></li>'.replaceAll('#title#', options.title))
            
            $tab.appendTo($tabs)
            $panel.appendTo($panels)
            $more.appendTo($moreBox)
             
            if (options.external || (options.url && options.url.isExternalUrl())) {
                $tab.addClass('external')
                this.openExternal(options.url, $panel)
            } else {
                $tab.removeClass('external')
                tools.reloadTab($panel, {url:options.url, data:options.data})
            }
            
            currentIndex = tools.getTabs().length - 1
            this.contextmenu($tab)
            
            //events
            $tab.on('click', function(e) {
                var $target = $(e.target)
                
                if ($target.hasClass('close'))
                    that.closeTab(options.id)
                else if ($target.closest('li').hasClass('active'))
                    return false
                else
                    that.switchTab(options.id)
            })
            $more.on('click', function() {
                that.switchTab(options.id)
            })
            $tab.data('tabid', options.id).data('url', options.url)
        }
        
        tools.switchTab(currentIndex)
        tools.scrollCurrent()
    }
    
    Navtab.prototype.closeTab = function(tabid) {
        var index = this.tools.indexTabId(tabid)
        
        if (index > 0)
            this.tools.closeTab(index)
    }
    
    Navtab.prototype.closeCurrentTab = function(openTabid) { //openTabid can be empty. close current tab by default, and open the last tab
        if (currentIndex > 0)
            this.tools.closeTab(currentIndex, openTabid)
    }
    
    Navtab.prototype.closeAllTab = function() {
        this.tools.getTabs().filter(':gt(0)').remove()
        this.tools.getPanels().filter(':gt(0)').trigger(BJUI.eventType.beforeCloseNavtab).remove()
        this.tools.getMoreLi().filter(':gt(0)').remove()
        currentIndex = 0
        this.tools.scrollCurrent()
        this.tools.switchTab(currentIndex)
    }
    
    Navtab.prototype.reloadFlag = function(tabids) {
        var arr = tabids.split(',')
        
        for (var i = 0; i < arr.length; i++) {
            var $tab = this.tools.getTab(arr[i].trim())
            
            if ($tab) {
                if (this.tools.indexTabId(arr[i]) == currentIndex) this.tools.reload($tab, true)
                else $tab.data('reloadFlag', true)
            }
        }
    }
    
    Navtab.prototype.switchTab = function(tabid) {
        var index = this.tools.indexTabId(tabid)
        
        this.tools.switchTab(index)
    }
    
    Navtab.prototype.scrollPrev = function() {
        this.tools.scrollPrev()
    }
    
    Navtab.prototype.scrollNext = function() {
        this.tools.scrollNext()
    }
    
    Navtab.prototype.refresh = function(tabid) {
        var $tab = tabid ? this.tools.getTab(tabid) : $currentTab
        
        if ($tab) this.tools.reload($tab, true)
    }
    
    Navtab.prototype.reload = function(option) {
        var options = $.extend({}, this.tools.getDefaults(), typeof option == 'object' && option)
        var $tab
        
        if (typeof option == 'string') {
            $tab = this.tools.getTab(option)
        } else {
            $tab = options.id ? this.tools.getTab(options.id) : this.tools.getTabs().eq(currentIndex)
            if ($tab) {
                if (option.title) $tab.find('> a').attr('title', this.options.title).find(span$).html(this.options.title)
                if (options.url) $tab.data('url', options.url)
                this.tools.reload($tab, true)
            }
        }
        if ($tab) this.tools.reload($tab, true)
    }
    
    Navtab.prototype.reloadForm = function(clearQuery, option) {
        var options = $.extend({}, this.tools.getDefaults(), typeof option == 'object' && option)
        var $tab, $panel
        
        if (typeof option == 'string') {
            $tab   = this.tools.getTab(option)
            $panel = this.tools.getPanel(option)
        } else {
            $tab   = options.id ? this.tools.getTab(options.id) : this.tools.getTabs().eq(currentIndex)
            $panel = options.id ? this.tools.getPanel(options.id) : this.tools.getPanels().eq(currentIndex)
        }
        if ($tab && $panel) {
            if (option && option.title) $tab.find('> a').attr('title', this.options.title).find('> span').html(this.options.title)
            if (!options.url) options.url = $tab.data('url')
            if ($tab.hasClass('external')) {
                this.openExternal(options.url, $panel)
            } else {
                var $pagerForm = $panel.find('#pagerForm')
                
                if ($pagerForm && $pagerForm.length) {
                    if (!option || !option.type) options.type = $pagerForm.attr('method') || 'POST'
                    
                    options.data = $pagerForm.serializeJson()
                    
                    if (clearQuery) {
                        var pageParams = $.extend({}, BJUI.pageInfo)
                        
                        for (var key in BJUI.pageInfo) {
                            if (options.data[BJUI.pageInfo[key]]) pageParams[key] = options.data[BJUI.pageInfo[key]]
                        }
                        options.data = pageParams
                    }
                }
                
                this.tools.reloadTab($panel, {type:options.type, url:options.url, data:options.data})
            }
        }
    }
    
    Navtab.prototype.getCurrentPanel = function() {
        return this.tools.getPanels().eq(currentIndex)
    }
    
    Navtab.prototype.checkTimeout = function() {
        var json = JSON.parse($currentPanel.html())
        
        if (json && json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) this.closeCurrentTab()
    }
    
    Navtab.prototype.openExternal = function(url, $panel) {
        var ih = panels.height()
        
        $panel.html(FRAG.externalFrag.replaceAll('{url}', url).replaceAll('{height}', ih +'px'))
    }
    
    // NAVTAB PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Navtab.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.navtab')
            
            if (!data) $this.data('bjui.navtab', (data = new Navtab(this, options)))
            else if (data.options.id && data.options.id != options.id) $this.data('bjui.navtab', (data = new Navtab(this, options)))
            
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.openTab()
            }
        })
    }

    var old = $.fn.navtab

    $.fn.navtab             = Plugin
    $.fn.navtab.Constructor = Navtab
    
    // NAVTAB NO CONFLICT
    // =================
    
    $.fn.navtab.noConflict = function () {
        $.fn.navtab = old
        return this
    }
    
    // NAVTAB DATA-API
    // ==============

    $(document).on('click.bjui.navtab.data-api', '[data-toggle="navtab"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url)   options.url   = $this.attr('href')
        if (!options.id)    options.id    = 'navtab'
        if (!options.title) options.title = $this.text()
        
        Plugin.call($this, options)
        
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-dialog.js v1.0
 * reference: bjui-core.js, bjui-extends.js, bjui.frag.js, bjui-initui.js
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.dialog.js, dwz.dialogDrag.js, dwz.resize.js (author:Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-dialog.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // DIALOG GLOBAL ELEMENTS
    // ======================
    
    var $resizable
    var $current, shadow, zindex
    
    $(function() {
        var INIT_DIALOG = function() {
            $resizable = $('#bjui-resizable')
            shadow     = 'dialogShadow'
            zindex     = Dialog.ZINDEX
            
            var dr          = BJUI.regional.dialog
            var dialogProxy = 
                FRAG.dialogProxy
                    .replace('#close#', dr.close)
                    .replace('#maximize#', dr.maximize)
                    .replace('#restore#', dr.restore)
                    .replace('#minimize#', dr.minimize)
                    .replace('#title#', dr.title)
            
            $('body')
                .append('<!-- dialog resizable -->').append(FRAG.resizable)
                .append('<!-- dialog drag  -->').append(dialogProxy)
                .append('<!-- dialog mask -->').append(FRAG.dialogMask)
        }
        
        INIT_DIALOG()
    })
    
    // DIALOG CLASS DEFINITION
    // ======================
    var Dialog = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Dialog.DEFAULTS = {
        id        : 'dialog',
        title     : 'New Dialog',
        url       : undefined,
        type      : 'GET',
        data      : {},
        width     : 500,
        height    : 300,
        minW      : 65,
        minH      : 40,
        max       : false,
        mask      : false,
        resizable : true,
        drawable  : true,
        maxable   : true,
        minable   : true
    }
    
    Dialog.ZINDEX = 30
    
    Dialog.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getDefaults: function() {
                return Dialog.DEFAULTS
            },
            init: function($dialog) {
                var width  = that.options.width > that.options.minW ? that.options.width : that.options.minW
                var height = that.options.height > that.options.minH ? that.options.height : that.options.minH
                var wW     = $(window).width(),
                    wH     = $(window).height(),
                    iTop   = that.options.max ? 0 : ((wH - height) / 2)
                
                if (width > wW)  width  = wW
                if (height > wH) height = wH
                
                $dialog
                    .height(height)
                    .width(width)
                    .show()
                    .css({left:(wW - width) / 2, top:0, opacity:0.1})
                    .animate({top:iTop > 0 ? iTop : 0, opacity:1})
                    .addClass(shadow)
                    .find('> .dialogContent').height(height - $('> .dialogHeader', $dialog).outerHeight() - 6)
                
                $('body').find('> .bjui-dialog-container').not($dialog).removeClass(shadow)
            },
            reload: function($dialog, options) {
                var $dialogContent = $dialog.find('> .dialogContent')
                
                options = $.extend($dialog.data('options'), options || {})
                
                $dialog.trigger(BJUI.eventType.beforeLoadDialog)
                $dialogContent.ajaxUrl({
                    type:options.type || 'GET', url:options.url, data:options.data || {}, callback:function(response) {
                        $dialog.trigger('show.bjui.dialog', $dialog)
                    }
                })
            },
            resizeContent:function($dialog, width, height) {
                var $dialogContent = $dialog.find('> .dialogContent')
                
                $dialogContent
                    .css({width:(width - 0), height:(height - $dialog.find('> .dialogHeader').outerHeight() - 6)})
                    .find('[data-layout-h]')
                    .layoutH($dialogContent)
                
                $(window).trigger(BJUI.eventType.resizeGrid)
            }
        }
        
        return tools
    }
    
    Dialog.prototype.open = function() {
        var that    = this, options = that.options
        var $body   = $('body')
        var $dialog = $body.data(this.options.id)
        
        if (!(options.url)) {
            BJUI.debug('Dialog Plugin: Error trying to open a dialog, url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh(that.$element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                that.$element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('Dialog Plugin: The new dialog\'s url is incorrect, url: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        if ($dialog) { //if dialog'id is exists
            var op = $dialog.data('options') || options
            
            this.switchDialog($dialog)
            
            if ($dialog.is(':hidden')) $dialog.show()
            if (op.url != options.url) {
                $.extend(op, options)
                $dialog.data('options', op)
                
                if (options.title) $dialog.find('> .dialogHeader > h1 > span.title').html(options.title)
                this.tools.reload($dialog)
            }
        } else { //open a new dialog
            var dr     = BJUI.regional.dialog
            var dialog = FRAG.dialog
                .replace('#close#', dr.close)
                .replace('#maximize#', dr.maximize)
                .replace('#restore#', dr.restore)
                .replace('#minimize#', dr.minimize)
                .replace('#title#', dr.title)
            
            $dialog = $(dialog)
                .data('options', options)
                .css('zIndex', (zindex += 2))
                .hide()
                .appendTo($body)
            
            $dialog.find('> .dialogHeader > h1 > span.title').html(options.title)
            
            this.tools.init($dialog)
            
            if (options.maxable) $dialog.find('a.maximize').show()
            else $dialog.find('a.maximize').hide()
            if (options.minable) $dialog.find('a.minimize').show()
            else $dialog.find('a.minimize').hide()
            if (options.max) that.maxsize($dialog)
            
            $dialog.on('click', function(e) {
                if (!$(e.target).data('bjui.dialog'))
                    if ($current && $current[0] != $dialog[0]) that.switchDialog($dialog)
            }).on('click', '.btn-close', function(e) {
                that.close($dialog)
                
                e.preventDefault()
            }).on('click', '.dialogHeader > a', function(e) {
                var $a = $(this)
                
                if ($a.hasClass('close')) that.close($dialog)
                if ($a.hasClass('minimize')) {
                    that.minimize($dialog)
                }
                if ($a.hasClass('maximize')) {
                    that.switchDialog($dialog)
                    that.maxsize($dialog)
                }
                if ($a.hasClass('restore')) that.restore($dialog)
                
                e.preventDefault()
                e.stopPropagation()
            }).on('dblclick', '.dialogHeader > h1', function(e) {
                if ($dialog.find('> .dialogHeader > a.restore').is(':hidden')) $dialog.find('a.maximize').trigger('click')
                else $dialog.find('> .dialogHeader > a.restore').trigger('click')
            }).on('mousedown.bjui.dialog.drag', '.dialogHeader > h1', function(e) {
                that.switchDialog($dialog)
                
                if (!options.drawable || $dialog.data('max')) return
                
                $dialog.data('bjui.dialog.task', true)
                setTimeout($.proxy(function () {
                    if ($dialog.data('bjui.dialog.task')) that.drag(e, $dialog)
                }, that), 150)
                
                e.preventDefault()
            }).on('mouseup.bjui.dialog.drag', '.dialogHeader > h1', function(e) {
                $dialog.data('bjui.dialog.task', false)
            }).on('mousedown.bjui.dialog.resize', 'div[class^="resizable"]', function(e) {
                if (!options.drawable || $dialog.data('max')) return
                
                var $bar = $(this)
                
                that.switchDialog($dialog)
                that.resizeInit(e, $('#bjui-resizable'), $dialog, $bar)
                $bar.show()
                
                e.preventDefault()
            }).on('mouseup.bjui.dialog.resize', 'div[class^="resizable"]', function(e) {
                e.preventDefault()
            })
            
            $body.data(options.id, $dialog)
            this.tools.reload($dialog, options)
        }
        
        if (options.mask) {
            var $mask = $dialog.data('bjui.dialog.mask')
            
            if (!$mask || !$mask.length) {
                $mask = $(FRAG.dialogMask)
                $mask.appendTo($body).css('zIndex', zindex - 1).show()
                $dialog.data('bjui.dialog.mask', $mask)
            }
            $dialog.find('> .dialogHeader > a.minimize').hide()
        } else { //add a task to task bar
            if (options.minable && $.fn.taskbar) this.$element.taskbar({id:options.id, title:options.title})
        }
        
        $.CurrentDialog = $current = $dialog
    }
    
    Dialog.prototype.refresh = function(id) {
        if (id && typeof id == 'string') {
            var arr = id.split(',')
            
            for (var i = 0; i < arr.length; i++) {
                var $dialog = $('body').data(arr[i].trim())
                
                if ($dialog) this.tools.reload($dialog)
            }
        } else {
            this.tools.reload($current)
        }
    }
    
    Dialog.prototype.reload = function(option) {
        var options = $.extend({}, this.tools.getDefaults(), typeof option == 'object' && option)
        var $dialog = (options.id && $('body').data(options.id)) || this.getCurrent()

        if ($dialog) this.tools.reload($dialog, options)
    }
    
    Dialog.prototype.reloadForm = function(clearQuery, option) {
        var $dialog, options
        
        if (typeof option == 'string') {
            $dialog = $('body').data(option)
            options = $dialog.data('options')
        } else if (typeof option == 'object') {
            $dialog = (option.id && $('body').data(option.id)) || this.getCurrent()
        }
        if ($dialog) {
            if (typeof option == 'object') {
                if (option.title) $dialog.find('> .dialogHeader > h1 > span.title').html(option.title)
                options = $.extend({}, option, $dialog.data('options'))
            }
            var $pagerForm = $dialog.find('#pagerForm')
            
            if ($pagerForm && $pagerForm.length) {
                if (!option || !option.type) options.type = $pagerForm.attr('method') || 'POST'
                options.data = $pagerForm.serializeJson()
                
                if (clearQuery) {
                    var pageParams = $.extend({}, BJUI.pageInfo)
                    
                    for (var key in BJUI.pageInfo) {
                        if (options.data[BJUI.pageInfo[key]]) pageParams[key] = options.data[BJUI.pageInfo[key]]
                    }
                    options.data = pageParams
                }
            }
            
            this.tools.reload($dialog, options)
        }
    }
    
    Dialog.prototype.getCurrent = function(){
        return $current
    }
    
    Dialog.prototype.switchDialog = function($dialog) {
        var index = $dialog.css('zIndex')
        
        if ($current && $current != $dialog) {
            var cindex = $current.css('zIndex')
            
            $current.css('zIndex', index)
            $dialog.css('zIndex', cindex)
            $.CurrentDialog = $current = $dialog
            if ($.fn.taskbar) this.$element.taskbar('switchTask', $dialog.data('options').id)
        }
        
        $dialog.addClass(shadow)
        $('body').find('> .bjui-dialog-container').not($dialog).removeClass(shadow)
    }
    
    Dialog.prototype.close = function(dialog) {
        var that    = this
        var $dialog = (typeof dialog == 'string') ? $('body').data(dialog) : dialog
        var $mask   = $dialog.data('bjui.dialog.mask')
        var options = $dialog.data('options')
        
        if (!$dialog || !options) return
        if ($mask && $mask.length) $mask.remove()
        else if ($.fn.taskbar) this.$element.taskbar('closeDialog', options.id)
        
        $dialog.animate({top:-$dialog.outerHeight(), opacity:0.1}, 'normal', function() {
            $('body').removeData(options.id)
            $dialog.trigger(BJUI.eventType.beforeCloseDialog).remove()
            
            var $dialogs  = $('body').find('> .bjui-dialog-container')
            var $_current = undefined
            
            if ($dialogs.length) $_current = that.$element.getMaxIndexObj($dialogs)
            else zindex = Dialog.ZINDEX
            if ($_current && $_current.is(':visible')) that.switchDialog($_current)
        })
    }
    
    Dialog.prototype.closeCurrent = function() {
        this.close($current)
    }
    
    Dialog.prototype.checkTimeout = function() {
        var $dialogConetnt = $current.find('> .dialogContent')
        var json = JSON.parse($dialogConetnt.html())
        
        if (json && json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) this.closeCurrent()
    }
    
    Dialog.prototype.maxsize = function($dialog) {
        $dialog.data('original', {
            top: $dialog.css('top'),
            left: $dialog.css('left'),
            width: $dialog.css('width'),
            height: $dialog.css('height')
        }).data('max', true)
        $dialog.find('> .dialogHeader > a.maximize').hide()
        $dialog.find('> .dialogHeader > a.restore').show()
        
        var iContentW = $(window).width()
        var iContentH = $(window).height() - $('#bjui-taskbar').height() - 1
        
        $dialog.css({ top:0, left:0, width:iContentW, height:iContentH })
        this.tools.resizeContent($dialog, iContentW, iContentH)
    }
    
    Dialog.prototype.restore = function($dialog) {
        var original = $dialog.data('original')
        var dwidth   = parseInt(original.width)
        var dheight  = parseInt(original.height)
        
        $dialog.css({
            top: original.top,
            left: original.left,
            width: dwidth,
            height: dheight
        })
        this.tools.resizeContent($dialog, dwidth, dheight)
        $dialog.find('> .dialogHeader > a.maximize').show()
        $dialog.find('> .dialogHeader > a.restore').hide()
        $dialog.data('max', false)
    }
    
    Dialog.prototype.minimize = function($dialog) {
        $dialog.hide()
        if ($.fn.taskbar) this.$element.taskbar('minimize', $dialog)
    }
    
    Dialog.prototype.drag = function(e, $dialog) {
        var $shadow = $('#bjui-dialogProxy')
        
        if (!$shadow.size()) $shadow = $(FRAG.dialogProxy).appendTo($('body'))
        $shadow.find('> div.dialogHeader > h1').html($dialog.find('> div.dialogHeader > h1').html())
        $shadow.find('> div.dialogContent').css('height', $dialog.find('> div.dialogContent').css('height'))
        $shadow
            .css({
                left   : $dialog.css('left'),
                top    : $dialog.css('top'),
                height : $dialog.css('height'),
                width  : $dialog.css('width'),
                zIndex : parseInt($dialog.css('zIndex'))
            })
            .show()
        $dialog.css({left:'-10000px', top:'-10000px'})
        $shadow.basedrag({
            selector: '> .dialogHeader',
            stop: function() {
                $dialog.css({left:$shadow.css('left'), top:$shadow.css('top')})
                $shadow.hide()
            },
            event: e
        })
    }
    
    Dialog.prototype.resizeDialog = function($resizable, $dialog, target) {
        var tmove
        var oleft  = parseInt($resizable.css('left'))
        var otop   = parseInt($resizable.css('top'))
        var height = parseInt($resizable.css('height'))
        var width  = parseInt($resizable.css('width'))
        
        if (target == 'n' || target == 'nw') tmove = parseInt($dialog.css('top')) - otop
        else tmove = height - parseInt($dialog.css('height'))
        
        $dialog
            .css({top:otop, left:oleft, width:width + 2, height:height + 1})
            .find('> .dialogContent').css('width', (width - 0))
        
        if (target != 'w' && target != 'e') {
            var $dialogContent = $dialog.find('> .dialogContent')
            
            $dialogContent
                .css({height:height - $dialog.find('> .dialogHeader').outerHeight() - 6})
                .find('[data-layout-h]')
                .layoutH($dialogContent)
        }
        
        $(window).trigger(BJUI.eventType.resizeGrid)
    }
    
    Dialog.prototype.resizeInit = function(e, $resizable, $dialog, $bar) {
        var that   = this
        var target = $bar.attr('tar')
        
        $('body').css('cursor', target +'-resize')
        $resizable
            .css({
                top    : $dialog.css('top'),
                left   : $dialog.css('left'),
                height : $dialog.outerHeight(),
                width  : $dialog.css('width')
            })
            .show()
        
        if (!this.options.dragCurrent) {
            this.options.dragCurrent = {
                $resizable : $resizable,
                $dialog    : $dialog,
                target     : target,
                oleft      : parseInt($resizable.css('left')) || 0,
                owidth     : parseInt($resizable.css('width')) || 0,
                otop       : parseInt($resizable.css('top')) || 0,
                oheight    : parseInt($resizable.css('height')) || 0,
                ox         : e.pageX || e.screenX,
                oy         : e.pageY || e.clientY
            }
            $(document).on('mouseup.bjui.dialog.resize', $.proxy(that.resizeStop, that))
            $(document).on('mousemove.bjui.dialog.resize', $.proxy(that.resizeStart, that))
        }
    }
    
    Dialog.prototype.resizeStart = function(e) {
        var current   = this.options.dragCurrent
        
        if (!current) return
        if (!e) var e = window.event
        
        var lmove     = (e.pageX || e.screenX) - current.ox
        var tmove     = (e.pageY || e.clientY) - current.oy
        
        if ((e.pageY || e.clientY) <= 0 || (e.pageY || e.clientY) >= ($(window).height() - current.$dialog.find('> .dialogHeader').outerHeight())) return
        
        var target = current.target
        var width  = current.owidth
        var height = current.oheight
        
        if (target != 'n' && target != 's')
            width += (target.indexOf('w') >= 0) ? -lmove : lmove
        if (width >= this.options.minW) {
            if (target.indexOf('w') >= 0)
                current.$resizable.css('left', (current.oleft + lmove))
            if (target != 'n' && target != 's')
                current.$resizable.css('width', width)
        }
        if (target != 'w' && target != 'e')
            height += (target.indexOf('n') >= 0) ? -tmove : tmove
        if (height >= this.options.minH) {
            if (target.indexOf('n') >= 0)
                current.$resizable.css('top', (current.otop + tmove))
            if (target != 'w' && target != 'e')
                current.$resizable.css('height', height)
        }
    }
    
    Dialog.prototype.resizeStop = function(e) {
        var current = this.options.dragCurrent
        
        if (!current) return false
        
        $(document).off('mouseup.bjui.dialog.resize')
        $(document).off('mousemove.bjui.dialog.resize')
        this.options.dragCurrent = null
        this.resizeDialog(current.$resizable, current.$dialog, current.target)
        $('body').css('cursor', '')
        current.$resizable.hide()
    }
    
    // DIALOG PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Dialog.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.dialog')
            
            if (!data) $this.data('bjui.dialog', (data = new Dialog(this, options)))
            else if (data.options.id && data.options.id != options.id) $this.data('bjui.dialog', (data = new Dialog(this, options)))
            
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.open()
            }
        })
    }

    var old = $.fn.dialog

    $.fn.dialog             = Plugin
    $.fn.dialog.Constructor = Dialog
    
    // DIALOG NO CONFLICT
    // =================
    
    $.fn.dialog.noConflict = function () {
        $.fn.dialog = old
        return this
    }
    
    // DIALOG DATA-API
    // ==============

    $(document).on('click.bjui.dialog.data-api', '[data-toggle="dialog"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url)   options.url   = $this.attr('href')
        if (!options.id)    options.id    = 'dialog'
        if (!options.title) options.title = $this.text()
        
        Plugin.call($this, options)
        
        e.preventDefault()
    })

}(jQuery);

/* ========================================================================
 * B-JUI: bjui-taskbar.js v1.0
 * reference: bjui-core.js, bjui-extends.js, bjui.frag.js, bjui-initui.js, bjui-dialog.js
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.taskBar.js (author:Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-taskbar.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // TASKBAR GLOBAL ELEMENTS
    // ======================
    
    var $resizable
    var $taskBar, $taskBox, $taskList, $prevBtn, $nextBtn, taskDisabled, taskSelected, taskMargin
    
    $(function() {
        var INIT_TASKBAR = function() {
            $resizable   = $('#bjui-resizable')
            $taskBar     = $(FRAG.taskbar)
            $taskBox     = $taskBar.find('.taskbarContent')
            $taskList    = $taskBox.find('> ul')
            $prevBtn     = $taskBar.find('.taskbarLeft')
            $nextBtn     = $taskBar.find('.taskbarRight')
            taskDisabled = 'disabled'
            taskSelected = 'selected'
            taskMargin   = 'taskbarMargin'
            
            $('body').append('<!-- dialog task bar -->').append($taskBar)
            
            //events
            $prevBtn.click(function(e) { $(this).taskbar('scrollLeft') })
            $nextBtn.click(function(e) { $(this).taskbar('scrollRight') })
        }
        INIT_TASKBAR()
    })
    
    // TASKBAR CLASS DEFINITION
    // ======================
    
    var Taskbar = function(element, options) {
        this.$element = $(element)
        this.$task    = null
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Taskbar.DEFAULTS = {
        id: undefined,
        title: undefined
    }
    
    Taskbar.prototype.init = function() {
        var that = this
        var $task = $taskList.find('#'+ this.options.id)
        
        this.show()
        if (!$task.length) {
            var taskFrag = '<li id="#taskid#"><div class="taskbutton"><span><i class="fa fa-th-large"></i></span> <span class="title">#title#</span></div><div class="close"><i class="fa fa-times-circle"></i></div></li>';
            
            $task = $(taskFrag.replace('#taskid#', this.options.id).replace('#title#', this.options.title))
            $task.appendTo($taskList)
        } else {
            $task.find('> div > span.title').html(this.options.title)
        }
        this.contextmenu($task)
        this.switchTask($task)
        this.tools.scrollTask($task)
        
        //events
        $task.click(function(e) {
            if ($(e.target).closest('div').hasClass('close') || $(e.target).hasClass('close')) {
                $task.dialog('close', that.options.id)
            } else {
                var $dialog = $('body').data(that.options.id)
                
                if ($task.hasClass('selected')) {
                    $dialog.find('.dialogHeader a.minimize').trigger('click')
                } else {
                    if ($dialog.is(':hidden')) {
                        that.restoreDialog($dialog)
                    } else
                        $dialog.trigger('click')
                }
                that.scrollCurrent($task)
            }
            
            return false
        })
    }
    
    Taskbar.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            scrollCurrent: function() {
                var iW = this.tasksW(this.getTasks())
                
                if (iW > this.getTaskBarW()) {
                    var $tools = this
                    var lTask  = $taskList.find('> li:last-child')
                    var left   = this.getTaskBarW() - lTask.position().left - lTask.outerWidth(true)
                    
                    $taskList.animate({left: left}, 200, function() {
                        $tools.ctrlScrollBtn()
                    })
                } else {
                    this.ctrlScrollBtn()
                }
            },
            getTaskBarW: function() {
                return $taskBox.width()- ($prevBtn.is(':hidden') ? $prevBtn.width() + 2 : 0) - ($nextBtn.is(':hidden') ? $nextBtn.width() + 2 : 0)
            },
            scrollTask: function($task) {
                var $tools = this
                
                if ($task.position().left + this.getLeft() + $task.outerWidth() > this.getBarWidth()) {
                    var left = this.getTaskBarW() - $task.position().left  - $task.outerWidth(true) - 2
                    
                    $taskList.animate({left:left}, 200, function() {
                        $tools.ctrlScrollBtn()
                    })
                } else if ($task.position().left + this.getLeft() < 0) {
                    var left = this.getLeft() - ($task.position().left + this.getLeft())
                    
                    $taskList.animate({left:left}, 200, function() {
                        $tools.ctrlScrollBtn()
                    })
                }
            },
            ctrlScrollBtn: function() {
                var iW = this.tasksW(this.getTasks())
                
                if (this.getTaskBarW() > iW) {
                    $taskBox.removeClass(taskMargin)
                    $nextBtn.hide()
                    $prevBtn.hide()
                    if (this.getTasks().eq(0).length) this.scrollTask(this.getTasks().eq(0))
                } else {
                    $taskBox.addClass(taskMargin)
                    $nextBtn.show().removeClass(taskDisabled)
                    $prevBtn.show().removeClass(taskDisabled)
                    if (this.getLeft() >= 0) $prevBtn.addClass(taskDisabled)
                    if (this.getLeft() <= this.getTaskBarW() - iW) $nextBtn.addClass(taskDisabled)
                }
            },
            getLeft: function(){
                return $taskList.position().left
            },
            visibleStart: function() {
                var iLeft = this.getLeft()
                var jTasks = this.getTasks()
                
                for (var i = 0; i < jTasks.size(); i++) {
                    if (jTasks.eq(i).position().left + jTasks.eq(i).outerWidth(true) + iLeft >= 0) return jTasks.eq(i)
                }
                
                return jTasks.eq(0)
            },
            visibleEnd: function() {
                var iLeft = this.getLeft()
                var jTasks = this.getTasks()
                
                for (var i = 0; i < jTasks.size(); i++) {
                    if (jTasks.eq(i).position().left + jTasks.eq(i).outerWidth(true) + iLeft > this.getBarWidth()) return jTasks.eq(i)
                }
                
                return jTasks.eq(jTasks.size() - 1)
            },
            getTasks: function() {
                return $taskList.find('> li')
            },
            tasksW: function(jTasks) {
                var iW = 0
                
                jTasks.each(function() {
                    iW += $(this).outerWidth(true)
                })
                
                return iW
            },
            getBarWidth: function() {
                return $taskBar.innerWidth()
            },
            getCurrent: function() {
                return $taskList.find('li.'+ taskSelected)
            }
        }
        
        return tools
    }
    
    Taskbar.prototype.contextmenu = function($obj) {
        var that = this
        
        $obj.contextmenu({
            id: 'dialogCM',
            bindings: {
                reload: function(t) {
                    t.dialog('refresh', that.options.id)
                },
                closeCurrent: function(t, m) {
                    var $obj = t.isTag('li') ? t : that.tools.getCurrent()
                    
                    $obj.find('.close').trigger('click')
                },
                closeOther: function(t, m){
                    var $tasks = $taskList.find('> li').not(t)
                    
                    $tasks.each(function(i) {
                        $(this).find('.close').trigger('click')
                    })
                },
                closeAll: function(t, m) {
                    var $tasks = that.tools.getTasks()
                    
                    $tasks.each(function(i) {
                        $(this).find('.close').trigger('click')
                    })
                }
            },
            ctrSub: function(t, m) {
                var mCur = m.find('[rel="closeCurrent"]')
                var mOther = m.find('[rel="closeOther"]')
                
                if (!that.tools.getCurrent().length) {
                    mCur.addClass(taskDisabled)
                    mOther.addClass(taskDisabled)
                } else {
                    if (that.tools.getTasks().size() == 1)
                        mOther.addClass(taskDisabled)
                }
            }
        })
    }
    
    Taskbar.prototype.closeDialog = function(task) {
        var $task = (typeof task == 'string') ? this.getTask(task) : task
        
        if (!$task || !$task.length) return
        
        $task.remove()
        if (this.tools.getTasks().size() == 0) {
            this.hide()
        }
        this.tools.scrollCurrent()
        this.$element.removeData('bjui.taskbar')
    }
    
    Taskbar.prototype.minimize = function(dialog) {
        var that   = this
        var $dialog = (typeof dialog == 'string') ? $('body').data('dialog') : dialog
        var $task   = this.getTask($dialog.data('options').id)
        
        $resizable.css({
            top: $dialog.css('top'),
            left: $dialog.css('left'),
            height: $dialog.css('height'),
            width: $dialog.css('width')
        }).show().animate({top:$(window).height() - 60, left:$task.position().left, width:$task.outerWidth(), height:$task.outerHeight()}, 250, function() {
            $(this).hide()
            that.inactive($task)
        })
    }
    
    /**
     * @param {Object} id or dialog
     */
    Taskbar.prototype.restoreDialog = function($dialog) {
        var $task = this.getTask($dialog.data('options').id)
        
        $resizable.css({top:$(window).height() - 60, left:$task.position().left, height:$task.outerHeight(), width:$task.outerWidth()})
            .show()
            .animate({top:$dialog.css('top'), left:$dialog.css('left'), width:$dialog.css('width'), height:$dialog.css('height')}, 250, function() {
                $(this).hide()
                $dialog.show()
            })
        
        this.switchTask($task)
    }
    
    /**
     * @param {Object} id
     */
    Taskbar.prototype.inactive = function(task) {
        var $task = (typeof task == 'string') ? this.getTask(task) : task
        
        $task.removeClass(taskSelected)
    }
    
    Taskbar.prototype.scrollLeft = function() {
        var $task = this.tools.visibleStart()
        
        this.tools.scrollTask($task)
    }
    
    Taskbar.prototype.scrollRight = function() {
        var $task = this.tools.visibleEnd()
        
        this.tools.scrollTask($task)
    }
    
    Taskbar.prototype.scrollCurrent = function($task) {
        this.tools.scrollTask($task)
    }
    
    /**
     * @param {Object} id or $task
     */
    Taskbar.prototype.switchTask = function(task) {
        this.tools.getCurrent().removeClass(taskSelected)
        var $task = (typeof task == 'string') ? this.getTask(task) : task
        
        $task.addClass(taskSelected)
    }
    
    Taskbar.prototype.getTask = function(id) {
        return $taskList.find('#'+ id)
    }
    
    Taskbar.prototype.show = function() {
        if ($taskBar.is(':hidden')) {
            $taskBar.css('top', $(window).height() - 34 + $taskBar.outerHeight()).show()
            $taskBar.animate({top:$(window).height() - $taskBar.outerHeight()}, 500)
        }
    }
    
    Taskbar.prototype.hide = function() {
        $taskBar.animate({
            top: $(window).height() - 29 + $taskBar.outerHeight(true)
        }, 500, function() {
            $taskBar.hide()
        })
    }
    
    // TASKBAR PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Taskbar.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.taskbar')
            
            if (!data) $this.data('bjui.taskbar', (data = new Taskbar(this, options)))
            else if (data.options.id != options.id) $this.data('bjui.taskbar', (data = new Taskbar(this, options)))
            
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.taskbar

    $.fn.taskbar             = Plugin
    $.fn.taskbar.Constructor = Taskbar
    
    // TASKBAR NO CONFLICT
    // =================
    
    $.fn.taskbar.noConflict = function () {
        $.fn.taskbar = old
        return this
    }
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-ajax.js v1.0
 * @author K'naan (xknaan@163.com) 
 * -- Modified from dwz.ajax.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-ajax.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // BJUIAJAX CLASS DEFINITION
    // ======================
    
    var Bjuiajax = function(element, options) {
        var $this     = this
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Bjuiajax.DEFAULTS = {
        reload: true
    }
    
    Bjuiajax.NAVTAB = 'navtab'
    
    Bjuiajax.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getPagerForm: function($parent, args) {
                var form     = $parent.isTag('form') ? $parent[0] : $parent.find('#pagerForm:first')
                var pageInfo = $.extend({}, BJUI.pageInfo)
                
                if (form) {
                    for (var key in pageInfo) {
                        var val = ''
                        
                        if (args && args[key]) val = args[key]
                        if (!form[pageInfo[key]]) $('<input type="hidden" name="'+ pageInfo[key] +'" value="'+ val +'">').appendTo($(form))
                        else form[pageInfo[key]].value = val
                    }
                }
                
                return form
            },
            getTarget: function() {
                if (that.$element.closest('.navtab-panel').length) return Bjuiajax.NAVTAB
                else return 'dialog'
            }
        }
        
        return tools
    }
    
    Bjuiajax.prototype.ajaxForm4Iframe = function($form, successFn) {
        $.ajax({
            type        : $form.attr('method') || 'POST',
            url         : $form.attr('action'),
            data        : $form.serializeArray(),
            dataType    : 'json',
            files       : $form.find(':file'),
            iframe      : true,
            processData : false,
            cache       : false,
            success     : successFn,
            error       : $.proxy(this.ajaxError, this)
        })
    }
    
    Bjuiajax.prototype.ajaxForm4Html5 = function($form, successFn) {
        var formData = new FormData($form[0])
        
        $.ajax({
            type        : $form.attr('method') || 'POST',
            url         : $form.attr('action'),
            data        : formData,
            contentType : false,
            processData : false,
            dataType    : 'json',
            cache       : false,
            success     : successFn,
            error       : $.proxy(this.ajaxError, this)
        })
    }
    
    Bjuiajax.prototype.ajaxForm4Serialize = function($form, successFn) {
        $.ajax({
            type        : $form.attr('method') || 'POST',
            url         : $form.attr('action'),
            data        : $form.serializeArray(),
            dataType    : 'json',
            cache       : false,
            success     : successFn,
            error       : $.proxy(this.ajaxError, this)
        })
    }
    
    Bjuiajax.prototype.ajaxForm = function(options) {
        var that      = this
        var $form     = this.$element,
            callback  = options.callback,
            enctype   = $form.attr('enctype'),
            $target   = $form.closest('.bjui-layout')
        
        that.options = options
        
        if (callback) callback = callback.toFunc()
        if (!$target || !$target.length) {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) $target = $.CurrentNavtab
            else $target = $.CurrentDialog
        }
        
        $form.one('ajaxStart', function() {
            $target.trigger('bjui.ajaxStart')
        }).one('ajaxStop', function() {
            $target.trigger('bjui.ajaxStop')
        })
        
        var successFn = function(data, textStatus, jqXHR) {
            callback ? callback.apply(that, [data, $form]) : $.proxy(that.ajaxCallback(data), that)
        }
        var _submitFn = function() {
            if (enctype && enctype == 'multipart/form-data') {
                if (window.FormData) {
                    that.ajaxForm4Html5($form, successFn)
                } else {
                    that.ajaxForm4Iframe($form, successFn)
                }
            } else {
                that.ajaxForm4Serialize($form, successFn)
            }
        }
        
        if (options.confirmMsg) {
            $form.alertmsg('confirm', options.confirmMsg, {okCall: _submitFn})
        } else {
            _submitFn()
        }
    }
    
    Bjuiajax.prototype.ajaxDone = function(json) {
        var $element = this.$element
        
        if (json[BJUI.keys.statusCode] == BJUI.statusCode.error) {
            if (json[BJUI.keys.message]) $element.alertmsg('error', json[BJUI.keys.message])
        } else if (json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) {
            $element.alertmsg('error', json[BJUI.keys.message] || FRAG.sessionTimout, {okCall:BJUI.loadLogin})
        } else {
            if (json[BJUI.keys.message]) $element.alertmsg('correct', json[BJUI.keys.message])
        }
    }
    
    Bjuiajax.prototype.ajaxError = function(xhr, ajaxOptions, thrownError) {
        this.$element.alertmsg('error', '<div>Http status: ' + xhr.status + ' ' + xhr.statusText + '</div>' 
            + '<div>ajaxOptions: '+ ajaxOptions +' </div>'
            + '<div>thrownError: '+ thrownError +' </div>'
            + '<div>'+ xhr.responseText +'</div>')
    }
    
    Bjuiajax.prototype.ajaxCallback = function(json) {
        var that     = this
        var $element = that.$element
        var $target  = $element.closest('.bjui-layout')
        
        that.ajaxDone(json)
        
        if ($target && $target.length) {
            that.divCallback(json, $target)
        } else {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                that.navtabCallback(json)
            } else {
                that.dialogCallback(json)
            }
        }
    }
    
    Bjuiajax.prototype.divCallback = function(json, $target) {
        var that = this
        
        if (that.options.reload) {
            var form = that.tools.getPagerForm($target)
            var url  = null, type = null
            
            if (form) {
                url  = form.attr('action')
                type = form.attr('method') || 'GET'
            } else {
                url  = $target.data('url')
                type = $target.data('type') || 'GET'
            }
            
            if (!url) return
            
            $target.ajaxUrl({url: url, type: type})
        }
        if (that.options.reloadNavtab)
            setTimeout(function() { that.$element.navtab('refresh') }, 100)
        if (json.forward) {
            var _forward = function() {
                $target.ajaxUrl({url: json.forward})
            }
            
            if (json.forwardConfirm) {
                that.$element.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.navtabCallback = function(json) {
        var that = this
        
        if (json.tabid)
            setTimeout(function() { that.$element.navtab('reloadFlag', json.tabid) }, 100)
        if (json.closeCurrent && !json.forward)
            that.$element.navtab('closeCurrentTab')
        else if (that.options.reload)
            setTimeout(function() { that.$element.navtab('refresh') }, 100)
        if (json.forward) {
            var _forward = function() {
                that.$element.navtab('reload', {url:json.forward})
            }
            
            if (json.forwardConfirm) {
                that.$element.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() },
                    cancelCall: function() { if (json.closeCurrent) { that.$element.navtab('closeCurrentTab') } }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.dialogCallback = function(json) {
        var that = this
        
        if (json.dialogid)
            setTimeout(function() { that.$element.dialog('refresh', json.dialogid) }, 100)
        if (json.closeCurrent && !json.forward)
            that.$element.dialog('closeCurrent')
        else if (that.options.reload)
            setTimeout(function() { that.$element.dialog('refresh') }, 100)
        if (that.options.reloadNavtab)
            setTimeout(function() { that.$element.navtab('refresh') }, 100)
        if (json.forward) {
            var _forward = function() {
                that.$element.dialog('reload', {url:json.forward})
            }
            
            if (json.forwardConfirm) {
                that.$element.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.pageCallback = function(options, target) {
        var that    = this
        var op      = options
        var $target = target || null
        var form    = null
        
        if ($target && $target.length) {
            form = that.tools.getPagerForm($target, op)
            if (form) {
                $target.ajaxUrl({ type:'POST', url:$(form).attr('action'), data:$(form).serializeArray() })
            }
        } else {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                $target = $.CurrentNavtab
                form    = that.tools.getPagerForm($target, op)
                that.$element.navtab('reloadForm', false, op)
            } else {
                $target = $.CurrentDialog
                form    = that.tools.getPagerForm($target, op)
                that.$element.dialog('reloadForm', false, op)
            }
        }
    }
    
    Bjuiajax.prototype.doSearch = function(options) {
        var that = this, $element = that.$element, form = $element[0], $target = $element.closest('.bjui-layout')
        
        if (!options.url) options.url = $element.attr('action')
        if (!options.url) {
            BJUI.debug('Error trying to submit form action: action url is undefined!')
            return false
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('The submit form action is incorrect: '+ options.url)
                return false
            }
            
            options.url = encodeURI(options.url)
        }
        
        form = that.tools.getPagerForm($element)
        if (form[BJUI.pageInfo.pageCurrent]) form[BJUI.pageInfo.pageCurrent].value = 1
        
        if ($target && $target.length) {
            var data = $element.serializeJson()
            
            if (options.clearQuery) {
                var pageParams = $.extend({}, BJUI.pageInfo)
                
                for (var key in BJUI.pageInfo) {
                    if (data[BJUI.pageInfo[key]]) pageParams[key] = data[BJUI.pageInfo[key]]
                }
                data = pageParams
            }
            $target.ajaxUrl({ type:'POST', url:options.url, data:data })
        } else {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                $target = $.CurrentNavtab
                $element.navtab('reloadForm', options.clearQuery, options)
            } else {
                $target = $.CurrentDialog
                $element.dialog('reloadForm', options.clearQuery, options)
            }
        }
    }
    
    Bjuiajax.prototype.doLoad = function(options) {
        var that = this, $element = that.$element, type = options.type || 'GET', $target = options.target ? $(options.target) : null
        
        if (!options.url) {
            BJUI.debug('Error trying to open a ajax link: The url is undefined!')
            return false
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('The ajax link incorrect: '+ options.url)
                return false
            }
            
            options.url = encodeURI(options.url)
        }
        
        if (!$target || !$target.length) {
            BJUI.debug('Not set loaded \'ajax\' content container, like [data-target].')
            return false
        }
        
        if ($target && $target.length) {
            $target
                .data('url', options.url).data('type', type).data('data', options.data)
                .ajaxUrl({ type:type, url:options.url, data:options.data || {} })
        }
    }
    
    Bjuiajax.prototype.refreshLayout = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null
        
        if ($target && $target.length) {
            var url  = options.url || $target.data('url'),
                type = options.type || $target.data('type'),
                data = options.data || $target.data('data') || {}
            
            $target
                .data('url', url).data('type', type).data('data', data)
                .ajaxUrl({ type:type, url:url, data:data })
        }
    }
    
    Bjuiajax.prototype.doAjax = function(options) {
        var that = this, $element = that.$element
        
        if (!options.url) {
            BJUI.debug('Error trying to open a ajax link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        var callback = options.callback && options.callback.toFunc()
        var todo     = function() {
            $.ajax({
                type     : options.type || 'POST',
                url      : options.url,
                data     : options.data || {},
                dataType : 'json',
                cache    : false,
                success  : function(data, textStatus, jqXHR) {
                    callback ? callback.apply(that, [data]) : $.proxy(that.ajaxCallback(data), that)
                },
                error    : $.proxy(that.ajaxError, that)
            })
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype.doExport = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null, form

        if (!options.url) {
            BJUI.debug('Error trying to open a ajax link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            if (!$target || !$target.length) {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    $target = $.CurrentNavtab
                } else {
                    $target = $.CurrentDialog
                }
            }
            form = that.tools.getPagerForm($target)
            if (form) options.url = encodeURI(options.url + (options.url.indexOf('?') == -1 ? '?' : '&') + $(form).serialize())
            
            window.location = options.url
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype.doExportChecked = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null

        if (!options.url) {
            BJUI.debug('Error trying to open a export link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            if (!options.group) {
                that.$element.alertmsg('error', options.warn || FRAG.alertNoCheckGroup.replace('#nocheckgroup#', BJUI.regional.nocheckgroup))
                return
            }
            if (!$target || !$target.length) {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    $target = $.CurrentNavtab
                } else {
                    $target = $.CurrentDialog
                }
            }
            
            var ids     = []
            var $checks = $target.find(':checkbox[name='+ options.group +']:checked')
            
            if ($checks.length == 0) {
                that.$element.alertmsg('error', FRAG.alertNotChecked.replace('#notchecked#', BJUI.regional.notchecked))
                return
            }
            $checks.each(function() {
                ids.push($(this).val())
            })
            
            options.url += (options.url.indexOf('?') == -1 ? '?' : '&') + (options.idname ? options.idname : 'ids') +'='+ ids.join(',')
            
            window.location = options.url
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype.doAjaxChecked = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null

        if (!options.url) {
            BJUI.debug('Error trying to open a del link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            if (!options.group) {
                that.$element.alertmsg('error', options.warn || FRAG.alertNoCheckGroup.replace('#nocheckgroup#', BJUI.regional.nocheckgroup))
                return
            }
            if (!$target || !$target.length) {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    $target = $.CurrentNavtab
                } else {
                    $target = $.CurrentDialog
                }
            }
            
            var ids      = []
            var $checks  = $target.find(':checkbox[name='+ options.group +']:checked')
            var callback = options.callback && options.callback.toFunc()
            
            if ($checks.length == 0) {
                that.$element.alertmsg('error', FRAG.alertNotChecked.replace('#notchecked#', BJUI.regional.notchecked))
                return
            }
            $checks.each(function() {
                ids.push($(this).val())
            })
            
            options.url += (options.url.indexOf('?') == -1 ? '?' : '&') + (options.idname ? options.idname : 'ids') +'='+ ids.join(',')
            
            $.ajax({
                type     : options.type || 'POST',
                url      : options.url,
                dataType : 'json',
                cache    : false,
                success  : function(data, textStatus, jqXHR) {
                    callback ? callback.apply(that, [data]) : $.proxy(that.ajaxCallback(data), that)
                },
                error    : $.proxy(that.ajaxError, that)
            })
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    // BJUIAJAX PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Bjuiajax.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.bjuiajax')
            
            if (!data) $this.data('bjui.bjuiajax', (data = new Bjuiajax(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                return
            }
        })
    }

    var old = $.fn.bjuiajax

    $.fn.bjuiajax             = Plugin
    $.fn.bjuiajax.Constructor = Bjuiajax
    
    // BJUIAJAX NO CONFLICT
    // =================
    
    $.fn.bjuiajax.noConflict = function () {
        $.fn.bjuiajax = old
        return this
    }
    
    // BJUIAJAX DATA-API
    // ==============
    
    $(document).on('submit.bjui.bjuiajax.data-api', '[data-toggle="ajaxform"]', function(e) {
        var $this   = $(this)
        
        if (!$this.isTag('form')) return
        
        Plugin.call($this, 'ajaxForm', $this.data())
        
        e.preventDefault()
    })
    
    $(document).on('submit.bjui.bjuiajax.data-api', '[data-toggle="ajaxsearch"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!$this.isTag('form')) return
        
        Plugin.call($this, 'doSearch', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="reloadsearch"]', function(e) {
        var $this = $(this), options
        var $form = $this.closest('form')
        
        if (!$form || !$form.length) return
        
        options = $form.data()
        options.clearQuery = $this.data('clearQuery') || true
        
        Plugin.call($form, 'doSearch', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="ajaxload"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doLoad', options)
        
        e.preventDefault()
    })
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $box    = $(e.target).find('[data-toggle="autoajaxload"]')
        var options = $box.data()
        
        if ($box && $box.length) {
            options.target = $box[0]
            Plugin.call($box, 'doLoad', options)
        }
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="refreshlayout"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        Plugin.call($this, 'refreshLayout', options)
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doajax"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doAjax', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doexport"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doExport', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doexportchecked"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doExportChecked', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doajaxchecked"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doAjaxChecked', options)
        
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-alertmsg.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.alertMsg.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-alertmsg.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // ALERTMSG GLOBAL ELEMENTS
    // ======================
    
    var $box, $alertbg, timer
    
    $(function() {
        var INIT_ALERTMSG = function() {
            $box     = $(FRAG.alertBoxFrag).hide().html('')
            $alertbg = $(FRAG.alertBackground).hide().html('')
            $('body').append('<!-- alert msg box -->').append($box).append('<!-- alert msg box mask bg -->').append($alertbg)
        }
        
        INIT_ALERTMSG()
    })
    
    // ALERTMSG CLASS DEFINITION
    // ======================
    var Alertmsg = function(element, options) {
        this.$element  = $(element)
        this.options   = options
        this.tools     = this.TOOLS()
        this.clearTime = null
    }
    
    Alertmsg.DEFAULTS = {
        closeTimer: null,
        types: {error:'error', info:'info', warn:'warn', correct:'correct', confirm:'confirm'},
        fas: {error:'fa-times-circle', info:'fa-info-circle', warn:'fa-exclamation-circle', correct:'fa-check-circle', confirm:'fa-question-circle'}
    }
    
    Alertmsg.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getTitle: function(key){
                return BJUI.regional.alertmsg.title[key]
            },
            keydownOk: function(event) {
                if (event.which == BJUI.keyCode.ENTER) {
                    event.data.target.trigger('click')
                    return false
                }
                return true
            },
            keydownEsc: function(event) {
                if (event.which == BJUI.keyCode.ESC) event.data.target.trigger('click')
            },
            open: function(type, msg, buttons) {
                var $tools   = this
                var options  = that.options
                var btnsHtml = ''
                
                if (buttons) {
                    for (var i = 0; i < buttons.length; i++) {
                        var sRel = buttons[i].call ? 'callback' : ''
                        var sCls = buttons[i].cls  ? buttons[i].cls : 'default'
                        var sIco = (buttons[i].cls && buttons[i].cls == 'green') ? 'check' : 'close'
                        
                        btnsHtml += FRAG.alertBtnFrag.replace('#btnMsg#', '<i class="fa fa-'+ sIco +'"></i> '+ buttons[i].name).replace('#callback#', sRel).replace('#class#', sCls)
                    }
                }
                var $newbox = 
                    $(FRAG.alertBoxFrag.replace('#type#', type)
                    .replace('#fa#', options.fas[type])
                    .replace('#title#', this.getTitle(type))
                    .replace('#message#', msg)
                    .replace('#btnFragment#', btnsHtml))
                    .hide()
                    .appendTo('body')
                
                if ($box && $box.length) $box.remove()
                $box = $newbox
                $box.css({top:-$box.outerHeight()}).show().animate({top:'0px'}, 500)

                if (timer) {
                    clearTimeout(timer)
                    timer = null
                }
                if (options.types.info == type || options.types.correct == type) {
                    timer = setTimeout(function() { $tools.close() }, 6000)
                } else {
                    $alertbg.show()
                }

                var $btns = $box.find('.btn')
                
                $btns.each(function(i) {
                    $(this).on('click', $.proxy(function() {
                            that.tools.close()
                            if (buttons[i].call) buttons[i].call()
                        }, that)
                    )
                    
                    if (buttons[i].keyCode == BJUI.keyCode.ENTER) {
                        $(document).on('keydown.bjui.alertmsg.ok', {target:$btns.eq(i)}, $tools.keydownOk)
                    }
                    if (buttons[i].keyCode == BJUI.keyCode.ESC) {
                        $(document).on('keydown.bjui.alertmsg.esc', {target:$btns.eq(i)}, $tools.keydownEsc)
                    }
                })
            },
            alert: function(type, msg, options) {
                var op = $.extend({}, {okName:BJUI.regional.alertmsg.btnMsg.ok, okCall:null}, options)
                var buttons = [
                    {name:op.okName, call:op.okCall, cls:'default', keyCode:BJUI.keyCode.ENTER}
                ]
                
                this.open(type, msg, buttons)
            },
            close: function() {
                $(document).off('keydown.bjui.alertmsg.ok').off('keydown.bjui.alertmsg.esc')
                $box.animate({top:-$box.height()}, 500, function() {
                    $alertbg.hide()
                    $(this).hide().empty()
                })
            }
        }
        
        return tools
    }
    
    Alertmsg.prototype.error = function(msg, options) {
        this.tools.alert(this.options.types.error, msg, options)
    }
    
    Alertmsg.prototype.info = function(msg, options) {
        this.tools.alert(this.options.types.info, msg, options)
    }
    
    Alertmsg.prototype.warn = function(msg, options) {
        this.tools.alert(this.options.types.warn, msg, options)
    }
    
    Alertmsg.prototype.correct = function(msg, options) {
        this.tools.alert(this.options.types.correct, msg, options)
    }
    
    Alertmsg.prototype.confirm = function(msg, options) {
        var op = {okName:BJUI.regional.alertmsg.btnMsg.ok, okCall:null, cancelName:BJUI.regional.alertmsg.btnMsg.cancel, cancelCall:null}
        
        $.extend(op, options)
        
        var buttons = [
            {name:op.okName, call:op.okCall, cls:'green', keyCode:BJUI.keyCode.ENTER},
            {name:op.cancelName, call:op.cancelCall, cls:'red', keyCode:BJUI.keyCode.ESC}
        ]
        
        this.tools.open(this.options.types.confirm, msg, buttons)
    }
    
    // ALERTMSG PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Alertmsg.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.alertmsg')
            
            if (!data) $this.data('bjui.alertmsg', (data = new Alertmsg(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                return
            }
        })
    }

    var old = $.fn.alertmsg

    $.fn.alertmsg             = Plugin
    $.fn.alertmsg.Constructor = Alertmsg
    
    // ALERTMSG NO CONFLICT
    // =================
    
    $.fn.alertmsg.noConflict = function () {
        $.fn.alertmsg = old
        return this
    }
    
    // NAVTAB DATA-API
    // ==============
    
    $(document).on('click.bjui.alertmsg.data-api', '[data-toggle="alertmsg"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        var type    = options.type,
            msg     = options.msg
        
        if (!type || !msg) return false
        Plugin.call($this, type, msg, options)
        
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-pagination.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.pagination.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-pagination.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // PAGINATION CLASS DEFINITION
    // ======================
    
    var Pagination = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Pagination.DEFAULTS = {
        first :  'li.j-first',
        prev  :  'li.j-prev',
        next  :  'li.j-next',
        last  :  'li.j-last',
        nums  :  'li.j-num > a',
        jump  :  'li.jumpto',
        pageNumFrag : '<li class="#liClass#"><a href="javascript:;">#pageNum#</a></li>',
        target      : '',  // refresh container('div') selector
        total       : 0,
        pageSize    : 10,
        pageNum     : 10,
        pageCurrent : 1,
        callback    : function() { return false }
    }
    
    Pagination.prototype.TOOLS = function() {
        var that    = this
        var options = this.options
        var tools   = {
            pageNums: function() {
                return Math.ceil(options.total / options.pageSize)
            },
            getInterval: function() {
                var ne_half     = Math.ceil(options.pageNum / 2)
                var pn          = this.pageNums()
                var upper_limit = pn - options.pageNum
                var start       = this.getCurrentPage() > ne_half ? Math.max(Math.min(this.getCurrentPage() - ne_half, upper_limit), 0) : 0
                var end         = this.getCurrentPage() > ne_half ? Math.min(this.getCurrentPage() + ne_half, pn) : Math.min(options.pageNum, pn)
                
                return {start: start + 1, end:end + 1}
            },
            getCurrentPage: function() {
                var pageCurrent = parseInt(options.pageCurrent)
                
                return (isNaN(pageCurrent)) ? 1 : pageCurrent
            },
            hasPrev: function() {
                return this.getCurrentPage() > 1
            },
            hasNext: function() {
                return this.getCurrentPage() < this.pageNums()
            }
        }
        return tools
    }
    
    Pagination.prototype.init = function() {
        var that        = this
        var options     = this.options
        var tools       = this.tools
        var interval    = tools.getInterval()
        var pageNumFrag = ''
        var pagination  = FRAG.pagination
        var pr          = BJUI.regional.pagination
        
        for (var i = interval.start; i < interval.end; i++) {
            pageNumFrag += options.pageNumFrag.replaceAll('#pageNum#', i).replaceAll('#liClass#', i == tools.getCurrentPage() ? 'selected j-num' : 'j-num')
        }
        
        pagination = 
            pagination
                .replaceAll('#pageNumFrag#', pageNumFrag)
                .replaceAll('#pageCurrent#', tools.getCurrentPage())
                .replaceAll('#first#', pr.first)
                .replaceAll('#last#', pr.last)
                .replaceAll('#prev#', pr.prev)
                .replaceAll('#next#', pr.next)
                .replaceAll('#jumpto#', pr.jumpto)
                .replaceAll('#jump#', pr.jump)
            
        this.$element.html(pagination)
        
        var $first = this.$element.find(options.first)
        var $prev  = this.$element.find(options.prev)
        var $next  = this.$element.find(options.next)
        var $last  = this.$element.find(options.last)
        
        if (tools.hasPrev()){
            $first.add($prev).find('> span').hide()
            _bindEvent($prev, tools.getCurrentPage() - 1)
            _bindEvent($first, 1)
        } else {
            $first.add($prev).addClass('disabled').find('> a').hide()
        }
        if (tools.hasNext()) {
            $next.add($last).find('> span').hide()
            _bindEvent($next, tools.getCurrentPage() + 1)
            _bindEvent($last, tools.pageNums())
        } else {
            $next.add($last).addClass('disabled').find('> a').hide()
        }

        this.$element.find(options.nums).each(function(i) {
            _bindEvent($(this), i + interval.start)
        })
        
        this.$element.find(options.jump).each(function() {
            var $inputBox = $(this).find(':text')
            var $button   = $(this).find('.goto')
            
            $button.on('click', function() {
                var pageNum = $inputBox.val()
                
                if (pageNum && pageNum.isPositiveInteger())
                    $(this).bjuiajax('pageCallback', {pageCurrent:pageNum, pageSize:options.pageSize}, that.$element.closest('.bjui-layout'))
            })
            
            $inputBox.keyup(function(e) {
                if (e.keyCode == BJUI.keyCode.ENTER) $button.trigger('click')
            })
        })
        
        function _bindEvent($target, pageNum) {
            $target.on('click', function(e) {
                $(this).bjuiajax('pageCallback', {pageCurrent:pageNum, pageSize:that.options.pageSize}, that.$element.closest('.bjui-layout'))
                
                e.preventDefault()
            })
        }
    }
    
    Pagination.prototype.changePagesize = function() {
        var that = this, pageSize = that.$element.val()
        
        if (!isNaN(pageSize))
            that.$element.bjuiajax('pageCallback', {pageSize:pageSize}, that.$element.closest('.bjui-layout'))
    }
    
    Pagination.prototype.orderBy = function(options) {
        var that = this
        
        that.$element.css({cursor:'pointer'}).click(function() {
            var orderField     = $(this).data('orderField')
            var orderDirection = $(this).data('orderDirection')
            
            $(this).bjuiajax('pageCallback', {orderField:orderField, orderDirection:orderDirection}, that.$element.closest('.bjui-layout'))
        })
    }
    
    // PAGINATION PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Pagination.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.pagination')
            
            if (!data) $this.data('bjui.pagination', (data = new Pagination(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.pagination

    $.fn.pagination             = Plugin
    $.fn.pagination.Constructor = Pagination
    
    // PAGINATION NO CONFLICT
    // =================
    
    $.fn.pagination.noConflict = function () {
        $.fn.pagination = old
        return this
    }
    
    // PAGINATION DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('[data-toggle="pagination"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })
    
    $(document).on('change.bjui.pagination.data-api', 'select[data-toggle-change="changepagesize"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        Plugin.call($this, 'changePagesize')
        
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-util.date.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.util.date.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-util.date.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec')

    var DAY_NAMES   = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat')

    function LZ(x) {
        return (x < 0 || x > 9 ? '' :'0') + x
    }

    /**
         * formatDate (date_object, format)
         * Returns a date in the output format specified.
         * The format string uses the same abbreviations as in parseDate()
         * @param {Object} date
         * @param {Object} format
         */
    function formatDate(date, format) {
        format       = format + ''
        var result   = ''
        var i_format = 0
        var c        = ''
        var token    = ''
        var y        = date.getYear() + ''
        var M        = date.getMonth() + 1
        var d        = date.getDate()
        var E        = date.getDay()
        var H        = date.getHours()
        var m        = date.getMinutes()
        var s        = date.getSeconds()
        var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k
        // Convert real date parts into formatted versions
        var value = {}
        
        if (y.length < 4) {
            y = '' + (y - 0 + 1900)
        }
        value['y']    = '' + y
        value['yyyy'] = y
        value['yy']   = y.substring(2, 4)
        value['M']    = M
        value['MM']   = LZ(M)
        value['MMM']  = MONTH_NAMES[M - 1]
        value['NNN']  = MONTH_NAMES[M + 11]
        value['d']    = d
        value['dd']   = LZ(d)
        value['E']    = DAY_NAMES[E + 7]
        value['EE']   = DAY_NAMES[E]
        value['H']    = H
        value['HH']   = LZ(H)
        
        if (H == 0) {
            value['h'] = 12
        } else if (H > 12) {
            value['h'] = H - 12
        } else {
            value['h'] = H
        }
        value['hh'] = LZ(value['h'])
        
        if (H > 11) {
            value['K'] = H - 12
        } else {
            value['K'] = H
        }
        value['k']  = H + 1
        value['KK'] = LZ(value['K'])
        value['kk'] = LZ(value['k'])
        
        if (H > 11) {
            value['a'] = 'PM'
        } else {
            value['a'] = 'AM'
        }
        value['m']  = m
        value['mm'] = LZ(m)
        value['s']  = s
        value['ss'] = LZ(s)
        
        while (i_format < format.length) {
            c     = format.charAt(i_format)
            token = ''
            
            while (format.charAt(i_format) == c && i_format < format.length) {
                token += format.charAt(i_format++)
            }
            if (value[token] != null) {
                result += value[token]
            } else {
                result += token
            }
        }
        return result
    }

    function _isInteger(val) {
        return new RegExp(/^\d+$/).test(val)
    }

    function _getInt(str, i, minlength, maxlength) {
        for (var x = maxlength; x >= minlength; x--) {
            var token = str.substring(i, i + x)
            
            if (token.length < minlength) {
                return null
            }
            if (_isInteger(token)) {
                return token
            }
        }
        return null
    }

    /**
         * parseDate( date_string , format_string )
         * 
         * This function takes a date string and a format string. It matches
         * If the date string matches the format string, it returns the date. 
         * If it does not match, it returns 0.
         * @param {Object} val
         * @param {Object} format
         */
    function parseDate(val, format) {
        val          = val + ''
        format       = format + ''
        
        var i_val    = 0
        var i_format = 0
        var c        = ''
        var token    = ''
        var token2   = ''
        var x, y
        var now      = new Date(1900, 0, 1)
        var year     = now.getYear()
        var month    = now.getMonth() + 1
        var date     = 1
        var hh       = now.getHours()
        var mm       = now.getMinutes()
        var ss       = now.getSeconds()
        var ampm     = ''
        
        while (i_format < format.length) {
            // Get next token from format string
            c     = format.charAt(i_format)
            token = ''
            while (format.charAt(i_format) == c && i_format < format.length) {
                token += format.charAt(i_format++)
            }
            // Extract contents of value based on format token
            if (token == 'yyyy' || token == 'yy' || token == 'y') {
                if (token == 'yyyy') {
                    x = 4
                    y = 4
                }
                if (token == 'yy') {
                    x = 2
                    y = 2
                }
                if (token == 'y') {
                    x = 2
                    y = 4
                }
                year = _getInt(val, i_val, x, y)
                if (year == null) {
                    return 0
                }
                i_val += year.length
                if (year.length == 2) {
                    if (year > 70) {
                        year = 1900 + (year - 0)
                    } else {
                        year = 2e3 + (year - 0)
                    }
                }
            } else if (token == 'MMM' || token == 'NNN') {
                month = 0
                for (var i = 0; i < MONTH_NAMES.length; i++) {
                    var month_name = MONTH_NAMES[i]
                    
                    if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                        if (token == 'MMM' || token == 'NNN' && i > 11) {
                            month = i + 1
                            if (month > 12) {
                                month -= 12
                            }
                            i_val += month_name.length
                            break
                        }
                    }
                }
                if (month < 1 || month > 12) {
                    return 0
                }
            } else if (token == 'EE' || token == 'E') {
                for (var i = 0; i < DAY_NAMES.length; i++) {
                    var day_name = DAY_NAMES[i]
                    
                    if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                        i_val += day_name.length
                        break
                    }
                }
            } else if (token == 'MM' || token == 'M') {
                month = _getInt(val, i_val, token.length, 2)
                if (month == null || month < 1 || month > 12) {
                    return 0
                }
                i_val += month.length
            } else if (token == 'dd' || token == 'd') {
                date = _getInt(val, i_val, token.length, 2)
                if (date == null || date < 1 || date > 31) {
                    return 0
                }
                i_val += date.length
            } else if (token == 'hh' || token == 'h') {
                hh = _getInt(val, i_val, token.length, 2)
                if (hh == null || hh < 1 || hh > 12) {
                    return 0
                }
                i_val += hh.length
            } else if (token == 'HH' || token == 'H') {
                hh = _getInt(val, i_val, token.length, 2)
                if (hh == null || hh < 0 || hh > 23) {
                    return 0
                }
                i_val += hh.length
            } else if (token == 'KK' || token == 'K') {
                hh = _getInt(val, i_val, token.length, 2)
                if (hh == null || hh < 0 || hh > 11) {
                    return 0
                }
                i_val += hh.length
            } else if (token == 'kk' || token == 'k') {
                hh = _getInt(val, i_val, token.length, 2)
                if (hh == null || hh < 1 || hh > 24) {
                    return 0
                }
                i_val += hh.length
                hh--
            } else if (token == 'mm' || token == 'm') {
                mm = _getInt(val, i_val, token.length, 2)
                if (mm == null || mm < 0 || mm > 59) {
                    return 0
                }
                i_val += mm.length
            } else if (token == 'ss' || token == 's') {
                ss = _getInt(val, i_val, token.length, 2)
                if (ss == null || ss < 0 || ss > 59) {
                    return 0
                }
                i_val += ss.length
            } else if (token == 'a') {
                if (val.substring(i_val, i_val + 2).toLowerCase() == 'am') {
                    ampm = 'AM'
                } else if (val.substring(i_val, i_val + 2).toLowerCase() == 'pm') {
                    ampm = 'PM'
                } else {
                    return 0
                }
                i_val += 2
            } else {
                if (val.substring(i_val, i_val + token.length) != token) {
                    return 0
                } else {
                    i_val += token.length
                }
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) {
            return 0
        }
        // Is date valid for month?
        if (month == 2) {
            // Check for leap year
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
                // leap year
                if (date > 29) {
                    return 0
                }
            } else {
                if (date > 28) {
                    return 0
                }
            }
        }
        if (month == 4 || month == 6 || month == 9 || month == 11) {
            if (date > 30) {
                return 0
            }
        }
        // Correct hours value
        if (hh < 12 && ampm == 'PM') {
            hh = hh - 0 + 12
        } else if (hh > 11 && ampm == 'AM') {
            hh -= 12
        }
        
        return new Date(year, month - 1, date, hh, mm, ss)
    }

    Date.prototype.formatDate = function(dateFmt) {
        return formatDate(this, dateFmt)
    }

    String.prototype.parseDate = function(dateFmt) {
        if (this.length < dateFmt.length) {
            dateFmt = dateFmt.slice(0, this.length)
        }
        return parseDate(this, dateFmt)
    }

    /**
     * replaceTmEval('{1+2}-{2-1}')
     */
    function replaceTmEval(data) {
        return data.replace(RegExp('({[A-Za-z0-9_+-]*})', 'g'), function($1) {
            return eval('(' + $1.replace(/[{}]+/g, '') + ')')
        })
    }

    /**
     * dateFmt:%y-%M-%d
     * %y-%M-{%d+1}
     * ex: new Date().formatDateTm('%y-%M-{%d-1}')
     *     new Date().formatDateTm('2012-1')
     */
    Date.prototype.formatDateTm = function(dateFmt) {
        var y = this.getFullYear()
        var m = this.getMonth() + 1
        var d = this.getDate()
        var sDate = dateFmt.replaceAll('%y', y).replaceAll('%M', m).replaceAll('%d', d)
        
        sDate = replaceTmEval(sDate)
        
        var _y = 1900, _m = 0, _d = 1
        var aDate = sDate.split('-')
        
        if (aDate.length > 0) _y = aDate[0]
        if (aDate.length > 1) _m = aDate[1] - 1
        if (aDate.length > 2) _d = aDate[2]
        
        return new Date(_y, _m, _d).formatDate('yyyy-MM-dd')
    }
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-datepicker.js v1.0
 * reference: util.date.js
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.datepicker.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-datepicker.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';

    // DATEPICKER GLOBAL ELEMENTS
    // ======================
    
    var $box, $main, $prev, $next, $year, $month, $time, $timeinps, $spinner, $hh, $mm, $ss, $tm, $close, $days, $dayNames, $clearBtn, $okBtn
    
    $(function() {
        var INIT_DATEPICKER = function() {
            var cp       = BJUI.regional.datepicker
            var calendar = FRAG.calendarFrag
                .replace('#close#', cp.close)
                .replace('#prev#', cp.prev)
                .replace('#next#', cp.next)
                .replace('#clear#', cp.clear)
                .replace('#ok#', cp.ok)
            
            $box      = $(calendar).hide()
            $('body').append('<!-- datepicker -->').append($box)
            $main     = $box.find('> .main')
            $prev     = $box.find('a.prev')
            $next     = $box.find('a.next')
            $year     = $box.find('select[name=year]')
            $month    = $box.find('select[name=month]')
            $time     = $box.find('.time')
            $timeinps = $time.find(':text')
            $spinner  = $time.find('ul > li')
            $hh       = $time.find('.hh')
            $mm       = $time.find('.mm')
            $ss       = $time.find('.ss')
            $tm       = $main.find('> .tm')
            $close    = $box.find('.close')
            $days     = $main.find('> .body > .days')
            $dayNames = $main.find('> .body > .dayNames')
            $clearBtn = $box.find('.clearBtn')
            $okBtn    = $box.find('.okBtn')
            
            //regional
            var dayNames = '', dr = BJUI.regional.datepicker
            
            $.each(dr.dayNames, function(i, v) {
                dayNames += '<dt>'+ v +'</dt>'
            })
            $dayNames.html(dayNames)
            $.each(dr.monthNames, function(i, v) {
                var m = i + 1
                
                $month.append('<option value="'+ m +'">'+ v +'</option>')
            })
        
            $box.on('selectstart', function() { return false })
        }
        
        INIT_DATEPICKER()
    })
    
    // DATEPICKER CLASS DEFINITION
    // ======================
    var Datepicker = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
        this.$dateBtn = null
                
        //动态minDate、maxDate
        var now = new Date()
        
        this.options.minDate = now.formatDateTm(this.options.minDate)
        this.options.maxDate = now.formatDateTm(this.options.maxDate)
        
        //events
        this.events = {
            focus_time    : 'focus.bjui.datepicker.time',
            click_prev    : 'click.bjui.datepicker.prev',
            click_next    : 'click.bjui.datepicker.next',
            click_ok      : 'click.bjui.datepicker.ok',
            click_days    : 'click.bjui.datepicker.days',
            click_clear   : 'click.bjui.datepicker.clear',
            click_close   : 'click.bjui.datepicker.close',
            click_tm      : 'click.bjui.datepicker.tm',
            click_spinner : 'click.bjui.datepicker.spinner',
            mousedown_sp  : 'mousedown.bjui.datepicker.spinner',
            mouseup_sp    : 'mouseup.bjui.datepicker.spinner',
            change_ym     : 'change.bjui.datepicker.ym',
            click_time    : 'click.bjui.datepicker.time',
            keydown_time  : 'keydown.bjui.datepicker.time',
            keyup_time    : 'keyup.bjui.datepicker.time'
        }
    }
    
    Datepicker.DEFAULTS = {
        pattern : 'yyyy-MM-dd',
        minDate : '1900-01-01',
        maxDate : '2099-12-31',
        mmStep  : 1,
        ssStep  : 1
    }
    
    Datepicker.EVENTS = {
        afterChange : 'afterchange.bjui.datepicker'
    }
    
    Datepicker.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            changeTmMenu: function(sltClass) {
                $tm.removeClass('hh').removeClass('mm').removeClass('ss')
                if (sltClass) {
                    $tm.addClass(sltClass)
                    $timeinps.removeClass('slt').filter('.'+ sltClass).addClass('slt')
                }
            },
            clickTmMenu: function($input, type) {
                $tm
                    .find('> ul')
                    .hide()
                    .filter('.'+ type)
                    .show()
                    .find('> li')
                    .off(that.events.click_tm)
                    .on(that.events.click_tm, function() {
                        var $li = $(this)
                        var val = parseInt($li.text()) < 10 ? ('0'+ $li.text()) : $li.text()
                        
                        $input.val(val)
                    })
            },
            keydownInt: function(e) {
                if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode == BJUI.keyCode.DELETE || e.keyCode == BJUI.keyCode.BACKSPACE))) { return false }
            },
            changeTm: function($input, $btn) {
                var ivalue = parseInt($input.val()), istart = parseInt($input.data('start')) || 0, iend = parseInt($input.data('end'))
                var istep  = parseInt($input.data('step') || 1)
                var type   = $btn ? ($btn.data('add') ? $btn.data('add') : -1) : 0
                var newVal = ivalue
                
                if (type == 1) {
                    if (ivalue <= iend - istep) 
                        newVal = ivalue + istep
                } else if (type == -1) {
                    if (ivalue >= (istart + istep))
                        newVal = ivalue - istep
                } else if (ivalue > iend) {
                    newVal = iend
                } else if (ivalue < istart) {
                    newVal = istart
                }
                if (newVal < 10) newVal = '0'+ newVal
                $input.val(newVal)
            },
            closeCalendar: function(flag) {
                tools.changeTmMenu()
                if (flag) {
                    $(document).off(that.events.click_close)
                    $box.hide()
                }
            },
            get: function(name) {
                return that.options[name]
            },
            getDays: function (y, m) {
                return m == 2 ? (y % 4 || (!(y % 100) && y % 400) ? 28 : 29) : (/4|6|9|11/.test(m) ? 30 : 31)
            },
            minMaxDate: function(sDate) {
                var _count  = sDate.split('-').length - 1
                var _format = 'y-M-d'
                
                if (_count == 1) _format = 'y-M'
                else if (_count == 0) _format = 'y'
                
                return sDate.parseDate(_format)
            },
            getMinDate: function() {
                return this.minMaxDate(that.options.minDate)
            },
            getMaxDate: function() {
                var _sDate = that.options.maxDate
                var _count = _sDate.split('-').length - 1
                var _date  = this.minMaxDate(_sDate)
                
                if (_count < 2) { //format:y-M、y
                    var _day = this.getDays(_date.getFullYear(), _date.getMonth() + 1)
                    _date.setDate(_day)
                    if (_count == 0)//format:y
                        _date.setMonth(11)
                }
                
                return _date
            },
            getDateWrap: function(date) {
                if (!date) date = this.parseDate(that.sDate) || new Date()
                
                var y = date.getFullYear()
                var m = date.getMonth() + 1
                var days = this.getDays(y, m)
                
                return {
                    year: y, month: m, day: date.getDate(),
                    hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds(),
                    days: days, date: date
                }
            },
            changeDate: function(y, m, d) {
                var date    = new Date(y, m - 1, d || 1)
                
                that.sDate = this.formatDate(date)
                return date
            },
            changeDateTime: function(y, M, d, H, m, s) {
                var date    = new Date(y, M - 1, d, H, m, s)
                
                that.sDate = this.formatDate(date)
                return date
            },
            changeDay: function(day, chMonth) {
                if (!chMonth) chMonth = 0
                var dw = this.getDateWrap()
                
                return this.changeDate(dw.year, dw.month + parseInt(chMonth), day)
            },
            changeMonth: function(type) {
                var yearIndex = $year.get(0).selectedIndex
                var maxYear   = $year.find('option').length
                var month     = ($month.val() * 1) + type
                
                if (month == 0) {
                    if (yearIndex == 0) {
                        month = 1
                    } else {
                        month = 12
                        yearIndex--
                        $year.get(0).selectedIndex = yearIndex
                    }
                } else if (month == 13) {
                    if (yearIndex == (maxYear - 1)) {
                        month = 12
                    } else {
                        month = 1
                        yearIndex++
                        $year.get(0).selectedIndex = yearIndex
                    }
                }
                $month.val(month).change()
            },
            parseDate: function(sDate) {
                if (!sDate) return null
                return sDate.parseDate(that.options.pattern)
            },
            formatDate: function(date) {
                return date.formatDate(that.options.pattern)
            },
            hasHour: function() {
                return that.options.pattern.indexOf('H') != -1
            },
            hasMinute: function() {
                return that.options.pattern.indexOf('m') != -1
            },
            hasSecond: function() {
                return that.options.pattern.indexOf('s') != -1
            },
            hasTime: function() {
                return this.hasHour() || this.hasMinute() || this.hasSecond()
            },
            hasDate: function() {
                var _dateKeys = ['y','M','d','E']
                
                for (var i = 0; i < _dateKeys.length; i++) {
                    if (that.options.pattern.indexOf(_dateKeys[i]) != -1) return true
                }
                return false
            },
            afterChange: function(date) {
                that.$element.trigger(Datepicker.EVENTS.afterChange, {value:date})
            }
        }
        return tools
    }
    
    Datepicker.prototype.addBtn = function() {
        var that     = this, $element = that.$element
        
        if (!this.$dateBtn && !this.options.addbtn) {
            this.$dateBtn = $(FRAG.dateBtn)
            this.$element.css({'paddingRight':'15px'}).wrap('<span></span>')
            
            var $box   = this.$element.parent()
            var height = this.$element.addClass('form-control').innerHeight()
            
            $box.css({'position':'relative', 'display':'inline-block'})
            
            $.each(that.options, function(key, val) {
                if (key != 'toggle') that.$dateBtn.attr('data-'+ key, val)
            })
            this.$dateBtn.css({'height':height, 'lineHeight':height +'px'}).appendTo($box)
            this.$dateBtn.on('selectstart', function() { return false })
        }
    }
    
    Datepicker.prototype.init = function() {
        if (this.$element.val()) this.sDate = this.$element.val().trim()
        
        var that      = this
        var options   = this.options
        var tools     = this.tools
        var dw        = tools.getDateWrap()
        var minDate   = tools.getMinDate(), maxDate = tools.getMaxDate()
        var yearstart = minDate.getFullYear(), yearend = maxDate.getFullYear()
        
        for (var y = yearstart; y <= yearend; y++) {
            $year.append('<option value="'+ y +'"'+ (dw.year == y ? ' selected' : '') +'>'+ y +'</option>')
        }
        
        $month.val(dw.month)
        $year.add($month).off(this.events.change_ym).on(this.events.change_ym, function() {
            if (tools.hasTime()) {
                var $day = $days.find('.slt')
                var date = tools.changeDateTime($year.val(), $month.val(), $day.data('day'), dw.hour, dw.minute, dw.second)
                
                that.create(tools.getDateWrap(date), minDate, maxDate)
            } else {
                var $day = $days.find('.slt')
                var date = tools.changeDate($year.val(), $month.val(), $day.data('day'))
                
                that.create(tools.getDateWrap(date), minDate, maxDate)
            }
        })
        $prev.off(this.events.click_prev).on(this.events.click_prev, function() {
            that.tools.changeMonth(-1)
        })
        $next.off(this.events.click_prev).on(this.events.click_prev, function() {
            that.tools.changeMonth(1)
        })
        $clearBtn.off(this.events.click_clear).on(this.events.click_clear, function() {
            that.$element.val('')
            tools.closeCalendar(true)
        })
        $okBtn.off(this.events.click_ok).on(this.events.click_ok, function() {
            var $dd = $days.find('dd.slt')
            
            if ($dd.hasClass('disabled')) return false
            
            var date = tools.changeDay($dd.data('day'), $dd.data('month'))
            
            if (tools.hasTime()) {
                date.setHours(parseInt($hh.val()))
                date.setMinutes(parseInt($mm.val()))
                date.setSeconds(parseInt($ss.val()))
            }
            tools.closeCalendar(true)
            that.$element.val(tools.formatDate(date)).focus()
            
            //changedEvent
            tools.afterChange(date)
        })
        $close.off(this.events.click_close).on(this.events.click_close, function() {
            tools.closeCalendar(true)
        })
        $(document).on(this.events.click_close, function(e) {
            var $target = $(e.target)
            if (e.target == that.$element.get(0)) return
            if ($target.closest('#calendar').length) return
            if ($target.data('toggle') == 'datepicker') 
                tools.closeCalendar(false)
            else
                tools.closeCalendar(true)
        })
        this.create(dw, minDate, maxDate)
    }
    
    Datepicker.prototype.create = function(dw, minDate, maxDate) {
        var that       = this
        var options    = this.options
        var tools      = this.tools
        var monthStart = new Date(dw.year, dw.month - 1, 1)
        var startDay   = monthStart.getDay()
        var dayStr     = ''
        
        if (startDay > 0) {
            monthStart.setMonth(monthStart.getMonth() - 1)
            var prevDateWrap = tools.getDateWrap(monthStart)
            
            for (var t = prevDateWrap.days - startDay + 1; t <= prevDateWrap.days; t++) {
                var _date     = new Date(dw.year, dw.month - 2, t)
                var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : ' disabled'
                
                dayStr += '<dd class="other'+ _ctrClass +'" data-month="-1" data-day="'+ t +'">'+ t +'</dd>'
            }
        }
        for (var t = 1; t <= dw.days; t++) {
            var _date     = new Date(dw.year, dw.month - 1, t)
            var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : 'disabled'
            
            if (t == dw.day)
                _ctrClass += ' slt'
            dayStr += '<dd class="'+ _ctrClass +'" data-day="'+ t +'">'+ t +'</dd>'
        }
        for (var t = 1; t <= 42 - startDay - dw.days; t++) {
            var _date     = new Date(dw.year, dw.month, t)
            var _ctrClass = (_date >= minDate && _date <= maxDate) ? '' : ' disabled'
            
            dayStr += '<dd class="other'+ _ctrClass +'" data-month="1" data-day="'+ t +'">'+ t +'</dd>'
        }
        
        var $alldays = $days.html(dayStr).find('dd')
        
        $alldays.not('.disabled').off(this.events.click_days).on(this.events.click_days, function() {
            var $day = $(this)
            
            if (!tools.hasTime()) {
                var date = tools.changeDay($day.data('day'), $day.data('month'))
                
                tools.closeCalendar(true)
                that.$element.val(tools.formatDate(date)).focus()
                
                //changedEvent
                tools.afterChange(date)
            } else {
                $alldays.removeClass('slt')
                $day.addClass('slt')
            }
        })
        
        if (!tools.hasDate()) {
            $main.addClass('nodate') // only time
        } else {
            $main.removeClass('nodate')
        }
        if (tools.hasTime()) {
            $time.show()
            $hh.val(dw.hour < 10 ? ('0'+ dw.hour) : dw.hour).off(this.events.focus_time).on(this.events.focus_time, function() {
                tools.changeTmMenu('hh')
            })
            
            var iMinute = parseInt(dw.minute / options.mmStep) * options.mmStep
            
            $mm.val(iMinute < 10 ? ('0'+ iMinute) : iMinute).data('step', options.mmStep).off(this.events.focus_time).on(this.events.focus_time, function() {
                tools.changeTmMenu('mm')
            })
            $ss.val(tools.hasSecond() ? (dw.second < 10 ? ('0'+ dw.second) : dw.second) : '00').data('step', options.ssStep).off(this.events.focus_time).on(this.events.focus_time, function() {
                tools.changeTmMenu('ss')
            })
            $box.off('click').on('click', function(e) {
                if ($(e.target).closest('.time').length) return
                $tm.find('> ul').hide()
                tools.changeTmMenu()
            })
            $timeinps.off(this.events.keydown_time).on(this.events.keydown_time, tools.keydownInt).each(function() {
                var $input = $(this)
                
                $input.off(that.events.keyup_time).on(that.events.keyup_time, function() {
                    tools.changeTm($input)
                })
            }).off(this.events.click_time).on(this.events.click_time, function() {
                tools.clickTmMenu($(this), $(this).data('type'))
            })
            
            var timer = null
            
            $spinner.off(this.events.click_spinner).on(this.events.click_spinner, function(e) {
                var $btn = $(this)
                
                $timeinps.filter('.slt').each(function() {
                    tools.changeTm($(this), $btn)
                })
                
                e.preventDefault()
            }).off(this.events.mousedown_sp).on(this.events.mousedown_sp, function(e) {
                var $btn = $(this)
                
                timer = setInterval(function() {
                    $timeinps.filter('.slt').each(function() {
                        tools.changeTm($(this), $btn)
                    })
                }, 150)
            }).off(this.events.mouseup_sp).on(this.events.mouseup_sp, function(e) {
                clearTimeout(timer)
            })
            
            if (!tools.hasHour())   $hh.attr('disabled', true)
            if (!tools.hasMinute()) $mm.attr('disabled', true)
            if (!tools.hasSecond()) $ss.attr('disabled', true)
        } else {
            $time.hide()
        }
        this.show()
    }
    
    Datepicker.prototype.show = function() {
        var offset = this.$element.offset()
        var iTop   = offset.top + this.$element.get(0).offsetHeight
        // fix top
        var iBoxH  = $box.outerHeight(true)
        
        if (iTop > iBoxH && iTop > $(window).height() - iBoxH)
            iTop = offset.top - iBoxH
        $box.css({
            left: offset.left,
            top: iTop
        }).show().click(function(e) {
            e.stopPropagation()
        })
    }
    
    // DATEPICKER PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Datepicker.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.datepicker')
            
            if (!data) $this.data('bjui.datepicker', (data = new Datepicker(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.datepicker
    
    $.fn.datepicker             = Plugin
    $.fn.datepicker.Constructor = Datepicker
    
    // DATEPICKER NO CONFLICT
    // =================
    
    $.fn.datepicker.noConflict = function () {
        $.fn.datepicker = old
        return this
    }
    
    // DATEPICKER DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('[data-toggle="datepicker"]')
        
        if (!$this.length) return
        if ($this.data('nobtn')) return
        
        Plugin.call($this, 'addBtn')
    })
    
    $(document).on('click.bjui.lookup.data-api', '[data-toggle="datepickerbtn"]', function(e) {
        var $date = $(this).prev('[data-toggle="datepicker"]')
        
        if (!$date || !$date.is(':text')) return
        Plugin.call($date, $date.data())
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.datepicker.data-api', '[data-toggle="datepicker"]', function(e) {
        var $this = $(this)
        
        if ($this.data('onlybtn')) return
        if (!$this.is(':text')) return
        Plugin.call($this, $this.data())
        
        e.preventDefault()
    })

}(jQuery);

/* ========================================================================
 * B-JUI: bjui-ajaxtab.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-ajaxtab.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // AJAXTAB CLASS DEFINITION
    // ======================
    
    var Ajaxtab = function(element, options) {
        this.$element = $(element)
        this.options  = options
    }
    
    Ajaxtab.DEFAULTS = {
        url    : undefined,
        target : undefined,
        reload : false
    }
    
    Ajaxtab.prototype.init = function() {
        var options = this.options
        
        if (!(options.url)) {
            BJUI.debug('Ajaxtab Plugin: Error trying to open a tab, url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh(this.$element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                this.$element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('Ajaxtab Plugin: The new ajaxtab\'s url is incorrect, url: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        if (!options.target) {
            BJUI.debug('Ajaxtab Plugin: Attribute \'target\' is not defined!')
            return
        }
        if (options.reload) {
            this.load()
        } else {
            var reload = this.$element.data('bjui.ajaxtab.reload')
            
            if (!reload) this.load()
            else this.$element.tab('show')
        }
    }
    
    Ajaxtab.prototype.load = function() {
        var $element = this.$element
        var options  = this.options
        
        $(options.target).ajaxUrl({
            url      : options.url,
            data     : {},
            callback : function() {
                $element.data('bjui.ajaxtab.reload', true).tab('show')
            }
        })
    }
    
    // AJAXTAB PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Ajaxtab.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.ajaxtab')
            
            if (!data) $this.data('bjui.ajaxtab', (data = new Ajaxtab(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.ajaxtab

    $.fn.ajaxtab             = Plugin
    $.fn.ajaxtab.Constructor = Ajaxtab
    
    // AJAXTAB NO CONFLICT
    // =================
    
    $.fn.ajaxtab.noConflict = function () {
        $.fn.ajaxtab = old
        return this
    }
    
    // AJAXTAB DATA-API
    // ==============

    $(document).on('click.bjui.ajaxtab.data-api', '[data-toggle="ajaxtab"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        Plugin.call($this, options)
        
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-tablefixed.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.stable.js (author:ZhangHuihua@msn.com, Roger Wu)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-tablefixed.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // TABLEFIXED CLASS DEFINITION
    // ======================
    
    var Tablefixed = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Tablefixed.SCROLLW  = 18
    
    Tablefixed.DEFAULTS = {
        width: '100%'
    }
    
    Tablefixed.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getLeft: function($obj) {
                var width = 0
                
                $obj.prevAll().each(function() {
                    width += $(this).outerWidth()
                })
                
                return width
            },
            getRight: function($obj) {
                var width = 0
                
                $obj.prevAll().andSelf().each(function() {
                    width += $(this).outerWidth()
                })
                
                return width - 1
            },
            getCellNum: function($obj) {
                return $obj.prevAll().andSelf().size()
            },
            getColspan: function($obj) {
                return $obj.attr('colspan') || 1
            },
            getStart: function($obj) {
                var start = 1
                
                $obj.prevAll().each(function() {
                    start += parseInt($(this).attr('colspan') || 1)
                })
                
                return start
            },
            getPageCoord: function(element) {
                var coord = {x: 0, y: 0}
                
                while (element) {
                    coord.x += element.offsetLeft
                    coord.y += element.offsetTop
                    element = element.offsetParent
                }
                
                return coord
            },
            getOffset: function($obj, e) {
                if (!$.support.leadingWhitespace) {
                    var $objset = $obj.offset()
                    var evtset = {
                        offsetX: e.pageX || e.screenX,
                        offsetY: e.pageY || e.screenY
                    }
                    var offset = {
                        offsetX: evtset.offsetX - $objset.left,
                        offsetY: evtset.offsetY - $objset.top
                    }
                    
                    return offset
                }
                
                var target = e.target
                
                if (target.offsetLeft == undefined){
                    target = target.parentNode
                }
                
                var pageCoord  = this.getPageCoord(target)
                var eventCoord = {
                    x: window.pageXOffset + e.clientX,
                    y: window.pageYOffset + e.clientY
                }
                var offset = {
                    offsetX: eventCoord.x - pageCoord.x,
                    offsetY: eventCoord.y - pageCoord.y
                }
                
                return offset
            }
        }
        
        return tools
    }
    
    Tablefixed.prototype.resetWidth = function() {
        var $fixed = this.$element,
            width  = $fixed.width(),
            $table = $fixed.find('table'),
            tableW = $table && $table.width(),
            $ths   = $table.eq(0) && $table.eq(0).find('tr:first-child > th'),
            $tds   = $table.eq(1) && $table.eq(1).find('tr:first-child > td')
        
        if ($table && ((width - tableW)  < Tablefixed.SCROLLW)) {
            var fixedW = parseInt((width - tableW) / $ths.length)
            
            $table.width(width - Tablefixed.SCROLLW)
            $ths.each(function(i) {
                var tw = parseInt($(this).css('width'))
                
                $(this).width(tw + fixedW)
                if ($tds.eq(i)) $tds.eq(i).width(tw + fixedW)
            })
        }
    }
    
    Tablefixed.prototype.init = function() {
        if (!this.$element.isTag('table')) return
        
        this.$container = this.$element.parent().addClass('bjui-resizeGrid')
        this.$fixed     = undefined
        var width       = this.$container.innerWidth()
        var height      = this.options.height
        
        if (typeof this.options.width == 'string' && this.options.width.indexOf('%')) {
            this.options.newWidth = width * (this.options.width.replace('%', '') / 100)
        } else {
            this.options.newWidth = parseInt(this.options.width)
        }
        
        this.options.styles = []
        this.$element.wrap('<div class="bjui-tablefixed"></div>')
        this.$fixed = this.$element.parent()
        this.initHead()
        this.initBody()
        this.resizeCol()
        this.resizeGrid()
        
        if (height) this.$fixed.height(height).addClass('fixedH')
    }
    
    Tablefixed.prototype.initHead = function() {
        var styles  = this.options.styles = []
        var $hTrs   = this.$element.find('thead > tr')
        var $fThs   = $hTrs.eq(0).find('> th')
        var $table  = this.$element
        var fixedW  = 0
        var hTh     = []
        var cols    = []
        var jj      = -1
        
        $fThs.each(function(i) {
            var $th     = $(this),
                colspan = parseInt($th.attr('colspan') || 1),
                width   = $th.attr('width'),
                align   = $th.attr('align'),
                w       = ''
            for (var k = 0; k < colspan; k++) {
                if (colspan == 1 && width) w = ' width="'+ width +'"'
                if (align) $th.removeAttr('align').addClass(align)
                hTh.push('<th'+ w +'></th>')
            }
            $th.attr('colsNum', jj += colspan)
            cols[i] = colspan
        })
        
        var thLen = hTh.length,
            $hTh  = $('<tr class="resize-head">'+ hTh.join('') +'</tr>')
        
        if ($hTrs.length > 1) {
            jj = 0
            var $ths2 = $hTrs.eq(1).find('> th')
            $.each(cols, function(i, n) {
                n = parseInt(n)
                if (n > 1) {
                    var colsNum = parseInt($fThs.eq(i).attr('colsnum'))
                    for (var k = n - 1; k >= 0; k--) {
                        var $th  = $ths2.eq(jj++), myNum = colsNum - k, width = $th.attr('width'), align = $th.attr('align')
                        var $_th = $hTh.find('> th').eq(myNum)
                        
                        if ($th && $th.length) $th.attr('colsnum', myNum)
                        if (width)  $_th.attr('width', width)
                        if (align)  $th.addClass(align).removeAttr('align')
                    }
                }
            })
        }
        
        this.$fixed.html(this.$element.html())
        var $thead  = this.$fixed.find('thead')
        
        $thead.prepend($hTh)
        $hTh.find('> th').each(function(i) {
            var $th   = $(this)
            var style = [], width = $th.innerWidth()
            
            style[0]  = parseInt(width)
            fixedW   += style[0]
            styles[styles.length] = style
        })
        
        fixedW = parseInt((this.options.newWidth - Tablefixed.SCROLLW - fixedW) / thLen)
        var $ths = $thead.find('> tr:eq(0) > th')
        
        this.options.$ths = $ths
        $ths.each(function(i) {
            var $th = $(this), style = styles[i], w = $th.attr('width')
            
            $th
                .removeAttr('align')
                .width(style[0] + fixedW)
            
            style[0] = (style[0] + fixedW)
            if (w) {
                style[0] = parseInt(w)
                $th.width(w).removeAttr('width')
            }
        })
        
        $thead.find('> tr:gt(0) > th').each(function() {
            var $th = $(this)
            
            $th.html('<div class="fixedtableCol">'+ $th.html() +'</div>')
        })
        
        $thead.wrap('<div class="fixedtableHeader" style="width:'+ (this.options.newWidth - Tablefixed.SCROLLW) + 'px;overflow:hidden;"><div class="fixedtableThead"><table class="table table-bordered" style="width:'+ (this.options.newWidth - Tablefixed.SCROLLW) + 'px; max-width:'+ (this.options.newWidth - Tablefixed.SCROLLW) +'px;"></table></div></div>')
        this.$fixed.append('<div class="resizeMarker" style="display:none; height:300px; left:57px;"></div><div class="resizeProxy" style="left:377px; display:none; height:300px;"></div>')
    }
    
    Tablefixed.prototype.initBody = function() {
        var $tbody    = this.$fixed.find('> tbody')
        var layoutStr = ' data-layout-h="'+ (this.options.layoutH || 0) +'"'
        var $tds      = $tbody.find('> tr:first-child > td')
        var styles    = this.options.styles
        
        if (this.options.height) layoutStr = 'style="height:'+ (this.options.height - this.$fixed.find('.fixedtableHeader').height()) +'px; overflow-y:auto;"'
        
        $tds.each(function(i) {
            if (i < styles.length) $(this).width(styles[i][0])
        })
        
        this.options.$tds = $tds
        $tbody.wrap('<div class="fixedtableScroller"'+ layoutStr +' style="width:'+ (this.options.newWidth) +'px;"><div class="fixedtableTbody"><table style="width:'+ (this.options.newWidth - Tablefixed.SCROLLW) +'px; max-width:'+ (this.options.newWidth - Tablefixed.SCROLLW) +'px;"></table></div></div>')
        
        if (!this.$element.attr('class')) $tbody.parent().addClass('table table-striped table-bordered table-hover')
        else $tbody.parent().addClass(this.$element.attr('class'))
        
        if (this.options.nowrap) {
            $tbody.find('> tr > td').each(function(i) {
                var $td = $(this)
                
                $td
                    .html('<div class="fixedtableCol">'+ $td.html() +'</div>')
                    .attr('title', $td.text())
            })
        }
        
        $tbody.closest('.fixedtableScroller').scroll(function(e) {
            var $scroller  = $(this)
            var scrollLeft = $scroller.scrollLeft()
            var $header    = $scroller.prev().find('> .fixedtableThead')
            
            $header.css({ 'position':'relative', 'left':-scrollLeft })
            
            return false
        })
    }
    
    Tablefixed.prototype.resizeCol = function() {
        var that   = this
        var $fixed = this.$fixed
        var $ths   = this.options.$ths
        var $tds   = this.options.$tds
        var tools  = this.tools
        
        $fixed.find('thead > tr:gt(0) > th').each(function(i) {
            var $th = $(this)
            
            $th.mouseover(function(e) {
                var ofLeft    = parseInt($fixed.find('.fixedtableThead').css('left')) || 0
                var offset    = tools.getOffset($th, e).offsetX
                var $resizeTh = $ths.eq($th.attr('colsnum'))
                
                if ($th.outerWidth() - offset < 5) {
                    $th.css('cursor', 'col-resize').off('mousedown.bjui.tablefixed.resize').on('mousedown.bjui.tablefixed.resize', function(event) {
                        $fixed.find('> .resizeProxy')
                            .show()
                            .css({
                                left:   tools.getRight($resizeTh) + ofLeft + $fixed.position().left,
                                top:    $fixed.position().top,
                                height: $fixed.height(),
                                cursor: 'col-resize'
                            })
                            .basedrag({
                                scop:  true, cellMinW:20, relObj:$fixed.find('.resizeMarker'),
                                move:  'horizontal',
                                event: event,
                                stop:  function() {
                                    var pleft   = $fixed.find('.resizeProxy').position().left
                                    var mleft   = $fixed.find('.resizeMarker').position().left
                                    var move    = pleft - mleft - $resizeTh.outerWidth() - 9
                                    var cellNum = tools.getCellNum($resizeTh)
                                    var oldW    = $resizeTh.width(), newW = $resizeTh.width() + move
                                    var $dcell  = $tds.eq(cellNum - 1)
                                    var tableW  = $fixed.find('> .fixedtableHeader .table').width()
                                    
                                    $resizeTh.width(newW)
                                    $dcell.width(newW)
                                    
                                    $fixed.find('.table').width(tableW + move)
                                    $fixed.find('.resizeMarker, .resizeProxy').hide()
                                    
                                    if ((tableW + move + Tablefixed.SCROLLW) < that.options.newWidth) {
                                        $fixed.find('.fixedtableScroller').width(tableW + move + Tablefixed.SCROLLW)
                                    } else {
                                        var newW = $fixed.closest('.bjui-resizeGrid').innerWidth()
                                        if ((tableW + move + Tablefixed.SCROLLW) < newW) newW = (tableW + move + Tablefixed.SCROLLW)
                                        
                                        $fixed.find('.fixedtableHeader').width(newW - Tablefixed.SCROLLW)
                                        $fixed.find('.fixedtableScroller').width(newW)
                                        $fixed.width(newW)
                                    }
                                    $fixed.data('resizeGrid', true)
                                }
                            })
                        
                        $fixed
                            .find('> .resizeMarker')
                            .show()
                            .css({
                                left:   tools.getLeft($resizeTh) + ofLeft + $fixed.position().left,
                                top:    $fixed.position().top,
                                height: $fixed.height()
                            })
                    })
                } else {
                    $th
                        .css('cursor', 'default')
                        .off('mousedown.bjui.tablefixed.resize')
                }
                
                return false
            })
        })
    }
    
    Tablefixed.prototype.setOrderBy = function(options) {
        var $th       = this.$element,
            $orderBox = $th.find('.fixedtableCol'),
            $order    = $(FRAG.orderby.replace('#asc#', BJUI.regional.orderby.asc).replace('#desc#', BJUI.regional.orderby.desc))
            
        options   = options || this.options
        
        $th.addClass('orderby')
        if (options.orderDirection) $th.addClass(options.orderDirection)
        if (!$orderBox.length) {
            $orderBox = $('<div class="fixedtableCol">'+ $th.html() +'</div>')
                .appendTo($th.empty())
        }
        
        $order
            .data('orderField', options.orderField)
            .appendTo($orderBox)
            .pagination('orderBy')
    }
    
    Tablefixed.prototype.resizeGrid = function() {
        var that = this
        var _resizeGrid = function() {
            $('div.bjui-resizeGrid').each(function() {
                var $this = $(this), width  = $(this).innerWidth(), newWidth = that.options.newWidth
                var realWidth
                
                if (width) {
                    $this.find('.bjui-tablefixed').each(function() {
                        var $fixed = $(this)
                        
                        if (!$fixed.data('resizeGrid')) realWidth = width
                        else realWidth = newWidth
                        
                        $fixed.width(realWidth)
                        $fixed.find('.table').width(realWidth - Tablefixed.SCROLLW)
                        $fixed.find('.fixedtableHeader').width(realWidth - Tablefixed.SCROLLW)
                        $fixed.find('.fixedtableScroller').width(realWidth)
                    })
                }
            })
        }
        
        $(window).off(BJUI.eventType.resizeGrid).on(BJUI.eventType.resizeGrid, _resizeGrid)
    }
    
    
    // TABLEFIXED PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Tablefixed.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.tablefixed')
            
            if (!data) $this.data('bjui.tablefixed', (data = new Tablefixed(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.tablefixed

    $.fn.tablefixed             = Plugin
    $.fn.tablefixed.Constructor = Tablefixed
    
    // TABLEFIXED NO CONFLICT
    // =================
    
    $.fn.tablefixed.noConflict = function () {
        $.fn.tablefixed = old
        return this
    }
    
    // TABLEFIXED DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('table[data-toggle="tablefixed"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })
    
    /* orderby */
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $this = $(e.target).find('th[data-order-field]')
        
        if (!$this.length) return
        
        Plugin.call($this, 'setOrderBy')
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-tabledit.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.database.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-tabledit.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // TABLEDIT CLASS DEFINITION
    // ======================
    
    var Tabledit = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
        this.$tbody   = this.$element.find('> tbody')
        if (!this.$tbody.length) {
            this.$tbody = $('<tbody></tbody')
            this.$element.append(this.$tbody)
        }
        this.$numAdd =
        this.$btnAdd = null
    }
    
    Tabledit.DEFAULTS = {
        
    }
    
    Tabledit.EVENTS = {
        afterDelete: 'afterdelete.bjui.tabledit'
    }
    
    Tabledit.prototype.TOOLS = function() {
        var that = this
        var tools = {
            initSuffix: function($tbody) {
                var $trs = $tbody.find('> tr')
                
                $trs.each(function(i) {
                    var $tr = $(this)
                    
                    $tr.find(':input, :file, a, label, div').each(function() {
                        var $child = $(this),
                            name   = $child.attr('name'), 
                            val    = $child.val(),
                            fors   = $child.attr('for'),
                            id     = $child.attr('id'),
                            href   = $child.attr('href'),
                            group  = $child.attr('data-group'),
                            suffix = $child.attr('data-suffix')
                        
                        if (name) $child.attr('name', name.replaceSuffix(i))
                        if (fors) $child.attr('for', fors.replaceSuffix(i))
                        if (id)   $child.attr('id', id.replaceSuffix(i).replaceSuffix2(i))
                        if (href) $child.attr('href', href.replaceSuffix(i))
                        if (group)   $child.attr('data-group', group.replaceSuffix(i))
                        if (suffix)  $child.attr('data-suffix', suffix.replaceSuffix(i))
                        if (val && val.indexOf('#index#') >= 0) $child.val(val.replace('#index#', i + 1))
                        if ($child.hasClass('no')) {
                            var prefix = $child.data('prefix') ? $child.data('prefix') : ''
                            
                            $child.val(prefix + (i + 1))
                        }
                    })
                })
            },
            // Enter for Tab
            initEnter: function($tbody) {
                var $texts = $tbody.find(':text')
                
                $texts.each(function(i) {
                    $(this).bind('keydown', function (e) {
                        if (e.which == BJUI.keyCode.ENTER) {
                            var nexInd = i + 1
                            
                            if ($texts.eq(nexInd)) {
                                $texts.eq(nexInd).focus()
                            }
                        }
                    })
                })
                this.initInput($tbody)
            },
            initInput: function($tbody) {
                $tbody.find('> tr > td').each(function() {
                    var $span = $(this).find('.input-hold')
                    
                    if (!$span.length) {
                        $span = $('<span class="input-hold" style="display:block; padding:0 4px; height:0px; font-size:12px; visibility:hidden;"></span>')
                        $(this).append($span)
                    }
                    if (!$.support.leadingWhitespace) { // for ie8
                        $(this).on('propertychange', ':text', function(e) {
                            $span.text($(this).val())
                        })
                    } else {
                        $(this).on('input', ':text', function(e) {
                            $span.text($(this).val())
                        })
                    }
                })
            },
            initTbody: function() {
                var $table  = that.$element,
                    $tbody  = that.$tbody
                    
                $tbody.find('> tr').each(function() {
                    var $tr = $(this), $tds = $tr.find('> td'), $ths = $table.data('bjui.tabledit.tr').clone().find('> th')
                    
                    $tr.data('bjui.tabledit.oldTds', $tr.html())
                    
                    $ths.each(function(i) {
                        var $td = $tds.eq(i), val = $td.data('val'),
                            $th = $(this), $child = $th.children(), $pic = $th.find('.pic-box')
                        
                        if (typeof val == 'undefined') val = $td.html()
                        if (!$td.data('noedit')) {
                            if ($child.length) {
                                if ($child.is('input:checkbox') || $child.is('input:radio')) {
                                    $child.filter('[value="'+ val +'"]').attr('checked', 'checked')
                                } else if ($child.isTag('select')) {
                                    $child.find('option[value="'+ $td.data('val') +'"]').attr('selected', 'selected')
                                } else if ($pic.length) {
                                    if ($td.data('val')) $th.find('.pic-name').val($td.data('val'))
                                    $pic.html($td.html())
                                } else {
                                    $child.attr('value', val +'')
                                }
                                $td.html($th.html())
                            }
                        }
                    })
                    
                    $tr.on('dblclick', $.proxy(function(e) { _doEdit($tr) }, that)).initui()
                    that.tools.initSuffix($tbody)
                    _doRead($tr)
                })
                
                $tbody
                    .on('click.bjui.tabledit.readonly', '[data-toggle="doedit"]', function(e) {
                        _doEdit($(this).closest('tr'))
                    })
                    .on('click.bjui.tabledit.readonly', '[data-toggle="doreadonly"]', function(e) {
                        _doRead($(this).closest('tr'))
                    })
                
                that.tools.initEnter($tbody)
                
                function _doEdit($tr) {
                    $tr.removeClass('readonly').find('> td *').each(function() {
                        var $this = $(this), $td = $this.closest('td'), val = $td.data('val'), toggle = $this.attr('data-toggle-old')
                        
                        if (typeof val == 'undefined') val = $td.html()
                        if ($td.data('notread')) return true
                        if ($this.isTag('select')) {
                            $this.val($td.data('val')).prop('disabled', false).selectpicker('refresh')
                        }   
                        if ($this.is(':checkbox') || $this.is(':radio'))
                            $this.val($td.data('val')).prop('disabled', false).closest('.icheckbox_minimal-purple').removeClass('disabled')
                        if ($this.is(':radio'))
                            $this.prop('disabled', false).closest('.iradio_minimal-purple').removeClass('disabled')
                        if (toggle) {
                            if (toggle == 'doreadonly') return true
                            else
                                $this.removeAttr('data-toggle-old').attr('data-toggle', toggle)
                        }
                        if ($this.is(':text') || $this.is('textarea'))
                            $this.off('keydown.readonly')
                        
                        $this.find('.bjui-lookup, .bjui-spinner, .bjui-upload').show()
                    })
                    
                    $tr.find('[data-toggle="doedit"]')
                        .attr('data-toggle', 'doreadonly')
                        .text('完成')
                }
                function _doRead($tr) {
                    $tr.addClass('readonly').find('> td *').each(function() {
                        var $this = $(this), $td = $this.closest('td'), toggle = $this.attr('data-toggle')
                        
                        if ($td.data('notread')) return true
                        if ($this.isTag('select'))
                            $this.prop('disabled', true).selectpicker('refresh')
                        if ($this.is(':checkbox'))
                            $this.prop('disabled', true).closest('.icheckbox_minimal-purple').addClass('disabled')
                        if ($this.is(':radio'))
                            $this.prop('disabled', true).closest('.iradio_minimal-purple').addClass('disabled')
                        if (toggle) {
                            if (toggle == 'doedit' || toggle == 'doreadonly') return true
                            else
                                $this.removeAttr('data-toggle').attr('data-toggle-old', toggle)
                        }
                        if ($this.is(':text') || $this.is('textarea'))
                            $this.on('keydown.readonly', function(e) { e.preventDefault() })
                            
                        $this.find('.bjui-lookup, .bjui-spinner, .bjui-upload').hide()
                    })
                    
                    $tr.find('[data-toggle="doreadonly"]')
                        .attr('data-toggle', 'doedit')
                        .text('编辑')
                }
            },
            doAdd: function() {
                var tool   = this
                var $table = that.$element
                
                if (!that.$numAdd || !that.$btnAdd) return
                $table
                    .on('keydown.bjui.tabledit.add', 'thead .num-add', function(e) {
                        if (e.which == BJUI.keyCode.ENTER) {
                            that.$btnAdd.trigger('click.bjui.tabledit.add')
                            
                            e.preventDefault()
                        }
                    })
                    .on('click.bjui.tabledit.add', 'thead .row-add', function(e) {
                        var rowNum = 1
                        
                        if (!isNaN(that.$numAdd.val())) rowNum = parseInt(that.$numAdd.val())
                        that.add($table, rowNum)
                        
                        e.preventDefault()
                    })
            },
            doDel: function($tbody) {
                var tool     = this
                var delEvent = 'click.bjui.tabledit.del'
                
                $tbody.off(delEvent).on(delEvent, '.row-del', function(e) {
                    var $btnDel = $(this)
                    
                    if ($btnDel.data('confirmMsg')) {
                        $btnDel.alertmsg('confirm', $btnDel.data('confirmMsg'), {okCall: function() { tool.delData($btnDel) }})
                    } else {
                        tool.delData($btnDel)
                    }
                    
                    e.preventDefault()
                })
            },
            delData: function($btnDel) {
                var tool    = this
                var $tbody  = $btnDel.closest('tbody')
                var options = $btnDel.data()
                var _delRow = function(json) {
                    $btnDel.closest('tr').remove()
                    tool.initSuffix($tbody)
                    tool.afterDelete($tbody)
                    if (options.callback) (options.callback.toFunc()).apply(that, [json])
                }
                
                if ($btnDel.is('[href^=javascript:]') || $btnDel.is('[href^="#"]')) {
                    if ($btnDel.data('confirmMsg')) {
                        $btnDel.alertmsg('confirm', $btnDel.data('confirmMsg'), {okCall: function() {
                            _delRow()
                        }})
                    } else {
                        _delRow()
                    }
                } else {
                    $btnDel.bjuiajax('doAjax', {
                        url      : $btnDel.attr('href'),
                        data     : options.data,
                        callback : _delRow
                    })
                }
            },
            afterDelete: function($tbody) {
                var deletedEvent = $.Event(Tabledit.EVENTS.afterDelete, {relatedTarget: $tbody[0]})
                
                that.$element.trigger(deletedEvent)
                if (deletedEvent.isDefaultPrevented()) return
            }
        }
        
        return tools
    }
    
    Tabledit.prototype.init = function() {
        var that    = this
        var tools   = this.tools
        var $table  = this.$element.addClass('bjui-tabledit'), $tr = $table.find('> thead > tr:first'), $tbody = this.$tbody
        var trHtml  = $table.find('> thead > tr:first').html()
        
        $tr.find('> th').each(function() {
            var $th   = $(this)
            var title = $th.attr('title')
            var add   = $th.data('addtool')
            
            if (title) $th.html(title)
            if (add) {
                var $addBox   = $('<span style="position:relative;"></span>')
                
                $th.empty()
                that.$numAdd = $('<input type="text" value="1" class="form-control num-add" size="2" title="待添加的行数">')
                that.$btnAdd = $('<a href="javascript:;" class="row-add" title="添加行"><i class="fa fa-plus-square"></i></a>')
                $addBox.append(that.$numAdd).append(that.$btnAdd).appendTo($th)
            }
        })
        $table.data('bjui.tabledit.tr', $('<tr>'+ trHtml +'</tr>'))
        tools.initTbody()
        tools.doAdd()
        tools.doDel($tbody)
    }
    
    Tabledit.prototype.add = function($table, num) {
        var tools  = this.tools
        var $tbody = $table.find('> tbody')
        var $firstTr, $tr = $table.data('bjui.tabledit.tr')
        
        for (var i = 0; i < num; i++) {
            $tr.find('> th').each(function() { $(this).replaceWith('<td>'+ $(this).html() +'</td>') })
            
            var $addTr = $tr.clone()
            
            if (i == 0) $firstTr = $addTr
            $addTr.hide().appendTo($tbody)
            tools.initSuffix($tbody)
            tools.initEnter($tbody)
            $addTr.show().css('display', '').initui()
        }
        /*置入焦点*/
        if ($firstTr && $firstTr.length) {
            var $input = $firstTr.find(':text')
            
            $input.each(function() {
                var $txt = $(this)
                
                if (!$txt.prop('readonly')) {
                    $txt.focus()
                    return false
                }
            })
        }
    }
    
    // TABLEDIT PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Tabledit.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.tabledit')
            
            if (!data) $this.data('bjui.tabledit', (data = new Tabledit(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.tabledit

    $.fn.tabledit             = Plugin
    $.fn.tabledit.Constructor = Tabledit
    
    // TABLEDIT NO CONFLICT
    // =================
    
    $.fn.tabledit.noConflict = function () {
        $.fn.tabledit = old
        return this
    }
    
    // TABLEDIT DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('table[data-toggle="tabledit"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })
    
    // init add tr
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $this = $(e.target).find('table[data-toggle="tabledit"]')
        
        $this.each(function() {
            if ($(this).is('[data-initnum]')) {
                var initNum = $(this).data('initnum')
                
                if (initNum > 0) {
                    Plugin.call($(this), 'add', $(this), initNum)
                }
            }
        })
    })
    
    $(document).on('click.bjui.tabledit.data-api', '[data-toggle="tableditadd"]', function(e) {
        var $this = $(this)
        var num   = $this.data('num') || 1
        var table = $this.data('target')
        
        if (!table || !$(table).length) return
        if (!$(table).isTag('table')) return
        Plugin.call($this, 'add', $(table), num)
        
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-spinner.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-spinner.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // SPINNER CLASS DEFINITION
    // ======================
    var Spinner = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
        this.$spinner = null
        this.height   = this.$element.addClass('form-control').innerHeight()
        this.ivalue   = Number(this.$element.val()) || 0
    }
    
    Spinner.DEFAULTS = {
        min: 0,
        max: 100,
        step: 1,
        decimalPlace: 0
    }
    
    Spinner.EVENTS = {
        afterChange : 'afterchange.bjui.spinner'
    }
    
    Spinner.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            changeVal: function($btn) {
                var $input = that.$element
                var ivalue = Number($input.val()) || Number(that.ivalue)
                var type   = $btn.data('add') || -1
                var istart = that.options.min, iend = that.options.max, istep = that.options.step
                
                if (type == 1) {
                    if (ivalue <= iend - istep)
                        ivalue = ivalue + istep
                } else if (type == -1) {
                    if (ivalue >= (istart + istep))
                        ivalue = ivalue - istep
                } else if (ivalue > iend) {
                    ivalue = iend
                } else if (ivalue < istart) {
                    ivalue = istart
                }
                if (that.options.decimalPlace)
                    ivalue = new String(ivalue.toFixed(that.options.decimalPlace))
                
                that.ivalue = ivalue
                
                $input
                    .val(ivalue)
                    .trigger(Spinner.EVENTS.afterChange, {value:ivalue})
            }
        }
        
        return tools
    }
    
    Spinner.prototype.init = function() {
        var that     = this
        var $element = this.$element
        var options  = this.options
        
        if (isNaN(this.options.min) || isNaN(this.options.max) || isNaN(this.options.step)) {
            BJUI.debug('Spinner Plugin: Parameter is non-numeric type!')
            return
        }
        if (!this.$spinner)
            this.$spinner = $(FRAG.spinnerBtn)
            
        $element.css({'paddingRight':'13px'}).wrap('<span></span>')
        
        var $box = $element.parent()
        
        $box.css('position', 'relative')
        this.$spinner.css({'height':this.height}).appendTo($box)
        this.$spinner.on('selectstart', function() { return false })
        
        var timer = null
        
        this.$spinner.find('li').on('click', function(e) {
            that.tools.changeVal($(this))
        }).on('mousedown', function() {
            var $btn = $(this)
            
            timer = setInterval(function() {
                that.tools.changeVal($btn)
            }, 150)
        }).on('mouseup', function() { clearTimeout(timer) })
    }
    
    Spinner.prototype.destroy = function() {
        if (this.$spinner) {
            this.$element.upwrap()
            $spinner.remove()
        }
    }
    
    // SPINNER PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Spinner.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.spinner')
            
            if (!data) $this.data('bjui.spinner', (data = new Spinner(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.spinner
    
    $.fn.spinner             = Plugin
    $.fn.spinner.Constructor = Spinner
    
    // SPINNER NO CONFLICT
    // =================
    
    $.fn.spinner.noConflict = function () {
        $.fn.spinner = old
        return this
    }
    
    // SPINNER DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('input[data-toggle="spinner"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })

}(jQuery);

/* ========================================================================
 * B-JUI: bjui-lookup.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.database.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-lookup.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // LOOKUP GLOBAL ELEMENTS
    // ======================
    
    var group, suffix, $currentLookup
    
    // LOOKUP CLASS DEFINITION
    // ======================
    
    var Lookup = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.$lookBtn = null
    }
    
    Lookup.DEFAULTS = {
        url       : null,
        id        : null,
        mask      : true,
        width     : 600,
        height    : 400,
        title     : 'Lookup',
        maxable   : true,
        resizable : true
    }
    
    Lookup.EVENTS = {
        afterChange : 'afterchange.bjui.lookup'
    }
    
    Lookup.prototype.init = function() {
        var that = this, options = this.options, tools = this.tools
        
        if (!options.url) {
            BJUI.debug('Lookup Plugin: Error trying open a lookup dialog, url is undefined!')
            return false
        } else {
            options.url = decodeURI(options.url).replacePlh(that.$element.closest('.unitBox'))
            if (!options.url.isFinishedTm()) {
                that.$element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('Lookup Plugin: The lookup\'s url is incorrect, url:'+ options.url)
                return false
            }
            options.url = encodeURI(options.url)
        }
        
        group          = this.options.group  || null
        suffix         = this.options.suffix || null
        $currentLookup = this.$element
        
        if (suffix) suffix = suffix.trim()
        
        this.open(that.$element)
    }
    
    Lookup.prototype.addBtn = function() {
        var that     = this, $element = that.$element
        
        if (!this.$lookBtn) {
            this.$lookBtn = $(FRAG.lookupBtn)
            this.$element.css({'paddingRight':'15px'}).wrap('<span></span>')
            
            var $box   = this.$element.parent()
            var height = this.$element.addClass('form-control').innerHeight()
            
            $box.css({'position':'relative', 'display':'inline-block'})
            
            $.each(that.options, function(key, val) {
                if (key != 'toggle') that.$lookBtn.attr('data-'+ key, val)
            })
            this.$lookBtn.css({'height':height, 'lineHeight':height +'px'}).appendTo($box)
            this.$lookBtn.on('selectstart', function() { return false })
        }
    }
    
    Lookup.prototype.open = function($obj) {
        var that = this, options = this.options
        
        $obj.dialog({id:options.id || 'lookup_dialog', url:options.url, title:options.title, width:options.width, height:options.height, mask:options.mask, maxable:options.maxable, resizable:options.resizable})
    }
    
    Lookup.prototype.getField = function(key) {
        return (group ? (group +'.') : '') + (key) + (suffix ? suffix : '')
    }
    
    Lookup.prototype.setSingle = function(args) {
        if (typeof args == 'string')
            args  = new Function('return '+ args)()
        this.setVal(args)
    }
    
    Lookup.prototype.setMult = function(id) {
        var args  = {}
        var $unitBox = this.$element.closest('.unitBox')
        
        $unitBox.find('[name="'+ id +'"]').filter(':checked').each(function() {
            var _args = new Function('return '+ $(this).val())()
            
            for (var key in _args) {
                var value = args[key] ? args[key] +',' : ''
                
                args[key] = value + _args[key]
            }
        })
        
        if ($.isEmptyObject(args)) {
            this.$element.alertmsg('error', this.$element.data('warn') || FRAG.alertSelectMsg)
            return
        }
        
        this.setVal(args)
    }
    
    Lookup.prototype.setVal = function(args) {
        var that = this
        var $box = $currentLookup.closest('.unitBox')
        
        $box.find(':input').each(function() {
            var $input = $(this), inputName = $input.attr('name')
            
            for (var key in args) {
                var name = that.getField(key)
                
                if (name == inputName) {
                    $input
                        .val(args[key])
                        .trigger(Lookup.EVENTS.afterChange, {value:args[key]})
                        
                    break
                }
            }
        })
        
        this.$element.dialog('closeCurrent')
    }
    
    // LOOKUP PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Lookup.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.lookup')
            
            if (!data) $this.data('bjui.lookup', (data = new Lookup(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.lookup

    $.fn.lookup             = Plugin
    $.fn.lookup.Constructor = Lookup
    
    // LOOKUP NO CONFLICT
    // =================
    
    $.fn.lookup.noConflict = function () {
        $.fn.lookup = old
        return this
    }
    
    // LOOKUP DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('[data-toggle="lookup"]')
        
        if (!$this.length) return
        
        Plugin.call($this, 'addBtn')
    })
    
    $(document).on('click.bjui.lookup.data-api', '[data-toggle="lookupbtn"]', function(e) {
        var $this = $(this)
        
        if ($this.attr('href') && !$this.data('url')) $this.data('url', $this.attr('href'))
        if (!$this.data('title')) $this.data('title', $this.text())
        
        Plugin.call($this, $this.data())
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.lookupback.data-api', '[data-toggle="lookupback"]', function(e) {
        var $this = $(this)
        var args  = $this.data('args')
        var mult  = $this.data('lookupid')
        
        if (args)
            Plugin.call($this, 'setSingle', args)
        else if (mult)
            Plugin.call($this, 'setMult', mult)
            
        e.preventDefault()
    })
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-tags.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-tags.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // TAGS CLASS DEFINITION
    // ======================
    var Tags = function(element, options) {
        this.$element = $(element).addClass('tag-input')
        this.options  = options
        this.tools    = this.TOOLS()
        this.$box     = $(this.$element.wrap('<div class="bjui-tags"></div>')).parent()
        this.timeout  = null
        this.$tagsArr = {}
        this.tags     = []
    }
    
    Tags.DEFAULTS = {
        width    : 300,
        url      : '',
        global   : false,
        type     : 'GET',
        tagname  : 'tag',     // Appended "<input type='hidden'>" name attribute
        max      : 0,         // The maximum allowable number of tags(0=unlimited)
        clear    : false,     // If not found, clear the input characters
        lightCls : 'tags-highlight'
    }
    
    Tags.EVENTS = {
        afterCreated : 'aftercreated.bjui.tags'
    }
    
    Tags.prototype.TOOLS = function() {
        var that  = this, options = this.options
        var tools = {
            keyDown: function(e) {
                if (e.which == 13) {
                    return false
                }
            },
            keyUp: function(e) {
                switch(e.which) {
                case BJUI.keyCode.BACKSPACE:
                    if ($.trim(that.$element.val()).length == 0) {
                        that.tools.removeMenu()
                        return false
                    }
                    break
                case BJUI.keyCode.ESC:
                    that.tools.removeMenu()
                    break
                case BJUI.keyCode.DOWN:
                    if (!that.$menu || !that.$menu.length) return
                    
                    var $highlight = that.$menu.find('> .'+ options.lightCls),
                        $first     = that.$menu.find('> li:first-child')
                    
                    if (!$highlight.length) {
                        $first.addClass(options.lightCls)
                    } else {
                        var $hight_next = $highlight.removeClass(options.lightCls).next()
                        
                        if ($hight_next.length) {
                            $hight_next.addClass(options.lightCls)
                        } else {
                            $first.addClass(options.lightCls)
                        }
                    }
                    return false
                    break
                case BJUI.keyCode.UP:
                    if (!that.$menu || !that.$menu.length) return
                    var $highlight = that.$menu.find('> .'+ options.lightCls),
                        $last      = that.$menu.find('> li:last-child')
                    
                    if (!$highlight.length) {
                        $last.addClass(options.lightCls)
                    } else {
                        var $hight_prev = $highlight.removeClass(options.lightCls).prev()
                        
                        if ($hight_prev.length) {
                            $hight_prev.addClass(options.lightCls)
                        } else {
                            $last.addClass(options.lightCls)
                        }
                    }
                    return false
                    break
                case BJUI.keyCode.ENTER:
                    if (options.max > 0 && that.$tagsArr.length >= options.max) return false
                    
                    var label = false, value = false, item = null
                    var $selectedItem = that.$menu && that.$menu.find('> .'+ options.lightCls)
                    
                    if ($selectedItem && $selectedItem.length) {
                        label = $selectedItem.text()
                        item  = $selectedItem.data('item')
                        value = item.value
                    } else {
                        label = $.trim(that.$element.val())
                        
                        if (!label.length) return false
                        if (options.clear) {
                            if ($.inArray(label, that.tags) == -1) {
                                that.$element.val('')
                                return false
                            }
                        }
                        value = label
                    }
                    if (!label) return
                    
                    /* Check the repeatability */
                    var isRepeat = false
                    
                    that.$tagsArr.length && that.$tagsArr.each(function() {
                        if ($(this).val() == value) {
                            isRepeat = true
                            return
                        }
                    })
                    
                    if (isRepeat) {
                        that.$element.val('')
                        return false
                    }
                    
                    that.tools.createTag(label, value)
                    that.tools.removeMenu()
                    that.$element.val('')
                    
                    //events
                    $.proxy(that.tools.onAfterCreated(item, value), that)
                    
                    return false
                    break
                }
            },
            query: function() {
                if (that.timeout) clearTimeout(that.timeout)
                
                that.timeout = setTimeout(that.tools.doQuery, 300)
            },
            doQuery: function() {
                if (options.max > 0 && that.$tagsArr.length >= options.max) return
                
                var term = that.$element.val(), $menu = that.$box.find('> .tags-menu'), tags = [], $item = null
                var $parentBox = that.$element.closest('.navtab-panel').length ? $.CurrentNavtab : $.CurrentDialog
                
                if (that.$element.closest('.bjui-layout').length) $parentBox = that.$element.closest('.bjui-layout')
                if (term.length == 0) return
                
                that.$element.one('ajaxStart', function() {
                    $parentBox.trigger('bjui.ajaxStart')
                }).one('ajaxStop', function() {
                    $parentBox.trigger('bjui.ajaxStop')
                })
                
                $.ajax({
                    url      : options.url,
                    global   : options.global,
                    type     : options.type,
                    data     : {term: term},
                    dataType : 'json',
                    success  : function(json) {
                        if (json.length != 0) {
                            if (!$menu.length) $menu = $('<ul class="tags-menu"></ul>')
                            
                            $menu.empty().hide().appendTo(that.$box)
                            
                            for (var i = 0; i < json.length; i++) {
                                $item = $('<li class="tags-item">'+ json[i].label + '</li>').data('item', json[i])
                                $item.appendTo($menu)
                                tags.push(json[i].label)
                            }

                            that.tags = tags
                            
                            $menu
                                .css({'top':that.$element.position().top + (that.$element.outerHeight()), 'left':that.$element.position().left})
                                .fadeIn()
                                .find('> li')
                                    .hover(function() {
                                        $(this).addClass(options.lightCls).siblings().removeClass(options.lightCls)
                                    }, function() {
                                        $(this).removeClass(options.lightCls)
                                    })
                                    .click(function() {
                                        var label    = $(this).text()
                                        var item     = $(this).data('item')
                                        var value    = item.value
                                        var isRepeat = false
                                        
                                        that.$box.find('input:hidden').each(function() {
                                            if ($(this).val() == value) {
                                                isRepeat = true
                                                return
                                            }
                                        })
                                        
                                        if (isRepeat) {
                                            that.$element.val('')
                                            $menu.remove()
                                            return
                                        }
                                        
                                        $.proxy(that.tools.createTag(label, value), that)
                                        
                                        $menu.remove()
                                        that.$element.val('')
                                        
                                        //events
                                        $.proxy(that.tools.onAfterCreated(item, value), that)
                                    })
                            
                            that.$menu = $menu
                        }
                    }
                })
            },
            createTag: function(label, value) {
                var $btn = $('<span class="label label-tag" data-value="' + value +'" style="margin-left: 1px; margin-top: 1px;"><i class="fa fa-tag"></i> ' + label + '&nbsp;&nbsp;<a href="#" class="close">&times;</a></span>')
                
                $btn
                    .insertBefore(that.$element)
                    .find('a.close')
                    .click(function() {
                        var value = $btn.data('value')
                        
                        that.$box.find('input:hidden').each(function() {
                            if ($(this).val() == value) {
                                $(this).remove()
                            }
                        })
                        
                        $btn.remove()
                        that.$tagsArr = that.$box.find('input[name="'+ that.options.tagname +'"]')
                    })
                
                var $hidden = $('<input type="hidden" name="'+ that.options.tagname +'">').val(value)
                
                $hidden.appendTo(that.$box)
                that.$tagsArr = that.$box.find('input[name="'+ that.options.tagname +'"]')
            },
            removeMenu: function() {
                if (that.$menu) that.$menu.remove()
            },
            onAfterCreated: function(item, value) {
                var alltags = []
                
                that.$tagsArr.length && that.$tagsArr.each(function() {
                    alltags.push($(this).val())
                })
                
                that.$element.trigger(Tags.EVENTS.afterCreated, {item:item, value:value, tags:alltags.join(',')})
            }
        }
        
        return tools
    }
    
    Tags.prototype.init = function() {
        var that     = this
        var $element = this.$element
        var options  = this.options
        
        if (!(options.url)) {
            BJUI.debug('Tags Plugin: Do query tags, url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('Tags Plugin: The query tags url is incorrect, url: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        if (isNaN(this.options.max)) {
            BJUI.debug('Tags Plugin: Parameter \'max\' is non-numeric type!')
            return
        }
        
        that.$box
            .width(options.width)
            .on('click', function() {
                $element.focus()
            })
        
        $element
            //.on('blur', $.proxy(this.tools.removeMenu, this))
            .on('keydown', $.proxy(this.tools.keyDown, this))
            .on('keyup', $.proxy(this.tools.keyUp, this))
        
        if (!$.support.leadingWhitespace) { // for ie8
            $element.on('propertychange', $.proxy(this.tools.query, this))
        } else {
            $element.on('input', $.proxy(this.tools.query, this))
        }
        
        $(document).on('click.bjui.tags', $.proxy(function(e) {
            if (!$(e.target).closest(this.$box).length) this.tools.removeMenu()
        }, this))
    }
    
    Tags.prototype.destroy = function() {
        if (this.$tags) {
            this.$element.upwrap()
            $tags.remove()
        }
    }
    
    // TAGS PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Tags.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.tags')
            
            if (!data) $this.data('bjui.tags', (data = new Tags(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.tags
    
    $.fn.tags             = Plugin
    $.fn.tags.Constructor = Tags
    
    // TAGS NO CONFLICT
    // =================
    
    $.fn.tags.noConflict = function () {
        $.fn.tags = old
        return this
    }
    
    // TAGS DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('input[data-toggle="tags"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })

}(jQuery);

/* ========================================================================
 * B-JUI: bjui-upload.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from Huploadify 2.0 (author:吕大豹)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-upload.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // UPLOAD CLASS DEFINITION
    // ======================
    var Upload = function(element, options) {
        this.$element      = $(element)
        this.options       = options
        this.tools         = this.TOOLS()
    }
    
    Upload.DEFAULTS = {
        fileTypeExts        : '*.jpg;*.png',     //允许上传的文件类型，格式'*.jpg;*.doc'
        uploader            : '',     //文件提交的地址
        auto                : false,  //是否开启自动上传
        method              : 'POST', //发送请求的方式，get或post
        multi               : false,  //是否允许选择多个文件
        formData            : {},     //发送给服务端的参数，格式：{key1:value1,key2:value2}
        fileObjName         : 'file', //在后端接受文件的参数名称，如PHP中的$_FILES['file']
        fileSizeLimit       : 204800, //允许上传的文件大小，单位KB
        previewImg          : true,   //是否预览上传图片
        previewLoadimg      : null,   //预览图片前的载入图标
        dragDrop            : false,  //是否允许拖动上传
        showUploadedPercent : true,   //是否实时显示上传的百分比，如20%
        showUploadedSize    : true,   //是否实时显示已上传的文件大小，如1M/2M
        buttonText          : '选择上传文件',     //上传按钮上的文字
        removeTimeout       : 1e3,              //上传完成后进度条的消失时间
        itemTemplate        : FRAG.uploadTemp,  //上传队列显示的模板
        breakPoints         : false,            //是否开启断点续传
        fileSplitSize       : 1024 * 1024,      //断点续传的文件块大小，单位Byte，默认1M
        onUploadStart       : null,  //上传开始时的动作
        onUploadSuccess     : null,  //上传成功的动作
        onUploadComplete    : null,  //上传完成的动作
        onUploadError       : null,  //上传失败的动作
        onInit              : null,  //初始化时的动作
        onCancel            : null,  //删除掉某个文件后的回调函数，可传入参数file
        onSelect            : null
    }
    
    Upload.MIMETYPES = {
        zip  :[ 'application/x-zip-compressed' ],
        jpg  :[ 'image/jpeg' ],
        png  :[ 'image/png' ],
        gif  :[ 'image/gif' ],
        doc  :[ 'application/msword' ],
        xls  :[ 'application/msexcel' ],
        docx :[ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ],
        xlsx :[ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ],
        ppt  :[ 'application/vnd.ms-powerpoint' ],
        pptx :[ 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ],
        mp3  :[ 'audio/mp3' ],
        mp4  :[ 'video/mp4' ],
        pdf  :[ 'application/pdf' ]
    }
    
    Upload.prototype.TOOLS = function() {
        var that  = this, options = this.options
        var tools = {
            //将文件的单位由bytes转换为KB或MB，若第二个参数指定为true，则永远转换为KB
            formatFileSize: function(size, byKB) {
                if (size > 1024 * 1024 && !byKB)
                    size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB'
                else
                    size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB'
                
                return size
            },
            //根据文件序号获取文件
            getFile: function(index, files) {
                for (var i = 0; i < files.length; i++) {
                    if (files[i].index == index) return files[i]
                }
                return false
            },
            //将输入的文件类型字符串转化为数组,原格式为*.jpg;*.png
            getFileTypes: function(str) {
                var result = []
                var arr1   = str.split(';')
                
                for (var i = 0; i < arr1.length; i++) {
                    result.push(arr1[i].split('.').pop())
                }
                return result
            },
            //根据后缀名获得文件的mime类型
            getMimetype: function(name) {
                return Upload.MIMETYPES[name]
            },
            //根据配置的字符串，获得上传组件accept的值
            getAcceptString: function(str) {
                var types  = this.getFileTypes(str)
                var result = []
                
                for (var i = 0; i < types.length; i++) {
                    var mime = this.getMimetype(types[i])
                    
                    if (mime) result.push(mime)
                }
                return result.join(',')
            },
            //过滤上传文件
            filter: function(files) {
                var arr = []
                var typeArray = this.getFileTypes(options.fileTypeExts)
                
                if (typeArray.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        var thisFile = files[i]
                        
                        if (parseInt(this.formatFileSize(thisFile.size, true)) > options.fileSizeLimit) {
                            that.$element.alertmsg('error', '文件"'+ thisFile.name +'"大小超出限制！')
                            continue
                        }
                        if ($.inArray(thisFile.name.split('.').pop().toLowerCase(), typeArray) >= 0) {
                            arr.push(thisFile)
                        } else {
                            that.$element.alertmsg('error', '文件"'+ thisFile.name +'"类型不允许！')
                        }
                    }
                }
                return arr
            },
            //获取选择文件，file控件
            getFiles: function(e) {
                var files = e.target.files || e.dataTransfer.files // 获取文件列表对象
                
                files = this.filter(files)
                for (var i = 0; i < files.length; i++) {
                    files[i].id     = files[i].lastModifiedDate.getTime() +'_'+ files[i].size +'_'+ (files[i].type || '').replace(/\W/g, '')
                    this.renderQueueItem(files[i])
                    that.queueData.files++
                }
                
                return files
            },
            //生成上传队列Dom
            renderQueueItem: function(file) {
                var uploadedSize = 0
                var $temp = $(options.itemTemplate
                        .replace('{fileId}', file.id)
                        .replace('{fileName}', file.name)
                        .replace('#upConfirm#', BJUI.regional.upload.upConfirm)
                        .replace('#upPause#', BJUI.regional.upload.upPause)
                        .replace('#upCancel#', BJUI.regional.upload.upCancel)
                        .replace('{percent}', '0.00%')
                        .replace('{uploadedSize}', '0KB')
                        .replace('{fileSize}', this.formatFileSize(file.size)))
                
                //如果是自动上传，去掉上传按钮
                if (options.auto) {
                    $temp.find('> .info > .up_confirm').remove()
                }
                $temp.data('upfile', file)
                that.$uploadFileList.append($temp)
                //如果断点续传
                if (options.breakPoints) {
                    uploadedSize = this.getUploadedSize(file.id)
                    if (uploadedSize > file.size) uploadedSize = file.size
                }
                this.showProgress(file.id, uploadedSize, file.size)
                //判断是否预览图片
                if (options.previewImg && file.type.indexOf('image') != -1) {
                    var $prevbox = $temp.find('> .preview > .img')
                    
                    if (options.previewLoadimg) $prevbox.html('<img src="'+ options.previewLoadimg +'" height="114">')
                    this.previewImg(file, $prevbox)
                } else {
                    $temp.find('> .preview').remove()
                }
                //判断是否显示已上传文件大小
                if (options.showUploadedSize) {
                    var $fileSize = $temp.find('> .filesize')
                    
                    $fileSize.find('> .uploadedsize').html(this.formatFileSize(uploadedSize))
                    $fileSize.find('> .filesize').html(this.formatFileSize(file.size))
                } else {
                    $temp.find('> .filesize').remove()
                }
                //判断是否显示上传百分比
                if (options.showUploadedPercent) {
                    $temp.find('> .percent').html((uploadedSize / file.size * 100).toFixed(2) +'%')
                } else {
                    $temp.find('> .percent').remove()
                }
                options.onSelect && options.onSelect(files)
                //判断是否是自动上传
                if (options.auto) that.fileUpload(file, uploadedSize)
                
                $temp.on('click.bjui.upload.confirm', '.up_confirm', function(e) {
                    var $this = $(this), $queue = $this.closest('.item')
                    
                    $this.hide().next().show()
                    that.fileUpload($queue.data('upfile'), uploadedSize)
                })
                $temp.on('click.bjui.upload.cancel', '.up_cancel', this.removeQueueItem)
            },
            successQueueItem: function(file, xhr) {
                tools.showProgress(file.id, file.size, file.size)
                options.onUploadSuccess && options.onUploadSuccess.toFunc().call(that, file, xhr.responseText, that.$element)
                //在指定的间隔时间后删掉进度条
                setTimeout(function() {
                    that.$element.find('#'+ file.id).fadeOut('normal', function() {
                        $(this).remove()
                        var filelen = that.$element.find('> .queue > .item:visible').length
                        
                        if (filelen == 0) {
                            that.$element.find('> .queue').hide()
                            that.$file.val('')
                        }
                    })
                }, options.removeTimeout)
            },
            removeQueueItem: function(e, xhr) {
                if (xhr) xhr.abort()
                
                $(this).closest('.item').fadeOut('normal', function() {
                    $(this).remove()
                    
                    var filelen = that.$element.find('> .queue > .item:visible').length
                    if (filelen == 0) that.$element.find('> .queue').hide()
                })
                
                e.preventDefault()
            },
            //预览上传图片
            previewImg: function(file, $obj) {
                if (file && $obj.length) {
                    var reader = new FileReader()
                    
                    reader.onload = function(e) {
                        $obj.html('<img src="'+ e.target.result +'">')
                    }
                    reader.readAsDataURL(file)
                }
            },
            //上传进度条
            showProgress: function(fileId, uploadedSize, fileSize) {
                var initWidth     = uploadedSize / fileSize * 100 +'%',
                    initFileSize  = that.tools.formatFileSize(uploadedSize),
                    initUppercent = (uploadedSize / fileSize * 100).toFixed(2) +'%'
                that.$element.find('#'+ fileId +' > .progress > .bar').css('width', initWidth)
            },
            //断点续传：获取已上传的文件片断大小
            getUploadedSize: function(fileId) {
                return localStorage.getItem(fileId) * 1
            },
            //断点续传：保存已上传的文件片断大小
            saveUploadedSize:function(fileId, value) {
                localStorage.setItem(fileId, value)
            },
            //发送文件块函数
            sendBlob: function(url, xhr, file, formdata) {
                var fd = new FormData()
                
                xhr.open(options.method, url, true)
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
                //xhr.setRequestHeader('X_Requested_With', location.href.split('/')[5].replace(/[^a-z]+/g, '$'))
                fd.append(options.fileObjName, file)
                if (formdata) {
                    for (var key in formdata) {
                        fd.append(key, formdata[key])
                    }
                }
                xhr.send(fd)
            }
        }
        
        return tools
    }
    
    Upload.prototype.init = function() {
        var that     = this
        var $element = this.$element
        var options  = this.options
        
        if (!(options.uploader)) {
            BJUI.debug('Upload Plugin: The options uploader is undefined!')
            return
        } else {
            options.uploader = decodeURI(options.uploader).replacePlh($element.closest('.unitBox'))
            
            if (!options.uploader.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                BJUI.debug('Upload Plugin: The options uploader is incorrect: '+ options.uploader)
                return
            }
            
            options.uploader = encodeURI(options.uploader)
        }
        
        if ($element.hasClass('bjui-upload')) return
        
        var $uploadFrag = $(FRAG.uploadFrag
            .replaceAll('#multi#', options.multi ? 'multiple' : '')
            .replaceAll('#accept#', that.tools.getAcceptString(options.fileTypeExts))
            .replaceAll('#btnTxt#', (options.icon ? '<i class="fa fa-'+ options.icon +'">&nbsp;&nbsp;' : '') + options.buttonText))
        
        $element
            .addClass('bjui-upload')
            .append($uploadFrag)
        
        this.$file           = $element.find('> .bjui-upload-select-file')
        this.$uploadFileList = $element.find('> .queue')
        this.queueData       = { files:0, success:0, error:0 }
        
        //do select files
        $element
            .on('change.bjui.upload', '.bjui-upload-select-file', function(e) {
                that.fileSelect(e)
            })
            .on('click.bjui.upload', '.bjui-upload-select', function(e) {
                that.$file.trigger('click')
            })
        
        options.onInit && options.onInit()
        
        //如果允许拖动上传
        if (options.dragDrop) {
            /* 拖拽元素在目标元素头上移动的时候 */
            $element[0].ondragover = function(ev) {
                ev.preventDefault()
                return true
            }
            
            $element[0].ondrop = function(e) { 
                that.fileSelect(e)
                
                e.stopPropagation()
                e.preventDefault()
            }
        }
    }
    
    Upload.prototype.fileSelect = function(e) {
        this.$uploadFileList.show()
        this.tools.getFiles(e)
    }
    
    Upload.prototype.fileUpload = function(file, uploadedSize) {
        var that = this, $element = that.$element, options = that.options, tools = that.tools
        var xhr  = false, originalFile = file
        
        //校正进度条和上传比例的误差
        xhr = new XMLHttpRequest()
        
        if (options.breakPoints) {
            //对文件进行切割，并保留原来的信息
            file = originalFile.slice(uploadedSize, uploadedSize + options.fileSplitSize)
        }
        if (xhr.upload) {
            // 上传进度
            xhr.upload.onprogress = function(e) { that.onProgress(file, e.loaded, originalFile.size) }
            // 上传回调
            xhr.onreadystatechange = function(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var returnData = JSON.parse(xhr.responseText), upOver = false
                    if (options.breakPoints) {
                        //更新已上传文件大小，保存到本地
                        uploadedSize += options.fileSplitSize
                        tools.saveUploadedSize(originalFile.id, uploadedSize)
                        //继续上传其他片段
                        if (uploadedSize < originalFile.size) {
                            file = originalFile.slice(uploadedSize, uploadedSize + options.fileSplitSize)
                            //上传文件
                            tools.sendBlob(options.uploader, xhr, file, options.formData)
                        } else {
                            upOver = true
                        }
                    } else {
                        upOver = true
                    }
                    if (upOver) {
                        that.queueData.success++
                        tools.successQueueItem(originalFile, xhr)
                        options.onUploadComplete && options.onUploadComplete(originalFile, xhr.responseText)
                    }
                } else {
                    that.queueData.error++
                    //错误回调
                    options.onUploadError && options.onUploadError(originalFile, xhr.responseText)
                }
                //队列完成回调
                if (options.onQueueComplete) {
                    if (that.queueData.files = that.queueData.success + that.queueData.error)
                        option.onQueueComplete(that.queueData)
                }
            }
            options.onUploadStart && options.onUploadStart()
            
            //开始上传
            options.formData.fileName = originalFile.name
            options.formData.lastModifiedDate = originalFile.lastModifiedDate.getTime()
            tools.sendBlob(options.uploader, xhr, file, options.formData)
        }
        
        //暂停事件
        $element
            .find('#'+ originalFile.id +' > .info > .up_pause')
            .on('click.bjui.upload.pause', function(e) {
                xhr.abort()
                $(this).hide().prev().show()
            })
        
        //取消事件
        $element
            .find('#'+ originalFile.id +' > .info > .up_cancel')
            .off('click.bjui.upload.cancel')
            .on('click.bjui.upload.cancel', $.proxy(function(e) {
                this.tools.removeQueueItem(e, xhr)
            }, this))
    }
    
    Upload.prototype.onProgress = function(file, loaded, total) {
        var that        = this, options = that.options
        var $progress   = that.$element.find('#'+ file.id + ' .progress')
        var thisLoaded  = loaded
        //根据上一次触发progress时上传的大小，得到本次的增量
        var lastLoaded  = $progress.attr('lastLoaded') || 0
        
        loaded -= parseInt(lastLoaded)
        if (loaded > file.size) loaded = file.size
        
        that.$progressBar = $progress.children('.bar')
        var oldWidth      = options.breakPoints ? parseFloat(that.$progressBar.get(0).style.width || 0) : 0
        var percent       = (loaded / total * 100 + oldWidth).toFixed(2)
        var percentText   = percent > 100 ? '100%' : percent + '%'
        
        //校正四舍五入的计算误差
        if (options.showUploadedSize) {
            var $filesize = $progress.nextAll('.filesize')
            
            $filesize.find('> .uploadedsize').text(that.tools.formatFileSize(loaded))
        }
        if (options.showUploadedPercent) {
            $progress.nextAll('.up_percent').text(percentText)
        }
        that.$progressBar.css('width', percentText)
        //记录本次触发progress时已上传的大小，用来计算下次需增加的数量
        if (thisLoaded < options.fileSplitSize) {
            $progress.attr('lastLoaded', thisLoaded)
        } else {
            $progress.removeAttr('lastLoaded')
        }
    }
    
    Upload.prototype.destroy = function() {
        
    }
    
    // UPLOAD PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        if (window.FileReader) {
            return this.each(function () {
                var $this   = $(this)
                var options = $.extend({}, Upload.DEFAULTS, $this.data(), typeof option == 'object' && option)
                var data    = $this.data('bjui.upload')
            
                if (!data) $this.data('bjui.upload', (data = new Upload(this, options)))
                if (typeof property == 'string' && $.isFunction(data[property])) {
                    [].shift.apply(args)
                    if (!args) data[property]()
                    else data[property].apply(data, args)
                } else {
                    data.init()
                }
            })
        } else { //for IE8-9
            this.each(function() {
                if (!$.fn.uploadify) return
                var options = {
                    swf           : BJUI.PLUGINPATH +'uploadify/scripts/uploadify.swf',
                    fileTypeExts  : '*.jpg;*.png',
                    id            : 'fileInput',
                    fileObjName   : 'file',
                    fileSizeLimit : 204800,
                    buttonText    : '选择上传文件',
                    auto          : false,
                    multi         : false,
                    height        : 24
                }
                var $element = $(this), op = $element.data()
                
                if (!op.id) op.id = $element.attr('id')
                $.extend(options, op)
                if (!(options.uploader)) {
                    BJUI.debug('Upload Plugin: The options uploader is undefined!')
                    return
                } else {
                    options.uploader = decodeURI(options.uploader).replacePlh($element.closest('.unitBox'))
                    
                    if (!options.uploader.isFinishedTm()) {
                        $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg))
                        BJUI.debug('Upload Plugin: The options uploader is incorrect: '+ options.uploader)
                        return
                    }
                    
                    options.uploader = encodeURI(options.uploader)
                }
                if (options.id == 'fileInput') options.id = options.id + (new Date().getTime())
                var $file = $('<input type="file" name="'+ options.name +'" id="'+ options.id +'">')
                
                if (options.onInit && typeof options.onInit == 'string')
                    options.onInit = options.onInit.toFunc()
                if (options.onCancel && typeof options.onCancel == 'string')
                    options.onCancel = options.onCancel.toFunc()
                if (options.onSelect && typeof options.onSelect == 'string')
                    options.onSelect = options.onSelect.toFunc()
                if (options.onUploadSuccess && typeof options.onUploadSuccess == 'string')
                    options.onUploadSuccess = options.onUploadSuccess.toFunc()
                if (options.onUploadComplete && typeof options.onUploadComplete == 'string')
                    options.onUploadComplete = options.onUploadComplete.toFunc()
                if (options.onUploadError && typeof options.onUploadError == 'string')
                    options.onUploadError   = options.onUploadError.toFunc()
                
                $file.appendTo($element)
                if (!options.auto) {
                    var $upBtn = $('<button class="btn btn-orange" data-icon="cloud-upload">开始上传</button>')
                    
                    $upBtn
                        .hide()
                        .insertAfter($element)
                        .click(function() {
                            $file.uploadify('upload', '*');
                            $(this).hide()
                        })
                        
                    options.onSelect = function() {
                        $upBtn.show()
                    }
                }
                $file.uploadify(options)
            })
        }
    }
    
    var old = $.fn.upload
    
    $.fn.upload             = Plugin
    $.fn.upload.Constructor = Upload
    
    // UPLOAD NO CONFLICT
    // =================
    
    $.fn.upload.noConflict = function () {
        $.fn.upload = old
        return this
    }
    
    // UPLOAD DATA-API
    // ==============
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('[data-toggle="upload"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })

}(jQuery);

/* ========================================================================
 * B-JUI: bjui-theme.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-theme.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // THEME GLOBAL ELEMENTS
    // ======================
    
    var $themeLink, $themeLis
    
    $(function() {
        var INIT_THEME = function() {
            $themeLink = $('#bjui-link-theme')
            $themeLis  = $('#bjui-themes')
            if ($.cookie) {
                var themeName = $.cookie('bjui_theme') || 'purple'
                var $li = $themeLis.find('a.theme_'+ themeName)
                
                $li.theme({})
            }
        }
        
        INIT_THEME()
    })
    
    // THEME CLASS DEFINITION
    // ======================
    var Theme = function(element, options) {
        this.$element = $(element)
        this.options  = options
    }
    
    Theme.DEFAULTS = {
        theme: 'purple'
    }
    
    Theme.prototype.init = function() {
        if (!$themeLink.length) return
        var themeHref = $themeLink.attr('href')
        
        themeHref = themeHref.substring(0, themeHref.lastIndexOf('/'))
        themeHref = themeHref.substring(0, themeHref.lastIndexOf('/'))
        themeHref += '/'+ this.options.theme +'/core.css'
        $themeLink.attr('href', themeHref)
        
        var $themeA = this.$element.closest('ul').prev()
        var classA  = $themeA.attr('class')
        
        classA      = classA.replace(/(theme[\s][a-z]*)/g, '')
        $themeA.removeClass().addClass(classA).addClass('theme').addClass(this.options.theme)
        $themeLis.find('li').removeClass('active')
        this.$element.parent().addClass('active')
        this.cookie()
    }
    
    Theme.prototype.setTheme = function(themeName) {
        $themeLis.find('a.theme_'+ themeName).trigger('click')
    }
    
    Theme.prototype.cookie = function() {
        var theme = this.options.theme
        
        if ($.cookie) $.cookie('bjui_theme', theme, { path: '/', expires: 30 });
    }
    
    // THEME PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Theme.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.theme')
            
            if (!data) $this.data('bjui.theme', (data = new Theme(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }
    
    var old = $.fn.theme
    
    $.fn.theme             = Plugin
    $.fn.theme.Constructor = Theme
    
    // THEME NO CONFLICT
    // =================
    
    $.fn.theme.noConflict = function () {
        $.fn.theme = old
        return this
    }
    
    // THEME DATA-API
    // ==============

    $(document).on('click.bjui.theme.data-api', '[data-toggle="theme"]', function(e) {
        Plugin.call($(this))
        
        e.preventDefault()
    })

}(jQuery);

/* ========================================================================
 * B-JUI: bjui-initui.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-initui.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // INITUI CLASS DEFINITION
    // ======================
    var Initui = function(element, options) {
        var $this     = this
        this.$element = $(element)
        this.options  = options
    }
    
    Initui.DEFAULTS = {}
    
    Initui.prototype.init = function() {
        this.$element.trigger(BJUI.eventType.beforeInitUI)
        this.$element.trigger(BJUI.eventType.initUI)
        this.$element.trigger(BJUI.eventType.afterInitUI)
    }
    
    // INITUI PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args = arguments
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Initui.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.initui')
            if (!data) $this.data('bjui.initui', (data = new Initui(this, options)))
            var property = option
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.initui

    $.fn.initui             = Plugin
    $.fn.initui.Constructor = Initui
    
    // INITUI NO CONFLICT
    // =================
    
    $.fn.initui.noConflict = function () {
        $.fn.initui = old
        return this
    }
    
    // INITUI DATA-API
    // ==============

    $(document).on('click.bjui.initui.data-api', '[data-toggle="initui"]', function(e) {
        Plugin.call($this, $this.data())
        
        e.preventDefault()
    })
    
    /* Lateral Navigation */
    $(document).on('click.bjui.lnav.data-api', '[data-toggle="leftbar"]', function(e) {
        var $this = $(this)
        var $box  = $($this.attr('href'))
        var $hnav = $('#bjui-hnav')
        
        if ($box.length) {
            $('#bjui-sidebar').find('.panel-group').addClass('hide')
            $box.removeClass('hide')
            $this.parent().addClass('active').siblings().removeClass('active')
            if ($hnav.find('button[data-toggle="collapse"]').is(':visible')) {
                $this.closest('.navbar-collapse').removeClass('in')
            }
        }
        
        e.preventDefault()
    })
    
    /* beforeInitUI */
    $(document).on(BJUI.eventType.beforeInitUI, function(e) {
        var $box    = $(e.target)
        var noinits = []
        var $noinit = $box.find('[data-noinit]')
        
        // Hide not need to initialize the UI DOM
        $noinit.each(function(i) {
            var $this   = $(this)
            var pos     = {}
                        
            pos.$target = $this
            pos.$next   = $this.next()
            pos.$prev   = $this.prev()
            pos.$parent = $this.parent()
            
            noinits.push(pos)
            $this.remove()
        })
        
        $box.data('bjui.noinit', noinits)
    })
    
    /* afterInitUI */
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $box    = $(e.target)
        var noinits = $box.data('bjui.noinit')
        
        // Recovery not need to initialize the UI DOM
        if (noinits) {
            $.each(noinits, function(i, n) {
                if (n.$next.length) n.$next.before(n.$target)
                else if (n.$prev.length) n.$prev.after(n.$target)
                else if (n.$parent.length) n.$parent.append(n.$target)
                
                n.$target.show()
                $box.removeData('bjui.noinit')
            })
        }
        
        $box.find('.bjui-pageHeader, .bjui-headBar, .bjui-footBar').attr('data-layout-fixed', true)
        $box.find('[data-layout-h]').layoutH($box.data('bjui.layoutBox') || $box)
    })
    
    /* ajaxStatus */
    var bjui_ajaxStatus = function($target) {
        var $this    = $target
        var $offset  = $this
        var position = $this.css('position')
        
        if (position == 'static') $offset  = $this.offsetParent()
        
        var zIndex   = parseInt($offset.css('zIndex')) || 0
        var $ajaxBackground = $this.find('> .bjui-maskBackground')
        var $ajaxProgress   = $this.find('> .bjui-maskProgress')
            
        if (!$ajaxBackground.length) {
            $ajaxBackground = $(FRAG.maskBackground)
            $ajaxProgress   = $(FRAG.maskProgress.replace('#msg#', BJUI.regional.progressmsg))
            $this.append($ajaxBackground).append($ajaxProgress)
        }
        
        var bgZindex = parseInt($ajaxBackground.css('zIndex')) || 0
        var prZindex = parseInt($ajaxProgress.css('zIndex')) || 0
        
        //if (zIndex > bgZindex) {
            $ajaxBackground.css('zIndex', zIndex + 1)
            $ajaxProgress.css('zIndex', zIndex + 2)
        //}
        
        return {$bg:$ajaxBackground, $pr:$ajaxProgress}
    }
    
    $(document)
        .on('bjui.ajaxStart', function(e) {
            var ajaxMask = bjui_ajaxStatus($(e.target))
            
            ajaxMask.$bg.fadeIn()
            ajaxMask.$pr.fadeIn()
        })
        .on('bjui.ajaxStop', function(e) {
            var ajaxMask = bjui_ajaxStatus($(e.target))
            
            ajaxMask.$bg.fadeOut()
            ajaxMask.$pr.fadeOut()
        })
    
    $(document).on(BJUI.eventType.ajaxStatus, function(e) {
        var $target = $(e.target), ajaxMask = bjui_ajaxStatus($target)
        
        $target
            .one('ajaxStart', function() {
                ajaxMask.$bg.fadeIn()
                ajaxMask.$pr.fadeIn()
            })
            .one('ajaxStop', function() {
                ajaxMask.$bg.fadeOut()
                ajaxMask.$pr.fadeOut()
            })
    })
    
    /* Clean plugins generated 'Dom elements' in the body */
    var bodyClear = function($target) {
        $target.find('select[data-toggle="selectpicker"]').selectpicker('destroyMenu')
        $target.find('[data-toggle="selectztree"]').trigger('destroy.bjui.selectztree')
    }
    
    $(document).on(BJUI.eventType.beforeLoadDialog, function(e) {
        //console.log(111)
    }).on(BJUI.eventType.beforeAjaxLoad, function(e) {
        bodyClear($(e.target))
    }).on(BJUI.eventType.beforeCloseNavtab, function(e) {
        bodyClear($(e.target))
    }).on(BJUI.eventType.beforeCloseDialog, function(e) {
        bodyClear($(e.target))
    })
    
    
}(jQuery);

/* ========================================================================
 * B-JUI: bjui-plugins.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-plugins.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $box    = $(e.target)

        // UI init begin...
        
        /* i-check */
        var $icheck = $box.find('[data-toggle="icheck"]')
        
        $icheck.each(function(i) {
            var $element = $(this),
                id       = $element.attr('id'),
                name     = $element.attr('name'),
                label    = $element.data('label')
                
            if (label) $element.after('<label for="'+ id +'" class="ilabel">'+ label +'</label>')
            
            $element
                .on('ifCreated', function(e) {
                    /* Fixed validate msgbox position */
                    var $parent = $(this).closest('div'),
                        $ilabel = $parent.next('[for="'+ id +'"]')
                    
                    $parent.attr('data-icheck', name)
                    $ilabel.attr('data-icheck', name)
                })
                .iCheck({
                    checkboxClass: 'icheckbox_minimal-purple',
                    radioClass: 'iradio_minimal-purple',
                    increaseArea: '20%' // optional
                })
                .on('ifChanged', function() {
                    /* Trigger validation */
                    if ($(this).closest('div').attr('aria-checked')) {
                        $(this).trigger('validate')
                    }
                })
            
            if ($element.prop('disabled')) $element.iCheck('disable')
        })
        /* i-check check all */
        $icheck.filter('.checkboxCtrl').on('ifChanged', function(e) {
            var checked = e.target.checked == true ? 'check' : 'uncheck'
            var group = $(this).data('group')
            
            $box.find(':checkbox[name="'+ group +'"]').iCheck(checked)
        })
        
        /* fixed ui style */
        $box.find(':text, :password, textarea, :button, a.btn').each(function() {
            var $element = $(this), $tabledit = $element.closest('table.bjui-tabledit')
            
            if (($element.is(':text') || $element.is(':password') || $element.isTag('textarea')) && !$element.hasClass('form-control'))
                $element.addClass('form-control')
            if ($element.is(':button')) {
                var icon = $element.data('icon'), large = $element.data('large'), oldClass = $element.attr('class')
                
                if (!$element.hasClass('btn')) 
                    $element.removeClass().addClass('btn').addClass(oldClass)
                if (icon) {
                    var _icon = 'fa-'+ icon.replace('fa-', '')
                    
                    if (!$element.data('bjui.icon')) {
                        $element.html('<i class="fa '+ _icon +'"></i> '+ $element.html())
                            .data('bjui.icon', true)
                    }
                }
            }
            if ($element.isTag('a')) {
                var icon = $element.data('icon'), large = $element.data('large')
                
                if (icon) {
                    var _icon = 'fa-'+ icon.replace('fa-', '')
                    
                    if (!$element.data('bjui.icon')) {
                        $element.html('<i class="fa '+ _icon +'"></i> '+ $element.html())
                            .data('bjui.icon', true)
                    }
                }
            }
            if ($element.isTag('textarea')) {
                var toggle = $element.data('toggle')
                
                if (toggle && toggle == 'autoheight' && $.fn.autosize) $element.addClass('autosize').autosize()
            }
            if (!$tabledit.length) {
                var size = $element.attr('size') || $element.attr('cols'), width = size * 10
                
                if (!size) return
                if (width) $element.css('width', width)
            }
        })
        
        /* form validate */
        $box.find('form[data-toggle="validate"]').each(function() {
            $(this)
                .validator({
                    valid: function(form) {
                        $(form).bjuiajax('ajaxForm', $(form).data())
                    },
                    validClass: 'ok',
                    theme: 'red_right_effect'
                })
                .on('invalid.form', function(e, form, errors) {
                    $(form).alertmsg('error', FRAG.validateErrorMsg.replace('#validatemsg#', BJUI.regional.validatemsg).replaceMsg(errors.length))
                })
        })
        
        /* moreSearch */
        $box.find('a[data-toggle="moresearch"]').each(function() {
            var $element = $(this),
                $parent  = $element.closest('.bjui-pageHeader'),
                $more    = $parent && $parent.find('.bjui-moreSearch'),
                name     = $element.data('name')
                
            $element.click(function(e) {
                if (!$more.length) {
                    BJUI.debug('Not created \'moresearch\' box[class="bjui-moreSearch"]!')
                    return
                }
                if ($more.is(':visible')) {
                    $element.html('<i class="fa fa-angle-double-down"></i>')
                    if (name) $('body').data('moresearch.'+ name, false)
                } else {
                    $element.html('<i class="fa fa-angle-double-up"></i>')
                    if (name) $('body').data('moresearch.'+ name, true)
                }
                $more.fadeToggle('slow', 'linear')
                
                e.preventDefault()
            })
            
            if (name && $('body').data('moresearch.'+ name)) {
                $more.fadeIn()
                $element.html('<i class="fa fa-angle-double-up"></i>')
            }
        })
        
        /* bootstrap - select */
        var $selectpicker       = $box.find('select[data-toggle="selectpicker"]')
        var bjui_select_linkage = function($obj, $next) {
            var refurl    = $obj.data('refurl')
            var _setEmpty = function($select) {
                var $_nextselect = $($select.data('nextselect'))
                
                if ($_nextselect && $_nextselect.length) {
                    var emptytxt = $_nextselect.data('emptytxt') || '&nbsp;'
                    
                    $_nextselect.html('<option>'+ emptytxt +'</option>').selectpicker('refresh')
                    _setEmpty($_nextselect)
                }
            }
            
            if (($next && $next.length) && refurl) {
                var val = $obj.data('val'), nextVal = $next.data('val')
                
                if (typeof val == 'undefined') val = $obj.val()
                $.ajax({
                    type     : 'POST',
                    dataType : 'json', 
                    url      : refurl.replace('{value}', encodeURIComponent(val)), 
                    cache    : false,
                    data     : {},
                    success  : function(json) {
                        if (!json) return
                        
                        var html = '', selected = ''
                        
                        $.each(json, function(i) {
                            if (json[i] && json[i].length > 1) {
                                if (typeof nextVal != 'undefined') {
                                    
                                    selected = json[i][0] == nextVal ? ' selected' : ''
                                }
                                html += '<option value="'+ json[i][0] +'"'+ selected +'>' + json[i][1] + '</option>'
                            }
                        })
                        
                        $obj.removeAttr('data-val').removeData('val')
                        $next.removeAttr('data-val').removeData('val')
                        
                        if (!html) {
                            html = $next.data('emptytxt') || '&nbsp;'
                            html = '<option>'+ html +'</option>'
                        }
                        
                        $next.html(html).selectpicker('refresh')
                        _setEmpty($next)
                    },
                    error   : BJUI.ajaxError
                })
            }
        }
        
        $selectpicker.each(function() {
            var $element  = $(this)
            var options   = $element.data()
            var $next     = $(options.nextselect)
            
            $element.addClass('show-tick')
            if (!options.style) $element.data('style', 'btn-default')
            if (!options.width) $element.data('width', 'auto')
            if (!options.container) $element.data('container', 'body')
            
            $element.selectpicker()
            
            if ($next && $next.length && (typeof $next.data('val') != 'undefined'))
                bjui_select_linkage($element, $next)
        })
        
        /* bootstrap - select - linkage && Trigger validation */
        $selectpicker.change(function() {
            var $element    = $(this)
            var $nextselect = $($element.data('nextselect'))
            
            bjui_select_linkage($element, $nextselect)
            
            /* Trigger validation */
            if ($element.attr('aria-required')) {
                $element.trigger('validate')
            }
        })
        
        /* zTree - plugin */
        $box.find('[data-toggle="ztree"]').each(function() {
            var $this = $(this)
            var op    = $this.data()
            
            if (!op.nodes) {
                op.nodes = []
                $this.find('> li').each(function() {
                    var $li   = $(this)
                    var node  = $li.data()
                    
                    if (node.pid) node.pId = node.pid
                    node.name = $li.html()
                    op.nodes.push(node)
                })
                $this.empty()
            }
            
            if (!op.showRemoveBtn) op.showRemoveBtn = false
            if (!op.showRenameBtn) op.showRenameBtn = false
            if (op.addHoverDom && typeof op.addHoverDom != 'function')       op.addHoverDom    = (op.addHoverDom == 'edit')    ? _addHoverDom    : op.addHoverDom.toFunc()
            if (op.removeHoverDom && typeof op.removeHoverDom != 'function') op.removeHoverDom = (op.removeHoverDom == 'edit') ? _removeHoverDom : op.removeHoverDom.toFunc()
            if (!op.maxAddLevel)   op.maxAddLevel    = 2
            
            var setting = {
                view: {
                    addHoverDom    : op.addHoverDom || null,
                    removeHoverDom : op.removeHoverDom || null,
                    addDiyDom      : (op.addDiyDom != null) ? op.addDiyDom.toFunc() : null
                },
                edit: {
                    enable        : op.editEnable,
                    showRemoveBtn : op.showRemoveBtn,
                    showRenameBtn : op.showRenameBtn
                },
                check: {
                    enable    : op.checkEnable,
                    chkStyle  : op.chkStyle,
                    radioType : op.radioType
                },
                callback: {
                    onClick      : op.onClick      != null ? op.onClick.toFunc()      : null,
                    beforeDrag   : op.beforeDrag   != null ? op.beforeDrag.toFunc()   : _beforeDrag,
                    beforeDrop   : op.beforeDrop   != null ? op.beforeDrop.toFunc()   : _beforeDrop,
                    onDrop       : op.onDrop       != null ? op.onDrop.toFunc()       : null,
                    onCheck      : op.onCheck      != null ? op.onCheck.toFunc()      : null,
                    beforeRemove : op.beforeRemove != null ? op.beforeRemove.toFunc() : null,
                    onRemove     : op.onRemove     != null ? op.onRemove.toFunc()     : null
                },
                data: {
                    simpleData: {
                        enable: op.simpleData || true
                    },
                    key: {
                        title: op.title || ''
                    }
                }
            }
            
            $.fn.zTree.init($this, setting, op.nodes)
            
            var IDMark_A = '_a'
            var zTree = $.fn.zTree.getZTreeObj($this.attr('id'))
            
            if (op.expandAll) zTree.expandAll(true)
            
            // add button, del button
            function _addHoverDom(treeId, treeNode) {
                var level = treeNode.level
                var $obj = $('#'+ treeNode.tId + IDMark_A)
                var $add = $('#diyBtn_add_'+ treeNode.id)
                var $del = $('#diyBtn_del_'+ treeNode.id)
                
                if (!$add.length) {
                    if (level < op.maxAddLevel) {
                        $add = $('<span class="tree_add" id="diyBtn_add_'+ treeNode.id +'" title="添加"></span>')
                        $add.appendTo($obj);
                        $add.on('click', function(){
                            zTree.addNodes(treeNode, {name:'新增Item'})
                        })
                    }
                }
                
                if (!$del.length) {
                    var $del = $('<span class="tree_del" id="diyBtn_del_'+ treeNode.id +'" title="删除"></span>')
                    
                    $del
                        .appendTo($obj)
                        .on('click', function(event) {
                            var delFn = function() {
                                $del.alertmsg('confirm', '确认要删除 '+ treeNode.name +' 吗？', {
                                    okCall: function() {
                                        zTree.removeNode(treeNode)
                                        if (op.onRemove) {
                                            var fn = op.onRemove.toFunc()
                                            
                                            if (fn) fn.call(this, event, treeId, treeNode)
                                        }
                                    },
                                    cancelCall: function () {
                                        return
                                    }
                                })
                            }
                        
                            if (op.beforeRemove) {
                                var fn = op.beforeRemove.toFunc()
                                
                                if (fn) {
                                    var isdel = fn.call(fn, treeId, treeNode)
                                    
                                    if (isdel && isdel == true) delFn()
                                }
                            } else {
                                delFn()
                            }
                        }
                    )
                }
            }
            
            // remove add button && del button
            function _removeHoverDom(treeId, treeNode) {
                var $add = $('#diyBtn_add_'+ treeNode.id)
                var $del = $('#diyBtn_del_'+ treeNode.id)
                
                if ($add && $add.length) {
                    $add.off('click').remove()
                }
                
                if ($del && $del.length) {
                    $del.off('click').remove()
                }
            }
            
            // Drag
            function _beforeDrag(treeId, treeNodes) {
                for (var i = 0; i < treeNodes.length; i++) {
                    if (treeNodes[i].drag === false) {
                        return false
                    }
                }
                return true
            }
            
            function _beforeDrop(treeId, treeNodes, targetNode, moveType) {
                return targetNode ? targetNode.drop !== false : true
            }
        })
        
        /* zTree - drop-down selector */
        var $selectzTree = $box.find('[data-toggle="selectztree"]')
        
        $selectzTree.each(function() {
            var $this   = $(this)
            var options = $this.data(),
                $tree   = $(options.tree),
                w       = parseFloat($this.css('width')),
                h       = $this.outerHeight()
            
            options.width   = options.width || $this.outerWidth()
            options.height  = options.height || 'auto'
            
            if (!$tree || !$tree.length) return
            
            var treeid = $tree.attr('id')
            var $box   = $('#'+ treeid +'_select_box')
            var setPosition = function($box) {
                var top        = $this.offset().top,
                    left       = $this.offset().left,
                    $clone     = $tree.clone().appendTo($('body')),
                    treeHeight = $clone.outerHeight()
                
                $clone.remove()
                
                var offsetBot = $(window).height() - treeHeight - top - h,
                    maxHeight = $(window).height() - top - h
                
                if (options.height == 'auto' && offsetBot < 0) maxHeight = maxHeight + offsetBot
                $box.css({top:(top + h), left:left, 'max-height':maxHeight})
            }
            
            $this.click(function() {
                if ($box && $box.length) {
                    setPosition($box)
                    $box.show()
                    return
                }
                
                var zindex = 2
                var dialog = $.CurrentDialog
                
                if (dialog && dialog.length) {
                    zindex = dialog.css('zIndex') + 1
                }
                $box  = $('<div id="'+ treeid +'_select_box" class="tree-box"></div>')
                            .css({position:'absolute', 'zIndex':zindex, 'min-width':options.width, height:options.height, overflow:'auto', background:'#FAFAFA', border:'1px #EEE solid'})
                            .hide()
                            .appendTo($('body'))
                $tree.appendTo($box).css('width','100%').data('fromObj', $this).removeClass('hide').show()
                setPosition($box)
                $box.show()
            })
            
            $('body').on('mousedown', function(e) {
                var $target = $(e.target)
                
                if (!($this[0] == e.target || ($box && $box.length > 0 && $target.closest('.tree-box').length > 0))) {
                    $box.hide()
                }
            })
            
            var $scroll = $this.closest('[data-layout-h]')
            
            if ($scroll && $scroll.length) {
                $scroll.scroll(function() {
                    if ($box && $box.length) {
                        setPosition($box)
                    }
                })
            }
            
            //destory selectzTree
            $this.on('destory.bjui.selectztree', function() {
                $box.remove()
            })
        })
        
        /* accordion */
        $box.find('[data-toggle="accordion"]').each(function() {
            var $this = $(this)
            var initAccordion = function(hBox, height) {
                var offsety   = $this.data('offsety') || 0
                var height    = height || ($(hBox).outerHeight() - (offsety * 1))
                var $pheader  = $this.find('.panel-heading')
                var h1        = $pheader.outerHeight()
                
                h1 = h1 * $pheader.length + (parseInt($pheader.last().parent().css('marginTop')) * ($pheader.length - 1))
                $this.css('height', height)
                height = height - h1 - (2 * $pheader.length)
                $this.find('.panel-collapse').find('.panel-body').css('height', height)
            }
            var hBox   = $this.data('heightbox')
            var height = $this.data('height')
            
            if (hBox || height) {
                initAccordion(hBox, height)
                $(window).resize(function() {
                    initAccordion(hBox, height)
                })
            }
            
            $this.on('shown.bs.collapse', function() {
                var $collapse = $this.find('[data-toggle=collapse]')
                
                $collapse.find('i').removeClass('fa-caret-square-o-down').addClass('fa-caret-square-o-right')
                $collapse.removeClass('active').not('.collapsed').addClass('active').find('i').removeClass('fa-caret-square-o-right').addClass('fa-caret-square-o-down')
            })
        })
        
        /* Kindeditor */
        $box.find('[data-toggle="kindeditor"]').each(function() {
            var $editor         = $(this), options = $editor.data()
            
            if (options.items)                     options.items = options.items.split(',')
            if (options.afterUpload)         options.afterUpload = options.afterUpload.toFunc()
            if (options.afterSelectFile) options.afterSelectFile = options.afterSelectFile.toFunc()
            if (options.confirmSelect)     options.confirmSelect = options.confirmSelect.toFunc()
            
            var htmlTags = {
                font : [/*'color', 'size', 'face', '.background-color'*/],
                span : ['.color', '.background-color', '.font-size', '.font-family'
                        /*'.color', '.background-color', '.font-size', '.font-family', '.background',
                        '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'*/
                ],
                div : ['.margin', '.padding', '.text-align'
                        /*'align', '.border', '.margin', '.padding', '.text-align', '.color',
                        '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
                        '.font-style', '.text-decoration', '.vertical-align', '.margin-left'*/
                ],
                table: ['align', 'width'
                        /*'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
                        '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
                        '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
                        '.width', '.height', '.border-collapse'*/
                ],
                'td,th': ['align', 'valign', 'width', 'height', 'colspan', 'rowspan'
                        /*'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
                        '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
                        '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'*/
                ],
                a : ['href', 'target', 'name'],
                embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
                img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
                'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
                    'class', 'align', '.text-align', '.color', /*'.background-color', '.font-size', '.font-family', '.background',*/
                    '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
                ],
                pre : ['class'],
                hr : ['class', '.page-break-after'],
                'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : []
            }
            
            KindEditor.create($editor, {
                pasteType                : options.pasteType,
                minHeight                : options.minHeight || 260,
                autoHeightMode           : options.autoHeight || false,
                items                    : options.items || KindEditor.options.items,
                uploadJson               : options.uploadJson,
                fileManagerJson          : options.fileManagerJson,
                allowFileManager         : true,
                fillDescAfterUploadImage : true, //上传图片成功后转到属性页，为false则直接插入图片[设为true方便自定义函数(X_afterSelect)]
                afterUpload              : options.afterUpload,
                afterSelectFile          : options.afterSelectFile,
                X_afterSelect            : options.confirmSelect,
                htmlTags                 : htmlTags,
                cssPath                  : BJUI.JSPATH + 'plugins/kindeditor_4.1.10/editor-content.css',
                afterBlur                : function() { this.sync() }
            })
        })
        
        /* colorpicker */
        $box.find('[data-toggle="colorpicker"]').each(function() {
            var $this     = $(this)
            var isbgcolor = $this.data('bgcolor')
            
            $this.colorpicker()
            if (isbgcolor) {
                $this.on('changeColor', function(ev) {
                    $this.css('background-color', ev.color.toHex())
                })
            }
        })
        
        $box.find('[data-toggle="clearcolor"]').each(function() {
            var $this   = $(this)
            var $target = $this.data('target') ? $($this.data('target')) : null
            
            if ($target && $target.length) {
                $this.click(function() {
                    $target.val('')
                    if ($target.data('bgcolor')) $target.css('background-color', '')
                })
            }
        })
        
        /* not validate */
        $box.find('form[data-toggle="ajaxform"]').each(function() {
            $(this).validator({ignore: ':input'})
            $(this).validator('destroy')
        })
    })
    
}(jQuery);
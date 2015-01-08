/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-core.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-core.js
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
        alertTimeout: 6000, //alertmsg close timeout
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
            
            if (op.JSPATH) this.JSPATH = op.JSPATH
            if (op.PLUGINPATH) this.PLUGINPATH = op.PLUGINPATH
            if (op.ajaxTimeout) this.ajaxTimeout = op.ajaxTimeout
            if (op.alertTimeout) this.alertTimeout = op.alertTimeout
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
            $('#bjui-container .tabsPageContent').height(iContentH - 31)
            setTimeout(function() {
                $('#bjui-container .tabsPageContent').find('[data-layout-h]:not(.data-layout-h)').layoutH()
            }, 10)
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
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
            showSlidebar : true,      // After the B-JUI initialization, display slidebar
            clientPaging : true       // Response paging and sorting information on the client
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
            
            this.IS_DEBUG = op.debug || false
            this.initEnv()
            
            if ((!$.cookie || !$.cookie('bjui_theme')) && op.theme) $(this).theme('setTheme', op.theme)
        },
        initEnv: function() {
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
            var iContentW = $(window).width() - (BJUI.ui.showSlidebar ? $('#bjui-sidebar').width() + 10 : 8) - 0
            var iContentH = $(window).height() - $('#bjui-header').height() - $('#bjui-hnav').outerHeight() - $('#bjui-footer').outerHeight()
            var navtabH   = $('#bjui-navtab').find('.tabsPageHeader').height()
            var topH      = $('#bjui-hnav').height() + $('#bjui-header').outerHeight() + 5
            var collH     = $('#bjui-hnav').find('.navbar-collapse').height()
            
            $('#bjui-container').height(iContentH)
            $('#bjui-navtab').width(iContentW)
            $('#bjui-leftside, #bjui-sidebar, #bjui-sidebar-s, #bjui-splitBar, #bjui-splitBarProxy').css({height:'100%'})
            $('#bjui-navtab .tabsPageContent').height(iContentH - navtabH)
            setTimeout(function() {
                $('#bjui-navtab .tabsPageContent').find('[data-layout-h]').not('.bjui-layout-h').layoutH()
            }, 10)
            //$('#bjui-taskbar').css({top: iContentH + $('#bjui-header').height() + 5, width:$(window).width()})
            
            /* header navbar */
            var navbarWidth = $('body').data('bjui.navbar.width'),
                $header = $('#bjui-header'), $toggle = $header.find('.bjui-navbar-toggle'), $logo = $header.find('.bjui-navbar-logo'), $navbar = $('#bjui-navbar-collapse'), $nav = $navbar.find('.bjui-navbar-right')
            
            if (!navbarWidth) {
                navbarWidth = {logoW:$logo.outerWidth(), navW:$nav.outerWidth()}
                $('body').data('bjui.navbar.width', navbarWidth)
            }
            if (navbarWidth) {
                if ($(window).width() - navbarWidth.logoW < navbarWidth.navW) {
                    $toggle.show()
                    $navbar.addClass('collapse menu')
                } else {
                    $toggle.hide()
                    $navbar.removeClass('collapse menu in')
                }
            }
            /* horizontal navbar */
            var hnavWidth = $('body').data('bjui.hnav.width'), hnavCWidth = $('body').data('bjui.hnav.cwidth'),
                $hnav = $('#bjui-hnav'), $htoggle = $hnav.find('.bjui-hnav-toggle'), $hnavbar = $('#bjui-hnav-navbar'), $form = $hnav.find('.hnav-form')
            
            if (!hnavWidth) {
                hnavWidth = {barW:$hnavbar.outerWidth(), formW:$form.outerWidth()}
                $('body').data('bjui.hnav.width', hnavWidth)
            }
            if (hnavWidth) {
                if ((!hnavCWidth ? hnavWidth.barW : hnavCWidth) + hnavWidth.formW > $(window).width()) {
                    if (!hnavCWidth) {
                        $hnavbar.addClass('condensed')
                        $('body').data('bjui.hnav.cwidth', $hnavbar.outerWidth())
                    }
                    $htoggle.show()
                    $hnavbar.addClass('collapse menu')
                    $form.hide()
                } else {
                    if (hnavCWidth && (hnavWidth.barW + hnavWidth.formW < $(window).width())) {
                        $hnavbar.removeClass('condensed')
                        $('body').removeData('bjui.hnav.cwidth')
                    }
                    $hnavbar.removeClass('collapse menu in')
                    $form.show()
                    $htoggle.hide()
                }
            }
        },
        regional: {},
        setRegional: function(key, value) {
            BJUI.regional[key] = value
        }
    }
    
    window.BJUI = BJUI
    
}(jQuery);
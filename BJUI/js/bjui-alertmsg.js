/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

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
                    timer = setTimeout(function() { $tools.close() }, BJUI.alertTimeout)
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
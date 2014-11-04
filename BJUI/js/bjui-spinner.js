/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

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
                $input.val(ivalue)
                that.ivalue = ivalue
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
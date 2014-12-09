/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

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
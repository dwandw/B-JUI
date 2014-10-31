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
        var $this       = this
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
    
    Slidebar.prototype.init = function() {
        var $this = this
        this.$toggle.click(function() {
            $this.$split.hide()
            BJUI.ui.showSlidebar = false
            var sbarwidth = parseInt($this.$sbar.css('left')) + $this.$sbar.outerWidth()
            var barleft   = sbarwidth - $this.$bar.outerWidth()
            var cleft     = parseInt($this.$container.css('left')) - ($this.$bar.outerWidth() - $this.$sbar.outerWidth())
            var cwidth    = $this.$bar.outerWidth() - $this.$sbar.outerWidth() + $this.$container.outerWidth()
            $this.$container.animate({left:cleft, width:cwidth}, 50, function() {
                $this.$bar.animate({left: barleft}, 500, function() {
                    $this.$bar.hide()
                    $this.$sbar.show().css('left', -50).animate({left:5}, 200)
                    $(window).trigger(BJUI.eventType.resizeGrid)
                })
            })
            $this.$collapse.on('click', function() {
                var sbarwidth = parseInt($this.$sbar.css('left')) + $this.$sbar.outerWidth()
                var _hideBar  = function() {
                    if (!BJUI.ui.showSlidebar) {
                        $this.$bar.animate({left: barleft}, 500, function() {
                            $this.$bar.hide()
                        })
                    }
                    $this.$container.off('click')
                }
                if ($this.$bar.is(':hidden')) {
                    $this.$toggle.hide()
                    $this.$bar.show().animate({left: sbarwidth}, 500)
                    $this.$container.on('click', _hideBar)
                } else {
                    $this.$bar.animate({left: barleft}, 500, function() {
                        $this.$bar.hide()
                    })
                }
                return false
            })
            return false
        })
        this.$stoggle.click(function() {
            BJUI.ui.showSlidebar = true
            $this.$sbar.animate({left: -25}, 200, function() {                
                $this.$bar.show()
            })
            $this.$bar.animate({left: 5}, 800, function() {
                $this.$split.show()
                $this.$toggle.show()                    
                var cleft = 5 + $this.$bar.outerWidth() + $this.$split.outerWidth()
                var cwidth = $this.$container.outerWidth() - (cleft - parseInt($this.$container.css('left')))
                $this.$container.css({left:cleft, width:cwidth})
                $this.$collapse.off('click')
                $(window).trigger(BJUI.eventType.resizeGrid)
            })
            return false
        })
        this.$split.mousedown(function(event) {
            $this.$split2.each(function() {
                var $spbar2 = $(this)
                setTimeout(function() { $spbar2.show() }, 100)
                $spbar2.css({visibility:'visible', left: $this.$split.css('left')})                    
                $spbar2.basedrag($.extend($this.options, {obj:$this.$bar, move:'horizontal', event:event, stop: function() {
                    $(this).css('visibility', 'hidden')
                    var move      = parseInt($(this).css('left')) - parseInt($this.$split.css('left'))
                    var sbarwidth = $this.$bar.outerWidth() + move
                    var cleft     = parseInt($this.$container.css('left')) + move
                    var cwidth    = $this.$container.outerWidth() - move
                    $this.$bar.css('width', sbarwidth)
                    $this.$split.css('left', $(this).css('left'))
                    $this.$container.css({left:cleft, width:cwidth})
                }}))
                return false                    
            })
        })
    }
    
    // SLIDEBAR PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args = arguments
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.slidebar')
            if (!data) $this.data('bjui.slidebar', (data = new Slidebar(this, options)))
            if (typeof option == 'string' && data[option] instanceof Function) {
                [].shift.apply(args)
                if (!args) data[option]()
                else data[option].apply(data, args)
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
    
}(jQuery);
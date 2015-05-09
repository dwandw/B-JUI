/*!
 * B-JUI v1.1 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-slidebar.js v1.1
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
        $('#bjui-leftside').after('<!-- Adjust the width of Left slide -->').after(FRAG.splitBar).after(FRAG.splitBarProxy)
    })
    
    // SLIDEBAR CLASS DEFINITION
    // ======================
    
    var Slidebar = function(element, options) {
        this.$element   = $(element)
        this.$bar       = this.$element.find('#bjui-sidebar')
        this.$sbar      = this.$element.find('#bjui-sidebar-s')
        this.$lock      = this.$bar.find('> .toggleCollapse > .lock')
        this.$navtab    = $('#bjui-navtab')
        this.$collapse  = this.$sbar.find('.collapse')
        this.$split     = $('#bjui-splitBar')
        this.$split2    = $('#bjui-splitBarProxy')
        
        this.isfloat    = false
        this.options    = options
    }
    
    Slidebar.prototype.lock = function() {
        var that   = this
        var cleft  = that.$bar.outerWidth() + 6
        var cwidth = that.$navtab.outerWidth() - cleft + 6
        
        that.faLock()
        that.hoverLock()
        that.$sbar.animate({left: -10}, 20)
        that.$bar.removeClass('shadown')
        that.isfloat = false
        that.$navtab.animate({left:cleft, width:cwidth}, 500, function() {
            $(window).trigger(BJUI.eventType.resizeGrid)
        })
        that.$split.show()
    }
    
    Slidebar.prototype.unlock = function() {
        var that    = this
        var barleft = 0 - that.$bar.outerWidth() - 2
        var cwidth  = (BJUI.ui.showSlidebar ? that.$bar.outerWidth() : 0) + that.$navtab.outerWidth()
        
        that.faUnLock()
        that.hoverUnLock()
        that.$navtab.animate({left:6, width:cwidth}, 400)
        that.$bar.animate({left: barleft}, 500, function() {
            that.$sbar.animate({left:0}, 200)
            that.$split.hide()
            $(window).trigger(BJUI.eventType.resizeGrid)
        })
        that.isfloat = false
    }
    
    Slidebar.prototype.float = function() {
        var that  = this
        
        that.$sbar.animate({left:-10}, 200)
        that.$bar.addClass('shadown').animate({left: 2}, 500)
        that.isfloat = true
    }
    
    Slidebar.prototype.hideFloat = function() {
        var that    = this
        var barleft = 0 - that.$bar.outerWidth() - 2
        
        that.$bar.animate({left: barleft}, 500, function() {
            that.$sbar.animate({left:0}, 100)
        })
        that.isfloat = false
    }
    
    Slidebar.prototype.hoverLock = function() {
        var that = this
        
        that.$lock
            .hover(function() {
                that.tipUnLock()
                that.faUnLock()
            }, function() {
                that.tipLock()
                that.faLock()
            })
    }
    
    Slidebar.prototype.hoverUnLock = function() {
        var that = this
        
        that.$lock
            .hover(function() {
                that.tipLock()
                that.faLock()
            }, function() {
                that.tipUnLock()
                that.faUnLock()
            })
    }
    
    Slidebar.prototype.tipLock = function() {
        this.$lock.tooltip('destroy').tooltip({ title:'保持锁定，始终显示导航栏', container:'body' })
    }
    
    Slidebar.prototype.tipUnLock = function() {
        this.$lock.tooltip('destroy').tooltip({ title:'解除锁定，自动隐藏导航栏', container:'body' })
    }
    
    Slidebar.prototype.faLock = function() {
        this.$lock.find('> i').attr('class', 'fa fa-lock')
    }
    
    Slidebar.prototype.faUnLock = function() {
        this.$lock.find('> i').attr('class', 'fa fa-unlock-alt')
    }
    
    Slidebar.prototype.init = function() {
        var that = this
        
        if (!BJUI.ui.showSlidebar) {
            that.unlock()
        } else {
            that.hoverLock()
        } 
        
        this.$lock.off('click.bjui.slidebar').on('click.bjui.slidebar', function() {
            if (that.isfloat) {
                that.lock()
            } else {
                that.unlock()
            }
            BJUI.ui.showSlidebar = !BJUI.ui.showSlidebar
        })
        
        this.$collapse.hover(function() {
            that.float()
            that.$navtab.click(function() {
                if (that.isfloat) that.hideFloat()
            })
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
                        var cleft     = parseInt(that.$navtab.css('left')) + move
                        var cwidth    = that.$navtab.outerWidth() - move
                        
                        that.$bar.css('width', sbarwidth)
                        that.$split.css('left', $(this).css('left'))
                        that.$navtab.css({left:cleft, width:cwidth})
                    }}))
                
                return false                    
            })
        })
        
        Slidebar.prototype.initHnav = function() {
            var that   = this,
                title  = that.$element.text().trim(),
                $li    = that.$element.parent(),
                $trees = $li.find('> ul.ztree'),
                $box   = $('#bjui-accordionmenu'),
                $group = $box.find('> .panel:first-child'),
                $first
            
            if (!$trees.length) $trees = $li.find('> .trees > ul.ztree')
            if ($trees.length) $box.empty()
            else return
            
            $trees.each(function(i) {
                var $t = $(this), $tree = $t.clone().attr('id', 'bjui-sidebar-tree'+ i), faicon = $t.data('faicon'), faiconClose = $t.data('faiconClose'), icon = faicon ? faicon : 'caret-square-o-down'
                
                if ($t.data('title')) title = $t.data('title')
                
                var $newGroup  = $group.clone(),
                    $panelHead = $newGroup.find('.panel-heading'),
                    $panelBody = $newGroup.find('.panel-collapse'),
                    $paneltit  = $newGroup.find('.panel-heading > h4 > a').attr('href', '#bjui-accordionmenu-hnav-'+ i).attr('data-faicon', faicon).attr('data-faicon-close', faiconClose).html(title)
                
                $panelBody.attr('id', 'bjui-accordionmenu-hnav-'+ i).find('> .panel-body').empty()
                if (i == 0) {
                    $paneltit.addClass('active')
                    $panelBody.addClass('in').css('height', '')
                    $first = $paneltit
                } else {
                    $paneltit.removeClass('active')
                    $panelBody.removeClass('in')
                    icon = faiconClose ? faiconClose : (faicon ? faicon : 'caret-square-o-right')
                }
                
                $paneltit.prepend('<i class="fa fa-'+ icon +'"></i>&nbsp;')
                $tree.removeAttr('data-noinit').css('display', 'block').appendTo($panelBody.find('> .panel-body'))
                $box.append($newGroup)
            })
            
            $('#bjui-sidebar').initui()
            $li.addClass('active').siblings().removeClass('active')
        }
        
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
    $(document).one(BJUI.eventType.afterInitUI, function(e) {
        $('#bjui-leftside').slidebar({minW:150, maxW:700})
    })
    
    $(document).on('click.bjui.slidebar.data-api', '[data-toggle="slidebar"]', function(e) {
        Plugin.call($(this), 'initHnav')
        
        e.preventDefault()
    })
    
}(jQuery);
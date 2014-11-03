/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

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
    
    Tablefixed.DEFAULTS = {
        width: '100%'
    }
    
    Tablefixed.prototype.TOOLS = function() {
        var tools = {
            getLeft: function($obj) {
                var width = 0
                
                $obj.prevAll().each(function() {
                    width += $(this).outerWidth()
                })
                
                return width - 1
            },
            getRight: function($obj) {
                var width = 0
                
                $obj.prevAll().andSelf().each(function() {
                    width += $(this).outerWidth()
                })
                
                return width - 1
            },
            getTop: function($obj) {
                var height = 0
                
                $obj.parent().prevAll().each(function() {
                    height += $(this).outerHeight()
                })
                
                return height
            },
            getHeight: function($obj, $parent) {
                var height = 0
                var $head  = $obj.parent()
                
                $head.nextAll().andSelf().each(function() {
                    height += $(this).outerHeight()
                })
                $parent.find('.fixedtableTbody').children().each(function() {
                    height += $(this).outerHeight()
                })
                
                return height
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
    
    Tablefixed.prototype.init = function() {
        if (!this.$element.isTag('table')) return
        
        this.$container = this.$element.parent().addClass('bjui-resizeGrid')
        this.$fixed     = undefined
        var width       = this.$container.width()
        
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
    }
    
    Tablefixed.prototype.initHead = function() {
        var styles  = this.options.styles = []
        var $oldThs = this.$element.find('thead > tr:last-child > th')
        var $table  = this.$element
        var thLen   = $oldThs.length
        var fixedW  = 0
        
        for (var i = 0; i < $oldThs.size(); i++) {
            var $th   = $oldThs.eq(i)
            var style = [], width = $th.innerWidth()
            
            style[0]  = parseInt(width)
            style[1]  = $th.attr('align')
            style[2]  = $th.attr('class')
            fixedW   += style[0]
            styles[styles.length] = style
        }
        fixedW = parseInt((this.options.newWidth - fixedW) / thLen)
        this.$fixed.html(this.$element.html())

        var $thead  = this.$fixed.find('thead')
        var $ths    = $thead.find('> tr:last-child > th')
        
        this.options.$ths = $ths
        $ths.each(function(i) {
            var $th = $(this), style = styles[i], w = $th.attr('width')
            
            $th
                .addClass(style[1])
                .addClass(style[2])
                .removeAttr('align')
                .width(style[0] + fixedW)
                .attr('title', $th.text())
                .html('<div class="fixedtableCol">'+ $th.html() +'</div>')
            
            style[0] = (style[0] + fixedW)
            if (w) {
                style[0] = parseInt(w)
                $th.width(w).removeAttr('width')
            }
        })
        $thead.wrap('<div class="fixedtableHeader"><div class="fixedtableThead"><table class="table table-bordered" style="width:'+ (this.options.newWidth - 20) + 'px; max-width:'+ (this.options.newWidth - 20) +'px;"></table></div></div>')
        this.$fixed.append('<div class="resizeMarker" style="display:none; height:300px; left:57px;"></div><div class="resizeProxy" style="left:377px; display:none; height:300px;"></div>')
    }
    
    Tablefixed.prototype.initBody = function() {
        var $tbody    = this.$fixed.find('> tbody')
        var layoutStr = ' data-layout-h="'+ (this.options.layoutH || 0) +'"'
        var $tds      = $tbody.find('> tr:first-child > td')
        var styles    = this.options.styles
        
        $tds.each(function(i) {
            if (i < styles.length) $(this).width(styles[i][0])
        })
        
        this.options.$tds = $tds
        $tbody.wrap('<div class="fixedtableScroller"'+ layoutStr +'><div class="fixedtableTbody"><table style="width:'+ (this.options.newWidth - 20) +'px; max-width:'+ (this.options.newWidth - 20) +'px;"></table></div></div>')
        
        if (!this.$element.attr('class')) $tbody.parent().addClass('table table-striped table-bordered table-hover')
        else $tbody.parent().addClass(this.$element.attr('class'))
        
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
        
        $ths.each(function(i) {
            var $th = $(this)
            
            $th.mouseover(function(e) {
                var ofLeft = parseInt($fixed.find('.fixedtableThead').css('left')) || 0
                var offset = tools.getOffset($th, e).offsetX
                
                if ($th.outerWidth() - offset < 5) {
                    $th.css('cursor', 'col-resize').off('mousedown.bjui.tablefixed.resize').on('mousedown.bjui.tablefixed.resize', function(event) {
                        $fixed.find('> .resizeProxy')
                            .show()
                            .css({
                                left:   tools.getRight($th) + ofLeft,
                                top:    tools.getTop($th),
                                height: tools.getHeight($th, $fixed),
                                cursor: 'col-resize'
                            })
                            .basedrag({
                                scop:  true, cellMinW:20, relObj:$fixed.find('.resizeMarker'),
                                move:  'horizontal',
                                event: event,
                                stop:  function() {
                                    var pleft   = $fixed.find('.resizeProxy').position().left
                                    var mleft   = $fixed.find('.resizeMarker').position().left
                                    var move    = pleft - mleft - $th.outerWidth() - 9
                                    var cols    = tools.getColspan($th)
                                    var cellNum = tools.getCellNum($th)
                                    var oldW    = $th.width(), newW = $th.width() + move
                                    var $dcell  = $tds.eq(cellNum - 1)
                                    var scrolW  = $fixed.find('> .fixedtableScroller').width()
                                    var tableW  = $fixed.find('> .fixedtableHeader .table').width()
                                    
                                    $th.width(newW)
                                    $dcell.width(newW)
                                    
                                    $fixed.find('.table').width(tableW + move)
                                    $fixed.find('.resizeMarker, .resizeProxy').hide()
                                }
                            })
                        
                        $fixed
                            .find('> .resizeMarker')
                            .show()
                            .css({
                                left:   tools.getLeft($th) + 1 + ofLeft,
                                top:    tools.getTop($th),
                                height: tools.getHeight($th, $fixed)
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
    
    Tablefixed.prototype.setOrderBy = function() {
        var $th       = this.$element,
            $orderBox = $th.find('.fixedtableCol'),
            options   = this.options,
            $order    = $(FRAG.orderby.replace('#asc#', BJUI.regional.orderby.asc).replace('#desc#', BJUI.regional.orderby.desc))
        
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
                var width  = $(this).innerWidth(), newWidth = width
                
                if (width) {
                    if (typeof that.options.width == 'string' && that.options.width.indexOf('%')) {
                        newWidth = width * (that.options.width.replace('%', '') / 100)
                    } else {
                        newWidth = parseInt(that.options.width) 
                    }
                    $(this).find('.table').width(newWidth - 20)
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
        
        Plugin.call($this, $this.data())
    })
    
    /* orderby */
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $this = $(e.target).find('th[data-order-field]')
        
        if (!$this.length) return
        
        Plugin.call($this, 'setOrderBy', $this.data())
    })
    
}(jQuery);
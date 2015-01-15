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
        
        if (this.$container.hasClass('tab-pane')) width = this.$container.parent().innerWidth() - 20
        if (typeof this.options.width == 'string' && this.options.width.indexOf('%')) {
            this.options.newWidth = width * (this.options.width.replace('%', '') / 100)
        } else {
            this.options.newWidth = parseInt(this.options.width)
        }
        
        this.options.styles = []
        this.$element.wrap('<div class="bjui-tablefixed clearfix"></div>')
        this.$fixed = this.$element.parent()
        this.initHead()
        this.initBody()
        this.resizeCol()
        this.resizeGrid()
        
        if (height && !this.$fixed.closest('.tab-content').length) this.$fixed.height(height).addClass('fixedH')
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
        if (typeof this.$element.attr('data-selected-multi') != 'undefined') $tbody.parent().attr('data-selected-multi', this.$element.attr('data-selected-multi'))
        
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
    
    /* selected tr */
    $(document).on('click.bjui.tr.data-api', 'tr[data-id]', function(e) {
        var $this     = $(this),
            $table    = $this.closest('table'),
            multi     = $table.data('selectedMulti'),
            id        = $this.data('id'),
            clsName   = 'selected',
            $selected = $table.closest('.unitBox').find('#bjui-selected')
        
        $this.toggleClass(clsName)
        if (multi) {
            id = []
            $this.siblings('.'+ clsName).add(($this.hasClass(clsName) ? $this : '')).each(function() {
                id.push($(this).data('id'))
            })
            id = id.join(',')
        } else {
            $this.siblings().removeClass(clsName)
        }
        if ($selected && $selected.length) {
            $selected.val(id)
        } else {
            $selected = $('<input type="hidden" id="bjui-selected" value="'+ id +'">')
            $selected.appendTo($table.closest('.unitBox'))
        }
    })
    
}(jQuery);
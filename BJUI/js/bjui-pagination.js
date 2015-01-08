/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

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
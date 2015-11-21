/*!
 * B-JUI  v1.2 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-tabledit.js  v1.2
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.database.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-tabledit.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // TABLEDIT CLASS DEFINITION
    // ======================
    
    var Tabledit = function(element, options) {
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
        this.$tbody   = this.$element.find('> tbody')
        if (!this.$tbody.length) {
            this.$tbody = $('<tbody></tbody>')
            this.$element.append(this.$tbody)
        }
        this.$numAdd =
        this.$btnAdd = null
    }
    
    Tabledit.DEFAULTS = {
        singleNoindex : true
    }
    
    Tabledit.EVENTS = {
        afterDelete: 'afterdelete.bjui.tabledit'
    }
    
    Tabledit.prototype.TOOLS = function() {
        var that = this
        var tools = {
            initSuffix: function($tr) {
                var i = $tr.data("id");
                $tr.find(':input, :file, a, label, div, select').each(function() {
                    var $child = $(this),
                        name   = $child.attr('name'), 
                        val    = $child.val(),
                        fors   = $child.attr('for'),
                        id     = $child.attr('id'),
                        href   = $child.attr('href'),
                        group  = $child.attr('data-group'),
                        suffix = $child.attr('data-suffix'),
                        nextSelect = $child.attr('data-nextSelect')

                    if (name) $child.attr('name', name.replaceSuffix(i))
                    if (fors) $child.attr('for', fors.replaceSuffix(i))
                    if (id)   $child.attr('id', id.replaceSuffix(i).replaceSuffix2(i))
                    if (href) $child.attr('href', href.replaceSuffix(i))
                    if (group)   $child.attr('data-group', group.replaceSuffix(i))
                    if (suffix)  $child.attr('data-suffix', suffix.replaceSuffix(i))
                    if (val && val.indexOf('#index#') >= 0) $child.val(val.replace('#index#', i + 1))
                    if (nextSelect) $child.attr('data-nextSelect', nextSelect.replaceSuffix(i))
                    if ($child.hasClass('no')) {
                        var prefix = $child.data('prefix') ? $child.data('prefix') : ''

                        $child.val(prefix + (i + 1))
                    }
                })
            },
            // Tab
            initTab: function($tr) {
                var $texts = $tr.find(':text, button, textarea');
                
                $texts.each(function(i) {
                    $(this).bind('keydown', function (e) {
                        if (e.which == BJUI.keyCode.TAB) {
                            var nexInd = i + 1
                            
                            if ($texts.eq(nexInd).length > 0) {
                                $texts.eq(nexInd)[0].focus()
                            }else{
                                $texts.eq(0)[0].focus()
                            }
                            e.preventDefault()
                        }
                    })
                })
                this.initInput($tr)
            },
            initInput: function($tr) {
                $tr.find('> td').each(function() {
                    var $this = $(this);
                    $(this).on('change', ':input', function(e) {
                        $this.data("val", $(this).val()).attr("data-val", $(this).val());
                    });
                })
            },
            initTbody: function() {
                var $table  = that.$element,
                    $tbody  = that.$tbody

                $tbody.find('> tr').each(function() {
                    var $tr = $(this)
                    $tr.data('bjui.tabledit.oldTds', $tr.html())
                    if($tr.find('[data-toggle="doedit"]').length == 0)
                        $tr.find('> td:last').prepend('<button type="button" class="btn-green" data-toggle="doedit" data-icon="pencil" title="编辑"></button>');
                    _doRead($tr);
                    $tr.on('dblclick', $.proxy(function(e) { _doEdit($tr) }, that))
                })
                
                $tbody
                    .on('click.bjui.tabledit.readonly', '[data-toggle="doedit"]', function(e) {
                        _doEdit($(this).closest('tr'))
                    })
                    .on('click.bjui.tabledit.readonly', '[data-toggle="dosave"]', function(e) {
                        var $tr = $(this).closest('tr'), index = $tr.index(), callback = that.options.callback
                        
                        if (that.options.action) {
                            $tr.wrap('<form action="" method="POST"></form>')
                            if ($tr.attr('data-id')) {
                                var name = $table.find('> thead > tr:eq(0)').data('idname') || 'id'
                                
                                $tr.before('<input type="hidden" name="'+ name.replaceSuffix(index) +'" value="'+ $tr.attr('data-id') +'">')
                            }
                            
                            var data = $tr.parent().serializeArray()
                            
                            if (that.options.singleNoindex) {
                                $.each(data, function(ii, nn) {
                                    $.extend(nn, {name:nn.name.replaceSuffix(0)})
                                })
                            }
                            
                            $tr.prev('input').remove()
                            $tr.parent().isValid(function(v) {
                                if (v) {
                                    $tr.unwrap();
                                    var _callback = function(json) {
                                        $tr.bjuiajax('ajaxDone', json);
                                        if (json[BJUI.keys.statusCode] == BJUI.statusCode.ok) {
                                            _doRead($tr);
                                        }
                                        if(callback){
                                            callback = callback.toFunc();
                                            callback(json, that.$element);
                                        }
                                    };
                                    $tr.bjuiajax('doAjax', {url:that.options.action, data:data, type:that.options.type || 'POST', callback:_callback})
                                }
                            })
                        } else {
                            _doRead($tr)
                        }
                    })
                
                function _doEdit($tr) {
                    var $tds = $tr.find('> td'), $ths = $table.data('bjui.tabledit.tr').clone().find('> th');
                    $tr.removeClass('readonly');
                    $ths.each(function(i) {
                        var $td = $tds.eq(i), val = $td.data('val'), $th = $(this), $child = $th.children(), $pic = $th.find('.pic-box');
                        if(!$child.length && $th.data("edit")){
                            $th.html($th.data("edit"));
                            $child = $th.children();
                        }
                        if (!$td.data('noedit')) {
                            if ($child.length) {
                                if ($child.is('input:checkbox') || $child.is('input:radio')) {
                                    $child.filter('[value="'+ val +'"]').attr('checked', 'checked')
                                } else if ($child.isTag('select')) {
                                    if($child.data("toggle") == "address"){
                                        $child.attr('data-val', $td.data('val'));
                                    }else{
                                        $child.find('option[value="'+ $td.data('val') +'"]').attr('selected', 'selected')
                                    }
                                } else if ($pic.length) {
                                    if ($td.data('val')) $th.find('.pic-name').val($td.data('val'))
                                    $pic.html($td.html())
                                } else if ($child.hasClass('wrap_bjui_btn_box')) {
                                    $child.find('input[data-toggle]').attr('value', val +'')
                                } else if ($child.is('textarea')) {
                                    $child.html(val)
                                } else {
                                    $child.attr('value', val +'')
                                }
                                $td.html($th.html())
                            }
                        }
                    });
                    that.tools.initSuffix($tr);

                    $tr.initui();
                    that.tools.initTab($tr);
                    $tr.find('[data-toggle="doedit"]')
                        .attr('data-toggle', 'dosave')
                        .attr('title', '保存')
                        .empty()
                        .data('bjui.icon',false)
                        .data('icon','save')
                        .parent()
                        .initui()
                }
                function _doRead($tr) {
                    var $tds = $tr.find('> td'), $ths = $table.data('bjui.tabledit.tr').clone().find('> th');
                    $tr.addClass("readonly");
                    $ths.each(function(i) {
                        var $td = $tds.eq(i), val = $td.data('val'), $th = $(this);
                        if($th.data("hidden")) return;
                        $('select', $td).attr('disabled', 'disabled');
                        if($('select', $td).length == 0 && val)
                            $td.html(val);
                    });
                    
                    $tr.find('[data-toggle="dosave"]')
                        .attr('data-toggle', 'doedit')
                        .attr('title', '编辑')
                        .empty()
                        .data('bjui.icon',false)
                        .data('icon','pencil')
                        .parent()
                        .initui()
                }
            },
            doAdd: function() {
                var tool   = this
                var $table = that.$element
                
                if (!that.$numAdd || !that.$btnAdd) return
                $table
                    .on('keydown.bjui.tabledit.add', 'thead .num-add', function(e) {
                        if (e.which == BJUI.keyCode.ENTER) {
                            that.$btnAdd.trigger('click.bjui.tabledit.add')
                            
                            e.preventDefault()
                        }
                    })
                    .on('click.bjui.tabledit.add', 'thead .row-add', function(e) {
                        var rowNum = 1
                        
                        if (!isNaN(that.$numAdd.val())) rowNum = parseInt(that.$numAdd.val())
                        that.add($table, rowNum)
                        
                        e.preventDefault()
                    })
            },
            doDel: function($tbody) {
                var tool     = this
                var delEvent = 'click.bjui.tabledit.del'
                
                $tbody.off(delEvent).on(delEvent, '.row-del', function(e) {
                    var $btnDel = $(this)
                    
                    if ($btnDel.data('confirmMsg')) {
                        $btnDel.alertmsg('confirm', $btnDel.data('confirmMsg'), {okCall: function() { tool.delData($btnDel) }})
                    } else {
                        tool.delData($btnDel)
                    }
                    
                    e.preventDefault()
                })
            },
            delData: function($btnDel) {
                var tool    = this
                var $tbody  = $btnDel.closest('tbody')
                var options = $btnDel.data()
                var _delRow = function(json) {
                    $btnDel.closest('tr').remove()
                    tool.initSuffix($tbody)
                    tool.afterDelete($tbody)
                    if (options.callback) (options.callback.toFunc()).apply(that, [json])
                }
                
                if ($btnDel.is('[href^=javascript:]') || $btnDel.is('[href^="#"]')) {
                    _delRow()
                } else {
                    $btnDel.bjuiajax('doAjax', {
                        url      : $btnDel.attr('href'),
                        data     : options.data,
                        callback : _delRow
                    })
                }
            },
            afterDelete: function($tbody) {
                var deletedEvent = $.Event(Tabledit.EVENTS.afterDelete, {relatedTarget: $tbody[0]})
                
                that.$element.trigger(deletedEvent)
                if (deletedEvent.isDefaultPrevented()) return
            }
        }
        
        return tools
    }
    
    Tabledit.prototype.init = function() {
        var that    = this
        var tools   = this.tools
        var $table  = this.$element.addClass('bjui-tabledit'), $tr = $table.find('> thead > tr:first'), $tbody = this.$tbody
        var trHtml  = $tr.html()
        
        $tr.find('> th').each(function() {
            var $th   = $(this)
            var title = $th.attr('title')
            var add   = $th.data('addtool')
            
            if (title) $th.html(title)
            if (add) {
                var $addBox   = $('<span style="position:relative;"></span>')
                
                $th.empty()
                that.$numAdd = $('<input type="text" value="1" class="form-control num-add" size="2" title="待添加的行数">')
                that.$btnAdd = $('<a href="javascript:;" class="row-add" title="添加行"><i class="fa fa-plus-square"></i></a>')
                $addBox.append(that.$numAdd).append(that.$btnAdd).appendTo($th)
            }
        })
        $table.data('bjui.tabledit.tr', $('<tr>'+ trHtml +'</tr>'))
        tools.initTbody()
        tools.doAdd()
        tools.doDel($tbody)
    }
    
    Tabledit.prototype.add = function($table, num) {
        var tools  = this.tools
        var $tbody = $table.find('> tbody')
        var $firstTr, $tr = $table.data('bjui.tabledit.tr')
        
        for (var i = 0; i < num; i++) {
            $tr.find('> th').each(function() { $(this).replaceWith('<td>'+ $(this).html() +'</td>') })
            
            var $addTr = $tr.clone()
            
            if (i == 0) $firstTr = $addTr
            $addTr.hide().appendTo($tbody)
            tools.initSuffix($tbody)
            tools.initEnter($tbody)
            $addTr.show().css('display', '').initui()
        }
        /*置入焦点*/
        if ($firstTr && $firstTr.length) {
            var $input = $firstTr.find(':text')
            
            $input.each(function() {
                var $txt = $(this)
                
                if (!$txt.prop('readonly')) {
                    $txt.focus()
                    return false
                }
            })
        }
    }
    
    // TABLEDIT PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Tabledit.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.tabledit')
            
            if (!data) $this.data('bjui.tabledit', (data = new Tabledit(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.tabledit

    $.fn.tabledit             = Plugin
    $.fn.tabledit.Constructor = Tabledit
    
    // TABLEDIT NO CONFLICT
    // =================
    
    $.fn.tabledit.noConflict = function () {
        $.fn.tabledit = old
        return this
    }
    
    // TABLEDIT DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('table[data-toggle="tabledit"]')
        
        if (!$this.length) return
        
        Plugin.call($this)
    })
    
    // init add tr
    $(document).on(BJUI.eventType.afterInitUI, function(e) {
        var $this = $(e.target).find('table[data-toggle="tabledit"]')
        
        $this.each(function() {
            if ($(this).is('[data-initnum]')) {
                var initNum = $(this).data('initnum')
                
                if (initNum > 0) {
                    Plugin.call($(this), 'add', $(this), initNum)
                }
            }
        })
    })
    
    $(document).on('click.bjui.tabledit.data-api', '[data-toggle="tableditadd"]', function(e) {
        var $this = $(this)
        var num   = $this.data('num') || 1
        var table = $this.data('target')
        
        if (!table || !$(table).length) return
        if (!$(table).isTag('table')) return
        Plugin.call($this, 'add', $(table), num)
        
        e.preventDefault()
    })
    
}(jQuery);
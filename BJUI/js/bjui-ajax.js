/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-ajax.js v1.0
 * @author K'naan (xknaan@163.com) 
 * -- Modified from dwz.ajax.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-ajax.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    // BJUIAJAX CLASS DEFINITION
    // ======================
    
    var Bjuiajax = function(element, options) {
        var $this     = this
        this.$element = $(element)
        this.options  = options
        this.tools    = this.TOOLS()
    }
    
    Bjuiajax.DEFAULTS = {
        reload: true
    }
    
    Bjuiajax.NAVTAB = 'navtab'
    
    Bjuiajax.prototype.TOOLS = function() {
        var that  = this
        var tools = {
            getPagerForm: function($parent, args) {
                var form     = $parent.isTag('form') ? $parent[0] : $parent.find('#pagerForm:first')[0]
                var pageInfo = $.extend({}, BJUI.pageInfo)
                
                if (form) {
                    for (var key in pageInfo) {
                        var val = ''
                        
                        if (args && args[key]) val = args[key]
                        if (!form[pageInfo[key]]) $('<input type="hidden" name="'+ pageInfo[key] +'" value="'+ val +'">').appendTo($(form))
                        else if (val) form[pageInfo[key]].value = val
                    }
                }
                
                return form
            },
            getTarget: function() {
                if (that.$element.closest('.navtab-panel').length) return Bjuiajax.NAVTAB
                else return 'dialog'
            }
        }
        
        return tools
    }
    
    Bjuiajax.prototype.ajaxForm4Iframe = function($form, successFn) {
        $.ajax({
            type        : $form.attr('method') || 'POST',
            url         : $form.attr('action'),
            data        : $form.serializeArray(),
            dataType    : 'json',
            timeout     : BJUI.ajaxTimeout,
            files       : $form.find(':file'),
            iframe      : true,
            processData : false,
            cache       : false,
            success     : successFn,
            error       : $.proxy(this.ajaxError, this)
        })
    }
    
    Bjuiajax.prototype.ajaxForm4Html5 = function($form, successFn) {
        var formData = new FormData($form[0])
        
        $.ajax({
            type        : $form.attr('method') || 'POST',
            url         : $form.attr('action'),
            data        : formData,
            contentType : false,
            processData : false,
            dataType    : 'json',
            timeout     : BJUI.ajaxTimeout,
            cache       : false,
            success     : successFn,
            error       : $.proxy(this.ajaxError, this)
        })
    }
    
    Bjuiajax.prototype.ajaxForm4Serialize = function($form, successFn) {
        $.ajax({
            type        : $form.attr('method') || 'POST',
            url         : $form.attr('action'),
            data        : $form.serializeArray(),
            dataType    : 'json',
            timeout     : BJUI.ajaxTimeout,
            cache       : false,
            success     : successFn,
            error       : $.proxy(this.ajaxError, this)
        })
    }
    
    Bjuiajax.prototype.ajaxForm = function(options) {
        var that      = this
        var $form     = this.$element,
            callback  = options.callback,
            enctype   = $form.attr('enctype'),
            $target   = $form.closest('.bjui-layout')
        
        that.options = options
        
        if (callback) callback = callback.toFunc()
        if (!$target || !$target.length) {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) $target = $.CurrentNavtab
            else $target = $.CurrentDialog
        }
        
        $form.one('ajaxStart', function() {
            $target.trigger('bjui.ajaxStart')
        }).one('ajaxStop', function() {
            $target.trigger('bjui.ajaxStop')
        })
        
        var successFn = function(data, textStatus, jqXHR) {
            callback ? callback.apply(that, [data, $form]) : $.proxy(that.ajaxCallback(data), that)
        }
        var _submitFn = function() {
            if (enctype && enctype == 'multipart/form-data') {
                if (window.FormData) {
                    that.ajaxForm4Html5($form, successFn)
                } else {
                    that.ajaxForm4Iframe($form, successFn)
                }
            } else {
                that.ajaxForm4Serialize($form, successFn)
            }
        }
        
        if (options.confirmMsg) {
            $form.alertmsg('confirm', options.confirmMsg, {okCall: _submitFn})
        } else {
            _submitFn()
        }
    }
    
    Bjuiajax.prototype.ajaxDone = function(json) {
        var $element = this.$element
        
        if (json[BJUI.keys.statusCode] == BJUI.statusCode.error) {
            if (json[BJUI.keys.message]) $element.alertmsg('error', json[BJUI.keys.message])
        } else if (json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) {
            $element.alertmsg('error', json[BJUI.keys.message] || FRAG.sessionTimout, {okCall:BJUI.loadLogin})
        } else {
            if (json[BJUI.keys.message]) $element.alertmsg('correct', json[BJUI.keys.message])
        }
    }
    
    Bjuiajax.prototype.ajaxError = function(xhr, ajaxOptions, thrownError) {
        this.$element.alertmsg('error', '<div>Http status: ' + xhr.status + ' ' + xhr.statusText + '</div>' 
            + '<div>ajaxOptions: '+ ajaxOptions +' </div>'
            + '<div>thrownError: '+ thrownError +' </div>'
            + '<div>'+ xhr.responseText +'</div>')
    }
    
    Bjuiajax.prototype.ajaxCallback = function(json) {
        var that     = this
        var $element = that.$element
        var $target  = $element.closest('.bjui-layout')
        
        that.ajaxDone(json)
        
        if (json[BJUI.keys.statusCode] == BJUI.statusCode.ok) {
            if ($target && $target.length) {
                that.divCallback(json, $target)
            } else {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    that.navtabCallback(json)
                } else {
                    that.dialogCallback(json)
                }
            }
        }
    }
    
    Bjuiajax.prototype.divCallback = function(json, $target) {
        var that = this
        
        if (json.tabid)
            setTimeout(function() { that.$element.navtab('reloadFlag', json.tabid) }, 100)
        if (json.dialogid)
            setTimeout(function() { that.$element.dialog('refresh', json.dialogid) }, 100)
        if (json.divid)
            setTimeout(function() { that.$element.bjuiajax('refreshDiv', json.divid) }, 100)
        if (that.options.reload) {
            var form = that.tools.getPagerForm($target)
            var url  = null, type = null
            
            if (form) {
                url  = form.attr('action')
                type = form.attr('method') || 'GET'
            } else {
                url  = $target.data('url')
                type = $target.data('type') || 'GET'
            }
            
            if (!url) return
            
            $target.ajaxUrl({url: url, type: type})
        }
        if (that.options.reloadNavtab)
            setTimeout(function() { that.$element.navtab('refresh') }, 100)
        if (json.forward) {
            var _forward = function() {
                $target.ajaxUrl({url: json.forward})
            }
            
            if (json.forwardConfirm) {
                that.$element.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.navtabCallback = function(json) {
        var that = this
        
        if (json.tabid)
            setTimeout(function() { that.$element.navtab('reloadFlag', json.tabid) }, 100)
        if (json.dialogid)
            setTimeout(function() { that.$element.dialog('refresh', json.dialogid) }, 100)
        if (json.divid)
            setTimeout(function() { that.$element.bjuiajax('refreshDiv', json.divid) }, 100)
        if (json.closeCurrent && !json.forward)
            that.$element.navtab('closeCurrentTab')
        else if (that.options.reload)
            setTimeout(function() { that.$element.navtab('refresh') }, 100)
        if (json.forward) {
            var _forward = function() {
                that.$element.navtab('reload', {url:json.forward})
            }
            
            if (json.forwardConfirm) {
                that.$element.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() },
                    cancelCall: function() { if (json.closeCurrent) { that.$element.navtab('closeCurrentTab') } }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.dialogCallback = function(json) {
        var that = this
        
        if (json.tabid)
            setTimeout(function() { that.$element.navtab('reloadFlag', json.tabid) }, 100)
        if (json.dialogid)
            setTimeout(function() { that.$element.dialog('refresh', json.dialogid) }, 100)
        if (json.divid)
            setTimeout(function() { that.$element.bjuiajax('refreshDiv', json.divid) }, 100)
        if (json.closeCurrent && !json.forward)
            that.$element.dialog('closeCurrent')
        else if (that.options.reload)
            setTimeout(function() { that.$element.dialog('refresh') }, 100)
        if (that.options.reloadNavtab)
            setTimeout(function() { that.$element.navtab('refresh') }, 100)
        if (json.forward) {
            var _forward = function() {
                that.$element.dialog('reload', {url:json.forward})
            }
            
            if (json.forwardConfirm) {
                that.$element.alertmsg('confirm', json.forwardConfirm, {
                    okCall: function() { _forward() }
                })
            } else {
                _forward()
            }
        }
    }
    
    Bjuiajax.prototype.pageCallback = function(options, target) {
        var that    = this
        var op      = options
        var $target = target || null
        var form    = null
        
        if ($target && $target.length) {
            form = that.tools.getPagerForm($target, op)
            if (form) {
                $target.ajaxUrl({ type:'POST', url:$(form).attr('action'), data:$(form).serializeArray() })
            }
        } else {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                $target = $.CurrentNavtab
                form    = that.tools.getPagerForm($target, op)
                that.$element.navtab('reloadForm', false, op)
            } else {
                $target = $.CurrentDialog
                form    = that.tools.getPagerForm($target, op)
                that.$element.dialog('reloadForm', false, op)
            }
        }
    }
    
    Bjuiajax.prototype.doSearch = function(options) {
        var that = this, $element = that.$element, form = null, op = {pageCurrent:1}, $target = $element.closest('.bjui-layout')
        
        if (!options.url) options.url = $element.attr('action')
        if (!options.url) {
            BJUI.debug('Error trying to submit form action: action url is undefined!')
            return false
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The submit form action is incorrect: '+ options.url)
                return false
            }
            
            options.url = encodeURI(options.url)
        }
        
        if ($target && $target.length) {
            form = that.tools.getPagerForm($target, op)
            
            var data = $element.serializeJson(), _data = {}
            
            if (options.clearQuery) {
                var pageInfo = BJUI.pageInfo
                
                for (var key in pageInfo) {
                    _data[pageInfo[key]] = data[pageInfo[key]]
                }
                data = _data
            }
            $target.ajaxUrl({ type:$element.attr('method') || 'POST', url:options.url, data:data })
        } else {
            if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                $target = $.CurrentNavtab
                form    = that.tools.getPagerForm($target, op)
                $element.navtab('reloadForm', options.clearQuery, options)
            } else {
                $target = $.CurrentDialog
                form    = that.tools.getPagerForm($target, op)
                $element.dialog('reloadForm', options.clearQuery, options)
            }
        }
    }
    
    Bjuiajax.prototype.doLoad = function(options) {
        var that = this, $element = that.$element, type = options.type || 'GET', $target = options.target ? $(options.target) : null
        
        if (!options.url) {
            BJUI.debug('Error trying to open a ajax link: The url is undefined!')
            return false
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The ajax link incorrect: '+ options.url)
                return false
            }
            
            options.url = encodeURI(options.url)
        }
        
        if (!$target || !$target.length) {
            BJUI.debug('Not set loaded \'ajax\' content container, like [data-target].')
            return false
        }
        
        if ($target && $target.length) {
            $target
                .data('url', options.url).data('type', type).data('data', options.data)
                .ajaxUrl({ type:type, url:options.url, data:options.data || {}, callback:function(html) {
                    $target.find('[data-layout-h]').addClass('bjui-layout-h')
                    $(window).resize(function() {
                        setTimeout(function() { $target.find('[data-layout-h]').layoutH() }, 20)
                    })
                } })
        }
    }
    
    Bjuiajax.prototype.refreshLayout = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null
        
        if ($target && $target.length) {
            var url  = options.url || $target.data('url'),
                type = options.type || $target.data('type'),
                data = options.data || $target.data('data') || {}
            
            $target
                .data('url', url).data('type', type).data('data', data)
                .ajaxUrl({ type:type, url:url, data:data, callback:function(html) {
                    $target.find('[data-layout-h]').addClass('bjui-layout-h')
                    $(window).resize(function() {
                        setTimeout(function() { $target.find('[data-layout-h]').layoutH() }, 20)
                    })
                } })
        }
    }
    
    Bjuiajax.prototype.refreshDiv = function(divid) {
        if (divid && typeof divid == 'string') {
            var arr = divid.split(',')
            
            for (var i = 0; i < arr.length; i++) {
                this.refreshLayout({target: '#'+ arr[i]})
            }
        }
    }
    
    Bjuiajax.prototype.doAjax = function(options) {
        var that = this, $element = that.$element
        
        if (!options.url) {
            BJUI.debug('Error trying to open a ajax link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
            
            options.url = encodeURI(options.url)
        }
        
        var callback = options.callback && options.callback.toFunc()
        var todo     = function() {
            $.ajax({
                type     : options.type || 'POST',
                url      : options.url,
                data     : options.data || {},
                dataType : 'json',
                timeout  : BJUI.ajaxTimeout,
                cache    : false,
                success  : function(data, textStatus, jqXHR) {
                    callback ? callback.apply(that, [data]) : $.proxy(that.ajaxCallback(data), that)
                },
                error    : $.proxy(that.ajaxError, that)
            })
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype.doExport = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null, form

        if (!options.url) {
            BJUI.debug('Error trying to open a ajax link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            if (!$target || !$target.length) {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    $target = $.CurrentNavtab
                } else {
                    $target = $.CurrentDialog
                }
            }
            form = that.tools.getPagerForm($target)
            if (form) options.url = encodeURI(options.url + (options.url.indexOf('?') == -1 ? '?' : '&') + $(form).serialize())
            
            window.location = options.url
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype.doExportChecked = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null

        if (!options.url) {
            BJUI.debug('Error trying to open a export link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            if (!options.group) {
                that.$element.alertmsg('error', options.warn || FRAG.alertNoCheckGroup.replace('#nocheckgroup#', BJUI.regional.nocheckgroup))
                return
            }
            if (!$target || !$target.length) {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    $target = $.CurrentNavtab
                } else {
                    $target = $.CurrentDialog
                }
            }
            
            var ids     = []
            var $checks = $target.find(':checkbox[name='+ options.group +']:checked')
            
            if ($checks.length == 0) {
                that.$element.alertmsg('error', FRAG.alertNotChecked.replace('#notchecked#', BJUI.regional.notchecked))
                return
            }
            $checks.each(function() {
                ids.push($(this).val())
            })
            
            options.url += (options.url.indexOf('?') == -1 ? '?' : '&') + (options.idname ? options.idname : 'ids') +'='+ ids.join(',')
            
            window.location = options.url
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    Bjuiajax.prototype.doAjaxChecked = function(options) {
        var that = this, $element = that.$element, $target = options.target ? $(options.target) : null

        if (!options.url) {
            BJUI.debug('Error trying to open a del link: url is undefined!')
            return
        } else {
            options.url = decodeURI(options.url).replacePlh($element.closest('.unitBox'))
            
            if (!options.url.isFinishedTm()) {
                $element.alertmsg('error', (options.warn || FRAG.alertPlhMsg.replace('#plhmsg#', BJUI.regional.plhmsg)))
                BJUI.debug('The ajax url is incorrect: '+ options.url)
                return
            }
        }
        
        var todo = function() {
            if (!options.group) {
                that.$element.alertmsg('error', options.warn || FRAG.alertNoCheckGroup.replace('#nocheckgroup#', BJUI.regional.nocheckgroup))
                return
            }
            if (!$target || !$target.length) {
                if (that.tools.getTarget() == Bjuiajax.NAVTAB) {
                    $target = $.CurrentNavtab
                } else {
                    $target = $.CurrentDialog
                }
            }
            
            var ids      = []
            var $checks  = $target.find(':checkbox[name='+ options.group +']:checked')
            var callback = options.callback && options.callback.toFunc()
            
            if ($checks.length == 0) {
                that.$element.alertmsg('error', FRAG.alertNotChecked.replace('#notchecked#', BJUI.regional.notchecked))
                return
            }
            $checks.each(function() {
                ids.push($(this).val())
            })
            
            options.url += (options.url.indexOf('?') == -1 ? '?' : '&') + (options.idname ? options.idname : 'ids') +'='+ ids.join(',')
            
            $.ajax({
                type     : options.type || 'POST',
                url      : options.url,
                dataType : 'json',
                timeout  : BJUI.ajaxTimeout,
                cache    : false,
                success  : function(data, textStatus, jqXHR) {
                    callback ? callback.apply(that, [data]) : $.proxy(that.ajaxCallback(data), that)
                },
                error    : $.proxy(that.ajaxError, that)
            })
        }
        
        if (options.confirmMsg) {
            $element.alertmsg('confirm', options.confirmMsg, {
                okCall: function() {
                    todo()
                }
            })
        } else {
            todo()
        }
    }
    
    // BJUIAJAX PLUGIN DEFINITION
    // =======================
    
    function Plugin(option) {
        var args     = arguments
        var property = option
        
        return this.each(function () {
            var $this   = $(this)
            var options = $.extend({}, Bjuiajax.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data    = $this.data('bjui.bjuiajax')
            
            if (!data) $this.data('bjui.bjuiajax', (data = new Bjuiajax(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                return
            }
        })
    }

    var old = $.fn.bjuiajax

    $.fn.bjuiajax             = Plugin
    $.fn.bjuiajax.Constructor = Bjuiajax
    
    // BJUIAJAX NO CONFLICT
    // =================
    
    $.fn.bjuiajax.noConflict = function () {
        $.fn.bjuiajax = old
        return this
    }
    
    // BJUIAJAX DATA-API
    // ==============
    
    $(document).on('submit.bjui.bjuiajax.data-api', '[data-toggle="ajaxform"]', function(e) {
        var $this   = $(this)
        
        if (!$this.isTag('form')) return
        
        Plugin.call($this, 'ajaxForm', $this.data())
        
        e.preventDefault()
    })
    
    $(document).on('submit.bjui.bjuiajax.data-api', '[data-toggle="ajaxsearch"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!$this.isTag('form')) return
        
        Plugin.call($this, 'doSearch', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="reloadsearch"]', function(e) {
        var $this = $(this), options
        var $form = $this.closest('form')
        
        if (!$form || !$form.length) return
        
        options = $form.data()
        options.clearQuery = $this.data('clearQuery') || true
        
        Plugin.call($form, 'doSearch', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="ajaxload"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doLoad', options)
        
        e.preventDefault()
    })
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $box    = $(e.target).find('[data-toggle="autoajaxload"]')
        
        $box.each(function() {
            var $element = $(this), options = $element.data()
            
            options.target = this
            Plugin.call($element, 'doLoad', options)
        })
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="refreshlayout"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        Plugin.call($this, 'refreshLayout', options)
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doajax"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doAjax', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doexport"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doExport', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doexportchecked"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doExportChecked', options)
        
        e.preventDefault()
    })
    
    $(document).on('click.bjui.bjuiajax.data-api', '[data-toggle="doajaxchecked"]', function(e) {
        var $this   = $(this)
        var options = $this.data()
        
        if (!options.url) options.url = $this.attr('href')
        
        Plugin.call($this, 'doAjaxChecked', options)
        
        e.preventDefault()
    })
    
}(jQuery);
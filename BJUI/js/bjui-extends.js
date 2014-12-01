/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: bjui-extends.js v1.0
 * @author K'naan (xknaan@163.com)
 * -- Modified from dwz.core.js (author:ZhangHuihua@msn.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/bjui-extends.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    $.fn.extend({
        /**
         * @param {Object} op: {type:GET/POST, url:ajax请求地址, data:ajax请求参数列表, callback:回调函数 }
         */
        ajaxUrl: function(op) {
            var $this = $(this)
            
            $this.trigger(BJUI.eventType.beforeAjaxLoad).trigger(BJUI.eventType.ajaxStatus)
            
            $.ajax({
                type     : op.type || 'GET',
                url      : op.url,
                data     : op.data || {},
                cache    : false,
                dataType : 'text',
                timeout  : BJUI.ajaxTimeout,
                success  : function(response) {
                    var json = response.toJson()
                    
                    if (json[BJUI.keys.statusCode] == BJUI.statusCode.error) {
                        if (json[BJUI.keys.message]) $this.alertmsg('error', json[BJUI.keys.message])
                    } else {
                        $this.html(response).initui()
                        if ($.isFunction(op.callback)) op.callback(response)
                    }
                    if (json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) {
                        $this.alertmsg('error', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout),
                            { okCall:function() { BJUI.loadLogin() } }
                        )
                    }
                },
                error      : BJUI.ajaxError,
                statusCode : {
                    503: function(xhr, ajaxOptions, thrownError) {
                        alert(FRAG.statusCode_503.replace('#statusCode_503#', BJUI.regional.statusCode_503) || thrownError)
                    }
                }
            })
        },
        loadUrl: function(url,data,callback) {
            $(this).ajaxUrl({url:url, data:data, callback:callback})
        },
        /**
         * adjust component inner reference box height
         * @param {Object} refBox: reference box jQuery Obj
         */
        layoutH: function($refBox) {
            return this.each(function() {
                var $this    = $(this)
                var $target  = null
                
                if ($refBox && $refBox.length) $this.data('bjui.layout', ($target = $refBox))
                else $target = $this.data('bjui.layout') || $this.closest('div.layoutBox')
                
                var iRefH    = $target.height()
                var iLayoutH = parseInt($this.data('layoutH')) || 0
                var iH       = 0
                
                if (!iLayoutH) {
                    var $unitBox   = $this.closest('div.bjui-layout')
                    
                    if (!$unitBox.length) $unitBox = $this.closest('div.unitBox')
                    
                    var fixedH     = 0
                    var $fixedBox  = $unitBox.find('.bjui-tablefixed')
                    var fixedBoxH  = 0
                    var fixedTh    = 0
                    
                    $unitBox.find('[data-layout-fixed]').each(function(i) {
                        var $fixed = $(this)
                        
                        if (!$fixed.closest('.bjui-layout').length || $target.hasClass('bjui-layout')) {
                            fixedH = fixedH + $fixed.outerHeight() || 0
                        }
                    })
                    
                    if ($fixedBox.length && (!$fixedBox.closest('.bjui-layout').length || $target.hasClass('bjui-layout'))) {
                        if ($fixedBox[0].scrollWidth > $fixedBox[0].clientWidth || $fixedBox[0].scrollWidth > $fixedBox[0].offsetWidth) {
                            fixedBoxH = $fixedBox[0].offsetHeight - $fixedBox[0].clientHeight
                        }
                        fixedTh = $fixedBox.find('.fixedtableHeader').outerHeight() || 0
                    }
                    iH = iRefH - fixedH - fixedBoxH - fixedTh
                } else {
                    iH = iRefH - iLayoutH > 50 ? iRefH - iLayoutH : 50
                }
                if ($this.isTag('table') && !$this.parent('[data-layout-h]').length) {
                    $this.removeAttr('data-layout-h').wrap('<div data-layout-h="'+ iLayoutH +'" style="overflow:auto;width:100%;height:'+ iH +'px"></div>')
                } else {
                    $this.height(iH).css('overflow','auto')
                }
            })
        },
        getMaxIndexObj: function($elements) {
            var zIndex = 0, index = 0
            
            $elements.each(function(i) {
                var newZIndex = parseInt($(this).css('zIndex')) || 1
                
                if (zIndex < newZIndex) {
                    zIndex = newZIndex
                    index  = i
                }
            })
            
            return $elements.eq(index)
        },
        /**
         * 将表单数据转成JSON对象 用法：$(form).serializeJson() Author: K'naan
         */
        serializeJson: function () {
            var o = {}
            var a = this.serializeArray()
            
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]]
                    }
                    o[this.name].push(this.value || '')
                } else {
                   o[this.name] = this.value || ''
                }
            })
            
            return o
        },
        isTag: function(tn) {
            if(!tn) return false
            return $(this)[0].tagName.toLowerCase() == tn ? true : false
        },
        /**
         * 判断当前元素是否已经绑定某个事件
         * @param {Object} type
         */
        isBind: function(type) {
            var _events = $(this).data('events')
            return _events && type && _events[type]
        },
        /**
         * 输出firebug日志
         * @param {Object} msg
         */
        log: function(msg) {
            return this.each(function() {
                if (console) console.log('%s: %o', msg, this)
            })
        }
    })
    
    /**
     * 扩展String方法
     */
    $.extend(String.prototype, {
        isPositiveInteger: function() {
            return (new RegExp(/^[1-9]\d*$/).test(this))
        },
        isInteger: function() {
            return (new RegExp(/^\d+$/).test(this))
        },
        isNumber: function(value, element) {
            return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this))
        },
        trim: function() {
            return this.replace(/(^\s*)|(\s*$)|\r|\n/g, '')
        },
        startsWith: function (pattern) {
            return this.indexOf(pattern) === 0
        },
        endsWith: function(pattern) {
            var d = this.length - pattern.length
            return d >= 0 && this.lastIndexOf(pattern) === d
        },
        replaceSuffix: function(index) {
            return this.replace(/\[[0-9]+\]/,'['+index+']').replace('#index#',index)
        },
        replaceSuffix2: function(index) {
            return this.replace(/\-(i)([0-9]+)$/, '-i'+ index).replace('#index#', index)
        },
        trans: function() {
            return this.replace(/&lt;/g, '<').replace(/&gt;/g,'>').replace(/&quot;/g, '"')
        },
        encodeTXT: function() {
            return (this).replaceAll('&', '&amp;').replaceAll('<','&lt;').replaceAll('>', '&gt;').replaceAll(' ', '&nbsp;')
        },
        replaceAll: function(os, ns) {
            return this.replace(new RegExp(os,'gm'), ns)
        },
        /*替换占位符为对应选择器的值*/ //{^(.|\#)[A-Za-z0-9_-\s]*}
        replacePlh: function($box) {
            $box = $box || $(document)
            return this.replace(RegExp('{.*}', 'g'), function($1) {
                var $input = $box.find($1.replace(/[{}]+/g, ''))
                return $input.val() ? $input.val() : $1
            })
        },
        replaceMsg: function(holder) {
            return this.replace(new RegExp('({.*})', 'g'), holder)
        },
        replaceTm: function($data) {
            if (!$data) return this
            
            return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})','g'), function($1) {
                return $data[$1.replace(/[{}]+/g, '')]
            })
        },
        replaceTmById: function(_box) {
            var $parent = _box || $(document)
            
            return this.replace(RegExp('({[A-Za-z_]+[A-Za-z0-9_-]*})','g'), function($1) {
                var $input = $parent.find('#'+ $1.replace(/[{}]+/g, ''))
                return $input.val() ? $input.val() : $1
            })
        },
        isFinishedTm: function() {
            return !(new RegExp('{.*}').test(this))
        },
        skipChar: function(ch) {
            if (!this || this.length===0) return ''
            if (this.charAt(0)===ch) return this.substring(1).skipChar(ch)
            return this
        },
        isValidPwd: function() {
            return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this))
        },
        isValidMail: function() {
            return(new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(this.trim()))
        },
        isSpaces: function() {
            for (var i = 0; i < this.length; i += 1) {
                var ch = this.charAt(i)
                
                if (ch!=' '&& ch!='\n' && ch!='\t' && ch!='\r') return false
            }
            return true
        },
        isPhone:function() {
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/).test(this))
        },
        isUrl:function() {
            return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this))
        },
        isExternalUrl:function() {
            return this.isUrl() && this.indexOf('://'+ document.domain) == -1
        },
        toBool: function() {
            return (this.toLowerCase() === 'true') ? true : false
        },
        toJson: function() {
            try {
                if (typeof this === 'string') return $.parseJSON(this)
                else return this
            } catch (e) {
                return {}
            }
        },
        /**
         * String to Function
         * 参数(方法字符串或方法名)： 'function(){...}' 或 'getName' 或 'USER.getName' 均可
         * Author: K'naan
         */
        toFunc: function() {
            if (!this || this.length == 0) return undefined
            //if ($.isFunction(this)) return this
            
            if (this.startsWith('function')) {
                return (new Function('return '+ this))()
            }
            
            var m_arr = this.split('.')
            var fn    = window
            
            for (var i = 0; i < m_arr.length; i++) {
                fn = fn[m_arr[i]]
            }
            
            if (typeof fn === 'function') {
                return fn
            }
            
            return undefined
        }
    })
    
    $.extend(Function.prototype, {
        //to fixed String.prototype -> toFunc
        toFunc: function() {
            return this
        }
    })
}(jQuery);
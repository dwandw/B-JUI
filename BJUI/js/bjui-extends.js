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
                dataType : 'html',
                timeout  : BJUI.ajaxTimeout,
                success  : function(response) {
                    var json = response.toJson()
                    
                    if (!json[BJUI.keys.statusCode]) {
                        $this.html(response).initui()
                        if ($.isFunction(op.callback)) op.callback(response)
                    } else {
                        if (json[BJUI.keys.statusCode] == BJUI.statusCode.error) {
                            if (json[BJUI.keys.message]) $this.alertmsg('error', json[BJUI.keys.message])
                        } else if (json[BJUI.keys.statusCode] == BJUI.statusCode.timeout) {
                            if (!$this.children().not('.bjui-maskBackground, .bjui-maskProgress').length) {
                                if ($this.closest('.bjui-dialog').length) $this.dialog('closeCurrent')
                                if ($this.closest('.navtab-panel').length) $this.navtab('closeCurrent')
                            }
                            $('body').alertmsg('error', (json[BJUI.keys.message] || BJUI.regional.sessiontimeout),
                                { okCall:function() { BJUI.loadLogin() } }
                            )
                        }
                    }
                },
                error      : function(xhr, ajaxOptions, thrownError) {
                    $this.bjuiajax('ajaxError', xhr, ajaxOptions, thrownError)
                    if (!$this.closest('.bjui-layout').length) {
                        if ($this.closest('.navtab-panel').length) $this.navtab('closeCurrentTab')
                        else $this.dialog('closeCurrent')
                    }
                },
                statusCode : {
                    503: function(xhr, ajaxOptions, thrownError) {
                        $this.alertmsg('error', FRAG.statusCode_503.replace('#statusCode_503#', BJUI.regional.statusCode_503) || thrownError)
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
                var $box      = $(this)
                var $unitBox  = null
                var $fixedBox = null
                
                if (!$refBox || !$refBox.length) $refBox = $box.closest('.bjui-layout')
                if (!$refBox || !$refBox.length) $refBox = $box.closest('div.layoutBox')
                
                var refH = $refBox.height() || parseInt($refBox.css('height'))
                var layH = $box.data('bjuiLayH') || parseInt($box.data('layoutH')) || 0
                var bodH = 0
                
                if (!layH) {
                    $unitBox  = $box.closest('div.bjui-layout')
                    if (!$unitBox || !$unitBox.length) $unitBox = $box.closest('div.unitBox')
                    
                    $unitBox.find('.bjui-layout').find('[data-layout-fixed]').hide()
                    $unitBox.find('.bjui-layout').find('.bjui-tablefixed').hide()
                    
                    var fixedH     = 0
                    var fixedBoxH  = 0
                    var fixedTh    = 0
                    
                    $unitBox.find('[data-layout-fixed]:visible').each(function() {
                        fixedH += $(this).outerHeight() || 0
                    })
                    
                    $fixedBox = $unitBox.find('.bjui-tablefixed:visible')
                    if (!$fixedBox.hasClass('fixedH') && $fixedBox.length) {
                        if ($fixedBox[0].scrollWidth > $fixedBox[0].clientWidth || $fixedBox[0].scrollWidth > $fixedBox[0].offsetWidth) {
                            fixedBoxH = $fixedBox[0].offsetHeight - $fixedBox[0].clientHeight
                        }
                        fixedTh = $fixedBox.find('.fixedtableHeader').outerHeight() || 0
                    }
                    $unitBox.find('.bjui-layout').find('[data-layout-fixed]').show()
                    $unitBox.find('.bjui-layout').find('.bjui-tablefixed').show()
                    bodH = refH - fixedH - fixedBoxH - fixedTh
                    $box.data('bjuiLayH', (fixedH + fixedBoxH + fixedTh))
                } else {
                    bodH = refH - layH > 50 ? refH - layH : 50
                }
                if ($box.isTag('table') && !$box.parent('[data-layout-h]').length) {
                    $box.removeAttr('data-layout-h').wrap('<div data-bjui-lay-h="'+ $box.data('bjuiLayH') +'" data-layout-h="'+ layH +'" style="overflow:auto;width:100%;height:'+ bodH +'px"></div>')
                } else {
                    $box.height(bodH).css('overflow','auto')
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
            return this.replace(/{\/?[^}]*}/g, function($1) {
                var $input = $box.find($1.replace(/[{}]+/g, ''))
                
                return $input && $input.val() ? $input.val() : $1
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
            var json = this
            
            try {
                if (typeof json == 'object') json = json.toString()
                if (!json.trim().match("^\{(.+:.+,*){1,}\}$")) return this
                else return JSON.parse(this)
            } catch (e) {
                return this
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
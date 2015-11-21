+ function($) {
    'use strict';

    // DRAG CLASS DEFINITION
    // ======================
    var Drag = function(element, options) {
        this.$element = $(element);
        this.options = options;
        this.tools = this.TOOLS();
    }

    Drag.DEFAULTS = {
        cursor: 'move', // selector 的鼠标手势
        sortBoxs: '[data-toggle=sortDrag]', //拖动排序项父容器
        replace: false, //2个sortBox之间拖动替换
        items: '> *', //拖动排序项选择器
        itemsParent: '', //拖动排序项选择器
        selector: '', //拖动排序项用于拖动的子元素的选择器，为空时等于item
        zIndex: 1000,
        selector: ''
    }

    Drag.prototype.TOOLS = function() {
        var that = this,
            options = this.options
        var tools = {
            createPlaceholder: function($item) {
                return $('<' + $item[0].nodeName + ' class="sortDragPlaceholder"/>').css({
                    width: $item.outerWidth() + 'px',
                    height: $item.outerHeight() + 'px',
                    marginTop: $item.css('marginTop'),
                    marginRight: $item.css('marginRight'),
                    marginBottom: $item.css('marginBottom'),
                    marginLeft: $item.css('marginLeft')
                });
            },
            getOverSortBox: function($item, e) {
                var itemPos = $item.position();
                var y = itemPos.top + ($item.height() / 2),
                    x = itemPos.left + ($item.width() / 2);

                function isOverAxis(x, reference, size) {
                    return (x > reference) && (x < (reference + size));
                }

                function isOver(y, x, top, left, height, width) {
                    return isOverAxis(y, top, height) && isOverAxis(x, left, width);
                }

                return $(options.sortBoxs).filter(':visible').filter(function() {
                    var $sortBox = $(this),
                        sortBoxPos = $sortBox.position(),
                        sortBoxH = $sortBox.height(),
                        sortBoxW = $sortBox.width();
                    return isOver(y, x, sortBoxPos.top, sortBoxPos.left, sortBoxH, sortBoxW);
                });
            }
        };
        return tools;
    }

    Drag.prototype.init = function() {
        var that = this
        var $element = this.$element
        var options = this.options

        $element.find(options.items).each(function(i) {
            var $item = $(this),
                $selector = $item;
            if ($item.data("bjui-item-drag")) return;
            else $item.data("bjui-item-drag", true)
            if (options.selector) {
                $selector = $item.find(options.selector).css({
                    cursor: options.cursor
                });
            }

            $selector.mousedown(function(event) {
                that.start($element, $item, event);

                event.preventDefault();
            });
        });
    }

    Drag.prototype.start = function($sortBox, $item, event) {
        var that = this,
            op = that.options;
        var callback = op.callback && op.callback.toFunc();
        var $placeholder;
        if ($item.data("$placeholder")) {
            $placeholder = $item.data("$placeholder");
        } else {
            $placeholder = this.tools.createPlaceholder($item);
            $item.data("$placeholder", $placeholder);
        }
        var $helper = $item.clone();
        var position = $item.position();
        $helper.addClass('sortDragHelper').css({
            position: 'absolute',
            top: position.top + $sortBox.scrollTop(),
            left: position.left,
            zIndex: op.zIndex,
            width: $item.width() + 'px',
            height: $item.height() + 'px'
        }).basedrag({
            selector: op.selector,
            move: op.move || 'vertical',
            drag: function(el, event) {
                var $helper = $(arguments[0]);
                var $items = $sortBox.find(op.items).filter(':visible').filter(':not(.sortDragPlaceholder, .sortDragHelper)');
                var helperPos = $helper.position(),
                    firstPos = $items.eq(0).position();
                var oldTop = parseInt($helper.css("top").replace("px", ""));
                $helper.css("top", oldTop + ($.CurrentDialog.find(".bjui-pageContent").scrollTop() || 0));
                var oldLeft = parseInt($helper.css("left").replace("px", ""));
                $helper.css("left", oldLeft + ($.CurrentDialog.find(".bjui-pageContent").scrollLeft() || 0));

                var $overBox = that.tools.getOverSortBox($helper, event);
                if ($overBox.length > 0 && $overBox[0] != $sortBox[0]) { //移动到其他容器
                    if (op.itemsParent) {
                        $placeholder.appendTo($overBox.find(op.itemsParent));
                    } else {
                        $placeholder.appendTo($overBox);
                    }
                    $sortBox = $overBox;
                } else {
                    for (var i = 0; i < $items.length; i++) {
                        var $this = $items.eq(i),
                            position = $this.position();

                        if (helperPos.top > position.top + 10) {
                            $this.after($placeholder);
                        } else if (helperPos.top <= position.top) {
                            $this.before($placeholder);
                            break;
                        }
                    }
                }
            },
            stop: function(el, event) {
                var $helper = $(arguments[0]);

                var position = $placeholder.position();
                $helper.animate({
                    top: (position.top + $sortBox.scrollTop()) + "px",
                    left: position.left + "px"
                }, {
                    complete: function() {
                        if (op.replace) { //2个sortBox之间替换处理
                            var $srcBox = $item.parents(op.sortBoxs + ":first");
                            var $destBox = $placeholder.parents(op.sortBoxs + ":first");
                            if ($srcBox[0] != $destBox[0]) { //判断是否移动到其他容器中
                                var $replaceItem = $placeholder.next();
                                if ($replaceItem.size() > 0) {
                                    $replaceItem.insertAfter($item);
                                }
                            }
                        }
                        var $srcParent = $item.parents(op.sortBoxs);
                        $item.insertAfter($placeholder).show();
                        $placeholder.remove();
                        $helper.remove();

                        if (callback) {
                            callback($item, $srcParent, $sortBox);
                        }
                    },
                    duration: 300
                });
            },
            event: event
        });

        $item.before($placeholder).before($helper).hide();
        return false;
    }

    // DRAG PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = arguments
        var property = option

        return this.each(function() {
            var $this = $(this)
            var options = $.extend({}, Drag.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var data = $this.data('bjui.drag')

            if (!data) $this.data('bjui.drag', (data = new Drag(this, options)))
            if (typeof property == 'string' && $.isFunction(data[property])) {
                [].shift.apply(args)
                if (!args) data[property]()
                else data[property].apply(data, args)
            } else {
                data.init()
            }
        })
    }

    var old = $.fn.drag

    $.fn.drag = Plugin
    $.fn.drag.Constructor = Drag

    // DRAG NO CONFLICT
    // =================

    $.fn.drag.noConflict = function() {
        $.fn.drag = old
        return this
    }

    // DRAG DATA-API
    // ==============

    $(document).on(BJUI.eventType.initUI, function(e) {
        var $this = $(e.target).find('[data-toggle="sortDrag"]');

        if (!$this.length) return;

        Plugin.call($this)

    });
}(jQuery);

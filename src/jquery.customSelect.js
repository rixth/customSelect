/*! customSelect: a jQuery UI widget to select items and ranges
    http://github.com/rixth/customSelect
*/

/*jshint browser: true, jquery: true, indent: 2, white: true, curly: true, forin: true, noarg: true, immed: true, newcap: true, noempty: true */

(function ($) {
  var openClass = 'ui-customSelect-open',
      disabledClass = 'ui-customRange-disabled',
      eventPrefix = 'customselect',
      focusEvent = eventPrefix + 'focus',
      blurEvent = eventPrefix + 'blur',
      disabledEvent = eventPrefix + 'disabled',
      enabledEvent = eventPrefix + 'enabled';
      
  $.widget("ui.customSelect", {
    options: {
      defaultValue: null,
      showCustom: false
    },
    _create: function () {
      var self = this,
          select = this.element,
          isMultipleSelect = select.attr('multiple'),
          root, rootHtml = [], rootId = select.attr('id') + '_customSelect',
          isOpen = false,
          idCounter = 0,
          selectWindow, selectList;
          
      if (!select.is('select')) {
        throw new TypeError("jquery.customSelect expects a <select> element.");
      }
      
      // Create the base HTML, the window and dropdown
      rootHtml.push('<div class="ui-customSelect">');
      rootHtml.push('  <div class="ui-customSelect-window">');
      rootHtml.push('    <div class="ui-customSelect-arrow ui-customSelect-downArrow">&#x25BC;</div>');
      rootHtml.push('    <div class="ui-customSelect-arrow ui-customSelect-upArrow">&#x25B2;</div>');
      rootHtml.push('  </div>');
      rootHtml.push('  <div class="ui-customSelect-dropdown"><ul></ul></div>');
      rootHtml.push('</div>');
      
      // Place ourselves 
      this.root = root = $(rootHtml.join('')).attr('id', rootId);
      select.hide().after(root);
      
      selectWindow = root.find('.ui-customSelect-window');
      selectList = root.find('ul');
            
      // Seed in the items from the select
      select.children().each(function () {
        var id = rootId + '_' + (idCounter++),
            label = '<label for="' + id + '">' + this.innerHTML + '</label>',
            input;
        if (isMultipleSelect) {
          input = '<input id="' + id + '" type="checkbox" value="' + this.value + '">';
        } else {
          input = '<input id="' + id + '" name="' + rootId + '_radio" type="radio" value="' + this.value + '">';
        }
        selectList.append('<li>' + input + ' ' + label + '</li>');
      });
    
      // Bind events
      selectWindow.click(function (event) {
        self._trigger(isOpen ? 'blur' : 'focus', event);
      });

      select.bind(focusEvent, function () {
        if (!root.hasClass(disabledClass)) {
          isOpen = true;
          root.addClass(openClass);

          // Close when a click is detected on something other than the widget
          $(document).bind('click.customRange', function (event) {
            if (!$.contains(root[0], event.target)) {
              self._trigger('blur');
              $(document).unbind('click.customRange');
            }
          });
        }
      }).bind(blurEvent, function () {
        isOpen = false;
        root.removeClass(openClass);
      }).bind(disabledEvent, function () {
        root.addClass(disabledClass);
        if (isOpen) {
          self._trigger('blur');
        }
      }).bind(enabledEvent, function () {
        root.removeClass(disabledClass);
      });
    },
    val: function () {
      // fetch the value
    },
    _setOption: function (name, value) {
      if (name === 'disabled') {
        this._trigger(value ? 'disabled' : 'enabled');
      }
    },
    _destroy: function () {
      $.Widget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
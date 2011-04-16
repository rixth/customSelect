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
      placeholder: 'Please select some items',
      showCustom: false
    },
    _create: function () {
      var self = this,
          select = this.element,
          root, rootHtml = [],
          isOpen = false;
          
      if (!select.is('select')) {
        throw new TypeError("jquery.customSelect expects a <select> element.");
      }
      
      self.isMultipleSelect = select.attr('multiple')
      self.rootId = select.attr('id') + '_customSelect'
      
      // Create the base HTML, the window and dropdown
      rootHtml.push('<div class="ui-customSelect">');
      rootHtml.push('  <div class="ui-customSelect-window"><span></span>');
      rootHtml.push('    <div class="ui-customSelect-arrow ui-customSelect-downArrow">&#x25BC;</div>');
      rootHtml.push('    <div class="ui-customSelect-arrow ui-customSelect-upArrow">&#x25B2;</div>');
      rootHtml.push('  </div>');
      rootHtml.push('  <div class="ui-customSelect-dropdown"><ul></ul></div>');
      rootHtml.push('</div>');
      
      // Place ourselves 
      this.root = root = $(rootHtml.join('')).attr('id', self.rootId);
      select.after(root).hide();
      
      this.window = root.find('.ui-customSelect-window span');
      this.list = root.find('ul');
            
      self.createItemsFromSelect();
      self.setWindowText();
    
      // Bind events
      self.window.parent().click(function (event) {
        self._trigger(isOpen ? 'blur' : 'focus', event);
      });
      
      root.delegate('li>input', 'change', function (event) {
        self.setWindowText();
        select.val(self.val()).trigger('change');
        self._trigger('change', event);
      });

      select.bind(focusEvent, function () {
        if (!root.hasClass(disabledClass)) {
          isOpen = true;
          root.addClass(openClass);

          // Close when a click is detected on something other than the widget
          $(document).bind('click.customRange' + self.rootId, function (event) {
            if (!$.contains(root[0], event.target)) {
              self._trigger('blur');
            }
            // TODO clicks on radios in single selecte
          });
        }
      }).bind(blurEvent, function () {
        $(document).unbind('click.customRange' + self.rootId);
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
      // TODO the setter
      var result = this.root.find('input:checked').map(function () {
        return this.value;
      }).toArray();
      return this.isMultipleSelect ? result : result[0];
    },
    friendlyVal: function () {
      return this.root.find('input:checked+label').map(function () {
        return this.innerHTML;
      }).toArray();
    },
    setWindowText: function () {
      var value = this.friendlyVal();
      this.window.html(value.length ? value.join(', ') : (this.options.placeholder || ''));
    },
    createItemsFromSelect: function () {
      var self = this,
          idCounter = 0;
      
      self.list.empty();
          
      this.element.children().each(function () {
        var element = this,
            id = self.rootId + '_' + (idCounter++),
            label = '<label for="' + id + '">' + element.innerHTML + '</label>',
            input;
        if (self.isMultipleSelect) {
          input = $('<input id="' + id + '" type="checkbox" value="' + element.value + '">');
        } else {
          input = $('<input id="' + id + '" name="' + self.rootId + '_radio" type="radio" value="' + element.value + '">');
        }
        
        if (element.selected) {
          input.attr('checked', true);
        }
        
        self.list.append($('<li></li>').append(input).append(' ').append(label));
      });
    },
    reload: function () {
      this.createItemsFromSelect();
    },
    _setOption: function (name, value) {
      if (name === 'disabled') {
        this._trigger((value ? 'dis' : 'en') + 'abled');
      }
    },
    destroy: function () {
      $.Widget.prototype.destroy.apply(this, arguments);
      $(document).unbind('click.customRange' + this.rootId);
      this.root.remove();
      this.element.show();
    }
  });
}(jQuery));
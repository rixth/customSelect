/*! customSelect: a jQuery UI widget to select items and ranges
    http://github.com/rixth/customSelect
*/

/*jshint browser: true, jquery: true, indent: 2, white: true, curly: true, forin: true, noarg: true, immed: true, newcap: true, noempty: true */

(function ($) {
  var openClass = 'ui-customSelect-open',
      disabledClass = 'ui-customRange-disabled',
      eventPrefix = 'customselect';
      
  $.widget("ui.customSelect", {
    options: {
      placeholder: 'Please select some items'
    },
    _create: function () {
      var self = this,
          select = this.element,
          root, rootHtml = [],
          isOpen = false;
          
      if (!select.is('select')) {
        throw new TypeError("jquery.customSelect expects a <select> element.");
      }
      
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
            
      self._createFromSelect();
      self._setWindowText();
    
      // Bind events
      self.window.parent().click(function (event) {
        self._trigger(isOpen ? 'blur' : 'focus', event);
      });
      
      root.delegate('li>input', 'change', function (event) {
        self._setWindowText();
        select.val(self.getVal()).trigger('change');
        self._trigger('change', event);
      });
      
      if ($.browser.msie && $.browser.version < 9) {
        $('input').bind('click', function (event) {
          this.checked = !this.checked;
          $(this).trigger('change');
        });
      }
      
      select.bind(eventPrefix + 'focus', function () {
        if (!root.hasClass(disabledClass)) {
          isOpen = true;
          root.addClass(openClass);

          // Close when a click is detected on something other than the widget
          $(document).bind('click.customRange' + self.rootId, function (event) {
            if (!$.contains(root[0], event.target)) {
              self._trigger('blur');
            }
          });
        }
      }).bind(eventPrefix + 'blur', function () {
        $(document).unbind('click.customRange' + self.rootId);
        isOpen = false;
        root.removeClass(openClass);
      }).bind(eventPrefix + 'disabled', function () {
        root.addClass(disabledClass);
        if (isOpen) {
          self._trigger('blur');
        }
      }).bind(eventPrefix + 'enabled', function () {
        root.removeClass(disabledClass);
      });
    },
    getVal: function () {
      var result = this.root.find('li>input:checked').map(function () {
        return this.value;
      }).toArray();
      return result.length ? result[this.isMultiple ? 'slice' : 'pop']() : (this.isMultiple ? [] : null);
    },
    friendlyVal: function () {
      return this.root.find('input:checked+label').map(function () {
        return this.innerHTML;
      }).toArray();
    },
    _setWindowText: function () {
      var value = this.friendlyVal();
      this.window.html(value.length ? value.join(', ') : (this.options.placeholder || ''));
    },
    _createFromSelect: function () {
      var self = this,
          idCounter = 0,
          list = self.list,
          insertionPoint = list.prev()[0] || list.parent();

      self.isMultiple = self.element.attr('multiple')
      list.empty();
          
      this.element.children().each(function () {
        var element = this,
            id = self.rootId + '_' + (idCounter++),
            label = '<label for="' + id + '">' + element.innerHTML + '</label>',
            input;
        if (self.isMultiple) {
          input = $('<input id="' + id + '" type="checkbox" value="' + element.value + '">');
        } else {
          input = $('<input id="' + id + '" name="' + self.rootId + '_radio" type="radio" value="' + element.value + '">');
        }

        list.append($('<li></li>').append(input).append(' ').append(label));
        
        // For some reason, this needs to happen after appending, otherwise
        // IE7 appears to "forget" the checked flag.
        if (element.selected) {
          input.attr('checked', true);
        }
      });
    },
    reload: function () {
      this._createFromSelect();
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
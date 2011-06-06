/*! customSelect: a jQuery UI widget to select items and ranges
    http://github.com/rixth/customSelect
*/

/*jshint browser: true, jquery: true, indent: 2, white: true, curly: true, forin: true, noarg: true, immed: true, newcap: true, noempty: true */

(function ($) {
  var openClass = 'ui-customSelect-open',
      disabledClass = 'ui-customRange-disabled',
      eventPrefix = 'customselect',
      createCustomRange;
      
  $.widget("ui.customSelect", {
    options: {
      placeholder: 'Please select some items',
      defaultValue: null,
      customRange: false,
      customRanges: null,
      windowFormatter: function (value) {
        return value;
      },
      customRangeHelper: function (min, max) {
        var value, display;

        if (min && max) {
          value = min + '-' + max;
          display = min == max ? min : (min + ' to ' + max);
        } else if (min && !max) {
          value = min + 'p';
          display = min + '+';
        } else if (!min && max) {
          value =  '0-' + max;
          display = '0 to ' + max;
        }
        
        return [value, display];
      },
      reverseRangeHelper: function (string) {
        if (string.match(/^\d+-\d+$/)) {
          return string.split('-');
        } else if (string.match(/^\d+p$/)) {
          return [string.match(/^(\d+)p$/)[1], ''];
        }
      }
    },
    _create: function () {
      var self = this,
          options = self.options,
          defaultValue = options.defaultValue,
          select = this.element,
          root, rootHtml,
          isOpen = false;
          
      if (!select.is('select')) {
        throw new TypeError("jquery.customSelect expects a <select> element.");
      }
      
      self.customValue = null;
      self.rootId = select.attr('id') + '_customSelect'
      
      // Create the base HTML, the window and dropdown
      rootHtml = [
        '<div class="ui-customSelect">',
        '  <div class="ui-customSelect-window"><span></span>',
        '    <div class="ui-customSelect-arrow ui-customSelect-downArrow">&#x25BC;</div>',
        '    <div class="ui-customSelect-arrow ui-customSelect-upArrow">&#x25B2;</div>',
        '  </div>',
        '  <div class="ui-customSelect-dropdown"><ul></ul></div>',
        '</div>'
      ];
      
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
        self._trigger('change', event, {
          element: this,
          value: this.value
        });
        $('.ui-customSelect-rangeContainer input').val('');
        $('.ui-customSelect-error').hide();
        self.customValue = null;
      });
            
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

      if (self.isMultiple && defaultValue) {
        function setDefaultItem() {
          if (!self.getVal().length) {
            self.list.find('input[value=' + defaultValue + ']').attr('checked', true).change();
          }
        };
        select.bind(eventPrefix + 'change', setDefaultItem);
        setDefaultItem();
      }
      
      if (!self.isMultiple && options.customRange && createCustomRange) {
        createCustomRange.call(self, root, this.list, options);
      }
    },
    setVal: function (value) {
      var existingOption = this.element.find('option[value=' + value + ']'),
          customRange;
      
      if (existingOption.length) {
        existingOption.attr('selected', true);
        this.reload();
        this._setWindowText();
      } else {
        customRange = this.options.reverseRangeHelper(value);
        this.root.find('.ui-customSelect-min').val(customRange[0]);
        this.root.find('.ui-customSelect-max').val(customRange[1]);
        setCustomRangeUI.apply(this, customRange);
      }
    },
    getVal: function () {
      if (this.customValue !== null) {
        return this.customValue;
      }
      
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
    _setWindowText: function (windowValue) {
      var value;
      if (!windowValue) {
        value = this.friendlyVal();
        windowValue = value.length ? value.join(', ') : this.options.placeholder;
      }
      this.window.html(this.options.windowFormatter(windowValue));
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
      // Remove all custom options
      this.element.find('option[data-custom]').remove();
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
  
  function setCustomRangeUI(min, max, event) {
    var self = this,
        formattingResult = self.options.customRangeHelper(min, max),
        option;
    
    self._setWindowText(formattingResult[1]);
    self.customValue = formattingResult[0];
    
    option = $('<option data-custom="true" value="' + formattingResult[0] + '">' + formattingResult[1] + '</option>');
    self.element.find('option[data-custom]').remove();
    self.element.append(option.attr('selected', true)).trigger('change', event);
    self._trigger('change', event);
    self.root.find('input:checked').attr('checked', false);
  }
  
  createCustomRange = function (root, list, options) {
    var customRangeHtml, errorDiv, minInput, maxInput,
        self = this;
    
    customRangeHtml = [
      '<div class="ui-customSelect-rangeContainer">',
      '  <input class="ui-customSelect-min" placeholder="min" /> to &nbsp;<input class="ui-customSelect-max" placeholder="max" />',
      '  <div style="display: none" class="ui-customSelect-error"></div>',
      '</div>'
    ];
    
    list.after($(customRangeHtml.join('')));
    minInput = root.find('.ui-customSelect-min');
    maxInput = root.find('.ui-customSelect-max');
    errorDiv = root.find('.ui-customSelect-error');
    
    function customRangeHandler(event) {
      var min = minInput.val(),
          max = maxInput.val(),
          rangeChangeData = {
            min: min,
            max: max,
            widget: self
          },
          formattingResult, option;
      
      if (isNaN(min) || isNaN(max)) {
        self.setCustomRangeError("Please enter only numbers.");
      } else {
        if (min && max && min > max) {
          self.setCustomRangeError("Min cannot be bigger than max.");
        } else {
          if (self._trigger('rangechange', event, rangeChangeData)) {
            $('.ui-customSelect-error').hide();
            setCustomRangeUI.call(self, min, max, event);
            self._trigger('blur');
          }
        }
      }
    }
    
    self.setCustomRangeError = function (error) {
      errorDiv.show().html(error);
    };
    
    if (options.customRanges) {
      minInput.val(options.customRanges.min);
      maxInput.val(options.customRanges.max);
      customRangeHandler();
    }

    minInput.add(maxInput).bind('keydown', function (event) {
      if (event.which === 13) {
        customRangeHandler(event);
      }
    });
  }
}(jQuery));
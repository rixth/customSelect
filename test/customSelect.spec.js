describe("customSelect", function () {
  var select,
      customSelect;
  
  beforeEach(function () {
    resetSingle();
  });
  
  afterEach(function () {
    destroy();
  });
  
  describe("interaction", function () {
    it("it should open and close upon mouse click", function () {
      clickWindow();
      expect(isOpen()).toBeTruthy();
      $('body').click();
      expect(isOpen()).toBeFalsy();
    });
    it("should not close when the click event is on the dropdown", function () {
      clickWindow();
      expect(isOpen()).toBeTruthy();
      customSelect.find('ul>li:first-child').click();
      expect(isOpen()).toBeTruthy();
    });
    it("should respect the enable and disable methods", function () {
      var blurCallback = jasmine.createSpy();
      
      select.bind('customselectblur', blurCallback);
      clickWindow();
      expect(isOpen()).toBeTruthy();
      select.customSelect("disable");
      expect(isOpen()).toBeFalsy(); // disabling should close the dropdown
      expect(blurCallback).toHaveBeenCalled(); // and it should fire a blur event since the dropdown was open
      
      clickWindow();
      expect(isOpen()).toBeFalsy(); // and a click shouldn't open it
      
      select.customSelect("enable");
      clickWindow();
      expect(isOpen()).toBeTruthy(); // can open now that it's enabled
    });
    it("should not fire a blur event if disabled when the dropdown is closed", function () {
      var blurCallback = jasmine.createSpy();
          
      select.bind('customselectblur', blurCallback);
      expect(isOpen()).toBeFalsy();
      select.customSelect("disable");
      expect(blurCallback).not.toHaveBeenCalled(); // and it should fire a blur event since the dropdown was open
    })
  });
  
  describe("events", function () {
    it("should fire a change event on the native select and customSelect", function () {
      var changeCallback = jasmine.createSpy(),
          itemCallback = jasmine.createSpy();
      
      select.bind('change', changeCallback);
      select.bind('customselectchange', changeCallback);
      select.bind('customselectchange', itemCallback);
      
      clickWindow();
      customSelect.find('ul>li:nth-child(2) input').attr('checked', true).change();
      
      expect(changeCallback.callCount).toBe(2);
      expect(itemCallback).toHaveBeenCalledWith(jasmine.any(Object), {
        element: jasmine.any(Object),
        value: "1p"
      });
    });
    it("should fire a focus and blur event", function () {
      var blurCallback = jasmine.createSpy(),
          focusCallback = jasmine.createSpy();

      select.bind('customselectblur', blurCallback);
      select.bind('customselectfocus', focusCallback);
      
      clickWindow();
      expect(focusCallback).toHaveBeenCalled();
      clickWindow();
      expect(blurCallback).toHaveBeenCalled();
    });
    it("should fire a blur event when the dropdown is open and something else is clicked", function () {
      var blurCallback = jasmine.createSpy();
      
      clickWindow();
      select.bind('customselectblur', blurCallback);
      $('body').click();
      expect(isOpen()).toBeFalsy();
      expect(blurCallback).toHaveBeenCalled();
    });
  });
  
  describe("single select mode", function () {
    describe("creation", function () {
      it("should create a series of radio buttons for a select element", function () {
        var selectOptions = select.children('option').map(function () {
              return this.value;
            }).toArray(),
            customSelectOptions = customSelect.find('input[type=radio]').map(function () {
              return this.value;
            }).toArray();

        expect(customSelectOptions).toEqual(selectOptions);
      });
      it("should select whatever was initially selected in the native select", function () {
        expect(select.val()).toEqual(select.customSelect("getVal"));
      });
      it("should put the default item text in the window", function () {
        expect(windowText()).toBe(select.children().eq(1).html());
      });
    });
    describe("interaction", function () {
      it("should place the selected value in the window", function () {
        var selectedItem = customSelect.find('li:nth-child(3)>input').attr('checked', true).change();
        expect(windowText()).toBe(selectedItem.next().html());
      });
      it("should run the window value through the formatter", function () {
        destroy();
        resetSingle({
          windowFormatter: function (value) {
            return 'LOLBUTTS-' + value;
          }
        });
        
        expect(select.val()).toBe('1p');
        expect(windowText()).toBe('LOLBUTTS-1+');
      });
    });
    describe("value", function () {
      it("the value can be retrieved in an array by calling val/getVal on the native or custom select", function () {
        expect(select.val()).toEqual('1p');
        expect(select.customSelect("getVal")).toEqual('1p');
        
        customSelect.find('li>input').eq(2).attr('checked', true).change();
        expect(select.val()).toEqual('2p');
        expect(select.customSelect("getVal")).toEqual('2p');        
      });
      
      it("should be possible to programattically set a value", function () {
        select.customSelect("setVal", '2p');
        expect(select.customSelect("getVal")).toEqual('2p');
        expect(windowText()).toBe('2+');
      });
    });
    
    it("should be possible to remove options from the list", function () {
      select.children().eq(1).remove();
      select.customSelect("reload");
      
      var selectOptions = select.children('option').map(function () {
            return this.value;
          }).toArray(),
          customSelectOptions = customSelect.find('input[type=radio]').map(function () {
            return this.value;
          }).toArray();

      expect(customSelectOptions).toEqual(selectOptions);
    });
    
    it("should be possible to add options to the list", function () {
      select.append('<option name="10p">10+</option>');
      select.customSelect("reload");
      
      var selectOptions = select.children('option').map(function () {
            return this.value;
          }).toArray(),
          customSelectOptions = customSelect.find('input[type=radio]').map(function () {
            return this.value;
          }).toArray();

      expect(customSelectOptions).toEqual(selectOptions);
    });
  });

  describe("multi select mode", function () {
    beforeEach(function () {
      destroy();
      resetMultipleSelected(); // make a multiple select
    });
    
    describe("creation", function () {
      it("should create a series of checkboxes for a select=multiple element", function () {
        var selectOptions = select.children('option').map(function () {
              return this.value;
            }).toArray(),
            customSelectOptions = customSelect.find('input[type=checkbox]').map(function () {
              return this.value;
            }).toArray();

        expect(customSelectOptions).toEqual(selectOptions);
      });
      it("should select whatever was initially selected in the native select", function () {
        expect(select.val()).toEqual(select.customSelect("getVal"));
      });
      it("should display the placeholder text if no items were selected at creation", function () {
        destroy();
        resetMultipleNoneSelected();
        expect(windowText()).toBe('Please select some items');
      });
      it("should display the default item if no items were selected at creation", function () {
        destroy();
        resetMultipleNoneSelected({
          defaultValue: '2p'
        });
        expect(windowText()).toBe('2+');
        expect(select.val()).toEqual(['2p']);
      });
    });
    describe("interaction", function () {
      it("should display placeholder text if all items were unchecked", function () {
        customSelect.find('li>input:checked').attr('checked', false).change();
        expect(windowText()).toBe('Please select some items');
      });
      it("should default to a certain value if all items were unchecked", function () {
        destroy();
        resetMultipleSelected({
          defaultValue: '2p'
        });
        
        customSelect.find('li>input:checked').attr('checked', false).change();
        expect(select.val()).toEqual(['2p']);
        expect(select.customSelect("getVal")).toEqual(['2p']);        
      });
      it("should place a comma separated list of selected items in the window", function () {
        expect(windowText()).toBe('1+, 3+');
        customSelect.find('li>input:checked').eq(1).attr('checked', false).change();
        expect(windowText()).toBe('1+');
      });
    });
    describe("value", function () {
      it("the value can be retrieved in an array by calling val/getVal on the native or custom select", function () {
        var expectedValue = ['1p', '3p'];
        
        expect(select.val()).toEqual(expectedValue);
        expect(select.customSelect("getVal")).toEqual(expectedValue);
        
        customSelect.find('li>input:checked').eq(1).attr('checked', false).change();
        expect(select.val()).toEqual(['1p']);
        expect(select.customSelect("getVal")).toEqual(['1p']);        
      });
    });
    
    it("should be possible to remove options from the list", function () {
      select.children().eq(1).remove();
      select.customSelect("reload");
      
      var selectOptions = select.children('option').map(function () {
            return this.value;
          }).toArray(),
          customSelectOptions = customSelect.find('input[type=checkbox]').map(function () {
            return this.value;
          }).toArray();

      expect(customSelectOptions).toEqual(selectOptions);
    });
    
    it("should be possible to add options to the list", function () {
      select.append('<option name="10p">10+</option>');
      select.customSelect("reload");
      
      var selectOptions = select.children('option').map(function () {
            return this.value;
          }).toArray(),
          customSelectOptions = customSelect.find('input[type=checkbox]').map(function () {
            return this.value;
          }).toArray();

      expect(customSelectOptions).toEqual(selectOptions);
    });
  });
  
  describe("custom range", function () {
    beforeEach(function () {
      destroy();
      resetSingle({
        customRange: true
      });
    });
    describe("creation", function () {
      it("should create a custom mix/max inputs when the option is specified", function () {
        expect(customSelect).toContain('.ui-customSelect-rangeContainer');
      });
      it("should not create mix/max inputs for a multiple select", function () {
        destroy();
        resetMultipleSelected({
          customRange: true
        });
        expect(customSelect).not.toContain('.ui-customSelect-rangeContainer');
      });
      it("should load the starting custom values if they are provided and display them in the window", function () {
        destroy();
        resetSingle({
          customRange: true,
          customRanges: {
            min: 1,
            max: 10
          }
        });
        
        expect(windowText()).toBe('1 to 10');
        expect(select.val()).toBe('1-10');
      });
    });
    describe("events", function () {
      it("should fire data validation callbacks", function () {
        var callback = jasmine.createSpy();
                
        select.bind('customselectrangechange', callback);
        
        fillValues(1, 10);
        rangeSubmit();
        
        expect(callback).toHaveBeenCalledWith(jasmine.any(Object), { min: '1', max: '10', widget: jasmine.any(Object)});
      });
      it("should fire change events on the native select", function () {
        var callback = jasmine.createSpy();
                
        select.bind('change', callback);
        
        fillValues(1, 10);
        rangeSubmit();
        
        expect(callback).toHaveBeenCalled()
      });
    });
    describe("interaction", function () {
      it("should submit the custom values upon pressing enter", function () {      
        fillValues(1, 10);
        rangeSubmit();
        expect(select.val()).toBe('1-10');
      });
      it("should pass the selected range through helper, returning the value and display value", function () {
        destroy();
        resetSingle({
          customRange: true,
          customRangeHelper: function(){
            return ['dataValue', 'displayValue'];
          }
        });
        fillValues(1, 10);
        rangeSubmit();
        expect(select.val()).toBe('dataValue');
        expect(windowText()).toBe('displayValue');
      });
      it("should place the range in the window", function () {
        fillValues(1, 10);
        rangeSubmit();
        expect(windowText()).toBe('1 to 10');
      });
      it("should uncheck all the radio boxes", function () {
        var selectedItem = customSelect.find('li:nth-child(3)>input').attr('checked', true).change();
        
        expect(selectedItem).toBeChecked();
        fillValues(1, 10);
        rangeSubmit();
        expect(selectedItem).not.toBeChecked();
        expect(customSelect.find('input:checked')).not.toExist();
      });
      it("should not allow min to be bigger than max", function () {
        expect(select.val()).toBe('1p');
        fillValues(10, 1);
        rangeSubmit();
        expect(select.val()).toBe('1p');
        expect(customSelect.find('.ui-customSelect-error')).toBeVisible();
      });
      it("should hide error messages after a successful range", function () {
        expect(select.val()).toBe('1p');
        fillValues(10, 1);
        rangeSubmit();
        expect(select.val()).toBe('1p');
        expect(customSelect.find('.ui-customSelect-error')).toBeVisible();
        fillValues(1, 10);
        rangeSubmit();
        expect(select.val()).toBe('1-10');
        expect(customSelect.find('.ui-customSelect-error')).not.toBeVisible();        
      });
      it("should show error messages from the data validation handlers", function () {                
        select.bind('customselectrangechange', function (event, data) {
          data.widget.setCustomValueError("LOLWUT");
          return false;
        });
        
        fillValues(1, 10);
        rangeSubmit();
        
        expect(customSelect.find('.ui-customSelect-error')).toBeVisible();
      });
      it("should have sane data and display values for various use cases", function () {
        // min and max set
        fillValues(1, 10);
        rangeSubmit();
        expect(select.val()).toBe('1-10');
        expect(windowText()).toBe('1 to 10');
        
        // min set, max not
        fillValues(100, '');
        rangeSubmit();
        expect(select.val()).toBe('100p');
        expect(windowText()).toBe('100+');
        
        // max set, min not,
        fillValues('', 100);
        rangeSubmit();
        expect(select.val()).toBe('0-100');
        expect(windowText()).toBe('0 to 100');
        
        // min == max
        fillValues(100, 100);
        rangeSubmit();
        expect(select.val()).toBe('100-100');
        expect(windowText()).toBe('100');
      });
    });
    describe("value", function () {
      it("should create an option in the native select with the custom data attribute and select it", function () {
        fillValues(1, 10);
        rangeSubmit();
        
        var newOption = select.find('option[data-custom]:last-child');
        expect(newOption).toExist();
        expect(newOption).toHaveValue("1-10");
      });
      it("calling val() on the native select should retrieve our custom value", function () {
        fillValues(1, 10);
        rangeSubmit();
        expect(select.val()).toBe("1-10");
      });
      it("calling getVal on the custom select should retrieve our custom value", function () {
        fillValues(1, 10);
        rangeSubmit();
        expect(select.customSelect("getVal")).toBe("1-10");        
      });
      it("should be possible to programattically set a custom range", function () {
        select.customSelect("setVal", '2-3');
        expect(select.customSelect("getVal")).toEqual('2-3')
        
        expect(customSelect.find('.ui-customSelect-min').val()).toBe('2');
        expect(customSelect.find('.ui-customSelect-max').val()).toBe('3');
        expect(windowText()).toBe('2 to 3');
      });
    });
    
    /**
     * Custom range test helpers
     */
    function fillValues(min, max) {
      $('.ui-customSelect-min').val(min);
      $('.ui-customSelect-max').val(max);
    }
    
    function rangeSubmit() {
      var event = $.Event('keydown');
      event.which = 13;
      $('.ui-customSelect-min').trigger(event);
    };
  });
  
  describe("custom value", function () {
    beforeEach(function () {
      destroy();
      resetSingle({
        customValue: true
      });
    });
    describe("creation", function () {
      it("should create a custom value input when the option is specified", function () {
        expect(customSelect).toContain('.ui-customSelect-customValue');
      });
      it("should not create custom input for a multiple select", function () {
        destroy();
        resetMultipleSelected({
          customValue: true
        });
        expect(customSelect).not.toContain('.ui-customSelect-customValue');
      });
      it("should load the starting custom value if it is provided and display them in the window and input", function () {
        destroy();
        resetSingle({
          customValue: 123
        });
        
        expect(windowText()).toBe('123');
        expect(select.val()).toBe('123');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('123');
      });
    });
    describe("events", function () {
      it("should fire data validation callbacks", function () {
        var callback = jasmine.createSpy();
                
        select.bind('customselectcustomvaluechange', callback);
        
        fillValue("123");
        valueSubmit();
        
        expect(callback).toHaveBeenCalledWith(jasmine.any(Object), { value: "123", widget: jasmine.any(Object)});
      });
      it("should fire change events on the native select", function () {
        var callback = jasmine.createSpy();
                
        select.bind('change', callback);
        
        fillValue("123");
        valueSubmit();
        
        expect(callback).toHaveBeenCalled()
      });
    });
    describe("interaction", function () {
      it("should submit the custom value upon pressing enter", function () {      
        fillValue("123");
        valueSubmit();
        expect(select.val()).toBe('123');
      });
      it("should place the value in the window", function () {
        fillValue("123");
        valueSubmit();
        expect(windowText()).toBe('123');
      });
      it("should uncheck all the radio boxes", function () {
        var selectedItem = customSelect.find('li:nth-child(3)>input').attr('checked', true).change();
        
        expect(selectedItem).toBeChecked();
        fillValue("123");
        valueSubmit();
        expect(selectedItem).not.toBeChecked();
        expect(customSelect.find('input:checked')).not.toExist();
      });
      it("should hide error messages after a successful value", function () {
        select.bind('customselectcustomvaluechange', function (event, ui) {
          if (ui.value == 456) {
            ui.widget.setCustomValueError('LOLBUTS');
            return false;
          }
        });
        
        // customvaluechange
        expect(select.val()).toBe('1p');
        fillValue(456);
        valueSubmit();
        expect(select.val()).toBe('1p');
        expect(customSelect.find('.ui-customSelect-error')).toBeVisible();
        fillValue(123);
        valueSubmit();
        expect(select.val()).toBe('123');
        expect(customSelect.find('.ui-customSelect-error')).not.toBeVisible();        
      });
      it("should show error messages from the data validation handlers", function () {                
        select.bind('customselectcustomvaluechange', function (event, data) {
          data.widget.setCustomValueError("LOLWUT");
          return false;
        });
        
        fillValue(123);
        valueSubmit();
        
        expect(customSelect.find('.ui-customSelect-error')).toBeVisible();
      });
    });
    describe("value", function () {
      it("should create an option in the native select with the custom data attribute and select it", function () {
        fillValue(123);
        valueSubmit();
        
        var newOption = select.find('option[data-custom]:last-child');
        expect(newOption).toExist();
        expect(newOption).toHaveValue("123");
      });
      it("calling val() on the native select should retrieve our custom value", function () {
        fillValue(123);
        valueSubmit();
        expect(select.val()).toBe("123");
      });
      it("calling getVal on the custom select should retrieve our custom value", function () {
        fillValue(123);
        valueSubmit();
        expect(select.customSelect("getVal")).toBe("123");
      });
      it("should be possible to programattically set a custom range", function () {
        select.customSelect("setVal", '123');
        expect(select.customSelect("getVal")).toEqual('123');
        
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('123');
        expect(windowText()).toBe('123');
      });
      it("should not freak out when setting the custom value multiple times", function () {
        // Set the value & verify
        select.customSelect("setVal", '123');
        expect(select.customSelect("getVal")).toEqual('123');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('123');
        expect(windowText()).toBe('123');
        
        // Set the custom value to the same amount again & verify
        select.customSelect("setVal", '123');
        expect(select.customSelect("getVal")).toEqual('123');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('123');
        expect(windowText()).toBe('123');
        
        // Switch back to one of the defaults & verify
        select.customSelect("setVal", '1p');
        expect(select.customSelect("getVal")).toEqual('1p');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('');
        expect(windowText()).toBe('1+');
      });
      it("should play nice when switching between custom and default types", function () {
        // Click the default, make sure the custom input is blank
        customSelect.find('li:nth-child(2)>input').attr('checked', true).change();
        expect(select.customSelect("getVal")).toEqual('1p');
        expect(select.val()).toEqual('1p');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('');
        expect(windowText()).toBe('1+');

        // Programatically set a custom value & verify
        select.customSelect("setVal", '123');
        expect(select.customSelect("getVal")).toEqual('123');
        expect(select.val()).toEqual('123');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('123');
        expect(windowText()).toBe('123');
        
        // Click the default, make sure the custom input is blank
        customSelect.find('li:nth-child(2)>input').attr('checked', true).change();
        expect(select.customSelect("getVal")).toEqual('1p');
        expect(select.val()).toEqual('1p');
        expect(customSelect.find('.ui-customSelect-customValue').val()).toBe('');
        expect(windowText()).toBe('1+');
      });
    });
    
    /**
     * Custom range test helpers
     */
    function fillValue(val) {
      $('.ui-customSelect-customValue').val(val);
    }
    
    function valueSubmit() {
      var event = $.Event('keydown');
      event.which = 13;
      $('.ui-customSelect-customValue').trigger(event);
    };
  });
  
  it("should hide the native select upon creation", function () {
    expect($('#select').is(':visible')).toBeFalsy();
  });
  
  it("should show the native select upon destruction", function () {
    destroy();
    expect($('#select').is(':visible')).toBeTruthy();
  });
  
  /**
   * Test helpers
   */
   
  function resetSingle(options) {
    setFixtures('<select id="select"><option value="">Any</option><option selected value="1p">1+</option><option value="2p">2+</option><option value="3p">3+</option></select>');
    select = $('#select').customSelect(options || {});
    customSelect = $('#select_customSelect');
  }
  
  function resetMultipleSelected(options) {
    setFixtures('<select multiple id="select"><option value="">Any</option><option selected value="1p">1+</option><option value="2p">2+</option><option selected value="3p">3+</option></select>');
    select = $('#select').customSelect(options || {});
    customSelect = $('#select_customSelect');
  }

  function resetMultipleNoneSelected(options) {
    setFixtures('<select multiple id="select"><option value="">Any</option><option value="1p">1+</option><option value="2p">2+</option><option value="3p">3+</option></select>');
    select = $('#select').customSelect(options || {});
    customSelect = $('#select_customSelect');
  }
  
  
  function destroy() {
    $('select').customSelect('destroy');
  }
   
  function clickWindow() {
    customSelect.find('.ui-customSelect-window').click();
  }

  function isOpen() {
    return customSelect.hasClass('ui-customSelect-open');
  }
  
  function windowText() {
    return customSelect.find('.ui-customSelect-window span').html()
  }
});
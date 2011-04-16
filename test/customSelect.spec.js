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
      var changeCallback = jasmine.createSpy();
      
      select.bind('change', changeCallback);
      select.bind('customselectchange', changeCallback);
      
      clickWindow();
      customSelect.find('ul>li:first-child input').click();
      
      expect(changeCallback.callCount).toBe(2);
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
        expect(select.val()).toEqual(select.customSelect("val"));
      });
      it("should put the default item text in the window", function () {
        expect(placeholderText()).toBe(select.children().eq(1).html());
      });
    });
    describe("interaction", function () {
      it("should place the selected value in the window", function () {
        var selectedItem = customSelect.find('li:nth-child(3)>input').click();
        expect(placeholderText()).toBe(selectedItem.next().html());
      });
    });
    describe("value", function () {
      it("the value can be retrieved in an array by calling val on the native or custom select", function () {
        expect(select.val()).toEqual('1p');
        expect(select.customSelect("val")).toEqual('1p');
        
        customSelect.find('li>input').eq(2).click();
        expect(select.val()).toEqual('2p');
        expect(select.customSelect("val")).toEqual('2p');        
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
      select.append('<option name="10p">10+</option');
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
        expect(select.val()).toEqual(select.customSelect("val"));
      });
      it("should display the placeholder text if no items were selected at creation", function () {
        destroy();
        resetMultipleNoneSelected();
        expect(placeholderText()).toBe('Please select some items');
      });
    });
    describe("interaction", function () {
      it("should display placeholder text if all items were unchecked", function () {
        customSelect.find('li>input:checked').click();
        expect(placeholderText()).toBe('Please select some items');
      });
      it("should place a comma separated list of selected items in the window", function () {
        expect(placeholderText()).toBe('1+, 3+');
        customSelect.find('li>input:checked').eq(1).click();
        expect(placeholderText()).toBe('1+');
      });
    });
    describe("value", function () {
      it("the value can be retrieved in an array by calling val on the native or custom select", function () {
        var expectedValue = ['1p', '3p'];
        
        expect(select.val()).toEqual(expectedValue);
        expect(select.customSelect("val")).toEqual(expectedValue);
        
        customSelect.find('li>input:checked').eq(1).click();
        expect(select.val()).toEqual(['1p']);
        expect(select.customSelect("val")).toEqual(['1p']);        
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
      select.append('<option name="10p">10+</option');
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
  
  xdescribe("custom range", function () {
    describe("creation", function () {
      it("should create a custom mix/max inputs when the option is specified", function () {
        
      });
    });
    describe("events", function () {
      it("should fire data validation callbacks", function () {

      });
    })
    it("should not allow min to be bigger than max", function () {
      
    });
    it("should pass the selected range through a formatting helper", function () {
      
    });
    it("should place the range in the window", function () {
      
    });
    describe("value", function () {
      it("when setting a value, it should set the min/max inputs if the value does not exist", function () {

      });
    });
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
   
  function resetSingle() {
    setFixtures('<select id="select"><option value="">Any</option><option selected value="1p">1+</option><option value="2p">2+</option><option value="3p">3+</option></select>');
    select = $('#select').customSelect();
    customSelect = $('#select_customSelect');
  }
  
  function resetMultipleSelected() {
    setFixtures('<select multiple id="select"><option value="">Any</option><option selected value="1p">1+</option><option value="2p">2+</option><option selected value="3p">3+</option></select>');
    select = $('#select').customSelect();
    customSelect = $('#select_customSelect');
  }

  function resetMultipleNoneSelected() {
    setFixtures('<select multiple id="select"><option value="">Any</option><option value="1p">1+</option><option value="2p">2+</option><option value="3p">3+</option></select>');
    select = $('#select').customSelect();
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
  
  function placeholderText() {
    return customSelect.find('.ui-customSelect-window span').html()
  }
});
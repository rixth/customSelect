
    
describe("customSelect", function () {
  var select,
      customSelect;
  
  beforeEach(function() {
    reset();
  });
        
  describe("creation", function () {
    it("should put placeholder text in the window", function () {
      
    });
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
    it("should fire a change event", function () {
      
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
      expect(blurCallback).toHaveBeenCalled();
    });
  });
  
  describe("single select mode", function () {
    describe("creation", function () {
      it("should create a series of radio buttons for a select element", function () {

      });
      it("should select the first item by default unless otherwise specified", function () {
        
      });
    });
    
    describe("interaction", function () {
      it("should place the selected value in the window", function () {
        
      });
    });
  });

  describe("multi select mode", function () {
    describe("creation", function () {
      it("should create a series of checkboxes for a select=multiple element", function () {

      });
    });
    describe("interaction", function () {
      it("should display placeholder text if all items were unchecked", function () {
      
      });
      it("should place a comma separated list of selected items in the window", function () {
      
      });
    });
  });
  
  describe("custom range", function () {
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
  });

  describe("value", function () {
    it("should be possible to inject values in to the set list", function () {
      
    });
    it("should be possible to remove values from the set list", function () {
      
    });
    it("should set an existing checkbox/radio if the set value already exists", function () {
      
    });
    it("should set the min/max inputs if the value does not exist", function () {
      
    });
    it("should manipulate the options of the underlying select", function () {
      
    });
  });
  
  /**
   * Test helpers
   */
   
  function reset(multiple) {
    setFixtures('<select ' + (multiple ? 'multiple ' : '') + 'id="select"><option value="">Any</option><option value="1p">1+</option><option value="2p">2+</option><option value="3p">3+</option></select>');
    select = $('#select').customSelect();
    customSelect = $('#select_customSelect');
  }
   
  function clickWindow() {
    customSelect.find('.ui-customSelect-window').click();
  }

  function isOpen() {
    return customSelect.hasClass('ui-customSelect-open');
  }
});
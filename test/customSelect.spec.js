describe("customSelect", function () {
  describe("creation", function () {
    it("should put placeholder text in the window", function () {
      
    });
  });
  
  describe("events", function () {
    it("should fire an open and close event", function () {
      
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
  });
  
  describe("events", function () {
    it("should fire events on the original select element", function () {
      
    });
    it("should fire data validation callbacks", function () {
      
    });
    it("should fire a change event", function () {
      
    });
  });
});
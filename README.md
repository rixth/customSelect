# jquery.customSelect

A simple jQuery UI widget to pretty up select elements. There is a full suite of unit tests available in test/, written with Jasmine. You can see an example and run the tests on the [plugin's website](http://rixth.github.com/customSelect/).

It works by setting the values back in your original select, so you can call the standard jQuery val methods, bind to the change event, etc right on the native element. This is just a presentation layer. It does have its own events too, however.

## HTML structure required

    <select id="singleSelect">
      <option value="cola">A glass of cola</option>
      <option selected value="lemonade">A class of lemonade</option>
      <option value="tea">A cup of tea</option>
    </select>
    
That's it! It also supports multi-select inputs, in which case it'll use checkboxes rather than radio inputs.

To make it go, all you need to do is:

    $('#singleSelect').customSelect();
    
Sample CSS has been provided for you in src/jquery.customSelect.css. There's lots of classes so it shouldn't be too tricky for you to get it to look how you want.

## Options

* placeholder (*default: Please select some items*): if you're using a multiple select and no options are selected, this is the text that is shown

## Methods

These are the methods on the widget, call them like so

    $('#yourSelect').customSelect(methodName)

* val: fetch the widget's value (it's a string for a single select, or an array for a multi select). You should probably just call .val() directly on your native browser select.
* friendlyVal: return the display value (or array of values) that the user actually selects from, rather than the value="" attribute
* reload: if you want to add or remove items in the widget, manipulate the native browser select then call this method. It'll refresh the items that appear in the dropdown.
* destroy: remove the pretty widget, unbind events and show the original select
* disable: disable the widget, close the popup if it is open, do not allow it to be opened
* enable: allow interaction with the widget after disabling it

## Events

As noted above, you can also bind to the standard events on the select.

* change: fired whenever the user changes any of the inputs in the dropdown
* focus: fired when the dropdown is opened
* blur: fired when the dropdown loses focus (and is closed)
* disabled: fired when the widget is disabled
* enabled: fired when the widget is enabled
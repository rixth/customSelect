/*
Knockout Binding Handler:
usage: 
<select id="testselect" data-bind="
            options: testOptions, 
            optionsText: 'testName', 
            optionsValue: 'id', 
            customselect: testValueName, 
            customselectOptions: { placeholder: 'Please select value'}
"></select>

*/
ko.bindingHandlers.customselect = {
    init: function (element, valueAccessor, allBindingsAccessor) {

        var options = allBindingsAccessor().customselectOptions || {};

        var onChange = function () {
            var observable = valueAccessor();
            observable($(element).customSelect("getVal"));
        };
        options.change = onChange;
        $(element).customSelect(options);
        ko.utils.registerEventHandler(element, "change", onChange);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).customSelect("destroy");
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).customSelect("setVal", value);

    }
};

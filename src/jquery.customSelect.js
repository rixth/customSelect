/*! customSelect: a jQuery UI widget to select items and ranges
    http://github.com/rixth/customSelect
*/

/*jshint browser: true, jquery: true, indent: 2, white: true, curly: true, forin: true, noarg: true, immed: true, newcap: true, noempty: true */

(function ($) {
  $.widget("ui.customSelect", {
    options: {
    },
    _create: function () {
      var self = this;
    },
    _destroy: function () {
      $.Widget.prototype.destroy.apply(this, arguments);
    }
  });
}(jQuery));
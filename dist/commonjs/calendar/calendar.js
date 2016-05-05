'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTemplating = require('aurelia-templating');

var _commonWidgetBase = require('../common/widget-base');

var _commonDecorators = require('../common/decorators');

var _commonConstants = require('../common/constants');

require('kendo.calendar.min');

var Calendar = (function () {
  function Calendar(element, widgetBase, viewResources) {
    _classCallCheck(this, _Calendar);

    this.element = element;
    this.widgetBase = widgetBase.control('kendoCalendar').linkViewModel(this).useValueBinding();
  }

  Calendar.prototype.bind = function bind(ctx) {
    this.$parent = ctx;
  };

  Calendar.prototype.attached = function attached() {
    this.recreate();
  };

  Calendar.prototype.recreate = function recreate() {
    this.kWidget = this.widgetBase.createWidget({
      element: this.element,
      parentCtx: this.$parent
    });
  };

  Calendar.prototype.propertyChanged = function propertyChanged(property, newValue, oldValue) {
    this.widgetBase.handlePropertyChanged(this.kWidget, property, newValue, oldValue);
  };

  Calendar.prototype.detached = function detached() {
    this.widgetBase.destroy(this.kWidget);
  };

  var _Calendar = Calendar;
  Calendar = _aureliaDependencyInjection.inject(Element, _commonWidgetBase.WidgetBase)(Calendar) || Calendar;
  Calendar = _commonDecorators.generateBindables('kendoCalendar')(Calendar) || Calendar;
  Calendar = _aureliaTemplating.customElement(_commonConstants.constants.elementPrefix + 'calendar')(Calendar) || Calendar;
  return Calendar;
})();

exports.Calendar = Calendar;
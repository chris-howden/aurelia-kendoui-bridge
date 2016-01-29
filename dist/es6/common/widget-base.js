import {pruneOptions} from './options';
import {fireKendoEvent} from './events';
import {getEventsFromAttributes, _hyphenate, getBindablePropertyName} from './util';
import {TemplateCompiler} from './template-compiler';
import {inject, transient} from 'aurelia-dependency-injection';
import {TaskQueue} from 'aurelia-task-queue';

/**
* Abstraction of commonly used code across wrappers
*/
@transient()
@inject(TaskQueue, TemplateCompiler)
export class WidgetBase {

  /**
  * The element of the custom element, or the element on which a custom attribute
  * is placed. DOM events will be raised on this element
  */
  element: Element;

  /**
  * Used to prevent race conditions when events are raised before
  * all bindings have been updated.
  */
  taskQueue: TaskQueue;

  /**
  * The element on which a Kendo widget is initialized
  * This is the "element" by default
  */
  target: Element;

  /**
  * The Kendo control's name, such as kendoGrid or kendoButton
  */
  controlName: string;

  /**
  * The parent context (used for template compilation)
  */
  $parent: any;

  /**
  * The widgets parent viewmodel (this is the object instance the user will bind to)
  */
  viewModel: any;

  /**
  * The constructor of a Kendo control
  */
  ctor: any;

  constructor(taskQueue, templateCompiler) {
    this.taskQueue = taskQueue;
    templateCompiler.initialize();
  }

  control(controlName) {
    if (!controlName || !jQuery.fn[controlName]) {
      throw new Error(`The name of control ${controlName} is invalid or not set`);
    }

    this.controlName = controlName;

    let ctor = jQuery.fn[this.controlName];
    this.kendoOptions = ctor.widget.prototype.options;
    this.kendoEvents = ctor.widget.prototype.events;

    return this;
  }

  linkViewModel(viewModel) {
    if (!viewModel) {
      throw new Error('viewModel is not set');
    }

    this.viewModel = viewModel;

    return this;
  }

  /**
  * collects all options objects
  * calls all hooks
  * then initialized the Kendo control as "widget"
  */
  createWidget(options) {
    if (!options) {
      throw new Error('the createWidget() function needs to be called with an object');
    }

    if (!options.element) {
      throw new Error('element is not set');
    }

    if (!options.parentCtx) {
      throw new Error('parentCtx is not set');
    }

    // generate all options, including event handlers
    let allOptions = this._getOptions(options.element);

    // before initialization callback
    // allows you to modify/add/remove options before the control gets initialized
    if (options.beforeInitialize) {
      options.beforeInitialize(allOptions);
    }

    // add parent context to options
    // deepExtend in kendo.core will fail with stack
    // overflow if we don't put it in an array :-\
    Object.assign(allOptions, { _$parent: [options.parentCtx] });

    // instantiate the Kendo control
    let widget = jQuery(options.element)[this.controlName](allOptions).data(this.controlName);

    widget._$parent = options.parentCtx;

    if (options.afterInitialize) {
      options.afterInitialize();
    }

    return widget;
  }


  /**
  * combines all options objects and properties into a single options object
  */
  _getOptions(element) {
    let options = this.getOptionsFromBindables();
    let eventOptions = this.getEventOptions(element);

    // merge all option objects together
    // - options on the wrapper
    // - options compiled from all the bindable properties
    // - event handler options
    return Object.assign({}, this.viewModel.options, pruneOptions(options), eventOptions);
  }

  /**
  * loops through all bindable properties generated by the @generateBindables decorator
  * and puts all these values in a single options object
  */
  getOptionsFromBindables() {
    let props = this.kendoOptions;
    let options = {};

    for (let prop of Object.keys(props)) {
      options[prop] = this.viewModel[getBindablePropertyName(prop)];
    }

    if (this.viewModel.kDataSource) {
      options.dataSource = this.viewModel.kDataSource;
    }

    return options;
  }

  /**
  * sets the default value of all bindable properties
  *  gets the value from the options object in the Kendo control itself
  */
  setDefaultBindableValues() {
    if (!this.viewModel) {
      throw new Error('viewModel is not set');
    }

    let props = this.kendoOptions;

    for (let prop of Object.keys(props)) {
      this.viewModel[getBindablePropertyName(prop)] = props[prop];
    }

    return this;
  }

  /**
  * convert attributes into a list of events a user wants to subscribe to.
  * These events are then subscribed to, which when called
  * calls the fireKendoEvent function to raise a DOM event
  */
  getEventOptions(element) {
    let options = {};
    let allowedEvents = this.kendoEvents;

    // iterate all attributes on the custom elements
    // and only return the normalized kendo event's (dataBound etc)
    let events = getEventsFromAttributes(element);

    events.forEach(event => {
      // throw error if this event is not defined on the Kendo control
      if (!allowedEvents.includes(event)) {
        throw new Error(`${event} is not an event on the ${this.controlName} control`);
      }

      // add an event handler 'proxy' to the options object
      options[event] = e => {
        this.taskQueue.queueMicroTask(() => {
          fireKendoEvent(element, _hyphenate(event), e);
        });
      };
    });

    return options;
  }

  /**
  * destroys the widget
  */
  destroy(widget) {
    widget.destroy();
  }
}

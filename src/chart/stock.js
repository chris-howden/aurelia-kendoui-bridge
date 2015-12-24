import {customElement, bindable, inject} from 'aurelia-framework';
import {WidgetBase, generateBindables} from '../common/index';
import 'jquery';
import 'kendo-ui/js/kendo.dataviz.stock.min';

@customElement('k-stock')
@generateBindables('kendoStockChart')
@inject(Element)
export class Stock extends WidgetBase {

  @bindable options = {};
  @bindable dataSource;

  constructor(element) {
    super('kendoStockChart', element);
  }

  attached() {
    this._initialize();
  }

  recreate() {
    this._initialize();
  }
}
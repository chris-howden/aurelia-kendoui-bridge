import {children, customElement, bindable} from 'aurelia-templating';
import {constants} from '../common/constants';
import {templateProperty} from '../common/decorators';
import {useTemplates} from '../common/templating';

@customElement(`${constants.elementPrefix}col`)
export class Col {
  @bindable aggregates;
  @bindable attributes;
  @bindable columns;
  @bindable command;
  @bindable editor;
  @bindable encoded;
  @bindable field;
  @bindable filterable;
  @templateProperty()
  @bindable footerTemplate;
  @bindable format = '';
  @bindable groupable;
  @templateProperty()
  @bindable groupFooterTemplate;
  @templateProperty()
  @bindable groupHeaderTemplate;
  @bindable headerAttributes;
  @templateProperty()
  @bindable headerTemplate;
  @bindable hidden;
  @bindable lockable;
  @bindable locked;
  @bindable menu;
  @bindable minScreenWidth;
  @bindable sortable;
  @bindable title;
  @bindable values;
  @bindable width;
  @templateProperty(true) @bindable template;
  @bindable withKendoTemplates = false;

  // For multi template support
  @children(`${constants.elementPrefix}template`) templateChildren;

  bind() {
    useTemplates(this, this.templateChildren);
  }
}

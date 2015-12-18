import {useView} from 'aurelia-framework';

@useView("shared/showcase.html")
export class Index {

  configureRouter(config, router){
      config.title = 'Range Chart';
      config.map([
            { route: ['','basic-use'],            moduleId: './basic-use',                 nav: true,    title:'Basic use' },
            { route: 'binding-to-remote-data',    moduleId: './binding-to-remote-data',    nav: true,    title:'Binding to remote data' },
            { route: 'binding-to-local-data',     moduleId: './binding-to-local-data',     nav: true,    title:'Binding to local data' }

      ]);

      this.router = router;
  }
}

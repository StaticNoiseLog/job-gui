import { inject } from 'aurelia-framework';
import { WebAPI } from './web-api';

@inject(WebAPI)
export class App {
  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router) {
    config.title = 'Jobs';
    config.map([
      { route: '', moduleId: 'no-selection', title: 'Select' },
      { route: 'jobs/:id', moduleId: 'job-detail', name: 'jobs' }
    ]);

    this.router = router;
  }
}

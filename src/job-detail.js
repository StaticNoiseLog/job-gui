import { inject } from 'aurelia-framework';
import { WebAPI } from './web-api';
import { EventAggregator } from 'aurelia-event-aggregator';
import { JobUpdated, JobViewed } from './messages';
import { areEqual, removeCarriageReturnFromString } from './utility';

@inject(WebAPI, EventAggregator)
export class JobDetail {
  constructor(api, ea) {
    this.api = api;
    this.ea = ea;
  }

  /**
   * "activate" is a life-cycle method for routed components. It gets
   * invoked right before the router is about to activate the component.
   * @param {*} params one property for every route param that was parsed,
   * as well as a property for each query string parameter
   * @param {*} routeConfig configuration object that you created to
   * configure the router itself (in app.js)
   */
  activate(params, routeConfig) {
    this.routeConfig = routeConfig;

    return this.api.getJobDetails(params.id).then(job => {
      this.job = job;
      // in the DB we can have Windows CR/LF line separation, but HTML textarea loses
      // the CR and leads to confusion, so we get rid of the CR here at the entrance
      this.job.executionLogic = removeCarriageReturnFromString(job.executionLogic);
      this.originalJob = JSON.parse(JSON.stringify(this.job));

      // the router generates a navModel for each routeConfig
      this.routeConfig.navModel.setTitle(job.firstName);
      this.ea.publish(new JobViewed(this.job));
    });
  }

  get canSave() {
    return this.job.id && this.job.name && !this.api.isRequesting;
  }

  save() {
    this.api.updateJob(this.job).then(
      job => {
        this.job = job;
        this.originalJob = JSON.parse(JSON.stringify(job));
        this.routeConfig.navModel.setTitle(job.firstName);
        this.ea.publish(new JobUpdated(this.job));
      },
      error => alert('updateJob: ' + error)
    );
  }

  /**
   * "canDeactivate" is a life-cycle method for routed components,
   * called before navigating away from the current component.
   * If true is returned, navigation is allowed; if false is returned,
   * it is prevented and the route state is reverted.
   */
  canDeactivate() {
    if (!areEqual(this.originalJob, this.job)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?');

      if (!result) {
        this.ea.publish(new JobViewed(this.job)); // indicate we are returning to view the current job
      }

      return result;
    }

    return true;
  }
}

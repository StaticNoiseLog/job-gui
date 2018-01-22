import { WebAPI } from './web-api';
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { JobUpdated, JobViewed } from './messages';

@inject(WebAPI, EventAggregator)
export class JobList {
  constructor(api, ea) {
    this.api = api;
    this.jobs = [];

    ea.subscribe(JobViewed, msg => this.select(msg.job));
    ea.subscribe(JobUpdated, msg => {
      let id = msg.job.id;
      let found = this.jobs.find(x => x.id == id);
      Object.assign(found, msg.job); // 1st parameter (found) is the target of the assignment
    });
  }

  created() {
    this.api.getJobList().then(jobs => this.jobs = jobs);
  }

  select(job) {
    this.selectedId = job.id;
    return true;
  }
}

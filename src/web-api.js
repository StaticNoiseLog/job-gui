import { HttpClient, json } from 'aurelia-fetch-client';

let httpClient = new HttpClient();

httpClient.configure(config => {
  config
    //    .useStandardConfiguration()
    .withBaseUrl('http://localhost:8080/com.swisscom.nwb.cf.api/v1/')
    .withDefaults({
      credentials: 'omit',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'Fetch'
      }
    })
    .withInterceptor({
      request(request) {
        console.log('HTTP request: ' + request);
        // request.headers.append('Authorization', authHeader);
        return request;
      },
      response(response) {
        console.log(`Received ${response.status} ${response.statusText} ${response.url}`);
        return response; // you can return a modified Response
      }

    });
});


//--------------------------------------

let latency = 200;
let id = 0;

function getId() {
  return ++id;
}


export class WebAPI {

  jobs = [];

  addJob(job) {
    var promise = new Promise((resolve, reject) => {
      httpClient.fetch(this.apiRoot + 'api/Jobs', {
        method: 'POST',
        body: json(job) // json is a helper provided buy Aurelia
      }).then(response => response.json())
        .then(data => {
          this.jobs.push(data);
          resolve(data);
        }).catch(err => reject(err));
    });
    return promise;
  }

  // returns a promise that resolves to an array of Job objects to display on the left
  getJobList() {
    this.isRequesting = true;
    return httpClient
      .fetch('jobs', {
        method: 'get'
      })
      .then(response => response.json()) // .json() returns a Promise that resolves to an array of JSON objects
      .then(jobs => {
        this.jobs = jobs;
        return jobs;
      })
      .catch(error => {
        alert('Error in getJobList: ' + error);
      });
  }

  getJobDetails(idParam) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = this.jobs.filter(x => x.id == idParam)[0];
        resolve(JSON.parse(JSON.stringify(found)));
        this.isRequesting = false;
      }, latency);
    });
  }

  updateJob(job) {
    this.isRequesting = true;
    var promise = new Promise((resolve, reject) => {
      httpClient.fetch('jobs/' + job.id, {
        method: 'PUT',
        body: json(job)
      }).then(response => {
        if (response.status != 200) {
          response.text()
            .then(text => reject(`HTTP call failed: ${response.status} ${response.statusText}\r\n${response.url}\r\nresponse body:\r\n${text}`));
        } else {
          new Promise((resolve) => resolve(response))
            .then(response => response.json())
            .then(data => {
              let instance = JSON.parse(JSON.stringify(data));
              let found = this.jobs.filter(x => x.id == job.id)[0];
              if (found) {
                let index = jobs.indexOf(found);
                jobs[index] = instance;
              } else {
                throw Error('Internal nervous breakdown, why is Job ID not in jobs array? ' + job.id);
              }
              resolve(data);
            });
        }
      }).catch(err => {
        reject(err);
      }).finally(() => this.isRequesting = false);
    });
    return promise;
  }

  // TODO
  saveJob(job) {
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(job));
        let found = jobs.filter(x => x.id == job.id)[0];

        if (found) {
          let index = jobs.indexOf(found);
          jobs[index] = instance;
        } else {
          instance.id = getId();
          jobs.push(instance);
        }

        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
let jobs = []; // denn brauchts dann nimmmer

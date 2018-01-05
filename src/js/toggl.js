const TogglClient = require('toggl-api');
import { DateTime } from 'luxon';
import { Storage } from './storage';

export class Toggl {

  constructor(){
    this.apiBase = 'https://www.toggl.com/api/v8/';
    this.apiReports = 'https://toggl.com/reports/api/v2';

    this.storage = new Storage();

    this.apiToken = this.storage.options.togglApiKey;
    this.toggl = new TogglClient({apiToken: this.apiToken});
    this.defOpts = {
      workspace_id: this.storage.options.togglWsId,
      user_agent: this.storage.options.togglUserAgent
    }

    this.dayOffset = 0;
    this.targetDay = DateTime.local().startOf('day');
    this.start = this.targetDay.startOf('day').toISO();
    this.end = this.targetDay.endOf('day').toISO();
  }

  prevDay(){
    this.dayOffset--;
    this.setDay( DateTime.local().startOf('day').plus({days: this.dayOffset}) );
  }

  nextDay(){
    this.dayOffset++;
    this.setDay( DateTime.local().startOf('day').plus({days: this.dayOffset}) );
  }

  setDay(isoDate){
    this.targetDay = DateTime.fromISO(isoDate);
    this.dayOffset = this.targetDay.diff(DateTime.local().startOf('day'), ['days']).toObject().days || 0;

    this.start = this.targetDay.startOf('day').toISO();
    this.end = this.targetDay.endOf('day').toISO();
    return this.targetDay;
  }

  buildOpts(extraOpts){
    return Object.assign({}, this.defOpts, extraOpts);
  }

  test(){
    let opts = this.buildOpts({withRelatedData: false});

    return new Promise((resolve, reject) => {
        this.toggl.getUserData(opts, (err, data) => {
          if(err){
            console.log('Toggl error: ', err);
            reject(err);
          }

          resolve(data);
        });
    });
  }

  getDay(date){
    let opts = this.buildOpts({
      since: this.start,
      until: this.end
    });

    return new Promise((resolve, reject) => {
      this.toggl.summaryReport(opts, (err, data) => {
        if(err){
            console.log('Toggl error: ', err);
            reject(err);
          }

          resolve({date: this.start, entries: data});
      })
    })
  }
}
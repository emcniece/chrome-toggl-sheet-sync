//const _ = require('underscore');
import { DateTime } from 'luxon';

export class Formatter {
  constructor(){
    
  }

  // togglSummary = {date: this.start, entries: data}
  toCells(togglSummary){
    let output = [];

    let date = DateTime.fromISO(togglSummary.date).toLocaleString(DateTime.DATE_SHORT);

    togglSummary.entries.data.forEach(item => {
      let hours = (item.time/1000/60/60).toFixed(2);
      let project = item.title.project;
      let desc = "";

      item.items.forEach((entry, i, arr) => {
        let comma = (i < arr.length-1) ? ', ' : '';
        desc += entry.title.time_entry + comma;
      })

      output.push([
        date,
        null, // month
        null, // week
        null, // year
        project,
        hours,
        null, // project hours
        null, // billable
        null, // IRAP
        null, // IRAP Hours
        desc
      ]);
    });

    return output;
  } 
}
import 'bootstrap';
import "../sass/general.scss";
import { Storage } from './storage';
import { Toggl } from './toggl';
import { Sheets } from './sheets';
import { Formatter } from './formatter';

import "../css/popup.css";
import hello from "./popup/example";

export class Popup {
  constructor(){
    this.storage = new Storage();
    this.toggl = new Toggl();
    this.sheet = new Sheets();
    this.format = new Formatter();

    // Buttons / Form Elements
    document.getElementById('toggl-prevDay').addEventListener('click', this.togglPrev.bind(this));    
    document.getElementById('toggl-nextDay').addEventListener('click', this.togglNext.bind(this));
    document.getElementById('current-day').value = this.toggl.targetDay.toISODate();
    document.getElementById('current-day').addEventListener('input', this.togglParse.bind(this)); 
    document.getElementById('sheet-put').addEventListener('click', this.sheetPut.bind(this));
    document.getElementById('sheet-put-bump').addEventListener('click', this.sheetPutBump.bind(this));
    document.getElementById('open-options').addEventListener('click', this.openOptions.bind(this));

    this.setLinks();
    this.togglGet();
  }

  openOptions(){
    chrome.runtime.openOptionsPage();
  }

  sheetPut(){
    this.toggl.getDay()
    .then(res => {
      let cells = this.format.toCells(res);
      this.sheet.append(cells);
    })
  }

  sheetPutBump(){
    this.toggl.getDay()
    .then(res => {
      let cells = this.format.toCells(res);
      this.sheet.append(cells);
      this.togglNext();
    })
  }

  setLinks(){
    const date = this.toggl.targetDay.toISODate();
    const sheetLink = `https://docs.google.com/spreadsheets/d/${this.storage.options.gsheetId}/edit`
    const togglLink = `https://www.toggl.com/app/reports/summary/${this.storage.options.togglWsId}/from/${date}/to/${date}/billable/both`;
    document.getElementById('link-sheet').href = sheetLink;
    document.getElementById('link-toggl').href = togglLink;
  }

  togglPrev(){
    this.toggl.prevDay();
    document.getElementById('current-day').value = this.toggl.targetDay.toISODate();
    this.togglGet();
  }

  togglNext(){
    this.toggl.nextDay();
    document.getElementById('current-day').value = this.toggl.targetDay.toISODate();
    this.togglGet();
  }

  togglParse(){
    const value = document.getElementById('current-day').value;
    const result = this.toggl.setDay(value);
    this.togglGet();
  }

  togglGet(){
    this.toggl.getDay()
    .then(res => {
      let cells = this.format.toCells(res);
      let html = '';

      console.log('fmt', cells);

      cells.forEach(entry => {
        html += `<div class="entry row">
          <div class="col-xs-auto"><button type="button" class="btn btn-sm btn-info">${entry[4]}</button></div>
          <div class="col"><strong>${entry[5]}h</strong> - ${entry[10]}</div>
        </div>`;
      });

      if(!cells.length){
        html = '<div class="entry row no-entries"><div class="col"><em>No entries for date</em></div></div>';
      }

      document.getElementById('entries').innerHTML = html;
      this.setLinks();
    })
  }
}

const popup = new Popup();
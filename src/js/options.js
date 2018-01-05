import 'bootstrap';
import "../sass/general.scss";
import { Storage } from './storage';
import { Toggl } from './toggl';
import { Sheets } from './sheets';
import { Formatter } from './formatter';

export class Options {
  constructor(){
    this.storage = new Storage();
    this.toggl = new Toggl();
    this.sheet = new Sheets();
    this.format = new Formatter();

    console.log('Loaded: ', this.storage);

    // Options
    document.getElementById('save-options').addEventListener('click', this.save.bind(this));
    document.getElementById('test-google').addEventListener('click', this.testGoogle.bind(this));
    document.getElementById('test-toggl').addEventListener('click', this.testToggl.bind(this));
    document.getElementById('btn-options').addEventListener('click', this.showOptions.bind(this));
    document.getElementById('btn-test').addEventListener('click', this.showTest.bind(this));

    // Test: Toggl
    document.getElementById('toggl-get').addEventListener('click', this.togglGet.bind(this));
    document.getElementById('toggl-prevDay').addEventListener('click', this.togglPrev.bind(this));    
    document.getElementById('toggl-nextDay').addEventListener('click', this.togglNext.bind(this));
    document.getElementById('current-day').value = this.toggl.targetDay.toISODate();
    document.getElementById('current-day').addEventListener('input', this.togglParse.bind(this));

    // Test: Sheet
    document.getElementById('sheet-put').addEventListener('click', this.sheetPut.bind(this));
    document.getElementById('sheet-put-bump').addEventListener('click', this.sheetPutBump.bind(this));

    // Load data into form elements
    this.populate();
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

  togglPrev(){
    this.toggl.prevDay();
    document.getElementById('current-day').value = this.toggl.targetDay.toISODate();
  }

  togglNext(){
    this.toggl.nextDay();
    document.getElementById('current-day').value = this.toggl.targetDay.toISODate();
  }

  togglParse(){
    const value = document.getElementById('current-day').value;
    const result = this.toggl.setDay(value);
  }

  togglGet(){
    this.toggl.getDay()
    .then(res => {
      let fmt = this.format.toCells(res);
      console.log('fmt', fmt);
    })
  }

  showOptions(){
    document.getElementById('options').style.display = 'block';
    document.getElementById('test').style.display = 'none';
  }

  showTest(){
    document.getElementById('options').style.display = 'none';
    document.getElementById('test').style.display = 'block';
  }

  testGoogle(){
    this.alert('info', `Testing credentials...`);

    this.sheet.test()
    .then(res => {
      console.log(res);
      this.alert('success', `Success! <strong>${res.range}</strong> Sheet has ${res.values.length} rows`);
    })
    .catch(err => {
      this.alert('danger', `gAPI: ${err}`);
    });
  }

  testToggl(){
    this.alert('info', `Testing credentials...`);

    this.toggl.test()
    .then(res => {
      this.alert('success', `Success! User is ${res.fullname}`);
    })
    .catch(err => {
      this.alert('danger', `Toggl: ${err}`);
    });
  }

  populate(){
    const options = this.storage.load();

    Array.from(document.getElementsByClassName('data-storage')).forEach(item => {
      let value = !!options ? options[item.id] : "";

      if(item.dataset.type == 'json'){
        try{
          //options[item.id] = JSON.parse(value);
          value = JSON.stringify(value);
        } catch(e){
          alert('Error parsing JSON input: '+item.id);
        }
      }

      item.value = value;
    });
  }

  save(){
    let options = this.collect();
    console.log('saving', options)
    this.storage.save(options);
  }

  collect(){
    let options = {};

    Array.from(document.getElementsByClassName('data-storage')).forEach(item => {
      options[item.id] = item.value;
    });

    return options;
  }

  alert(type, content){
    let alertHtml = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${content}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;

    document.getElementById("alerts").innerHTML = alertHtml
  }
}

const options = new Options();
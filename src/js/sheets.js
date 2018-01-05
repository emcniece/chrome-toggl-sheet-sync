const google = require('googleapis');

import { Storage } from './storage';

export class Sheets {

  constructor(){
    this.ready = false;
    this.sheets = google.sheets('v4');
    this.storage = new Storage();

    this.jwtClient = new google.auth.JWT(
      this.storage.options.googleJsonCreds.client_email,
      null,
      this.storage.options.googleJsonCreds.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    //authenticate request
    this.jwtClient.authorize((err, tokens) => {
     if (err) {
      console.log(err);
      return;
     } else {
      console.log("Successfully connected!");

      this.init().then( sheet => {
        this.ready = true;
      });
     }
    });
  }

  init(){
    return this.getValues();
  }

  test(){
    return this.getValues();
  }

  getValues(){
    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.values.get({
        auth: this.jwtClient,
        spreadsheetId: this.storage.options.gsheetId,
        range: this.storage.options.worksheetName
      }, function (err, response) {
        if (err) {
          console.warn('Google API error: ' + err);
          reject(err);
        }

        resolve(response);
      });
    });
  }

  /**
   * Check sheet, compare dates, determine if these cells
   * need to be inserted or if they can be appended
   * @param  [Array] Cell[] (from formatter.js)
   * @return {object} {insertDataOption: [OVERWRITE|INSERT_ROWS], range}
   */
  getInsertStatus(cells){
    // Todo!
  }

  append(cells){
    if(!cells.length){
      console.warn('Error - no cells to write!', cells)
      return;
    }

    let body = {
      values: cells,
    };

    return new Promise((resolve, reject) => {
      this.sheets.spreadsheets.values.append({
        auth: this.jwtClient,
        spreadsheetId: this.storage.options.gsheetId,
        valueInputOption: 'USER_ENTERED',
        resource: body,
        range: this.storage.options.worksheetName,
      }, function (err, response) {
        if (err) {
          console.warn('Google API error: ' + err);
          reject(err);
        }

        console.log('Append: ', cells)
        resolve(response);
      });
    });
  }
}
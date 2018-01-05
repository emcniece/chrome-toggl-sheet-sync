
export class Storage {

  constructor(){
    const options = this.load();
    this.options = options;
  }

  save(options){
    //const options = Storage.collect();
    localStorage.setItem('options', JSON.stringify(options));
  }

  load(){
    let options = localStorage.getItem('options');

    try{
      options = JSON.parse(options);
    } catch(e){
      options = {};
      alert('Error loading options - resetting form.');
      this.save();
    }

    if(!!options.googleJsonCreds){
      try{
        options.googleJsonCreds = JSON.parse(options.googleJsonCreds);
      } catch(e){
        alert('Error decoding Google JSON credentials');
      }
    }

    return options;
  }


};

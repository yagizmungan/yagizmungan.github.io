class App {
  constructor(options) {
    this.options = options;
  }

  init(){
  	console.log(this.options);
  	for (let i =  0; i < this.options.items.length; i++) {
  		// this.options.items[i]
  		let item = new MainItem(this.options.items[i]);
  	}


    for (let i in this.options.footer_items){      
      let footer_item_element = new FooterItem(this.options.footer_items[i]);
    }
  }
}
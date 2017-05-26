class App {
  constructor(options) {
    this.options = options;
  }

  init(){
  	console.log(this.options);
  	for (var i = this.options.items.length - 1; i >= 0; i--) {
  		// this.options.items[i]
  		let item = new MainItem(this.options.items[i]);
  	}
  }
}
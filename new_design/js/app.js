class App {
  constructor(options) {
    this.options = options;
  }

  init(){
  	console.log(this.options);

    switch (this.options.role){
      case 'bio':
        for (let i =  0; i < this.options.bio_exhibitions.length; i++) {
          // this.options.items[i]
          let item = new BioItem({
            "content": this.options.bio_exhibitions[i],
            "parent_id": 'bio__works__exhibitions' 
          });
        }

        for (let i in this.options.bio_footer_items){      
          let footer_item_element = new FooterItem(this.options.bio_footer_items[i]);
        }
        break;

      case 'works':
        for (let i =  0; i < this.options.items.length; i++) {
          // this.options.items[i]
          let item = new MainItem(this.options.items[i]);
        }

        for (let i in this.options.footer_items){      
          let footer_item_element = new FooterItem(this.options.footer_items[i]);
        }
        break;
    }    
  }
}
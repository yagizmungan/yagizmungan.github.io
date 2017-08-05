class App {
  constructor(options) {
    this.options = options;
  }

  init(){
  	console.log(this.options);

    switch (this.options.role){
      case 'bio':
        for (let i =  0; i < this.options.bio_exhibitions.length; i++) {
          let item = new BioItem({
            "content": this.options.bio_exhibitions[i],
            "parent_id": 'bio__works__exhibitions' 
          });
        }

        for (let i =  0; i < this.options.bio_publications.length; i++) {
          let item = new BioItem({
            "content": this.options.bio_publications[i],
            "parent_id": 'bio__works__publications' 
          });
        }

        for (let i =  0; i < this.options.bio_workshops.length; i++) {
          let item = new BioItem({
            "content": this.options.bio_workshops[i],
            "parent_id": 'bio__works__workshops' 
          });
        }

        for (let i in this.options.bio_footer_items){      
          let footer_item_element = new FooterItem(this.options.bio_footer_items[i]);
        }

        for (let i in this.options.bio_section_links) {
          this.options.bio_section_links[i].parent = "bio__main__links";
          let section_link = new SectionLink(this.options.bio_section_links[i]);

          if(i < this.options.bio_section_links.length - 1) {
            let temp_div = document.createElement('div');
            temp_div.innerHTML = "&nbsp;|&nbsp;";
            document.getElementById("bio__main__links").appendChild(temp_div);
          }
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
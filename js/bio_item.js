class BioItem {
	constructor(options) {
    if(!options.content || !options.parent_id) {      
      return;
    }

    let parent = document.getElementById(options.parent_id);

    let container = document.createElement('div')
    container.classList.add('bio__item'); 

    for (let i = 0; i < options.content.entry.length; i++) {
      if(options.content.entry[i].link.length > 0) {
        let a = document.createElement('a');
        a.href = options.content.entry[i].link;
        a.innerText = options.content.entry[i].text;
        container.appendChild(a);
      }
      else {
        container.innerHTML += options.content.entry[i].text;
      }
    }

    parent.appendChild(container);
  }
}
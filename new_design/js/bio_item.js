class BioItem {
	constructor(options) {
    if(!options.content || !options.parent_id) {      
      return;
    }

    let parent = document.getElementById(options.parent_id);

    let container = document.createElement('div')
    container.classList.add('bio__item'); 
    container.innerHTML = options.content.text;

    console.log('here', options.content.text);

    parent.appendChild(container);
  }
}
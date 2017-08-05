class BioItem {
	constructor(options) {
    if(!options.content || !options.parent_id) {      
      return;
    }

    let parent = document.getElementById(options.parent_id);

    let container = document.createElement('div')
    container.classList.add('bio__item'); 

    // for (let i = 0; i < options.content.entry.length; i++) {
      // if(options.content.entry[i].link.length > 0) {
      //   let a = document.createElement('a');
      //   a.href = options.content.entry[i].link;
      //   a.innerText = options.content.entry[i].text;
      //   container.appendChild(a);
      // }
      // else {
      //   container.innerHTML += options.content.entry[i].text;
      // }
    // }
    if(options.content.entry.date) {
      container.innerHTML += options.content.entry.date.text + ",&nbsp;";
    }

    if(options.content.entry.project) {
      if(options.content.entry.project.link.length > 0) {
        let a = document.createElement('a');
        a.href = options.content.entry.project.link;
        a.innerText = options.content.entry.project.text;
        container.appendChild(a);
      }
      else {
        container.innerHTML += options.content.entry.project.text;
      }
      container.innerHTML += "&nbsp;";
    }

    if(options.content.entry.event) {
      container.innerHTML += "at&nbsp;";

      if(options.content.entry.event.link.length > 0) {
        let a = document.createElement('a');
        a.href = options.content.entry.event.link;
        a.innerText = options.content.entry.event.text;
        container.appendChild(a);
      }
      else {
        container.innerHTML += options.content.entry.event.text;
      }
      container.innerHTML += "&nbsp;";
    }

    if(options.content.entry.location) {
      container.innerHTML += "in&nbsp;";

      if(options.content.entry.location.link.length > 0) {
        let a = document.createElement('a');
        a.href = options.content.entry.location.link;
        a.innerText = options.content.entry.location.text;
        container.appendChild(a);
      }
      else {
        container.innerHTML += options.content.entry.location.text;
      }
      container.innerHTML += "&nbsp;";
    }

    parent.appendChild(container);
  }
}
class SectionLink {
	constructor(options) {
		let container = document.createElement('div');
    container.innerHTML = options.title;
    container.classList.add('section-link');
		container.onclick =  () => {
      document.getElementById(options.target_id).scrollIntoView({ 
        behavior: 'smooth' 
      });
      // TweenLite.to(window, 0.2, {scrollTo:'#' + options.target_id});
      // TweenMax.to(window, 0.2, {scrollTo:"#bio__works__publications"});
    }

    console.log(options.parent);
    document.getElementById(options.parent).appendChild(container);
	}
}
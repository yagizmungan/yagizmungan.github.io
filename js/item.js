class MainItem {
  constructor(options) {
    let container = document.createElement('div');
    container.classList.add('main__container');
    container.style.backgroundImage = "url('" + options.color_image + "')";

    // let color_image = document.createElement('img');
    // color_image.src = options.color_image;
    // color_image.classList.add('main__color-image');

    let bw_image = document.createElement('img');
    bw_image.src = options.bw_image;
    bw_image.classList.add('main__bw-image');

    let text_container = document.createElement('div');
    text_container.classList.add('main__text-container');

    let text_header_container = document.createElement('div');
    text_header_container.classList.add('main__text-container__top');


    let title = document.createElement('div');
    title.innerHTML = options.title;

    let subtitle = document.createElement('div');
    subtitle.innerHTML = options.subtitle;

    text_header_container.appendChild(title);
    text_header_container.appendChild(subtitle);

    let info = document.createElement('div');
    info.classList.add('main__text-container__bottom');
    info.innerHTML = options.date + ' ' + options.location;

    // let link = document.createElement('a');

    let interaction_zone = document.createElement('div');
    interaction_zone.classList.add('main__interaction-zone');

    // link.appendChild('main__interaction-zone');

    container.appendChild(bw_image);
    // container.appendChild(color_image);
    text_container.appendChild(text_header_container);
    text_container.appendChild(info);
    container.appendChild(text_container);
    container.appendChild(interaction_zone);
    // container.appendChild(link);

    // TweenLite.to(bw_image, 0.2, {width:"200px", height:"150px"});

    interaction_zone.onmouseover =  () => {
      // bw_image.classList.add('invisible');
      TweenLite.to(bw_image, 0.25, {opacity: 0});
      TweenLite.to(text_container, 0.25, {opacity: 1});
    }

    interaction_zone.onmouseout =  () => {
      // bw_image.classList.remove('invisible');
      // TweenLite.to(bw_image, 0.2, {autoAlpha: 1});
      TweenLite.to(bw_image, 0.25, {opacity: 1});
      setTimeout( function(){
        TweenLite.to(text_container, 0, {opacity: 0});
      }, 250);
    }

    interaction_zone.onclick =  () => {
      console.log(options.link);
      window.location.href = options.link;
    }

    document.getElementById('main-content').appendChild(container);
  }
}
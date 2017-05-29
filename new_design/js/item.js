class MainItem {
  constructor(options) {
    let container = document.createElement('div');
    container.classList.add('main__container');
    container.style.backgroundImage = "url('" + options.color_image + "')";

    let color_image = document.createElement('img');
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


    container.appendChild(bw_image);
    container.appendChild(color_image);
    text_container.appendChild(text_header_container);
    text_container.appendChild(info);
    container.appendChild(text_container);

    // TweenLite.to(bw_image, 0.2, {width:"200px", height:"150px"});

    container.onmouseover =  () => {
      // bw_image.classList.add('invisible');
      TweenLite.to(bw_image, 0.25, {opacity: 0});
    }

    container.onmouseout =  () => {
      // bw_image.classList.remove('invisible');
      // TweenLite.to(bw_image, 0.2, {autoAlpha: 1});
      TweenLite.to(bw_image, 0.25, {opacity: 1});
    }

    container.onclick =  () => {
      console.log(options.link);
    }

    document.getElementById('main-content').appendChild(container);
  }
}
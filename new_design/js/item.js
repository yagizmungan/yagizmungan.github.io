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

    let title = document.createElement('div');
    title.innerHTML = options.title;

    let subtitle = document.createElement('div');
    subtitle.innerHTML = options.subtitle;

    let info = document.createElement('div');
    info.innerHTML = options.date + ' ' + options.location;


    container.appendChild(bw_image);
    container.appendChild(color_image);
    text_container.appendChild(title);
    text_container.appendChild(subtitle);
    text_container.appendChild(info);
    container.appendChild(text_container);

    container.onmouseover =  () => {
      bw_image.classList.add('invisible');
    }

    container.onmouseout =  () => {
      bw_image.classList.remove('invisible');
    }

    container.onclick =  () => {
      console.log(options.link);
    }

    document.getElementById('main-content').appendChild(container);
  }
}
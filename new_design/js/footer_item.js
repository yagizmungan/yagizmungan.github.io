class FooterItem {
	constructor(options) {
    console.log(options)
    let container = document.createElement('div');
    let a = document.createElement('a');

    a.innerText = options.text;
    a.href = options.link;

    document.getElementById('footer').appendChild(a);
  }
}
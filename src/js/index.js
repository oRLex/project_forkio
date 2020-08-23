const menuBtn = document.querySelector('.menu__btn--toggle');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', handleMenu);

function handleMenu(event) {
  event.preventDefault();
  this.classList.toggle('btn--toggle-active');
  menu.classList.toggle('menu-active');
}
'use strict';

///////////////////////////////////////
// Modal window
const btnScroolTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tab = document.querySelectorAll('.operations__tab');
const tabContiner = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// Button scroll
btnScroolTo.addEventListener('click', function (e) {
  // const s1Coord = section1.getBoundingClientRect();
  // console.log(s1Coord);
  // console.log(e.target.getBoundingClientRect());
  // console.log('current scroll', window.scrollX, window.scrollY);
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //Scroll to

  // window.scrollTo(s1Coord.left + window.screenX, s1Coord.top + window.scrollY);

  // window.scrollTo({
  //   left: s1Coord.left + window.screenX,
  //   top: s1Coord.top + window.scrollY,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});
// page navigation
/* document.querySelectorAll('.nav__link').forEach(el =>
  el.addEventListener('click', function (e) {
    e.preventDefault();
    // to get  actual url rather than absolute attribute url this key word holds current target not e.target/ orginal where the event crearted

    const id = this.getAttribute('href');
    // this is the element  that we want scroll to
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  })
); */

// NOW USE EVENT DELEGATION TO EFFICENT CODE
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  console.log(id);
  console.log(e.target);
  console.log(e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabContiner.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // GAURED CLAUSE
  if (!clicked) return;
  tab.forEach(btn => btn.classList.remove('operations__tab--active'));
  tabContent.forEach(op => op.classList.remove('operations__content--active'));

  // ACTIVE TABS
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// pade link nav
nav.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const log = link.closest('.nav').querySelector('img');
    sibling.forEach(el => {
      if (el !== e.target) el.style.opacity = 0.5;
    });
    log.style.opacity = 0.5;
  }
});
nav.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const log = link.closest('.nav').querySelector('img');
    sibling.forEach(el => {
      if (el !== e.target) el.style.opacity = 1;
    });
    log.style.opacity = 1;
  }
});

// const callBack = function (entrie, observer) {
//   entrie.forEach(entrie => console.log(entrie));
// };
// const option = {
//   root: null,
//   threshold: 0.15,
// };
// const observer = new IntersectionObserver(callBack, option);
// observer.observe(section1);

const callBack = function (entrie) {
  const [entry] = entrie;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const option = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(callBack, option);
headerObserver.observe(header);

//REVEALING ELEMENT ON SCROLL

const reveal = function (entries, observer) {
  const [entry] = entries;

  //GUARD CLAUSE
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(reveal, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('.section');

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY IMAGE LOAD
const loadImg = function (entries) {
  const [entry] = entries;
  console.log(entry);
  // when it replace lazy image it will emite load event
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  //we use addeventlistener b/c when we load the original image to lazy exactly on that time we want to remove lazy image class
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const allLazy = document.querySelectorAll('img[data-src]');

const imgObserve = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
allLazy.forEach(img => {
  imgObserve.observe(img);
});

//SLIDER COMPONENT

const slider = document.querySelector('.slider');

const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContiner = document.querySelector('.dots');
const slides = document.querySelectorAll('.slide');

//CREATE HTML ELEMENT OR TEMPLATE
const createDots = function () {
  slides.forEach((_, i) =>
    dotContiner.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    )
  );
};
createDots();

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0);

// slides.forEach(
//   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
// );

//the below code same us the above
const goToSlide = function (slide) {
  slides.forEach(
    (s, index) => (s.style.transform = `translateX(${100 * (index - slide)}%)`)
  );
};
goToSlide(0);

// Move to right

let curSlide = 0;
const maxSlide = slides.length;

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});
dotContiner.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    // const slide=e.target.dataset.slide;
    // her slide is the dataset number
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

// btnRight.addEventListener('click', function () {
//   if (curSlide === maxSlide - 1) {
//     curSlide = 0;
//   } else {
//     curSlide++;
//   }

//   slides.forEach((slide, index) => {
//     slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
//   });
// });

// btnLeft.addEventListener('click', function () {
//   if (curSlide === 0) {
//     curSlide = maxSlide - 1;
//   } else {
//     curSlide--;
//   }

//   slides.forEach((slide, index) => {
//     // this code to try to make traslateX (0)
//     slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
//   });
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* // addEventListener on html element
const h1 = document.querySelector('h1');
// h1.addEventListener('mouseenter', function (e) {
//   alert('this is event listenr');
// });
// to listen only one time
const h1Listener = function (e) {
  alert('this is event listenr but once it listen');
  // here we notice it only listen  once
  h1.removeEventListener('mouseenter', h1Listener);
};
h1.addEventListener('mouseenter', h1Listener); */

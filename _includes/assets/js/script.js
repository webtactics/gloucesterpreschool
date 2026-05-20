const toggleButton = document.querySelector('.toggle-nav');
  const offcanvasNav = document.querySelector('.offcanvas');
  const closeNavButton = document.querySelector('.close-nav');
  
  toggleButton.addEventListener('click', function() {
    offcanvasNav.classList.toggle('open');
    toggleButton.classList.toggle('active');
  });
  
  function closeOffcanvasNav() {
    offcanvasNav.classList.remove('open');
    toggleButton.classList.remove('active');
  }
  
  document.addEventListener('click', function(event) {
    const targetElement = event.target;
    if (
      !offcanvasNav.contains(targetElement) &&
      targetElement !== toggleButton &&
      !toggleButton.contains(targetElement) &&
      targetElement !== closeNavButton
    ) {
      closeOffcanvasNav();
    }
  });
  
  closeNavButton.addEventListener('click', function() {
    closeOffcanvasNav();
  });
  

const header = document.querySelector('.topbar');
const scrollWatcher = document.createElement('div');

scrollWatcher.setAttribute('data-scroll-watcher', '');
header.before(scrollWatcher);

const navObserver = new IntersectionObserver((entries) => {
header.classList.toggle('scrolled', !entries[0].isIntersecting)

  }, {rootMargin: "300px 0px 0px 0px"});
navObserver.observe(scrollWatcher)



  const faders = document.querySelectorAll(".fade-in");
  const sliders = document.querySelectorAll(".slide-in");



  const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -200px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function(
    entries,
    appearOnScroll
  ) {
    entries.forEach(entry => {


if (entry.isIntersecting) {
                // Element is in view, add the desired class
                entry.target.classList.add('appear');
            } 

    });
  },
  appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  sliders.forEach(slider => {
    appearOnScroll.observe(slider);
  });









// Mobile menu toggle



// Accordion



// Project filter



const filterList = document.querySelector(".filter");
const filterButtons = filterList.querySelectorAll(".filter-btn");
const conferences = document.querySelectorAll(".conference");

let conferenceIndex = 0;

conferences.forEach((conference) => {
  conference.style.viewTransitionName = `conf-${++conferenceIndex}`;
});

filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let confCategory = e.target.getAttribute("data-filter");

    if (!document.startViewTransition) {
      updateActiveButton(e.target);
      filterEvents(confCategory);
    }

    document.startViewTransition(() => {
      updateActiveButton(e.target);
      filterEvents(confCategory);
    });
  });
});

function updateActiveButton(newButton) {
  filterList.querySelector(".active").classList.remove("active");
  newButton.classList.add("active");
}

function filterEvents(filter) {
  conferences.forEach((conference) => {
    // get each conferences category
    let eventCategory = conference.getAttribute("data-category");

    // check if that category matches with the filter
    if (filter === "all" || filter === eventCategory) {
      conference.removeAttribute("hidden");
    } else {
      conference.setAttribute("hidden", "");
    }
  });
}



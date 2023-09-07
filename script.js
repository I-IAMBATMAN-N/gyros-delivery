"use strict";
// ***********************************************************************************************
// BOOT
// ***********************************************************************************************
//
window.addEventListener("load", function () {
  this.setTimeout(() => {
    closingHeader();
  }, 1000);
});

window.scrollTo(0, 0);

setTimeout(() => {
  timerOut = true;
}, 2000);

// ***********************************************************************************************
// HEADER ANIMATION
// ***********************************************************************************************
const hero = document.querySelector(".hero-container");
const header = document.querySelector(".header");
const headerContainer = document.querySelector(".header-container");
const logoContainer = document.querySelector(".logo");
const nav = document.querySelector(".nav");
const container = document.querySelector(".container");
let timerOut = false;
function closingHeader() {
  setTimeout(() => {
    headerContainer.classList.remove("intro");
    nav.classList.remove("hidden");
    container.classList.remove("hidden");
    container.classList.toggle("visible");
  }, 1000);
  //
  setTimeout(() => {
    const heroHeading = document.querySelector(".hero-heading");
    const heroFooter = document.querySelector(".hero-footer");
    if (!heroHeading.classList.contains("loaded")) {
      heroHeading.classList.add("loaded");
      heroFooter.classList.add("loaded");
    }
  }, 2000);
}

// ***********************************************************************************************
// STICKY NAVIGATION
// ***********************************************************************************************
const formContainer = document.querySelector(".form-container");
const menu = document.querySelector(".main-menu.center");
const navLinks = document.querySelectorAll(".nav-link");
const logoImgContainer = document.querySelector(".logo-img-container");
const orderForm = document.querySelector(".order-form");
const inputContainer = document.querySelector(".input-container--input");
const inputContainers = document.querySelectorAll(".input-container--input");

function activeLink(str) {
  navLinks.forEach((e) => {
    if (e.innerText === str) {
      e.classList.add("link-active");
    } else {
      e.classList.remove("link-active");
    }
  });
}
let firstTime = false;
const headerObsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // console.log("entry", entry);
      if (entry.target.id === "hero") {
        activeLink("");
        firstTime = true;
      } else if (entry.target.id === "form-container") {
        activeLink("KOŠÍK");
        //
        if (!orderForm.classList.contains("loaded")) {
          setTimeout(() => {
            orderForm.classList.add("loaded");
          }, 500);
        }
      } else if (entry.target.id === "main-menu") {
        activeLink("MENU");
      }
    } else if (!entry.isIntersecting) {
    }
  });
};
const obsOptions = {
  root: null,
  threshold: [0.85],
  rootMargin: `${100}px`,
};
const menuObsOptions = {
  root: null,
  threshold: [0.5, 0.8],
  rootMargin: `${100}px`,
};
const headerObserver = new IntersectionObserver(headerObsCallback, obsOptions);
const menuObserver = new IntersectionObserver(
  headerObsCallback,
  menuObsOptions
);
setTimeout(() => {
  const mainContainers = document.querySelectorAll(".main-container");
  mainContainers.forEach((e) => {
    if (e.classList.contains("main-menu")) {
      menuObserver.observe(e);
    } else {
      headerObserver.observe(e);
    }
  });
}, 5000);

// ***********************************************************************************************
// FORM INPUTS UX ANIMATIONS
// ***********************************************************************************************
const name = document.querySelector("#name");
const address = document.querySelector("#address");
const tel = document.querySelector("#tel");
const inputs = document.querySelectorAll(".input");

inputs.forEach((e) => {
  e.addEventListener("focus", function (e) {
    if (e.target.id === "name") {
      //
      inputContainers.forEach((el) => {
        if (el.children[0].id === "name") {
          el.classList.add("clicked");
        }
      });
    } else if (e.target.id === "email") {
      //
      inputContainers.forEach((el) => {
        if (el.children[0].id === "email") {
          el.classList.add("clicked");
        }
      });
    } else if (e.target.id === "tel") {
      //
      inputContainers.forEach((el) => {
        if (el.children[0].id === "tel") {
          el.classList.add("clicked");
        }
      });
    }
  });
});
inputContainers.forEach((element) => {
  if (JSON.stringify(element.children[0].value).slice(1, -1).length > 0) {
    element.classList.add("clicked");
  }
});
const inputsss = document.querySelectorAll(".input");
inputsss.forEach((element) => {
  element.addEventListener("focusout", function (e) {
    if (
      e.target.parentElement.classList.contains("clicked") &&
      !JSON.stringify(e.target.value).slice(1, -1) > 0
    ) {
      e.target.parentElement.classList.remove("clicked");
    }
  });
  element.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      if (
        e.target.parentElement.classList.contains("clicked") &&
        !JSON.stringify(e.target.value).slice(1, -1) > 0
      ) {
        e.target.parentElement.classList.remove("clicked");
      }
    }
  });
});

// ***********************************************************************************************
// MOBILE MENU UX,UI
// ***********************************************************************************************
const menuButton = document.querySelector(".btn-phone-menu");
const menuIcons = document.querySelectorAll(".btn-phone-menu-icon");

menuButton.addEventListener("click", function (e) {
  //
  container.classList.toggle("visible");
  //
  menuIcons.forEach((el) => {
    el.classList.toggle("icon-visible");
  });
  //
  headerContainer.classList.toggle("phone");
  //
});

navLinks.forEach((e) => {
  e.addEventListener("click", function () {
    //
    container.classList.toggle("visible");
    //
    menuIcons.forEach((el) => {
      el.classList.toggle("icon-visible");
    });
    //
    headerContainer.classList.remove("phone");
  });
});

let heroHeadingCurve = new CircleType(document.querySelector(".hero-heading"));
heroHeadingCurve.radius(600);
// ***********************************************************************************************
// SAUCES
// ***********************************************************************************************
const kebapSauces = document.querySelectorAll(
  ".menu.kebap .menu-items .menu-item section .sauces .sauce"
);
const kebapExtraSauces = document.querySelectorAll(
  ".menu.kebap .menu-items .menu-item article .ingredients .ingredients-list .ingredients-list-item.extra-sauce .sauces .sauce"
);
const saladSauces = document.querySelectorAll(
  ".menu.salad .menu-items .menu-item section .sauces .sauce"
);
const saladExtraSauces = document.querySelectorAll(
  ".menu.salad .menu-items .menu-item article .ingredients .ingredients-list .ingredients-list-item.extra-sauce .sauces .sauce"
);
const durumSauces = document.querySelectorAll(
  ".menu.durum .menu-items .menu-item section .sauces .sauce"
);
const durumExtraSauces = document.querySelectorAll(
  ".menu.durum .menu-items .menu-item article .ingredients .ingredients-list .ingredients-list-item.extra-sauce .sauces .sauce"
);

const sauces = [kebapSauces, saladSauces, durumSauces];
const extraSauces = [kebapExtraSauces, saladExtraSauces, durumExtraSauces];

function saucesClicker(arr) {
  arr.forEach((el) => {
    el.addEventListener("click", function (e) {
      //
      let counter = false;
      arr.forEach((el) => {
        if (el.classList.contains("clicked")) {
          counter = true;
        }
      });
      //
      if (counter === false) {
        if (!e.target.closest(".sauce").classList.contains("clicked")) {
          e.target.closest(".sauce").classList.add("clicked");
        } else if (e.target.closest(".sauce").classList.contains("clicked")) {
          e.target.closest(".sauce").classList.remove("clicked");
        }
      } else if (
        counter === true &&
        e.target.closest(".sauce").classList.contains("clicked")
      ) {
        e.target.closest(".sauce").classList.toggle("clicked");
      }
    });
  });
}
// extra sauces click UX/UI function
// - toggle clicked state for extra sauces
extraSauces.forEach((el) => {
  if (el)
    el.forEach((el) => {
      el.addEventListener("click", function (e) {
        e.target.closest(".sauce").classList.toggle("clicked");
      });
    });
});

sauces.forEach((e) => {
  saucesClicker(e);
});

// *********************************************************************************************************
//ADD-ONS
// *********************************************************************************************************

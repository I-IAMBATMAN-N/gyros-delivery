"use strict";
// **********************************************************************
// MAP
// **********************************************************************
let customerAddress;
const map = L.map("map", {
  minZoom: 15,
  maxZoom: 18,
}).setView([50.06150901362802, 14.590529586293], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  zoom: 20,
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

let searchControl = L.esri.Geocoding.geosearch({
  position: "topright",
  expanded: true,
  collapseAfterResult: false,
  placeholder: "Zadejte adresu",
  useMapBounds: false,
  providers: [
    L.esri.Geocoding.arcgisOnlineProvider({
      apikey:
        "AAPK29248a728a344872b08912104f4d8305oV3LxhImrJrVbX8N0X9EzBAJw0o0jThpAFYuI8C6F-x0T_cjpGK79PK9y1MANL0l",
      nearby: {
        lat: 50.061404122086145,
        lng: 14.58573020897362,
      },
    }),
  ],
}).addTo(map);

let results = L.layerGroup().addTo(map);
let formAddress = "";
let formLatLng = [];

searchControl.on("results", function (data) {
  results.clearLayers();
  formAddress = data.text;
  formLatLng = [data.results[0].latlng.lat, data.results[0].latlng.lng];
  let marker = new L.marker(
    { ...data.results[0].latlng },
    { draggable: "false" }
  );

  arr.push(marker);
  showMarker(data.text);
});
//
let arr = [];
let coords;
function onMapClick(e) {
  // console.log("map", map);
  map.setView({ ...e.latlng }, 16);
  coords = e.latlng;
  // console.log("coords", coords);
  let { lat, lng } = e.latlng;
  L.esri.Geocoding.reverseGeocode({
    apikey:
      "AAPK29248a728a344872b08912104f4d8305oV3LxhImrJrVbX8N0X9EzBAJw0o0jThpAFYuI8C6F-x0T_cjpGK79PK9y1MANL0l",
  })
    .latlng({ ...e.latlng })
    .run(function (err, results, response) {
      if (err) {
        console.log("err", err);
        return;
      }
      formAddress = results.address.Match_addr;
      formLatLng = [lat, lng];

      let marker = new L.marker({ ...e.latlng });
      arr.push(marker);
      showMarker(results.address.Match_addr);
    });
}
function showMarker(text) {
  for (let i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      arr[i].addTo(map).bindPopup(text).openPopup();
    } else {
      map.removeLayer(arr[i]);
    }
  }
}
map.on("click", onMapClick);

// **********************************************************************
// FORM
// **********************************************************************
class Order {
  constructor(orderContent, name, address, phone, payment) {
    this.orderContent = orderContent;
    this.name = name;
    this.address = address;
    this.coords = coords;
    this.phone = phone;
    this.payment = payment;
  }
  getAdress() {
    this.coords = L.esri.Geocoding.reverseGeocode({
      apikey:
        "AAPK29248a728a344872b08912104f4d8305oV3LxhImrJrVbX8N0X9EzBAJw0o0jThpAFYuI8C6F-x0T_cjpGK79PK9y1MANL0l",
    })
      .latlng({ ...coords })
      .run(function (err, results, response) {
        if (err) {
          console.log("err", err);
          return;
        }
        formAddress = results.address.Match_addr;
        let marker = new L.marker({ ...e.latlng });
      });
  }
}

// ************************************************************************
// CREATE ORDER ITEM
// ************************************************************************
let orderItems = [];
class OrderItem {
  constructor(type, sauce, ingredients) {
    this.type = type;
    this.sauce = sauce;
    this.ingredients = ingredients;
  }
}
const firstChecks = document.querySelectorAll(
  ".menu.kebap .menu-items .menu-item article .ingredients .ingredients-list .ingredients-list-item .check-box"
);
const secondChecks = document.querySelectorAll(
  ".menu.salad .menu-items .menu-item article .ingredients .ingredients-list .ingredients-list-item .check-box"
);
const thirdChecks = document.querySelectorAll(
  ".menu.durum .menu-items .menu-item article .ingredients .ingredients-list .ingredients-list-item .check-box"
);

const shoppingCarts = document.querySelectorAll(".shopping-cart");
//
shoppingCarts.forEach((e) => {
  e.addEventListener("click", function (event) {
    createOrderItem(event);
  });
});

// CREATE ORDER ITEM OBJECT
// *******************************************************************
let htmlIndex = 0;
let htmlIndex2 = 0;

function createOrderItem(e) {
  // console.log("ORDER CREATION INITIATED");
  //
  // Selected Menu Item
  const selectedItem =
    e.target.closest(".menu").children[2].children[0].children[0].children[0]
      .children[0].innerText;
  const selectedItem2 = Number(
    e.target
      .closest(".menu")
      .children[2].children[0].children[0].children[0].children[1].children[3].innerText.slice(
        0,
        3
      )
  );
  //
  // Find Selected Sauce
  const saucesHTMLColl = [
    e.target.closest(".menu").children[2].children[0].children[0].children[0]
      .children[1].children[0],
    e.target.closest(".menu").children[2].children[0].children[0].children[0]
      .children[1].children[1],
    e.target.closest(".menu").children[2].children[0].children[0].children[0]
      .children[1].children[2],
  ];
  let sauce;
  saucesHTMLColl.forEach((e) => {
    if (e.classList.contains("clicked")) {
      sauce = e.children[0].innerText;
      // console.log("sauce", sauce);
    }
  });
  //
  // get extra ingredients
  let ingrArr = [];
  if (e.target.closest(".menu").classList.contains("kebap")) {
    checkBoxHandler(firstChecks);
  } else if (e.target.closest(".menu").classList.contains("salad")) {
    checkBoxHandler(secondChecks);
  } else if (e.target.closest(".menu").classList.contains("durum")) {
    checkBoxHandler(thirdChecks);
  }
  // console.log("ingrArr", ingrArr);
  //
  // Create New Order Item Object
  let newOrderItem = new OrderItem(
    [selectedItem, selectedItem2],
    sauce,
    ingrArr
  );
  // add New Order Item to Order Items Array
  orderItems.push([newOrderItem, htmlIndex]);
  htmlIndex++;
  // console.log("orderItems", orderItems);

  function showOrderItems() {
    let firstPart = [];
    let secondPart = [];
    let newHTMLArray = [];
    let newOrderArray = [];

    selectedItemss.innerHTML = ``;
    orderItemHTMLsArray.forEach((e) => {
      selectedItemss.innerHTML += e[0];

      //delete order item event listenner
      document.querySelectorAll(".delete-order-item").forEach((e) => {
        e.addEventListener("click", function (e) {
          const target = e.target;
          orderItemHTMLsArray.forEach((e) => {
            if (Number(target.dataset.id) !== e[1]) {
              newHTMLArray.push(e);
            }
          });
          orderItems.forEach((el) => {
            if (Number(target.dataset.id) !== el[1]) {
              newOrderArray.push(el);
            }
          });
          orderItemHTMLsArray = newHTMLArray;
          orderItems = newOrderArray;
          // console.log("NEW orderItemssArray", newHTMLArray);

          // console.log("NEW orderItemHTMLsArray", newOrderArray);
          showOrderItems();
        });
      });
    });
  }

  // Refresh  Menu Related Interactive Elements
  function checkBoxHandler(arr) {
    arr.forEach((e) => {
      if (e.checked === true) {
        //
        // hiding extra sauce list
        if (e.nextElementSibling.innerText === "omáčka navíc") {
          if (
            e
              .closest(".ingredients-list-item")
              .nextElementSibling.classList.contains("clicked")
          ) {
            e.closest(
              ".ingredients-list-item"
            ).nextElementSibling.classList.remove("clicked");
          }
          let extraSaucesArr = [];
          extraSaucesArr.push(
            e.closest(".ingredients-list-item").nextElementSibling.children[0]
              .children[0],
            e.closest(".ingredients-list-item").nextElementSibling.children[0]
              .children[1],
            e.closest(".ingredients-list-item").nextElementSibling.children[0]
              .children[2]
          );
          //
          //getting extra sauce
          const extraSHTMLCollection = e.closest(".ingredients-list-item")
            .nextElementSibling.children[0].children;
          //
          // console.log(extraSHTMLCollection[0]);
          //
          const extraSauceElArr = [
            extraSHTMLCollection[0],
            extraSHTMLCollection[1],
            extraSHTMLCollection[2],
          ];
          //
          const extraSauces = [];
          //
          // console.log("extra omacka", extraSauceElArr);
          //
          extraSauceElArr.forEach((el) => {
            if (el.classList.contains("clicked")) {
              extraSauces.push([el.children[0].innerText, 10]);
              // console.log(extraSauces);
            }
          });
          ingrArr.push(extraSauces);
        } else {
          // getting ingredients
          ingrArr.push([
            e.nextElementSibling.innerText,
            e.closest(".input-wrapper").nextElementSibling.innerText.length > 4
              ? 0
              : Number(
                  e
                    .closest(".input-wrapper")
                    .nextElementSibling.innerText.slice(0, 2)
                ),
          ]);
          // ingrArr.push(extraSauces);
          // console.log("ingrArr", ingrArr);
        }
        //
        // Creating Order Item
      }
    });
  }
  createOrderItems([newOrderItem, htmlIndex2]);
  htmlIndex2++;
  showOrderItems();
}

// *******************************************************************
// CREATE ORDER ITEM UX/UI Handlers
// *******************************************************************
// ONLY MEAT SALAD TEXT SCRATCHER
//
const checkBoxes = document.querySelectorAll(".check-box");
checkBoxes.forEach((e) => {
  e.addEventListener("click", function (e) {
    if (
      e.target.nextElementSibling.innerText === "jen maso - 200g" &&
      e.target.closest(".menu")
    ) {
      e.target
        .closest(".menu")
        .children[2].children[0].children[0].children[0].children[0].children[1].classList.toggle(
          "scratched"
        );
    }
  });
});

// CLEARING MENU SELECTION ON ADD TO CART CLICK
function toggleChecks(target) {
  if (target.closest(".menu").classList.contains("salad")) {
    saladSauces.forEach((e) => {
      if (e.classList.contains("clicked")) {
        e.classList.remove("clicked");
      }
    });
    //
    secondChecks.forEach((e) => {
      if ((e.checked = true)) {
        e.checked = false;
      }
    });
  }
  //
  else if (!target.closest(".menu").classList.contains("salad")) {
    if (target.closest(".menu").classList.contains("kebap")) {
      kebapSauces.forEach((e) => {
        if (e.classList.contains("clicked")) {
          e.classList.remove("clicked");
        }
      });
      //
      firstChecks.forEach((e) => {
        if ((e.checked = true)) {
          if (
            (e.checked =
              true &&
              e.nextElementSibling.innerText === "jen maso - 200g" &&
              e
                .closest(".menu")
                .children[2].children[0].children[0].children[0].children[0].children[1].classList.contains(
                  "scratched"
                ))
          ) {
            e.closest(
              ".menu"
            ).children[2].children[0].children[0].children[0].children[0].children[1].classList.toggle(
              "scratched"
            );
          }
          e.checked = false;
        }
      });
    } else if (target.closest(".menu").classList.contains("durum")) {
      durumSauces.forEach((e) => {
        if (e.classList.contains("clicked")) {
          e.classList.remove("clicked");
        }
      });
      //
      thirdChecks.forEach((e) => {
        if ((e.checked = true)) {
          if (
            (e.checked =
              true & (e.nextElementSibling.innerText === "jen maso - 200g") &&
              e
                .closest(".menu")
                .children[2].children[0].children[0].children[0].children[0].children[1].classList.contains(
                  "scratched"
                ))
          ) {
            e.closest(
              ".menu"
            ).children[2].children[0].children[0].children[0].children[0].children[1].classList.toggle(
              "scratched"
            );
          }
          //
          e.checked = false;
        }
      });
    }
  }
}
//
shoppingCarts.forEach((el) => {
  el.addEventListener("click", function (e) {
    toggleChecks(e.target);
  });
});
//
// DISPLAY EXTRA SAUCE ON "EXTRASAUCE CHECKBOX" CLICK
[firstChecks, secondChecks, thirdChecks].forEach((e) => {
  displayExtraSauce(e);
});
function displayExtraSauce(arr) {
  arr.forEach((e) => {
    e.addEventListener("click", function () {
      arr.forEach((e) => {
        if (
          e.checked === true &&
          e.nextElementSibling.innerText === "omáčka navíc"
        ) {
          e.closest(".ingredients-list-item").nextElementSibling.classList.add(
            "clicked"
          );
        } else if (
          e.checked === false &&
          e.nextElementSibling.innerText === "omáčka navíc"
        ) {
          e.closest(
            ".ingredients-list-item"
          ).nextElementSibling.classList.remove("clicked");
        }
      });
    });
  });
}

let orderPrice = 0;
let ingredientsPrice = 0;

// *********************************************************************
// DISPLAY ORDER ITEMS in SELECTED ITEMS SECTION
// *********************************************************************
function createOrderItems(workingArr) {
  function getPrice(arr) {
    ingredientsPrice = 0;
    arr.forEach((e) => {
      if (!Array.isArray(e[0])) {
        ingredientsPrice += e[1];
      } else if (Array.isArray(e[0])) {
        e.forEach((e) => {
          ingredientsPrice += e[1];
        });
      }
    });
    return ingredientsPrice;
  }
  //
  function fillIngredients(arr) {
    let returnedHTML = ``;
    arr.forEach((e) => {
      if (!Array.isArray(e[0])) {
        returnedHTML += `<li class="order-item-ingredients-item">${e[0]} 
          <span class="order-item-ingr-price">${e[1]},-</span>
          </li>`;
      } else if (Array.isArray(e[0])) {
        returnedHTML += `<h2>Extra omáčky</h2>`;
        e.forEach((e) => {
          returnedHTML += `<li class="order-item-ingredients-item">${e[0]} 
            <span class="order-item-ingr-price">${e[1]},-</span>
            </li>`;
        });
      }
    });
    return returnedHTML;
  }

  const [orderIt, orderIndex] = workingArr;
  // console.log("orderIt", orderIt);
  const orderItemsInnerHTML = `
      <article class="order-items">
        <header>
          <h2 class="order-title">
            ${orderIt.type[0]}
          </h2>
          <p class="order-sauce-content">${
            orderIt.sauce === undefined ? "bez omáčky" : orderIt.sauce
          }
          <span class="order-item-ingr-price">${
            orderIt.type[1] + getPrice(orderIt.ingredients)
          },-</span></p>
        </header>
        <section class="order-item-ingredients">
          <h3 class="order-item-ingredients-header">Přísady</h3>
          ${
            orderIt.ingredients.length > 0
              ? `
            <ul class="order-item-ingredients-list">
              ${fillIngredients(orderIt.ingredients)}
            </ul>`
              : `<p>bez přísad</p>`
          }
        </section>
        <button data-id="${orderIndex}"type="button" class="delete-order-item">
        odstranit položku
        </button>
      </article>
  `;
  orderItemHTMLsArray.push([orderItemsInnerHTML, orderIndex]);
}

// ******************************************************************
//  SENDING ORDER as EMAIL
// ******************************************************************
const button = document.querySelector(".btn-send-order");
const form = document.querySelector(".order-form");
// const emailInput = document.querySelector("#email");
const paymentInput = document.querySelector("#payment-type");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#tel");
const selectedItemsContainer = document.querySelector(
  ".selected-items-container"
);
const formHeader = document.querySelector(".form-header");

let orderItemHTMLsArray = [];
const days = [
  "Neděle",
  "Pondělí",
  "Úterý",
  "Středa",
  "Čtvrtek",
  "Pátek",
  "Sobota",
];
let datum = new Date();
const alertStringOpening =
  "Momentálně máme zavřeno, zkuste to prosím jindy. \n\nProvonzí doba:\nPo - Pá\n11:00 - 21:00";

const alertStringError =
  "😣😣Něco se pokazilo 😣😣\n\nZkuste to prosím později,\nnebo objednejte telefonicky na čísle:\n+420606879964";

// console.log("DATCEEEE", datum.getHours());

//
// SEND EMAIL FUNCTION
function sendEmail(object) {
  // console.log("objectobjectobjectobjectobjectobjectobject", object);

  if (
    datum.getHours() > 11 &&
    datum.getHours() < 21 &&
    datum.getDay() > 0 &&
    datum.getDay() < 6
  ) {
    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "gyros.bot@elasticmail.com",
      Password: "5171C1760702F58A4A6BEB6267F423564BE3",
      To: "gyros.objednavky@gmail.com",
      From: "gyros.objednavky@gmail.com",
      Subject: `Objednávka: ${days[datum.getDay()]} ${datum.getHours()}:${
        datum.getMinutes() < 10 ? 0 : ""
      }${datum.getMinutes()} pro ${object.name}`,
      Body: `
      <html>
    <!DOCTYPE html>
    <html lang="cs">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }
          html{
            font-size:62.5%;
          }
          ul{
            list-stlye:none;
          }
          .menu-item {
            width: 90%;
            margin: 0 auto;
            color: #1d2023;
            font-size:1.6rem;
          }
          .menu-item section{
            margin: 2.4rem 0;
            border-bottom: solid 1px #1d2023;
            padding-bottom: 2rem;
          }
          .order-ingredients-item{
            width: 50%;
            display:flex;
          }
          .contacts {
            width: 100%;
            display: flex;
            justify-content:space-between;
          }
          .contact {
            width: 50%;
          }
          .contact a,
          .contact p,
          a.order-adress-link{
            color: #1d2023;
            text-align:center;
            text-decoration: underline;
          }
          .contact-heading{
            text-align:center;
          }
          .order-address {
            width: 100%;
            padding: 0.6rem 0;
          }
          .order-address p{
            text-align:center;
          }
          .ingr-price{
            margin-left: auto;
          }
          .price{
            text-align:right;
          }
          .order.price{
            font-size: 2rem;
            font-weight:bold;
          }
          .order-complete-price{
            display:flex;
          }
          @media(max-width: 53.125em){
            .menu-item {
              font-size: 1.2rem;
            }
          }
        </style>
      </head>
      <body>
        <section class="menu-item">
          <h1>
            Objednávka pro ${object.name}
          </h1>
          <h1>
            z ${days[datum.getDay()]}, ${datum.getHours()}:${
        datum.getMinutes() < 10 ? 0 : ""
      }${datum.getMinutes()}
          </h1>
          <section class="order-items">
            ${addOrderItems()}
          </section>
          <section>
            <h2 class="order-complete-price">Cena celkem<span class="ingr-price">${orderPrice},-</span></h2>
          </section>
          <section class="order-address">
          <h2 class="contact-heading">Adresa</h2>
          <p><a href="https://www.google.com/maps/dir/?api=1&origin=&destination=${formLatLng}&travelmode=car" class="order-adress-link">${
        object.address
      }</a></p>
          </section>
          <section class="contacts">
            <div class="contact">
              <h2 class="contact-heading">Telefon</h2>
              <p>
                <a
                  href="tel:+420${object.phone}"
                  >+420 ${object.phone}</a
                >
              </p>
            </div>
            <div class="contact">
              <h2 class="contact-heading">Platba</h2>
              <p>
                ${paymentInput.value}
              </p>
            </div>
          </section>
        </section>
      </body>
    </html>
       `,
    }).then((message) => {
      if (message === "OK") {
        formHeader.innerText = "Děkujeme,\nza objednávku";
        formHeader.classList.add("order-completed");
        selectedItemss.style.flex = "0 0 45%";
        document.querySelector(".customer-adress-container").style.flex =
          "0 0 0%";
        btnSendOrder.style.flex = "0 0 0%";
        btnSendOrder.style.opacity = "0%";
      } else {
        alert(/*message*/ alertStringError);
      }
    });
  } else {
    alert(alertStringOpening);
  }

  //
  function addOrderItems() {
    orderPrice = 0;
    const orderContentArray = [...object.orderContent];
    // console.log("object.orderContent", orderContentArray);
    let returnedHTML = `
    `;
    orderContentArray.forEach((e) => {
      orderPrice += e[0].type[1];
      returnedHTML += `
      <section class="order-item">
      <h1 class="order-heading">
      ${e[0].type[0]}
      </h1>
      <p class="order-sauce">
        ${e[0].sauce === undefined ? "bez omáčky" : e[0].sauce}
      </p>
      <p class="price">
      ${e[0].type[1]},-
      </p>
      <h3 class="ingredients-heading">
        Přísady
      </h3>
      <ul class="order-ingredients">
      ${returnIngredientsHTML(e[0])}
      </ul>
      <p class="order price">
      ${e[0].type[1] + ingredientsPrice},-
      </p>
    </section>`;
    });

    //
    function returnIngredientsHTML(e) {
      let ingredientsHTML = ``;
      ingredientsPrice = 0;
      e.ingredients.forEach((e) => {
        if (!Array.isArray(e[0])) {
          ingredientsPrice += e[1];
          ingredientsHTML += `
          <li class="order-ingredients-item">${e[0]}<span class="ingr-price">${e[1]},-</span>
          </li>
          `;
        } else if (Array.isArray(e[0])) {
          ingredientsHTML += `
          <h3 class="ingredients-heading">
            Extra omáčka
          </h3>
          `;
          e.forEach((e) => {
            ingredientsPrice += e[1];
            ingredientsHTML += `
            <li class="order-ingredients-item">${e[0]}<span class="ingr-price">${e[1]},-</span>
            </li>
            `;
          });
        }
      });
      orderPrice += ingredientsPrice;
      //
      return ingredientsHTML;
    }
    // object.orderContent.forEach((e) => {
    //   // console.log("orderContent", e);
    // });
    return returnedHTML;
  }
}

const selectedItemss = document.querySelector(".selected-items");
const btnSendOrder = document.querySelector(".btn-send-order");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (
    !nameInput.value.length > 0 ||
    !phoneInput.value.length > 0 ||
    !formAddress
  ) {
    alert("Vyplnte prosím všechny pole");
    return;
  } else if (nameInput.value.length > 0 || phoneInput.value.length > 0) {
    let order = new Order(
      orderItems,
      nameInput.value,
      formAddress,
      phoneInput.value,
      paymentInput.value
    );
    // console.log("order", order);
    sendEmail(order);
  }
});

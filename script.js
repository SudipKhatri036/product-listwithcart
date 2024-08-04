const productContainer = document.querySelector(".grid-container");
const cartProductListContainer = document.querySelector(".cart-product-lists");
const noProductMsg = document.querySelector(".no-items-content");
const cartOrderDetailContainer = document.querySelector(".cart-order-detail");
const totalProductQty = document.querySelector(".total-product");
const totalPrice = document.querySelector(".total-amt h2");
const confirmationWrapper = document.querySelector(".overlay-wrapper");
const confirmationProductList = document.querySelector(
  ".confirmation-product-list"
);
const confirmationTotalAmt = confirmationWrapper.querySelector(".total-amt h2");
const confirmBtn = document.querySelector(".confirm-btn");
const newOrderBtn = document.querySelector(".new-order-btn");

const state = {
  carts: [],
};

const getJson = async function () {
  try {
    const res = await fetch("./data.json");
    if (!res.ok) return;
    const data = await res.json();

    state.products = data;
  } catch (error) {
    console.error(error.message);
  }
};

const renderProductList = async function () {
  // Getting Data and Setting  as stat.products value
  await getJson();

  // Check Current Device
  let viewPort;
  const productsHTML = state.products
    .map((product) => {
      if (window.innerWidth > 1024) viewPort = product.image.desktop;
      else if (window.innerWidth > 767) viewPort = product.image.tablet;
      else viewPort = product.image.mobile;
      return `
        <li class="product-items" data-category="${product.category}">
            <img src="${viewPort}" alt="${product.name}" class="product-img" />
            <div class="btn-container">
              <button class="add-to-btn">
                <img
                  src="./assets/images/icon-add-to-cart.svg"
                  alt="Add to Cart Svg"
                  class="icon-svg"
                />Add to Cart
              </button>

              <div class="added-content ">
                <button class="id-btn decrement-btn">
                  <svg
                  class="dec-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="2"
                    fill="none"
                    viewBox="0 0 10 2"
                  >
                    <path fill="" d="M0 .375h10v1.25H0V.375Z" />
                  </svg>
                </button>
                <p class="quantity">1</p>
                <button class="id-btn increment-btn">
                  <svg
                  class="inc-svg"
                  
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                <path
                  fill=""
                  d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                />
              </svg>
                </button>
               
              </div>
              </button>
              </div>
              <div class="details">
              <p class="category">${product.category}</p>
              <h3>${product.name}</h3>
              <p class="price">$${product.price.toFixed(2)}</p>
              </div>
              </li>
              `;
    })
    .join("");

  // Inserting Products HTML inside ProductContainer
  productContainer.insertAdjacentHTML("afterbegin", productsHTML);
};

renderProductList();

// Render Cart Function
const renderCart = function (cartProducts) {
  const cartHTML = cartProducts
    .map((product) => {
      return `
        <li class="cart-product" data-category="${product.category}">
            <div>
              <p class="product-name">${product.name}</p>
              <div class="cart-info">
                <p class="product-quantity">${product.quantity}x</p>
                <p class="product-rate">@ $${product.price.toFixed(2)}</p>
                <p class="product-total-amt">$${product.totalItemPrice.toFixed(
                  2
                )}</p>
              </div>
            </div>
            <button class="delete-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="none"
                viewBox="0 0 10 10"
                >
                <path
                d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
                />
                </svg>
            </button>
            </li>
            `;
    })
    .join("");

  cartProductListContainer.insertAdjacentHTML("afterbegin", cartHTML);
};

// Calculating Single Items Total Amt Function
const calculateItemTotal = function (cartItems) {
  cartItems.totalItemPrice = cartItems.price * cartItems.quantity;
};

// Updating Total Cart Items and Total Amount Function
const updateCartTotal = function (cartItems) {
  const totalAmt = cartItems
    .reduce((total, curVal) => {
      return total + curVal.totalItemPrice;
    }, 0)
    .toFixed(2);
  const calculatedTotalQty = cartItems.reduce((total, curVal) => {
    return total + curVal.quantity;
  }, 0);

  totalPrice.textContent = `$${totalAmt}`;
  confirmationTotalAmt.textContent = `$${totalAmt}`;
  totalProductQty.textContent = calculatedTotalQty;
};

// Updating Cart UI Function
const UpdateCartUI = function (productsObj) {
  cartProductListContainer.innerHTML = "";
  calculateItemTotal(productsObj);
  updateCartTotal(state.carts);
  renderCart(state.carts);
};

// Increase Qty Function
const increaseQty = function (category) {
  const productsObj = state.carts.find(
    (product) => product.category === category
  );

  productsObj.quantity++;

  UpdateCartUI(productsObj);
  return productsObj.quantity;
};

// Decrease Qty Function
const deacreaseQty = function (category) {
  const productsObj = state.carts.find(
    (product) => product.category === category
  );
  if (productsObj.quantity > 1) {
    productsObj.quantity--;
    UpdateCartUI(productsObj);
  }
  return productsObj.quantity;
};

const handleClick = async function (e) {
  const btnContainer = e.target.closest(".btn-container");

  // if (!btnContainer) return;
  if (!btnContainer) return;

  // Changing Btn to increment or decrement value

  btnContainer.closest(".product-items").classList.add("active");
  const category = btnContainer.closest(".product-items").dataset.category;

  await getJson();
  // Product is added to cart array as object
  const productObj = state.products.find(
    (product) => product.category === category
  );

  if (e.target.closest(".add-to-btn")) {
    productObj.quantity = 1;
    productObj.totalItemPrice = productObj.price;
  }

  // Cheicking if btn clicked is increment Btn and handling it
  if (e.target.closest(".increment-btn")) {
    const qt = increaseQty(category);
    btnContainer.querySelector(".quantity").textContent = qt;
  }

  // Cheicking if btn clicked is decrement Btn and handling it
  if (e.target.closest(".decrement-btn")) {
    const qt = deacreaseQty(category);
    btnContainer.querySelector(".quantity").textContent = qt;
  }

  //   Checking Weather cart contains same item
  if (state.carts.some((product) => product.category === category)) return;

  //   Adding product items in cart
  state.carts.push(productObj);

  //   Hiding No Product Message and clearing cartProductListContainer
  noProductMsg.classList.add("hidden");
  cartOrderDetailContainer.classList.remove("hidden");

  // Updating Cart UI
  UpdateCartUI(productObj);
};

// Delete Specific Cart Handler Function
const deleteCartItemHandler = function (e) {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;
  const listItemCategory = deleteBtn.closest(".cart-product").dataset.category;

  const indexOfItem = state.carts.findIndex(
    (cart) => cart.category === listItemCategory
  );

  state.carts.splice(indexOfItem, 1);
  // document.querySelectorAll("div.btn-container").forEach((btn) => {
  //   btn.classList.remove("active");
  //   btn.querySelector(".quantity").textContent = 1;
  // });
  const productLiEl = document.querySelector(
    `.product-items[data-category="${listItemCategory}"]`
  );
  productLiEl.classList.remove("active");
  // productLiEl.classList.remove("active");
  productLiEl.querySelector("p.quantity").textContent = 1;

  cartProductListContainer.innerHTML = "";

  if (state.carts.length === 0) {
    cartOrderDetailContainer.classList.add("hidden");
    noProductMsg.classList.remove("hidden");
  }

  updateCartTotal(state.carts);
  renderCart(state.carts);
};

// Rendering OrderConfirmed Values
const renderConfirmationCart = function () {
  const listHTML = state.carts
    .map((product) => {
      return `
     <li class="cart-product">
              <div class="cart-info">
                <img
                  src="${product.image.thumbnail}"
                  alt="${product.name}"
                  class="thumbnail"
                />
                <div>
                  <p class="product-name">${product.name}</p>
                  <p class="product-quantity">${product.quantity}x</p>
                  <p class="product-rate">@ $${product.price.toFixed(2)}</p>
                </div>
              </div>
              <p class="product-total-amt">$${product.totalItemPrice.toFixed(
                2
              )}</p>
            </li>
    `;
    })
    .join("");

  confirmationProductList.insertAdjacentHTML("afterbegin", listHTML);
};

// Reseting All Details Function For New Order
const resetDetails = function () {
  state.carts = [];
  cartProductListContainer.innerHTML = "";
  totalProductQty.textContent = state.carts.length;
  totalPrice.textContent = "$0.00";
  confirmationWrapper.classList.remove("active");
  confirmationProductList.innerHTML = "";
  noProductMsg.classList.remove("hidden");
  cartOrderDetailContainer.classList.add("hidden");
  document.querySelectorAll(".product-items").forEach((product) => {
    product.classList.remove("active");
    product.querySelector(".quantity").textContent = 1;
  });
};

const confirmBtnHandler = function () {
  if (window.innerWidth < 767) {
    document
      .querySelector(".grid-container")
      .scrollIntoView({ behavior: "smooth" });
  }
  confirmationWrapper.classList.add("active");
  renderConfirmationCart();
};
// Event Listeners
productContainer.addEventListener("click", handleClick);
cartProductListContainer.addEventListener("click", deleteCartItemHandler);
confirmBtn.addEventListener("click", confirmBtnHandler);
newOrderBtn.addEventListener("click", resetDetails);

document.querySelector(".anim").addEventListener("mouseover", function () {
  document.querySelector(".anim").style.animationPlayState = "paused";
});

document.querySelector(".anim").addEventListener("mouseout", function () {
  document.querySelector(".attribution>p").style.animationPlayState = "running";
});

const cartPopup = document.querySelector(".popup");
const cartList = document.querySelector("#popup_product_list");
const cartQuant = document.querySelector("#cart_num");
const finallyCost = document.querySelector("#popup_cost");
const finallyDiscount = document.querySelector("#popup_discount");
const finallyCostWithDiscount = document.querySelector("#popup_cost_discount");
document.querySelector("#cart").addEventListener("click", openCart);
document.querySelector(".popup__close").addEventListener("click", closeCart);

document
  .querySelectorAll(".card__add")
  .forEach((btn) => btn.addEventListener("click", addProductToCartAndSaveLS));

const cart = JSON.parse(localStorage.getItem("cart")) || [];
cartQuant.innerHTML = cart.length;

function addProductToCartAndSaveLS(e) {
  const product = createProduct(e.target.closest(".card"));
  cart.push(product);
  saveProductToLS();
  cartQuant.innerHTML = cart.length;
}

function saveProductToLS() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function createProduct(item) {
  return {
    name: item.querySelector(".card__title").innerText,
    img: item.querySelector("img").src,
    price: item.querySelector(".card__price--common").innerText,
    discount: item.querySelector(".card__price--discount").innerText,
  };
}

function createCartFromLS() {
  cartList.innerHTML = "";
  finallyCost.innerHTML = 0;
  finallyDiscount.innerHTML = 0;
  finallyCostWithDiscount.innerHTML = 0;
  JSON.parse(localStorage.getItem("cart")).forEach((product, idx) => {
    const productItem = document.createElement("div");
    productItem.classList.add("popup__product");

    const productWrap1 = document.createElement("div");
    productWrap1.classList.add("popup__product-wrap");
    const productWrap2 = document.createElement("div");
    productWrap2.classList.add("popup__product-wrap");

    const productImage = document.createElement("img");
    productImage.classList.add("popup__product-image");
    productImage.setAttribute("src", product.img);

    const productTitle = document.createElement("h2");
    productTitle.classList.add("popup__product-title");
    productTitle.innerHTML = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("popup__product-price");
    productPrice.innerHTML =
      product.price.replace(" ", "") - product.discount.replace(" ", "");

    const productDiscount = document.createElement("div");
    productDiscount.classList.add("popup__product-priceWithDiscount");
    productDiscount.innerHTML = toCurrency(toNum(product.discount));

    const productDelete = document.createElement("button");
    productDelete.classList.add("popup__product-delete");
    productDelete.innerHTML = "&#10006;";
    productDelete.addEventListener("click", () => removeProduct(idx));

    productWrap1.appendChild(productImage);
    productWrap1.appendChild(productTitle);
    productWrap2.appendChild(productPrice);
    productWrap2.appendChild(productDiscount);
    productWrap2.appendChild(productDelete);
    productItem.appendChild(productWrap1);
    productItem.appendChild(productWrap2);
    cartList.appendChild(productItem);

    finallyCost.innerHTML =
      +finallyCost.innerText + +product.price.replace(" ", "");
    finallyDiscount.innerHTML =
      +finallyDiscount.innerText +
      +product.price.replace(" ", "") -
      +product.discount.replace(" ", "");
    finallyCostWithDiscount.innerHTML =
      +finallyCostWithDiscount.innerText + +product.discount.replace(" ", "");
  });
}

function openCart() {
  cartPopup.classList.add("popup--open");
  document.body.classList.add("lock");
  createCartFromLS();
}
function closeCart() {
  cartPopup.classList.remove("popup--open");
  document.body.classList.remove("lock");
}

function removeProduct(idx) {
  finallyCost.innerHTML =
    finallyCost.innerText - cart[idx].price.replace(" ", "");
  finallyDiscount.innerHTML =
    finallyDiscount.innerText - cart[idx].discount.replace(" ", "");
  finallyCostWithDiscount.innerHTML =
    finallyCostWithDiscount.innerText -
    (cart[idx].price.replace(" ", "") - cart[idx].discount.replace(" ", ""));
  cart.splice(idx, 1);
  cartQuant.innerHTML = cart.length;
  saveProductToLS();
  createCartFromLS();
}

function toNum(str) {
  const num = Number(str.replace(/ /g, ""));
  return num;
}

function toCurrency(num) {
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num);
  return format;
}

const handleEscapePress = (e) => {
  if (e.key === "Escape") {
    closeCart();
  }
};

window.addEventListener("keydown", handleEscapePress);

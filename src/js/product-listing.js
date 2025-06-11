import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./productList.mjs";



loadHeaderFooter();
const category = getParam("category");
const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const sortElement = document.getElementById("sort-options");

const listing = new ProductList(category, dataSource, listElement, sortElement);


listing.init();


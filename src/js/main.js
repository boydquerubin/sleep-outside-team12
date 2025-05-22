import ProductData from "./productData.mjs";
import ProductList from "./productList.mjs";
import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();


const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

productList.init();
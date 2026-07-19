// discriminated-unions -> every type will have a common-property

import { string } from "zod";

type ProductState = {
  status: "available";
  name: string;
  price: number;
}

{
  status: "outOfStock";
  name: string;
  restoreDate: string;
}

{
  status: "discontinued";
  name: string;
  reason: string;
}

// status - common in all

function printProductInfo(product: ProductState): void {
  if (product.status === "available") {
    return;
  }
  if (product.status === "outOfStock") {
    return;
  }
}

const product1: ProductState = {
  status: "available",
  name: "name",
  price: 67,
};

const product2: ProductState = {
 status: "outOfStock",
  name: "name2",
  restoreDate: "67",
};

type abc = {
  status: "outOfStock" | "available" | "discontinued";
  name: string;
  price: number;
  restoreDate: string;
  reason: string;
};

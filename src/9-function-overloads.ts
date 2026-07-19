type Product = {
  name: string;
  price: number;
  inStock: boolean;
};

const laptopProduct: Product = {
  name: "name",
  price: 567,
  inStock: true,
};

// Create func-overload signature
function getProductValue(product: Product, key: "name"): string;
function getProductValue(product: Product, key: "price"): number;
function getProductValue(product: Product, key: "inStock"): boolean;

function getProductValue(
  product: Product,
  key: "name" | "price" | "inStock",
): string | number | boolean {
  return product[key];
}

const prodName = getProductValue(laptopProduct, "name");
console.log(prodName.toUpperCase());

const prodPrice = getProductValue(laptopProduct, "price");
console.log(prodPrice.toFixed());

// And so on..

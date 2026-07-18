// any - ts ain't protecting you, do whatever
// unknown - ts is gonna force us to check the value before

let looseValue: any = "typescript";
console.log(looseValue.toUpperCase());

looseValue = 100;
console.log(looseValue.toUpperCase()); // ⚠️

// unknown - don't know the type nut, safer than any

let safeValue: unknown = "backend";

// console.log(safeValue.toUpperCase()) // ❌

if (typeof safeValue === "string") {
  console.log(safeValue.toUpperCase()); // ✅
}

let num: unknown = 200;

// console.log(num*5) // ❌

if (typeof num === "number") {
  console.log(num * 5); // ✅
}

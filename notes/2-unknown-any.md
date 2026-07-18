# `any` vs `unknown` in TypeScript (In-Depth)

Both `any` and `unknown` can hold **any type of value**, but they differ in one very important aspect:

* **`any` disables TypeScript's type checking.**
* **`unknown` preserves type safety by requiring us to verify the type before using the value.**

Think of it this way:

* **`any`** = "We don't know the type, and we don't care."
* **`unknown`** = "We don't know the type yet, so we must check it first."

---

# 1. `any`

The `any` type tells TypeScript:

> "Trust us. Don't perform any type checking."

Once a variable becomes `any`, TypeScript stops helping us.

## Example

```ts
let value: any;

value = 10;
value = "Hello";
value = true;
value = [];
value = {};
```

Everything is allowed.

---

## We can perform any operation

```ts
let value: any = "Hello";

value.toUpperCase();
value.toFixed();
value();
value.xyz;
value[100];
```

TypeScript reports **no errors**, even though many of these operations are invalid.

At runtime:

```ts
let value: any = "Hello";

value.toFixed();
```

Output:

```
TypeError: value.toFixed is not a function
```

TypeScript failed to warn us because `any` disables type checking.

---

## `any` spreads

One dangerous property of `any` is that it propagates through our code.

```ts
let a: any = 10;

let b = a;
let c = b;
let d = c;
```

Now:

```
a → any
b → any
c → any
d → any
```

Type safety is lost throughout the chain.

---

## Example

```ts
function add(a: any, b: any) {
    return a + b;
}
```

These all compile:

```ts
add(10, 20);

add("Hello", "World");

add([], {});

add(true, null);
```

TypeScript cannot help us because everything is allowed.

---

# Why is `any` dangerous?

Suppose we fetch data from an API.

```ts
const user: any = fetchUser();
```

We write:

```ts
console.log(user.name.toUpperCase());
```

If the API returns:

```ts
{
    age: 25
}
```

Runtime:

```
Cannot read properties of undefined
```

TypeScript never warned us.

---

# When should we use `any`?

Very rarely.

Examples include:

* Migrating a large JavaScript project to TypeScript.
* Working with poorly typed third-party libraries.
* Temporary debugging.
* Quick prototypes.

Even then, we should try to replace `any` as soon as possible.

---

# 2. `unknown`

`unknown` also accepts every type of value.

```ts
let value: unknown;

value = 10;
value = "Hello";
value = true;
value = [];
value = {};
```

Everything above is valid.

The difference appears when we try to **use** the value.

---

## Example

```ts
let value: unknown = "Hello";

value.toUpperCase();
```

TypeScript reports:

```
Object is of type 'unknown'.
```

Unlike `any`, TypeScript refuses to let us use the value until we determine its type.

---

# Type Narrowing

Before using an `unknown` value, we must narrow its type.

```ts
let value: unknown = "Hello";

if (typeof value === "string") {
    console.log(value.toUpperCase());
}
```

Inside the `if` block, TypeScript knows that `value` is a `string`.

---

Another example:

```ts
let value: unknown = 100;

if (typeof value === "number") {
    console.log(value.toFixed(2));
}
```

Now `toFixed()` is allowed because we proved that `value` is a number.

---

# Using Arrays

```ts
let value: unknown = ["React", "Node"];
```

Wrong:

```ts
console.log(value.length);
```

Error.

Correct:

```ts
if (Array.isArray(value)) {
    console.log(value.length);
}
```

---

# Using Objects

```ts
let value: unknown = {
    name: "John"
};
```

Wrong:

```ts
console.log(value.name);
```

Error.

Correct:

```ts
if (
    typeof value === "object" &&
    value !== null &&
    "name" in value
) {
    console.log(value.name);
}
```

---

# Type Assertions

If we are absolutely certain of the type, we can tell TypeScript explicitly.

```ts
let value: unknown = "Hello";

console.log((value as string).toUpperCase());
```

This works, but we should only use assertions when we genuinely know the type.

---

# Function Example

Using `any`

```ts
function print(value: any) {
    console.log(value.toUpperCase());
}
```

Everything compiles:

```ts
print("Hello");

print(100);

print(true);
```

Runtime:

```
TypeError
```

---

Using `unknown`

```ts
function print(value: unknown) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
}
```

Now the function is safe.

---

# API Example

Suppose we receive JSON from an API.

```ts
const response: unknown = JSON.parse(data);
```

We cannot immediately write:

```ts
response.name;
```

Instead:

```ts
if (
    typeof response === "object" &&
    response !== null &&
    "name" in response
) {
    console.log(response.name);
}
```

This prevents many runtime errors.

---

# Assignment Rules

## `any`

```ts
let value: any = 10;

let num: number = value;

let str: string = value;

let arr: string[] = value;
```

Everything is allowed.

---

## `unknown`

```ts
let value: unknown = 10;

let num: number = value;
```

Error:

```
Type 'unknown' is not assignable to type 'number'.
```

We must narrow or assert the type first.

```ts
if (typeof value === "number") {
    let num: number = value;
}
```

---

# Comparison

| Feature                         | `any`      | `unknown`   |
| ------------------------------- | ---------- | ----------- |
| Can store any value             | ✅          | ✅           |
| Type checking                   | ❌ Disabled | ✅ Preserved |
| Can call methods immediately    | ✅          | ❌           |
| Can access properties           | ✅          | ❌           |
| Must narrow type                | ❌          | ✅           |
| Runtime safety                  | ❌ Low      | ✅ High      |
| Recommended for modern projects | ❌ Rarely   | ✅ Yes       |

---

# Visual Representation

### `any`

```
Unknown Data
      │
      ▼
TypeScript
      │
      ▼
"Do whatever we want."
      │
      ▼
Possible runtime errors
```

---

### `unknown`

```
Unknown Data
      │
      ▼
TypeScript
      │
      ▼
"First prove the type."
      │
      ▼
Type Narrowing
      │
      ▼
Safe Operations
```

---

# Real-World Analogy

Imagine we receive a sealed package.

### `any`

We immediately assume what's inside and use it without checking.

```
Package
   │
   ▼
"Let's use it."
```

If we guessed wrong, something may break.

---

### `unknown`

We first open the package, inspect its contents, and then decide how to use it.

```
Package
   │
   ▼
Inspect Contents
   │
   ▼
Identify Type
   │
   ▼
Use Safely
```

---

# Best Practices

* Use **`unknown`** whenever the type is genuinely unknown (e.g., API responses, user input, `JSON.parse()`, external libraries with uncertain types).
* Use **`any`** only as a last resort, such as during gradual migration from JavaScript or when working around missing type definitions.
* Prefer **type narrowing** (`typeof`, `instanceof`, `Array.isArray()`, custom type guards) over type assertions whenever possible.
* If we find ourselves using `any` frequently, it is often a sign that we should define better types or interfaces instead.

> **Rule of Thumb:** If we don't know the type, use **`unknown`**. If we use **`any`**, we are telling TypeScript to stop protecting us. In modern TypeScript codebases, `unknown` should almost always be the preferred choice.

# Custom Type Guards in TypeScript

A **Custom Type Guard** is a function that helps TypeScript determine the **actual type** of a value at runtime.

It is a way of telling TypeScript:

> "If this function returns `true`, we guarantee that the value is of a specific type."

Custom type guards are extremely useful when working with:

* Union types
* `unknown`
* API responses
* Complex objects
* Discriminated unions (when a discriminant property isn't available)
* Generic functions

They allow TypeScript to **narrow types safely** without using unsafe type assertions.

---

# Why Do We Need Custom Type Guards?

Suppose we have two types.

```ts id="9tmvwt"
type Dog = {
  bark(): void;
};

type Cat = {
  meow(): void;
};

type Animal = Dog | Cat;
```

Now suppose we write:

```ts id="pmnp5v"
function makeSound(animal: Animal) {
  animal.bark();
}
```

TypeScript reports:

```text id="ey9pxp"
Property 'bark' does not exist on type 'Animal'.
```

Why?

Because `Animal` might actually be a `Cat`.

TypeScript refuses to guess.

---

# Type Narrowing

We need a way to tell TypeScript which type we have.

One option is using built-in guards.

```ts id="v4hrgc"
if ("bark" in animal) {
  animal.bark();
}
```

Inside the `if` block:

```text id="8f4i63"
animal → Dog
```

This is called **type narrowing**.

---

# What if the Logic is Repeated?

Imagine we perform this check many times.

```ts id="4bx99w"
if ("bark" in animal) {
  ...
}
```

```ts id="0y1bm4"
if ("bark" in anotherAnimal) {
  ...
}
```

```ts id="d5i32b"
if ("bark" in pet) {
  ...
}
```

The same logic is repeated everywhere.

A better solution is a **custom type guard**.

---

# Creating a Custom Type Guard

Syntax:

```ts id="nhpywl"
function isDog(animal: Animal): animal is Dog {
  return "bark" in animal;
}
```

This syntax is very important.

```ts id="vx3u7x"
animal is Dog
```

This is called a **type predicate**.

It tells TypeScript:

> "Whenever this function returns `true`, treat `animal` as a `Dog`."

---

# Understanding the Return Type

Notice this is **not**:

```ts id="9p3v55"
boolean
```

Instead it is:

```ts id="5wtuxm"
animal is Dog
```

Both functions return `true` or `false` at runtime.

The difference is that the second one gives TypeScript extra type information.

---

Normal function:

```ts id="1vkhxy"
function isDog(animal: Animal): boolean {
  return "bark" in animal;
}
```

TypeScript learns nothing.

---

Custom type guard:

```ts id="lj6bms"
function isDog(animal: Animal): animal is Dog {
  return "bark" in animal;
}
```

TypeScript narrows the type automatically.

---

# Using the Guard

```ts id="ut8t6u"
function makeSound(animal: Animal) {
  if (isDog(animal)) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

Inside:

```ts id="g97oz2"
if (isDog(animal))
```

TypeScript knows:

```text id="txo6xg"
animal → Dog
```

Inside the `else` block:

```text id="zkmkfx"
animal → Cat
```

No type assertions are needed.

---

# Visual Representation

Initially:

```text id="6pfbj6"
Animal

↓

Dog | Cat
```

---

After calling:

```ts id="c2pkon"
isDog(animal)
```

If `true`:

```text id="9q3l7m"
Dog
```

If `false`:

```text id="q8id7y"
Cat
```

---

# Example with `unknown`

Custom type guards are especially useful with `unknown`.

Suppose we receive data from an API.

```ts id="stxqfc"
const response: unknown = JSON.parse(data);
```

We expect:

```ts id="vjfnrk"
type User = {
  name: string;
  age: number;
};
```

We create a guard.

```ts id="ffl7kc"
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "age" in value
  );
}
```

Now:

```ts id="hz31qi"
if (isUser(response)) {
  console.log(response.name);
}
```

TypeScript now knows:

```text id="79fbi8"
response → User
```

---

# Why Not Use `as`?

Many beginners write:

```ts id="uf1ttr"
const user = response as User;
```

This simply tells TypeScript:

> "Trust us."

No verification happens.

If the API returns:

```ts id="1csdcv"
{
  username: "John"
}
```

Runtime:

```text id="y3rjc9"
Cannot read property 'name'
```

Custom type guards actually perform a runtime check before narrowing the type.

---

# Real-World Example: Payment Methods

```ts id="n6q2e3"
type Card = {
  cardNumber: string;
};

type PayPal = {
  email: string;
};

type Payment = Card | PayPal;
```

Guard:

```ts id="ssy0vl"
function isCard(payment: Payment): payment is Card {
  return "cardNumber" in payment;
}
```

Usage:

```ts id="55fyp4"
function process(payment: Payment) {
  if (isCard(payment)) {
    console.log(payment.cardNumber);
  } else {
    console.log(payment.email);
  }
}
```

---

# Using Multiple Guards

```ts id="hllptf"
type Circle = {
  radius: number;
};

type Rectangle = {
  width: number;
  height: number;
};

type Square = {
  side: number;
};

type Shape =
  | Circle
  | Rectangle
  | Square;
```

Guards:

```ts id="k4xw6s"
function isCircle(shape: Shape): shape is Circle {
  return "radius" in shape;
}
```

```ts id="uk1dnl"
function isRectangle(shape: Shape): shape is Rectangle {
  return "width" in shape;
}
```

Usage:

```ts id="r37l0j"
function getArea(shape: Shape) {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2;
  }

  if (isRectangle(shape)) {
    return shape.width * shape.height;
  }

  return shape.side ** 2;
}
```

---

# Type Guard vs Boolean Function

Normal function:

```ts id="b5pckp"
function isString(value: unknown): boolean {
  return typeof value === "string";
}
```

Usage:

```ts id="48wt2s"
if (isString(value)) {
  value.toUpperCase();
}
```

Error.

TypeScript still sees:

```text id="w8ws2i"
unknown
```

---

Custom type guard:

```ts id="x9qrh3"
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

Now:

```ts id="m3n5s5"
if (isString(value)) {
  value.toUpperCase();
}
```

Works perfectly.

---

# Using Arrays

```ts id="uoh6j7"
function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(item => typeof item === "string")
  );
}
```

Usage:

```ts id="qjzn0n"
if (isStringArray(data)) {
  data.forEach(item => console.log(item.toUpperCase()));
}
```

---

# Type Guards with Classes

```ts id="7tltgi"
class Dog {
  bark() {}
}

class Cat {
  meow() {}
}

type Animal = Dog | Cat;
```

Guard:

```ts id="r0xmf4"
function isDog(animal: Animal): animal is Dog {
  return animal instanceof Dog;
}
```

Usage:

```ts id="mibw13"
if (isDog(animal)) {
  animal.bark();
}
```

---

# Type Guards vs Discriminated Unions

Suppose we have:

```ts id="9y2j2n"
type Circle = {
  kind: "circle";
  radius: number;
};
```

Then:

```ts id="1f4u6k"
if (shape.kind === "circle")
```

TypeScript already narrows the type automatically.

We do **not** need a custom type guard.

Custom guards are more useful when:

* There is no discriminant property.
* The type is `unknown`.
* The narrowing logic is complex.
* The same check is reused in multiple places.

---

# Common Mistakes

## Mistake 1: Returning `boolean`

Incorrect:

```ts id="wupm7h"
function isDog(animal: Animal): boolean {
  return "bark" in animal;
}
```

This returns `true` or `false`, but TypeScript does **not** narrow the type.

Correct:

```ts id="qjjb3s"
function isDog(animal: Animal): animal is Dog {
  return "bark" in animal;
}
```

---

## Mistake 2: Using Unsafe Assertions

Incorrect:

```ts id="pxt2m8"
const user = response as User;
```

This bypasses TypeScript's safety.

Prefer:

```ts id="u42clx"
if (isUser(response)) {
  console.log(response.name);
}
```

---

## Mistake 3: Weak Runtime Checks

Incorrect:

```ts id="ykrvzk"
function isUser(value: unknown): value is User {
  return typeof value === "object";
}
```

Every object satisfies this condition, even objects that are not `User`.

Prefer checking the required properties.

```ts id="4apjlwm"
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "age" in value
  );
}
```

---

# Visual Summary

```text
Unknown Value
      │
      ▼
Custom Type Guard
      │
      ▼
Returns true?
      │
 ┌────┴────┐
 │         │
Yes       No
 │         │
 ▼         ▼
Specific   Original
 Type       Type
```

---

# Comparison

| Normal Boolean Function    | Custom Type Guard                              |
| -------------------------- | ---------------------------------------------- |
| Returns `boolean`          | Returns a type predicate (`value is Type`)     |
| Performs runtime checks    | Performs runtime checks                        |
| Does not narrow types      | Narrows types automatically                    |
| Less useful for TypeScript | Fully integrated with TypeScript's type system |

---

# Best Practices

* Use custom type guards whenever we repeatedly check whether a value belongs to a specific type.
* Prefer custom type guards over repeated inline checks to keep our code reusable and easier to maintain.
* Use them extensively when working with `unknown`, API responses, or third-party data.
* Perform meaningful runtime validation inside the guard instead of relying on type assertions.
* Prefer discriminated unions when a shared literal property (`kind`, `type`, `status`, etc.) is available, as they provide automatic narrowing without additional helper functions.

> **Rule of Thumb:** If TypeScript cannot determine the exact type on its own and we repeatedly perform the same runtime check, create a custom type guard. It combines runtime validation with compile-time type narrowing, giving us both safety and reusable code.

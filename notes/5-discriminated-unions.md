# Discriminated Unions in TypeScript (In-Depth)

A **Discriminated Union** is a technique in TypeScript that allows us to safely work with multiple related object types by using a **common property**, called the **discriminant** (or **tag**), to determine which specific type we are dealing with.

It is one of the most powerful features of TypeScript because it enables **automatic type narrowing**, making our code safer, cleaner, and easier to maintain.

---

# Why Do We Need Discriminated Unions?

Suppose we are building a drawing application that supports different shapes.

Each shape has different properties.

* Circle → `radius`
* Rectangle → `width`, `height`
* Square → `side`

Without discriminated unions, we might define:

```ts
type Shape = {
  radius?: number;
  width?: number;
  height?: number;
  side?: number;
};
```

Now suppose we want to calculate the area.

```ts
function getArea(shape: Shape) {
  return Math.PI * shape.radius * shape.radius;
}
```

TypeScript reports an error.

```
'radius' is possibly undefined.
```

Why?

Because `Shape` may not actually represent a circle.

It could be:

* Rectangle
* Square
* Or another shape

TypeScript cannot determine which properties are available.

---

# The Solution

Instead of one object with many optional properties, we create **multiple object types**.

```ts
type Circle = {
  kind: "circle";
  radius: number;
};

type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type Square = {
  kind: "square";
  side: number;
};
```

Now combine them.

```ts
type Shape = Circle | Rectangle | Square;
```

Notice something important.

Every object has a common property:

```ts
kind
```

But its value is different.

```text
Circle
kind = "circle"

Rectangle
kind = "rectangle"

Square
kind = "square"
```

This property is called the **discriminant** or **tag**.

---

# Why is it called a "Discriminated" Union?

The word **discriminate** means:

> To distinguish one thing from another.

The `kind` property allows TypeScript to distinguish between different members of the union.

---

# Visual Representation

```
            Shape
              │
     ┌────────┼────────┐
     │        │        │
 Circle   Rectangle  Square
     │        │        │
 kind     kind      kind
=circle =rectangle =square
```

The `kind` property uniquely identifies every object.

---

# Automatic Type Narrowing

Now suppose we write:

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }
}
```

Inside the `if` block, TypeScript automatically knows:

```
shape is Circle
```

So we can safely access:

```ts
shape.radius
```

without any errors.

---

# Another Example

```ts
function getArea(shape: Shape) {
  if (shape.kind === "rectangle") {
    return shape.width * shape.height;
  }
}
```

Inside the block:

```
shape becomes Rectangle
```

So:

```ts
shape.width
shape.height
```

are available.

---

# Full Example

```ts
type Circle = {
  kind: "circle";
  radius: number;
};

type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type Square = {
  kind: "square";
  side: number;
};

type Shape = Circle | Rectangle | Square;

function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }

  if (shape.kind === "rectangle") {
    return shape.width * shape.height;
  }

  return shape.side ** 2;
}
```

Notice that after the first two conditions, TypeScript automatically infers that the remaining case must be `Square`.

No additional type assertions are needed.

---

# Using `switch`

Discriminated unions are commonly used with `switch`.

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;

    case "rectangle":
      return shape.width * shape.height;

    case "square":
      return shape.side ** 2;
  }
}
```

This is often the preferred approach because it is easy to read and scales well.

---

# Why is This Better?

Without discriminated unions:

```ts
type Shape = {
  radius?: number;
  width?: number;
  height?: number;
  side?: number;
};
```

We constantly need to check for `undefined`.

```ts
if (shape.radius !== undefined) {
    ...
}
```

This quickly becomes messy.

With discriminated unions:

```ts
if (shape.kind === "circle") {
    shape.radius
}
```

TypeScript already knows the exact type.

---

# Real-World Example 1: API Responses

Suppose an API returns either success or failure.

Without discriminated unions:

```ts
type Response = {
  data?: string;
  error?: string;
};
```

Now we must constantly check:

```ts
if (response.data) {
    ...
}
```

or

```ts
if (response.error) {
    ...
}
```

This does not clearly express the relationship between success and failure.

---

Using discriminated unions:

```ts
type SuccessResponse = {
  status: "success";
  data: string;
};

type ErrorResponse = {
  status: "error";
  message: string;
};

type ApiResponse =
  | SuccessResponse
  | ErrorResponse;
```

Now:

```ts
function handle(response: ApiResponse) {
  if (response.status === "success") {
    console.log(response.data);
  } else {
    console.log(response.message);
  }
}
```

TypeScript automatically narrows the type.

---

# Real-World Example 2: User Roles

```ts
type Admin = {
  role: "admin";
  permissions: string[];
};

type Customer = {
  role: "customer";
  orders: number[];
};

type Guest = {
  role: "guest";
};

type User =
  | Admin
  | Customer
  | Guest;
```

Usage:

```ts
function showDashboard(user: User) {
  switch (user.role) {
    case "admin":
      console.log(user.permissions);
      break;

    case "customer":
      console.log(user.orders);
      break;

    case "guest":
      console.log("Please log in.");
      break;
  }
}
```

No unnecessary property checks are required.

---

# Real-World Example 3: Payment Methods

```ts
type CreditCard = {
  method: "credit-card";
  cardNumber: string;
};

type PayPal = {
  method: "paypal";
  email: string;
};

type UPI = {
  method: "upi";
  upiId: string;
};

type Payment =
  | CreditCard
  | PayPal
  | UPI;
```

Usage:

```ts
function pay(payment: Payment) {
  switch (payment.method) {
    case "credit-card":
      console.log(payment.cardNumber);
      break;

    case "paypal":
      console.log(payment.email);
      break;

    case "upi":
      console.log(payment.upiId);
      break;
  }
}
```

---

# Exhaustiveness Checking

One of the biggest advantages of discriminated unions is **exhaustiveness checking**.

Suppose we later add:

```ts
type Triangle = {
  kind: "triangle";
  base: number;
  height: number;
};
```

Now:

```ts
type Shape =
  | Circle
  | Rectangle
  | Square
  | Triangle;
```

If we forget to update:

```ts
switch (shape.kind) {
  ...
}
```

TypeScript can help us catch the missing case.

The recommended pattern uses `never`.

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;

    case "rectangle":
      return shape.width * shape.height;

    case "square":
      return shape.side ** 2;

    default: {
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
    }
  }
}
```

If we later add `Triangle` but forget to handle it, TypeScript reports:

```
Type 'Triangle' is not assignable to type 'never'.
```

This ensures every possible variant is handled.

---

# Why `never` Works

After handling every case:

```
Circle
Rectangle
Square
```

there should be **nothing left**.

The remaining type is:

```ts
never
```

If another type still exists, TypeScript reports an error.

This is called **exhaustive checking**.

---

# Choosing the Discriminant Property

The property name is arbitrary.

These are all valid:

```ts
kind
```

```ts
type
```

```ts
status
```

```ts
role
```

```ts
method
```

```ts
variant
```

The important rule is:

* Every member must contain the property.
* The property's value must be a unique literal type.

Example:

```ts
type Cat = {
  animal: "cat";
};
```

```ts
type Dog = {
  animal: "dog";
};
```

Here, `animal` is the discriminant.

---

# Common Mistakes

## Mistake 1: Using `string` Instead of String Literals

Incorrect:

```ts
type Circle = {
  kind: string;
  radius: number;
};
```

Now `kind` could be any string, so TypeScript cannot narrow the type.

Correct:

```ts
type Circle = {
  kind: "circle";
};
```

Literal types are required.

---

## Mistake 2: Missing the Discriminant

```ts
type Circle = {
  radius: number;
};

type Rectangle = {
  width: number;
  height: number;
};
```

There is no common property, so TypeScript has no reliable way to distinguish the union members.

---

## Mistake 3: Different Property Names

Incorrect:

```ts
type Circle = {
  kind: "circle";
};

type Rectangle = {
  type: "rectangle";
};
```

Now there is no shared discriminant property.

All union members should use the same property name.

---

# Visual Summary

```
            Shape
               │
        Discriminated Union
               │
     ┌─────────┼─────────┐
     │         │         │
 Circle   Rectangle   Square
     │         │         │
kind       kind      kind
 │           │          │
circle   rectangle   square
```

TypeScript checks the `kind` property and automatically narrows the type.

---

# Comparison

| Without Discriminated Unions | With Discriminated Unions           |
| ---------------------------- | ----------------------------------- |
| Many optional properties     | Separate, well-defined object types |
| Frequent `undefined` checks  | Automatic type narrowing            |
| Less readable                | Clear and expressive                |
| Easier to misuse             | Type-safe                           |
| Harder to maintain           | Easier to extend                    |

---

# Best Practices

* Use discriminated unions whenever a value can represent one of several related object shapes.
* Choose a clear and consistent discriminant property name such as `kind`, `type`, `status`, `role`, or `method`.
* Use **string literal types** for the discriminant values.
* Prefer `switch` statements with **exhaustiveness checking** (`never`) when handling many union members.
* Avoid creating a single type with many optional properties when the objects represent distinct concepts.

> **Rule of Thumb:** If several object types belong to the same family but have different properties, give them a shared discriminant property with unique literal values. This allows TypeScript to automatically identify the correct type and provide full type safety.

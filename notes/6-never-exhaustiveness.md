# `never` and Exhaustiveness Checking in TypeScript

One of the most powerful uses of the **`never`** type is **exhaustiveness checking**.

It helps us ensure that **every possible case in a union type has been handled**.

This is especially useful when working with:

* Discriminated unions
* Enums
* String literal unions

If we later add a new type but forget to update our logic, TypeScript immediately reports an error instead of letting a bug reach production.

---

# First, What is `never`?

The `never` type represents **a value that can never exist**.

It is the **bottom type** in TypeScript.

It means:

> "There are no possible values of this type."

Unlike `void`, which means a function returns nothing, `never` means execution **never successfully reaches a value**.

Examples:

```ts
function throwError(message: string): never {
  throw new Error(message);
}
```

The function never returns because it always throws an error.

---

Another example:

```ts
function infiniteLoop(): never {
  while (true) {}
}
```

This function never finishes, so it also returns `never`.

---

# Understanding Exhaustiveness

Suppose we have three shapes.

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
```

Our goal is to calculate the area.

---

## First Attempt

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

This works correctly.

But there is a hidden problem.

---

# What Happens Later?

Months later, we add another shape.

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

Unfortunately, we forget to update `getArea()`.

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

What happens?

If `shape.kind` is `"triangle"`:

* No case matches.
* The function reaches the end.
* It returns `undefined`.

This is a bug.

---

# How Can We Prevent This?

We use **exhaustiveness checking**.

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

This may look strange at first.

Let's understand it step by step.

---

# Step 1

Initially:

```text
shape

↓

Circle | Rectangle | Square
```

---

# Step 2

Suppose execution enters:

```ts
case "circle":
```

Inside this block:

```text
shape

↓

Circle
```

TypeScript narrows the type automatically.

---

# Step 3

After the first case finishes, TypeScript removes `Circle`.

Remaining possibilities:

```text
Rectangle | Square
```

---

After the rectangle case:

```text
Square
```

---

After the square case:

```text
Nothing left
```

What type represents "nothing left"?

```ts
never
```

---

# Visual Representation

Before checking:

```text
Shape

├── Circle
├── Rectangle
└── Square
```

---

After handling Circle:

```text
Remaining

├── Rectangle
└── Square
```

---

After handling Rectangle:

```text
Remaining

└── Square
```

---

After handling Square:

```text
Remaining

Nothing

↓

never
```

---

# Why Does This Work?

This line is the key.

```ts
const exhaustiveCheck: never = shape;
```

We are telling TypeScript:

> "At this point, there should be no possible value remaining."

If TypeScript agrees:

```text
shape = never
```

Everything is fine.

---

# What if We Add Triangle?

Now our union becomes:

```text
Circle
Rectangle
Square
Triangle
```

Our switch still handles only:

```text
Circle
Rectangle
Square
```

Remaining:

```text
Triangle
```

Now TypeScript sees:

```ts
const exhaustiveCheck: never = shape;
```

But:

```text
shape = Triangle
```

Not:

```text
shape = never
```

So TypeScript reports:

```text
Type 'Triangle' is not assignable to type 'never'.
```

This tells us immediately that we forgot to handle a new case.

---

# Visualizing the Error

Suppose:

```text
Shape

├── Circle
├── Rectangle
├── Square
└── Triangle
```

Our switch handles:

✅ Circle

✅ Rectangle

✅ Square

Remaining:

```text
Triangle
```

TypeScript expects:

```text
Remaining

↓

never
```

Instead it finds:

```text
Remaining

↓

Triangle
```

Compiler Error.

---

# Why is This Better?

Without exhaustiveness checking:

```ts
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      ...
  }
}
```

Months later:

* New type added
* Function forgotten
* Bug reaches production

---

With exhaustiveness checking:

The compiler immediately reports:

```text
Missing case: Triangle
```

The bug is caught before the application runs.

---

# Another Example

Suppose we have payment methods.

```ts
type Payment =
  | { method: "card" }
  | { method: "paypal" }
  | { method: "upi" };
```

Processing:

```ts
function process(payment: Payment) {
  switch (payment.method) {
    case "card":
      return "Card";

    case "paypal":
      return "PayPal";

    case "upi":
      return "UPI";

    default: {
      const exhaustiveCheck: never = payment;
      return exhaustiveCheck;
    }
  }
}
```

---

Later:

```ts
type Payment =
  | { method: "card" }
  | { method: "paypal" }
  | { method: "upi" }
  | { method: "crypto" };
```

Immediately:

```text
Type '{ method: "crypto"; }' is not assignable to type 'never'.
```

The compiler reminds us to update our function.

---

# Another Example Using Enums

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

```ts
function move(direction: Direction) {
  switch (direction) {
    case Direction.Up:
      break;

    case Direction.Down:
      break;

    case Direction.Left:
      break;

    case Direction.Right:
      break;

    default: {
      const exhaustiveCheck: never = direction;
      return exhaustiveCheck;
    }
  }
}
```

If a new enum member is added later:

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
  Forward,
}
```

The compiler reports an error because `Forward` is not handled.

---

# Why Use `default`?

We use `default` because it catches **everything that was not matched** by the previous `case` statements.

At that point, if every possible case has been handled, the remaining type should be:

```ts
never
```

If it isn't, something is missing.

---

# `never` vs `default`

Many developers think:

```ts
default:
    console.log("Unknown")
```

is enough.

It isn't.

This silently ignores new cases.

Example:

```ts
default:
    console.log("Unknown");
```

Later, we add:

```ts
kind = "triangle"
```

The application compiles successfully.

Instead of calculating the area, it prints:

```text
Unknown
```

The bug goes unnoticed.

---

Using `never`:

```ts
default: {
    const exhaustiveCheck: never = shape;
    return exhaustiveCheck;
}
```

Now the project doesn't compile until we handle `"triangle"`.

This is much safer.

---

# Visual Summary

Without Exhaustiveness Checking

```text
Shape

├── Circle
├── Rectangle
├── Square
└── Triangle

↓

Switch

Handles only 3

↓

Triangle ignored

↓

Bug
```

---

With Exhaustiveness Checking

```text
Shape

├── Circle
├── Rectangle
├── Square
└── Triangle

↓

Switch

↓

Triangle remains

↓

never assignment fails

↓

Compiler Error

↓

Bug Fixed Before Runtime
```

---

# Best Practices

* Use **discriminated unions** with a shared literal property (`kind`, `type`, `status`, etc.).
* Prefer `switch` statements when handling multiple union members.
* Add a `default` case containing a `never` assignment for **exhaustiveness checking**.
* Update the `switch` whenever a new union member or enum value is introduced.
* Let the compiler help us catch missing cases instead of relying on runtime behavior.

---

# Summary

| Concept                 | Explanation                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `never`                 | Represents a value that can never exist.                                  |
| Exhaustiveness Checking | Ensures every member of a union or enum is handled.                       |
| Why It Works            | After handling all cases, the remaining type should be `never`.           |
| If a New Case Is Added  | The remaining type is no longer `never`, so TypeScript reports an error.  |
| Benefit                 | Prevents bugs caused by forgotten cases when union types or enums evolve. |

> **Rule of Thumb:** Whenever we use a `switch` statement on a discriminated union or enum, finish it with a `default` case that assigns the remaining value to `never`. This guarantees that if the union grows in the future, the compiler forces us to update every relevant `switch` statement before the code can compile.

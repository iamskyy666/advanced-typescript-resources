# Mapped Types and Conditional Types in TypeScript

These are two of the most powerful features in TypeScript. Together, they allow us to **transform existing types**, **filter properties**, **create utility types**, and even perform **type-level programming**.

Think of them like this:

* **Mapped Types** → Loop through properties of a type.
* **Conditional Types** → Apply if-else logic to types.

They are often used together.

---

# Part 1: Mapped Types

## What is a Mapped Type?

A mapped type creates a new type by iterating over every property in another type.

Think of it like JavaScript's `Array.map()`.

### JavaScript

```ts
const arr = [1,2,3]

const doubled = arr.map(x => x * 2)
```

We transform every element.

Mapped types do the same for object properties.

Instead of values...

```
name
age
email
```

...we transform each property.

---

## Basic Syntax

```ts
type NewType = {
    [Key in keyof Original]: ...
}
```

Breaking it down:

```
keyof Original
```

gets

```
"name" | "age" | "email"
```

Then

```
Key in keyof Original
```

loops through them.

---

## Example

```ts
type User = {
    name: string
    age: number
}
```

Now create a readonly version.

```ts
type ReadonlyUser = {
    readonly [K in keyof User]: User[K]
}
```

Result

```ts
type ReadonlyUser = {
    readonly name: string
    readonly age: number
}
```

Notice

```
User[K]
```

means

```
User["name"] -> string

User["age"] -> number
```

---

# Visual

```
User

name -> string
age  -> number

↓

Loop

K = "name"

↓

name: User["name"]

↓

string

Repeat...

↓

ReadonlyUser
```

---

# Example: Optional Properties

```ts
type User = {
    name: string
    age: number
}
```

Mapped type

```ts
type OptionalUser = {
    [K in keyof User]?: User[K]
}
```

Produces

```ts
{
    name?: string
    age?: number
}
```

---

# Example: Nullable

```ts
type Nullable<T> = {
    [K in keyof T]: T[K] | null
}
```

Usage

```ts
type User = {
    name: string
    age: number
}

type NullableUser = Nullable<User>
```

Result

```ts
{
    name: string | null
    age: number | null
}
```

---

# Generic Mapped Types

```ts
type Box<T> = {
    [K in keyof T]: {
        value: T[K]
    }
}
```

Example

```ts
type User = {
    name: string
    age: number
}
```

Result

```ts
{
    name: {
        value: string
    }

    age: {
        value: number
    }
}
```

---

# Removing Optional Modifier

Suppose

```ts
type User = {
    name?: string
    age?: number
}
```

Remove `?`

```ts
type RequiredUser = {
    [K in keyof User]-?: User[K]
}
```

Result

```ts
{
    name: string
    age: number
}
```

`-?`

means

```
remove optional
```

---

# Adding Optional Modifier

```
+?
```

or simply

```
?
```

```ts
type Optional<T> = {
    [K in keyof T]?: T[K]
}
```

---

# Removing readonly

```ts
type Mutable<T> = {
    -readonly [K in keyof T]: T[K]
}
```

Example

```ts
type User = {
    readonly name: string
}
```

Result

```ts
{
    name: string
}
```

---

# Key Remapping

One of the coolest features.

```ts
type Prefix<T> = {
    [K in keyof T as `my_${string & K}`]: T[K]
}
```

Example

```ts
type User = {
    name: string
    age: number
}
```

Result

```ts
{
    my_name: string
    my_age: number
}
```

---

# Filtering Keys

Suppose

```ts
type User = {
    id: number
    password: string
    email: string
}
```

Remove password.

```ts
type WithoutPassword = {
    [K in keyof User as Exclude<K, "password">]: User[K]
}
```

Result

```ts
{
    id: number
    email: string
}
```

---

# Why Mapped Types Matter

Without mapped types

```ts
type UserDTO = {
    name?: string
    age?: number
    email?: string
}
```

Manually writing dozens of properties becomes tedious and error-prone.

With mapped types

```ts
type PartialUser = Partial<User>
```

Done.

---

# Part 2: Conditional Types

Conditional types allow us to write **if-else logic** at the type level.

---

## Syntax

```ts
T extends U
    ? X
    : Y
```

Read as

```
If T extends U

then X

else Y
```

---

## Example

```ts
type IsString<T> =
    T extends string
        ? true
        : false
```

Usage

```ts
type A = IsString<string>
```

```
true
```

```ts
type B = IsString<number>
```

```
false
```

---

# Another Example

```ts
type Message<T> =
    T extends string
        ? "Text"
        : "Not Text"
```

```
Message<string>

↓

"Text"
```

```
Message<boolean>

↓

"Not Text"
```

---

# Real Example

```ts
type ApiResponse<T> =
    T extends Error
        ? { success: false }
        : { success: true; data: T }
```

```
ApiResponse<string>

↓

{
    success: true
    data: string
}
```

```
ApiResponse<Error>

↓

{
    success: false
}
```

---

# Conditional Types with infer

`infer` lets us capture part of a type while checking a condition.

Example

```ts
type Return<T> =
    T extends (...args: any[]) => infer R
        ? R
        : never
```

Function

```ts
function getUser() {
    return {
        id: 1
    }
}
```

```
Return<typeof getUser>

↓

{
    id: number
}
```

`infer R`

means

```
Figure out the return type and call it R.
```

---

# Extract Array Element

```ts
type Element<T> =
    T extends (infer U)[]
        ? U
        : never
```

Usage

```ts
type A = Element<string[]>
```

↓

```
string
```

---

# Promise Type

```ts
type Awaited<T> =
    T extends Promise<infer U>
        ? U
        : T
```

```
Promise<string>

↓

string
```

---

# Distributive Conditional Types

This is one of the most confusing parts of TypeScript.

Suppose

```ts
type IsString<T> =
    T extends string
        ? true
        : false
```

Now

```ts
type Result = IsString<
    string | number
>
```

Many people expect

```
false
```

Wrong.

TypeScript distributes over the union.

```
string

↓

true

number

↓

false

↓

true | false
```

Result

```ts
true | false
```

---

# Disable Distribution

Wrap both sides in tuples.

```ts
type IsString<T> =
    [T] extends [string]
        ? true
        : false
```

Now

```ts
IsString<string | number>
```

becomes

```
false
```

because the union is treated as a whole instead of each member separately.

---

# Combining Mapped + Conditional Types

This is where TypeScript becomes extremely powerful.

Suppose

```ts
type User = {
    name: string
    age: number
    active: boolean
}
```

We only want string properties.

```ts
type OnlyStrings<T> = {
    [K in keyof T]:
        T[K] extends string
            ? T[K]
            : never
}
```

Result

```ts
{
    name: string
    age: never
    active: never
}
```

---

## Filtering Instead of Replacing

We can remove non-string properties entirely using key remapping.

```ts
type StringKeys<T> = {
    [K in keyof T as
        T[K] extends string
            ? K
            : never
    ]: T[K]
}
```

Result

```ts
{
    name: string
}
```

---

# Recreating Built-in Utility Types

## Partial

```ts
type MyPartial<T> = {
    [K in keyof T]?: T[K]
}
```

---

## Required

```ts
type MyRequired<T> = {
    [K in keyof T]-?: T[K]
}
```

---

## Readonly

```ts
type MyReadonly<T> = {
    readonly [K in keyof T]: T[K]
}
```

---

## Pick

```ts
type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]
}
```

---

## Omit

```ts
type MyOmit<T, K extends keyof any> = {
    [P in Exclude<keyof T, K>]: T[P]
}
```

---

## Record

```ts
type MyRecord<K extends keyof any, V> = {
    [P in K]: V
}
```

---

## Exclude

```ts
type MyExclude<T, U> =
    T extends U
        ? never
        : T
```

---

## Extract

```ts
type MyExtract<T, U> =
    T extends U
        ? T
        : never
```

---

## NonNullable

```ts
type MyNonNullable<T> =
    T extends null | undefined
        ? never
        : T
```

---

# Summary

| Feature                        | Purpose                                             | Example                                                           |
| ------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------- |
| `keyof`                        | Get property names                                  | `"name" \| "age"`                                                 |
| `in`                           | Iterate over keys                                   | `[K in keyof T]`                                                  |
| `T[K]`                         | Access a property's type                            | `string`, `number`                                                |
| Mapped Types                   | Transform object properties                         | `Partial<T>`, `Readonly<T>`                                       |
| `extends ? :`                  | Type-level if/else                                  | `T extends U ? X : Y`                                             |
| `infer`                        | Capture part of a matched type                      | Extract return type, array element, promise value                 |
| Distributive Conditional Types | Apply condition to each member of a union           | `string \| number → true \| false`                                |
| Key Remapping (`as`)           | Rename or filter keys during mapping                | Prefix keys, omit properties                                      |
| Mapped + Conditional Types     | Transform or filter properties based on their types | Keep only string-valued properties, make selected fields optional |

## Interview Tips

* `keyof`, indexed access (`T[K]`), mapped types, and conditional types are closely related and are frequently combined.
* Most built-in utility types (`Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`) are implemented using mapped types, conditional types, or both.
* Understand **distributive conditional types** well—they are a common interview topic because they often produce surprising results.
* Learn `infer` thoroughly. It powers advanced utilities such as `ReturnType<T>`, `Parameters<T>`, `ConstructorParameters<T>`, `Awaited<T>`, and many sophisticated library types.
* Modern frameworks and libraries (React, Next.js, Redux Toolkit, Zod, Prisma, TanStack Query, tRPC, etc.) make extensive use of mapped and conditional types, so becoming comfortable reading them will make advanced TypeScript code much easier to understand.

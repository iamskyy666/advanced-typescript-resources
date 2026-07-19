// keyof - gives us keys of an object{}
// typeof - gives us the type of an existing value

let score = 95;

console.log(typeof score); // number

const student = {
  name: "Skyy",
  age: 69,
  isActive: true,
};

type Student = typeof student;

const anotherStudent: Student = {
  name: "Banerjee",
  age: 108,
  isActive: false,
  //   email:"blabla@bla.com" // ❌
};

// Now..
type StudentKey = keyof Student;

// StudentKey = "age" | "isActive" | "name"

let fieldName: StudentKey = "age";

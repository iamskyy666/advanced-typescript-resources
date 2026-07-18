// strict - main switch for serious type checking
// noImplicitAny - ts will not silently create 'any' type for us

function createUser(name: string) {
  return {
    name,
    createdAt: new Date(),
  };
}

const userOne = createUser("Skyy");
console.log(userOne.name);

// strictNullChecks - ts won't sllow us to use a value if it's null or undefined
type User = {
  id: number;
  name: string;
};

function findUserById(id: number): User | undefined {
  const users: User[] = [{ id: 1, name: "Batman" }];
  return users.find((user) => user.id === id);
}

const foundUser = findUserById(1);
//console.log(foundUser?.name);
//better approach
if (foundUser) {
  console.log(foundUser.name);
} else {
  console.log(`User not found!`);
}

// another example
const PORT = process.env.PORT
const finalPORT = PORT ?? "5000";
// console.log(PORT.toUpperCase()); ❌
console.log(finalPORT.toUpperCase());

import { email } from "zod";
type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  {
    id: 1,
    name: "skyy",
    email: "skyy@test.com",
  },
  {
    id: 2,
    name: "soumadip",
    email: "soumadip@test.com",
  },
  {
    id: 3,
    name: "banerjee",
    email: "banerjee@test.com",
  },
];

async function getSingleUser(id: Number): Promise<User | null> {
  const user = users.find((currUser) => currUser.id === id);
  return user ?? null;
}

async function showUserWithAwait(): Promise<void> {
  const user = await getSingleUser(1);
  if (user === null) {
    console.log("User not found");
    return;
  }
  console.log(user.name);
}

async function showUserByPromiseChain(): Promise<void> {
  return getSingleUser(2).then((user) => {
    if (user === null) {
      console.log("User not found");
      return;
    }
    console.log(user.name);
  });
}

import Image from "next/image";
import { createUser , getUser } from "@/lib/app";
export default async function Home() {
  const user = await getUser(); 
  console.log(user);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {user.map((user: any) => (
          <li key={user.id}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

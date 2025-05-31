import Image from "next/image";
import { createUser , getUser } from "@/lib/app";
export default async function Home() {
  // await createUser({
  //   name: 'Vivek',
  //   email: 'vivek@nitt.edu',
  //   passwordHash: 'hashed_password_here',
  //   addresses: {
  //     create: [
  //       {
  //         fullName: 'Vivek N',
  //         phoneNumber: '9876543210',
  //         addressLine1: '123 Street Name',
  //         city: 'Trichy',
  //         state: 'TN',
  //         postalCode: '620015',
  //         country: 'India',
  //         isDefault: true,
  //       },
  //     ],
  //   },
  // });
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

import Image from 'next/image';
import { Prisma, prisma } from '../lib/client';
export default async function Home() {
<<<<<<< HEAD
  let user = await prisma.user.findMany();
=======
  // await createUser({
  //   name: 'Vivek',
  //   email: 'vivek@n.edu',
  //   passwordHash: 'hashed_password_here',
  //   phoneNumber: '9876543210',
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
>>>>>>> 0dcb071c85bcf80f8a3e0863feabb28a6c4ccf44
  console.log(user);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {user.map((user: any) => (
          <li key={user.id}>
<<<<<<< HEAD
            <p>
              <strong>Name:</strong> {user.phoneNumber}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>

=======
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            
>>>>>>> 0dcb071c85bcf80f8a3e0863feabb28a6c4ccf44
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

import Image from 'next/image';
import { Prisma, prisma } from '../lib/client';
export default async function Home() {
  let user = await prisma.user.findMany();
  console.log(user);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {user.map((user: any) => (
          <li key={user.id}>
            <p>
              <strong>Name:</strong> {user.phoneNumber}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>

            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

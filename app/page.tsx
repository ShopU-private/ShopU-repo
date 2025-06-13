import Image from 'next/image';
import { createUser, getUser } from '@/lib/app';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
export default async function Home() {
  const user = await getUser();
  console.log(user);

  return (
    <div>
      <Header/>
      <ChatBot />
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

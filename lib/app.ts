//write all db functions here 

import { Prisma, prisma } from './client'
export async function createUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
      include: {
        addresses: true,
        orders: true,
        cartItems: true,
      },
    });
    return user;
  }

  export async function getUser() {
    return await prisma.user.findMany();
  }
  
  
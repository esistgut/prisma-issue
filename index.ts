import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populate() {
  const u1 = await prisma.user.create({
    data: {name: 'Alice'}
  })
  const u2 = await prisma.user.create({
    data: {name: 'Bob'}
  })
  const s = await prisma.service.create({
    data: {
      owner: {connect: {id: u1.id}},
      code: 'samecode',
      description: 'My Service 1'
    }
  })
  await prisma.service.create({
    data: {
      owner: {connect: {id: u2.id}},
      code: 'samecode',
      description: 'My Service 2'
    }
  })
}

async function test() {
  const s = await prisma.service.findOne({
    where: {
      owner_code: {code: 'samecode'}
    }
  })
  console.log(s);
}

async function main() {
  //return populate();
  return test();
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.disconnect()
  })
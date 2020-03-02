import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populate() {
  const u = await prisma.user.create({
    data: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  })
  const s = await prisma.service.create({
    data: {
      owner: { connect: { id: u.id } },
      description: "My Service 1"
    }
  })
  await prisma.service.create({
    data: {
      owner: { connect: { id: u.id } },
      sourceService: { connect: { id: s.id } },
      description: "My Service 2"
    }
  })
}

async function test() {
  const u = await prisma.user.findOne({
    where: { email: 'alice@prisma.io' }
  });
  const s = (await prisma.service.findMany({
    where: { description: "My Service 1" }
  }))[0];
  if (s && u) {
    const targets = await prisma.service.findMany({
      where: {
        sourceService: { id: s.id },
        owner: { id: u.id }
      }
    });
    console.log(targets);
  }
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
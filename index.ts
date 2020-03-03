import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populate() {
  const s = await prisma.service.create({
    data: {
      description: "My Service 1"
    }
  })
  await prisma.service.create({
    data: {
      sourceService: { connect: { id: s.id } },
      description: "My Service 2"
    }
  })
}

async function test() {
  const s = (await prisma.service.findMany({
    where: { description: "My Service 1" }
  }))[0];
  if (s) {
    const targets = await prisma.service.findMany({
      where: {
        sourceService: { id: s.id },
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
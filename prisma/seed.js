const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  console.log('Seeding database...');

  const islands = [
    { name: 'Ngazidja' },
    { name: 'Nzwani' },
    { name: 'Moheli' }
  ];

  for (const isl of islands) {
    await prisma.island.upsert({
      where: { name: isl.name },
      update: {},
      create: { name: isl.name }
    });
  }

  const ngazidja = await prisma.island.findUnique({ where: { name: 'Ngazidja' }});
  const nzwani   = await prisma.island.findUnique({ where: { name: 'Nzwani' }});
  const moheli   = await prisma.island.findUnique({ where: { name: 'Moheli' }});

  await prisma.city.upsert({
    where: { name: 'Moroni' },
    update: {},
    create: { name: 'Moroni', islandId: ngazidja.id }
  });

  await prisma.city.upsert({
    where: { name: 'Mutsamudu' },
    update: {},
    create: { name: 'Mutsamudu', islandId: nzwani.id }
  });

  await prisma.city.upsert({
    where: { name: 'Fomboni' },
    update: {},
    create: { name: 'Fomboni', islandId: moheli.id }
  });

  console.log('Seed completed!');
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
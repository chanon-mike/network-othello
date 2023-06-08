import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createInitialLobby() {
  try {
    const lobby = await prisma.lobby.create({
      data: {
        title: 'Initial Lobby',
      },
    });

    console.log('Initial lobby created:', lobby);
  } catch (error) {
    console.error('Error creating initial lobby:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialLobby();

import { prisma } from "../lib/prisma.js";
import { syncAgentDefinitions } from "../data/agents.js";
import { syncSeededMarketplaceData } from "../data/marketplace-seeds.js";
import { syncProviderProfiles } from "../data/providers.js";

async function reset() {
  await prisma.reviewDecision.deleteMany();
  await prisma.runEvent.deleteMany();
  await prisma.taskRun.deleteMany();
  await prisma.demandResponse.deleteMany();
  await prisma.taskRequest.deleteMany();
  await prisma.agentDefinition.deleteMany();
  await prisma.providerProfile.deleteMany();
  await syncProviderProfiles();
  await syncAgentDefinitions();
  await syncSeededMarketplaceData();
}

reset()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Agora reset complete.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

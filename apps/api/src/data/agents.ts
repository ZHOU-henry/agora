import { agentDefinitions } from "@agora/shared/domain";
import { prisma } from "../lib/prisma.js";
import { serializeAgentDefinition } from "../lib/serialize.js";

export async function listAgents() {
  const rows = await prisma.agentDefinition.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return rows.map(serializeAgentDefinition);
}

export async function getAgentBySlug(slug: string) {
  const row = await prisma.agentDefinition.findUnique({
    where: { slug }
  });

  return row ? serializeAgentDefinition(row) : null;
}

export async function getAgentById(id: string) {
  const row = await prisma.agentDefinition.findUnique({
    where: { id }
  });

  return row ? serializeAgentDefinition(row) : null;
}

export async function syncAgentDefinitions() {
  for (const agent of agentDefinitions) {
    await prisma.agentDefinition.upsert({
      where: { id: agent.id },
      update: agent,
      create: agent
    });
  }
}

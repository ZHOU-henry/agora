import { providerProfiles } from "@agora/shared/domain";
import { prisma } from "../lib/prisma.js";
import {
  serializeProviderProfile,
  serializeProviderProfileDetail
} from "../lib/serialize.js";

export async function listProviders() {
  const rows = await prisma.providerProfile.findMany({
    orderBy: {
      name: "asc"
    }
  });

  return rows.map(serializeProviderProfile);
}

export async function getProviderBySlug(slug: string) {
  const row = await prisma.providerProfile.findUnique({
    where: { slug }
  });

  return row ? serializeProviderProfile(row) : null;
}

export async function getProviderById(id: string) {
  const row = await prisma.providerProfile.findUnique({
    where: { id }
  });

  return row ? serializeProviderProfile(row) : null;
}

export async function getProviderDetailBySlug(slug: string) {
  const row = await prisma.providerProfile.findUnique({
    where: { slug },
    include: {
      agents: {
        orderBy: {
          name: "asc"
        }
      },
      responses: {
        include: {
          provider: true,
          taskRequest: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  return row ? serializeProviderProfileDetail(row) : null;
}

export async function syncProviderProfiles() {
  for (const provider of providerProfiles) {
    await prisma.providerProfile.upsert({
      where: { id: provider.id },
      update: provider,
      create: provider
    });
  }
}

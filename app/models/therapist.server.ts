import { prisma } from "~/db.server";

export async function getAllTherapists() {
	return prisma.therapist.findMany({ include: { approaches: true } });
}

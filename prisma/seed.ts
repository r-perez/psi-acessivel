import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

async function seed() {
  const sheetId = process.env.DRIVE_SHEET_ID;

  console.log(`Fetching data from Google Drive...`);
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`,
    {
      redirect: "follow",
    }
  );
  const data = await response.text();

  console.log(`Parsing CSV...`);
  parse(
    data,
    {
      columns: [
        "name",
        "phone",
        "email",
        "url",
        "approaches",
        "crp",
        "address",
        "notes",
      ],
      relaxColumnCountMore: true,
      skipEmptyLines: true,
    },
    async (err, records) => {
      if (err) {
        console.error(err);
      }

      for (const record of records) {
        if (!(record.crp && record.name && (record.phone || record.email))) {
          continue;
        }

        let approaches = record.approaches.split(",")
        if (approaches.length === 1) approaches = record.approaches.split("/")
        if (approaches.length === 1) approaches = [record.approaches]
        const approachesConnect = approaches.map((approach: string) => ({
          where: { name: approach },
          create: { name: approach },
        }));

        await prisma.therapist.upsert({
          where: { crp: record.crp },
          update: {
            telephone: record.phone || null,
            email: record.email || null,
            approaches: {
              connectOrCreate: approachesConnect,
            },
            address: record.address || null,
          },
          create: {
            name: record.name,
            telephone: record.phone || null,
            email: record.email || null,
            approaches: {
              connectOrCreate: approachesConnect,
            },
            crp: record.crp,
            address: record.address || null,
          },
        });
      }
    }
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

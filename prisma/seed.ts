import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import { presence, validateEmail } from "~/utils";

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
        if (!(extractCrp(record.crp) && record.name && (extractTelephone(record.phone) || extractEmail(record.email)))) {
          continue;
        }

        const approaches = extractApproaches(record.approaches);

        const updateableFields = {
          telephone: extractTelephone(record.phone),
          email: extractEmail(record.email),
          approaches: {
            connectOrCreate: approaches,
          },
          address: presence(record.address),
        }

        await prisma.therapist.upsert({
          where: { crp: record.crp },
          update: updateableFields,
          create: {
            name: presence(record.name),
            crp: extractCrp(record.crp)!,
            ...updateableFields
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

function extractApproaches(column: string) {
  let approaches = column.split(",");
  if (approaches.length === 1) approaches = column.split("/");
  if (approaches.length === 1) approaches = [column];

  const approachesConnect = approaches.map((approach: string) => ({
    where: { name: approach },
    create: { name: approach },
  }));
  return approachesConnect;
}

function extractTelephone(column: string) {
  const numbers = presence(column)?.replace(/\D/g, "");
  if (numbers?.length == 11 || numbers?.length == 10) return `+55${numbers}`;
}

function extractEmail(column: string) {
  if (validateEmail(column)) return presence(column);
}

function extractCrp(column: string) {
  return presence(column)?.replace(/\D/g, "");
}

import { prisma } from "../lib/db/prisma";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@isaju.com";
  const password = process.env.ADMIN_PASSWORD || "changeme123";

  // Verificar si el usuario ya existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`Usuario ${email} ya existe`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: "Administrador",
    },
  });

  console.log(`✅ Usuario admin creado exitosamente:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ID: ${user.id}`);
  console.log(`\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login`);
}

createAdmin()
  .catch((error) => {
    console.error("Error creando usuario admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


// create-admin.js - Script para crear usuario administrador en DTunnel
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('🎯 INICIANDO CONFIGURACIÓN DE ADMINISTRADOR');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    // 1. Verificar conexión a la base de datos
    console.log('🔍 Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos\n');
    
    // 2. Configurar credenciales del administrador
    const adminCredentials = {
      username: 'admin',
      email: 'admin@dtunnel.com',
      password: 'DtunnelAdmin2024!',
      role: 'admin',
      is_admin: true
    };
    
    console.log('🔐 Configurando credenciales de administrador:');
    console.log(`   👤 Usuario: ${adminCredentials.username}`);
    console.log(`   📧 Email: ${adminCredentials.email}`);
    console.log(`   🔑 Contraseña: ${adminCredentials.password}`);
    console.log(`   🎯 Rol: ${adminCredentials.role}`);
    console.log(`   👑 is_admin: ${adminCredentials.is_admin}\n`);
    
    // 3. Hashear la contraseña
    console.log('⚙️  Hasheando contraseña para seguridad...');
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(adminCredentials.password, saltRounds);
    console.log('✅ Contraseña hasheada correctamente\n');
    
    // 4. Verificar si el usuario ya existe
    console.log('🔎 Buscando usuario existente...');
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: adminCredentials.username },
          { email: adminCredentials.email }
        ]
      }
    });
    
    if (existingUser) {
      // 5. Actualizar usuario existente
      console.log('🔄 Usuario encontrado, actualizando permisos...');
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: adminCredentials.role,
          is_admin: adminCredentials.is_admin,
          password: hashedPassword,
          updated_at: new Date()
        }
      });
      console.log('✅ Usuario existente actualizado como administrador\n');
    } else {
      // 6. Crear nuevo usuario administrador
      console.log('🆕 Creando nuevo usuario administrador...');
      await prisma.user.create({
        data: {
          username: adminCredentials.username,
          email: adminCredentials.email,
          password: hashedPassword,
          role: adminCredentials.role,
          is_admin: adminCredentials.is_admin,
          app_text_version: 1,
          app_layout_version: 1,
          app_config_version: 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      console.log('✅ Nuevo usuario administrador creado exitosamente\n');
    }
    
    // 7. Mostrar resultados finales
    console.log('📊 RESULTADO FINAL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 CREDENCIALES DE ACCESO:');
    console.log('├── 👤 Usuario: admin');
    console.log('├── 📧 Email: admin@dtunnel.com');
    console.log('├── 🔑 Contraseña: DtunnelAdmin2024!');
    console.log('├── 🎯 Rol: admin');
    console.log('└── 👑 is_admin: true\n');
    
    console.log('🚀 ACCIONES DISPONIBLES:');
    console.log('1. Iniciar sesión con las credenciales anteriores');
    console.log('2. Acceder al panel de administración');
    console.log('3. Crear más usuarios desde el panel\n');
    
    console.log('⚠️  IMPORTANTES RECOMENDACIONES DE SEGURIDAD:');
    console.log('1. ⚡ CAMBIA la contraseña después del primer login');
    console.log('2. 🔒 No compartas estas credenciales públicamente');
    console.log('3. 📝 Considera crear un usuario personal diferente al admin');
    console.log('4. 🛡️  Usa HTTPS en producción\n');
    
    console.log('🔧 SOPORTE TÉCNICO:');
    console.log('Si encuentras problemas:');
    console.log('1. Ejecuta: npx prisma migrate dev');
    console.log('2. Verifica: node -v (debe ser 16+)');
    console.log('3. Reinstala: npm install\n');
    
    console.log('🎉 ¡Tu DTunnel ahora tiene administrador!');
    
  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA CONFIGURACIÓN:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`Mensaje: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('💡 SOLUCIONES COMUNES:');
    console.log('1. Asegúrate de que la base de datos existe:');
    console.log('   Ejecuta: npx prisma migrate dev');
    console.log('2. Verifica las dependencias:');
    console.log('   Ejecuta: npm install bcryptjs @prisma/client prisma');
    console.log('3. Si usas SQLite, verifica permisos de escritura');
    console.log('4. Revisa el archivo .env: DATABASE_URL debe estar definido\n');
    
  } finally {
    // 8. Cerrar conexión a la base de datos
    await prisma.$disconnect();
    console.log('🔌 Conexión a la base de datos cerrada');
  }
}

// 9. Ejecutar automáticamente si se llama directamente
if (require.main === module) {
  createAdminUser().catch(console.error);
}

// 10. Exportar para uso en otros scripts
module.exports = { createAdminUser };
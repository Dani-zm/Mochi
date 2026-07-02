if (typeof global.WebSocket === "undefined") {
  global.WebSocket = class {};
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cnrippxhkxnapjumjhzq.supabase.co';
const supabaseAnonKey = 'sb_publishable_htI2Vkx-HIm87C8bnJh19A_4zskwblL';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'TestPassword123';
  const nombre = 'TestUser';

  console.log(`Intentando registrar usuario: ${email}`);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre
        }
      }
    });

    if (error) {
      console.error("ERROR DEVUELTO POR SUPABASE AUTH:");
      console.error("Nombre del error:", error.name);
      console.error("Mensaje del error:", error.message);
      console.error("Código de estado:", error.status);
      console.error("Detalles del error:", error.details);
      console.error("Objeto error completo:", JSON.stringify(error, null, 2));
    } else {
      console.log("¡Registro exitoso en Supabase Auth!");
      console.log(data);
    }
  } catch (err) {
    console.error("EXCEPCIÓN ATRAPADA:");
    console.error(err);
  }
}

run();

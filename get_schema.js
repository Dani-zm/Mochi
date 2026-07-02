const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch'); // wait, node-fetch might not be installed, but we can use global fetch in Node 20!

const supabaseUrl = 'https://cnrippxhkxnapjumjhzq.supabase.co';
const supabaseAnonKey = 'sb_publishable_htI2Vkx-HIm87C8bnJh19A_4zskwblL';

async function run() {
  console.log("Consultando especificación OpenAPI de PostgREST para el proyecto...");
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("¡Éxito! Tablas disponibles en la base de datos pública:");
    const tables = Object.keys(data.definitions || {});
    console.log(tables);
    
    console.log("\nDetalles de cada tabla:");
    for (const tableName of tables) {
      const definition = data.definitions[tableName];
      const columns = Object.keys(definition.properties || {});
      console.log(`- Tabla: ${tableName}`);
      console.log(`  Columnas: ${columns.join(', ')}`);
      if (definition.required) {
        console.log(`  Obligatorios: ${definition.required.join(', ')}`);
      }
    }
  } catch (err) {
    console.error("Error al obtener el esquema:", err);
  }
}

run();

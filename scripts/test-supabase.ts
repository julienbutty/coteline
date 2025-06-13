/**
 * Script de test pour vérifier la connexion Supabase
 * Usage: bun run scripts/test-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/database";

// Configuration directe pour éviter les imports React Native
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log("🔍 Test de la connexion Supabase...\n");

  try {
    // Test 1: Connexion basique
    console.log("1. Test de connexion basique...");
    const { data, error } = await supabase
      .from("clients")
      .select("count")
      .single();

    if (error) {
      console.error("❌ Erreur de connexion:", error.message);
      return;
    }

    console.log("✅ Connexion Supabase réussie!\n");

    // Test 2: Récupération des clients directement
    console.log("2. Test de récupération des clients...");
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .limit(5);

    if (clientsError) {
      console.error("❌ Erreur clients:", clientsError.message);
    } else {
      console.log(`✅ ${clients.length} clients récupérés`);
      if (clients.length > 0) {
        console.log("Premier client:", {
          nom: clients[0].last_name,
          prenom: clients[0].first_name,
          email: clients[0].email,
        });
      }
    }
    console.log("");

    // Test 3: Vérification des tables
    console.log("3. Vérification des tables...");
    const tables = [
      "clients",
      "products",
      "product_categories",
      "projects",
      "project_products",
    ];

    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table)
          .select("*", { count: "exact", head: true });
        console.log(`✅ Table ${table}: ${count} enregistrements`);
      } catch (err) {
        console.log(`❌ Erreur table ${table}:`, err);
      }
    }

    console.log("\n🎉 Tous les tests Supabase sont passés avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error);
  }
}

// Exécuter les tests
testSupabaseConnection();

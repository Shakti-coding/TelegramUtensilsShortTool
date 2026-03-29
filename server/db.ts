import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Priority chain: Replit/platform DB → hardcoded Neon backup → local PostgreSQL
const DATABASE_URL = 
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_MQV6w8jJzWhs@ep-curly-bar-a608e8jh.us-west-2.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Initialize database tables if they don't exist - creates ALL required tables automatically
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS console_logs (
        id SERIAL PRIMARY KEY,
        level VARCHAR(10) NOT NULL,
        message TEXT NOT NULL,
        source VARCHAR(50) DEFAULT 'application',
        metadata TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS log_collections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        total_entries INTEGER NOT NULL,
        saved_at VARCHAR(255) NOT NULL,
        logs_data TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS text_memos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        tags TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_cloning_instances (
        id SERIAL PRIMARY KEY,
        instance_id VARCHAR(255) UNIQUE NOT NULL,
        session_string TEXT,
        config TEXT,
        status VARCHAR(50) DEFAULT 'inactive',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS entity_links (
        id SERIAL PRIMARY KEY,
        instance_id VARCHAR(255) NOT NULL,
        from_entity VARCHAR(500) NOT NULL,
        to_entity VARCHAR(500) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS word_filters (
        id SERIAL PRIMARY KEY,
        instance_id VARCHAR(255) NOT NULL,
        from_word VARCHAR(500) NOT NULL,
        to_word VARCHAR(500) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS live_cloning_messages (
        id SERIAL PRIMARY KEY,
        instance_id VARCHAR(255) NOT NULL,
        source_entity VARCHAR(500),
        target_entity VARCHAR(500),
        message_id INTEGER,
        forwarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.warn('⚠️ Database initialization warning:', (error as Error).message);
  }
}

// Initialize on startup
initializeDatabase();

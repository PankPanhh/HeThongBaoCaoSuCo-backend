#!/usr/bin/env node
import fs from "fs/promises";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://lephuc_233:abc12345@cluster0.fsajkxk.mongodb.net/";
const DB_NAME = process.env.MONGO_DB_NAME || "zaloapp";
const OUT_DIR = './data';
const OUT_FILE = `${OUT_DIR}/mongo_dump.json`;

const COLLECTIONS = [
  'users',
  'areas',
  'user_areas',
  'incident_types',
  'incidents',
  'incident_history',
  'incident_media',
  'incident_assignments',
  'incident_votes',
  'alerts',
  'support_contacts'
];

function convertToSerializable(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj.toString === 'function') {
    // Handle ObjectId and other BSON types
    if (obj._bsontype === 'ObjectID' || obj._bsontype === 'ObjectId') {
      return obj.toString();
    }
    if (obj.constructor.name === 'ObjectId') {
      return obj.toString();
    }
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertToSerializable);
  }
  
  if (typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertToSerializable(value);
    }
    return result;
  }
  
  return obj;
}

async function main() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);

    await fs.mkdir(OUT_DIR, { recursive: true });

    const dump = {
      generatedAt: new Date().toISOString(),
      database: DB_NAME,
      collections: {},
    };

    for (const name of COLLECTIONS) {
      try {
        const collection = db.collection(name);
        const count = await collection.countDocuments();
        const docs = await collection.find({}).limit(1000).toArray();
        
        dump.collections[name] = {
          count,
          documents: docs.map(convertToSerializable),
        };
        
        console.log(`✅ Fetched ${docs.length} docs from ${name} (total: ${count})`);
      } catch (err) {
        console.warn(`⚠️  Failed to read collection ${name}:`, err.message || err);
        dump.collections[name] = {
          count: 0,
          documents: [],
          error: err.message,
        };
      }
    }

    await fs.writeFile(OUT_FILE, JSON.stringify(dump, null, 2), 'utf-8');
    console.log(`\n✅ Dump saved to ${OUT_FILE}`);
    
    await client.close();
    console.log('✅ Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Dump failed:', err);
    process.exit(1);
  }
}

main();

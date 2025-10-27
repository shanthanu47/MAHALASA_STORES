import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';
import Pincode from '../models/Pincode.js';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load server .env
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const run = async () => {
  try {
    await connectDB();
  console.log('Connected DB name:', mongoose.connection.name);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections in DB:', collections.map(c => c.name));

  const count = await Pincode.countDocuments();
  console.log('Pincode documents count:', count);
  const example = await Pincode.findOne().lean().limit(1);
  console.log('Example document (first):', example);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error checking pincodes:', err && err.message ? err.message : err);
    process.exit(1);
  }
};

run();

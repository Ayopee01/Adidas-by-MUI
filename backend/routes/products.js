import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// 🔧 Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../data/products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'ไม่สามารถโหลดข้อมูลสินค้าได้' });
    res.json(JSON.parse(data));
  });
});

export default router;
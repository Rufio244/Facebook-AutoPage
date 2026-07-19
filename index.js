/**
 * 🚀 Facebook AutoPage v2.3 • ALL-IN-ONE
 * ระบบตอบแชทอัตโนมัติ • เชื่อม Meta • ส่งลิงก์ภายนอก • ครบจบในไฟล์เดียว
 * เจ้าของ: Thanva Phupingbut 244
 * License: PROPRIETARY — ALL RIGHTS RESERVED
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// ==================== ⚙️ การตั้งค่า ====================
const app = express();
app.use(cors());
app.use(bodyParser.json());

const CONFIG = {
  API_VER: "v21.0",
  VERIFY_TOKEN: process.env.WEBHOOK_TOKEN || "fb_autopage_secure_2026",
  PORT: process.env.PORT || 3000,
  LINKS: {
    PRODUCTS: "https://your-shop.com/products",
    ORDER: "https://your-shop.com/order",
    CONTACT: "https://your-site.com/contact"
  }
};

// ==================== ✅ ยืนยัน Webhook ====================
app.get('/webhook', (req, res) => {
  const { mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;
  if (mode === 'subscribe' && token === CONFIG.VERIFY_TOKEN) {
    console.log("✅ Webhook เชื่อมต่อสำเร็จ | Facebook AutoPage v2.3");
    return res.send(challenge);
  }
  res.sendStatus(403);
});

// ==================== 📥 รับข้อความ & ประมวลผล ====================
app.post('/webhook', async (req, res) => {
  const entry = req.body.entry?.[0];
  const event = entry?.messaging?.[0];

  if (event?.message?.text && !event.message.is_echo) {
    const senderId = event.sender.id;
    const pageId = entry.id;
    const pageToken = process.env[`PAGE_TOKEN_${pageId}`] || "";
    const userMsg = event.message.text.toLowerCase();

    await sendReply(senderId, pageId, pageToken, userMsg);
  }
  res.sendStatus(200);
});

// ==================== 🤖 ตอบกลับอัจฉริยะ + ลิงก์ภายนอก ====================
async function sendReply(senderId, pageId, token, msg) {
  const API_URL = `https://graph.facebook.com/${CONFIG.API_VER}/${pageId}/messages`;

  // 📦 ส่งปุ่มลิงก์สินค้า
  if (msg.includes("สินค้า") || msg.includes("ดูของ") || msg.includes("มีอะไรบ้าง")) {
    return await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: "📦 นี่คือสินค้าทั้งหมดของเราเลือกดูได้เลยครับ",
              buttons: [{
                type: "web_url",
                url: CONFIG.LINKS.PRODUCTS,
                title: "ดูสินค้า",
                webview_height_ratio: "full"
              }]
            }
          }
        },
        access_token: token
      })
    });
  }

  // 🛒 ส่งลิงก์สั่งซื้อ
  if (msg.includes("สั่งซื้อ") || msg.includes("จอง") || msg.includes("ซื้อ")) {
    return await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text: "✅ สั่งซื้อได้ที่ลิงก์นี้ครับ\n🔗 " + CONFIG.LINKS.ORDER },
        access_token: token
      })
    });
  }

  // 📞 ติดต่อ
  if (msg.includes("ติดต่อ") || msg.includes("เบอร์") || msg.includes("โทร")) {
    return await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: "📞 ติดต่อเจ้าหน้าที่ได้เลยครับ",
              buttons: [{
                type: "web_url",
                url: CONFIG.LINKS.CONTACT,
                title: "ติดต่อ",
                webview_height_ratio: "full"
              }]
            }
          }
        },
        access_token: token
      })
    });
  }

  // 👋 ทักทาย
  if (msg.includes("สวัสดี") || msg.includes("hello") || msg.includes("ดี")) {
    return await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: senderId },
        message: { text: "สวัสดีครับ ยินดีต้อนรับสู่ Facebook AutoPage 🚀 มีอะไรให้ช่วยไหมครับ?" },
        access_token: token
      })
    });
  }

  // 💬 คำตอบอัตโนมัติอื่นๆ
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: senderId },
      message: { text: "ขอบคุณครับ เดี๋ยวเจ้าหน้าที่ตอบกลับให้เร็วที่สุดครับ 😊" },
      access_token: token
    })
  });
}

// ==================== 🚀 เปิดใช้งานระบบ ====================
app.listen(CONFIG.PORT, () => {
  console.log(`
╔═════════════════════════════════════════╗
║  🚀 Facebook AutoPage v2.3 • ALL-IN-ONE ║
║  ✅ ทำงานที่พอร์ต: ${CONFIG.PORT}          ║
║  🔗 รองรับลิงก์ภายนอก                  ║
║  © Thanva Phupingbut 244                ║
╚═════════════════════════════════════════╝
  `);
});

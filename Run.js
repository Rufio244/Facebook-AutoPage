# 1. สร้างโฟลเดอร์ใหม่
mkdir fb-autopage-v2.3 && cd fb-autopage-v2.3

# 2. สร้างไฟล์ตามด้านบน
# - index.js
# - .env.example

# 3. สร้าง package.json แบบรวดเร็ว
npm init -y
npm install express body-parser cors dotenv

# 4. อัปโหลดขึ้น GitHub
git init
git add .
git commit -m "🚀 Facebook AutoPage v2.3 All-in-One"
git remote add origin https://github.com/ชื่อของพี่/fb-autopage-v2.3.git
git push -u origin main

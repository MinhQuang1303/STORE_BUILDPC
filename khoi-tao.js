const fs = require('fs');
const path = require('path');

// Hàm tạo thư mục nếu chưa có
const buildDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Đã tạo thư mục: ${dirPath}`);
    }
};

// 1. Tạo các thư mục cần thiết
const base = "web-ban-linh-kien";
buildDir(path.join(base, "may-chu"));
buildDir(path.join(base, "giao-dien"));

// 2. Nội dung các file package.json
const rootPkg = {
  name: "build-pc-tong",
  scripts: {
    "backend": "cd web-ban-linh-kien/may-chu && npm start",
    "frontend": "cd web-ban-linh-kien/giao-dien && npm start",
    "dev": "concurrently \"npm run backend\" \"npm run frontend\""
  },
  devDependencies: { "concurrently": "^8.2.2" }
};

const serverPkg = {
  name: "may-chu",
  scripts: { "start": "node server.js" },
  dependencies: { "express": "^4.21.2", "mongoose": "^8.9.5", "dotenv": "^16.4.7", "cors": "^2.8.5" }
};

const clientPkg = {
  name: "giao-dien",
  dependencies: { "react": "^18.2.0", "react-dom": "^18.2.0", "react-scripts": "5.0.1", "axios": "^1.6.0" },
  scripts: { "start": "react-scripts start" }
};

// 3. Ghi file
fs.writeFileSync('package.json', JSON.stringify(rootPkg, null, 2));
fs.writeFileSync(path.join(base, 'may-chu', 'package.json'), JSON.stringify(serverPkg, null, 2));
fs.writeFileSync(path.join(base, 'giao-dien', 'package.json'), JSON.stringify(clientPkg, null, 2));

console.log("\n✅ Đã tạo xong toàn bộ file và thư mục!");
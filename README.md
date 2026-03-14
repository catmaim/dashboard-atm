## ATM Executive Dashboard

Next.js + Tailwind CSS dashboard for Branch and ATM monitoring.

### Data sources
- Branch sheet: `1QYlJKK4ijp-oeMUKMAPBD_buuPLP4wUDHNmOgzJmtPk` (gid `695915812`)
- ATM sheet: `1nRuVfB2XAFIsVFQr_CoJwPKRFC3NUHSj3icOepoL8mI` (gid `1100078309`)

## เปิดให้ดูแบบง่ายที่สุด (แนะนำ)

รันคำสั่งเดียว:

```bash
npm run open:easy
```

จากนั้นเปิดลิงก์นี้ในเบราว์เซอร์:

```text
http://localhost:3000
```

> ถ้าจะเปลี่ยนพอร์ต เช่น 3001:
>
> ```bash
> bash ./scripts/start-dashboard.sh 3001
> ```

---

## เปิดออนไลน์ผ่าน GitHub (ไม่ต้องรันบนเครื่องตัวเอง)

### วิธีที่แนะนำ: Vercel (ฟรี, เหมาะกับ Next.js)
1. Push โค้ดขึ้น GitHub repo ของคุณ
2. เข้า https://vercel.com แล้วกด **Continue with GitHub**
3. กด **Add New... → Project**
4. เลือก repo นี้ แล้วกด **Deploy**
5. รอ 1-2 นาที จะได้ URL ออนไลน์ เช่น:
   - `https://your-project.vercel.app`

> หลังจากนี้ทุกครั้งที่ push เข้า branch หลัก Vercel จะ deploy ให้อัตโนมัติ

### ทางเลือก 2: Netlify
1. เข้า https://app.netlify.com
2. เลือก **Add new site → Import an existing project → GitHub**
3. เลือก repo
4. Build command: `npm run build`
5. Publish directory: `.next`

> หมายเหตุ: Next.js บน Netlify อาจต้องใช้ plugin/runtime เพิ่มตาม wizard ของ Netlify

### ทางเลือก 3: CodeSandbox (เร็วสุดสำหรับ preview)
1. เข้า https://codesandbox.io
2. เลือก **Import from GitHub**
3. ใส่ URL repo
4. รอระบบติดตั้ง แล้วเปิด Preview URL ได้ทันที

---

## วิธีปกติ (ทีละขั้น)

```bash
npm install
npm run dev
```

แล้วเปิด `http://localhost:3000`

---

## ถ้าติดตั้งไม่ผ่าน (องค์กรบล็อก npm)

```bash
npm config set registry https://registry.npmjs.org/
npm install
```

แล้วค่อยรัน:

```bash
npm run open:easy
```

---

## แก้ปัญหา `git push` ไม่ได้ (CONNECT tunnel failed / 403)

### วิธี A (แนะนำ): ใช้ Personal Access Token (HTTPS)
1. ไปสร้าง Token ที่ GitHub (Scopes: `repo`)
2. ตั้ง remote:
   ```bash
   git remote set-url origin https://github.com/catmaim/dashboard-atm.git
   ```
3. push:
   ```bash
   git push -u origin work
   ```
4. ตอนถามรหัสผ่าน ให้ใส่ **Token** แทน password

### วิธี B: ใช้ SSH (มักผ่าน proxy ได้ดีกว่า)
```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub
```
- เอา public key ไปเพิ่มใน GitHub → Settings → SSH and GPG keys
- เปลี่ยน remote เป็น SSH และ push:
```bash
git remote set-url origin git@github.com:catmaim/dashboard-atm.git
git push -u origin work
```

### วิธี C: ตั้งค่า proxy ให้ git ถ้าองค์กรบังคับ
```bash
git config --global http.proxy http://<proxy-host>:<port>
git config --global https.proxy http://<proxy-host>:<port>
```

---

## Deploy Vercel แล้วขึ้น `404: NOT_FOUND` แก้ตามนี้

1. ต้องมีโค้ดบน GitHub ก่อน (push สำเร็จ)
2. ใน Vercel ให้เลือก **Project Root = /**
3. ตั้ง **Framework Preset = Next.js**
4. ตั้ง **Production Branch** ให้ตรงกับ branch ที่ deploy (`work` หรือ `main`)
5. กด **Redeploy** ล่าสุด
6. ถ้ายังไม่ได้ ให้ลบโปรเจกต์เดิมแล้วสร้างใหม่จาก repo เดิม

มีไฟล์ `vercel.json` ระบุ framework เป็น Next.js ไว้แล้ว

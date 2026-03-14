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


## Deploy Vercel แล้วขึ้น 404: NOT_FOUND แก้ตามนี้

1. เช็กว่าโค้ดถูก push ขึ้น GitHub แล้วจริง:
   ```bash
   git remote -v
   git push -u origin work
   ```
2. ใน Vercel ให้เลือก **Project Root = /** (root repo) ไม่ใช่โฟลเดอร์ย่อย
3. ใน Vercel Settings → Git ให้ตั้ง Production Branch ให้ตรงกับ branch ที่ deploy (เช่น `work` หรือ `main`)
4. กด Redeploy ล่าสุดอีกครั้ง
5. ถ้ายัง 404 ให้สร้าง Project ใหม่บน Vercel แล้วเลือก repo เดิมใหม่

ไฟล์ `vercel.json` ถูกเพิ่มให้ Vercel detect เป็น Next.js โดยตรงแล้ว

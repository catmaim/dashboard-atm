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

# FinTeen — Hackathon Full-stack MVP

## 1. O‘rnatish
```bash
npm install
```

## 2. `.env.local` yarating
`.env.example` nusxasini `.env.local` qiling:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/finteen
JWT_SECRET=istalgan-uzun-maxfiy-soz
```
MongoDB local service ishlayotgan bo‘lishi kerak.

## 3. Ishga tushirish
```bash
npm run dev
```
Brauzer: http://localhost:3000

## Demo oqimi
1. Parent sifatida register qiling va Family yarating.
2. Parent paneldagi Family bo‘limidan kodni oling.
3. Incognito/ikkinchi browserda Child sifatida register bo‘lib, family kodni kiriting.
4. Parent vazifa yaratadi: Responsibility (XP) yoki Extra work (pul).
5. Child vazifani bajaradi va test javobini yuboradi.
6. Parent tasdiqlaydi.
7. XP yoki pul child profiliga tushadi.
8. Child pulni Save yoki Goal bo‘limiga ajrata oladi.

## Hackathon uchun keyingi bosqich
Video URL/model, quizlar kolleksiyasi, transaction history, goal yaratish, bir nechta child, real-time notification va admin analytics qo‘shish mumkin.

## Session/task flow fix
This build forces fresh `/api/me` and `/api/tasks` reads after account changes and task mutations. Login/logout uses a full navigation so a previous Parent/Child session cannot remain in the client UI. Task approval is idempotent: the reward is credited once only.

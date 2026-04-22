### תיאור פרויקט SmartMatch

פרויקט SmartMatch הוא מערכת חיבור ותיאום בין משתמשים עם תהליך של:
- הרשמה ויצירת פרופיל אישי
- הגדרת דרישות לבן/בת זוג
- מציאת התאמות לפי קריטריונים
- שליחת התעניינות
- אישור עניין הדדי
- ניהול קבצים למנהל אחרי אישור

### תפקידים

1. משתמש רגיל
   - מנהל פרופיל אישי
   - מגדיר העדפות לבן/בת זוג
   - רואה הצעות מתאימות
   - שולח ומקבל בקשות התעניינות
   - מקבל גישה לקבצים אחרי התעניינות הדדית

2. מנהל / שדכן
   - רואה את כל המשתמשים
   - רואה הצעות ממתינות לטיפול
   - מנהל את המערכת

### טכנולוגיות

- Frontend: React + Vite
- Backend: Node.js + Express
- בסיס נתונים: MongoDB
- אימות: JWT
- קבצים: PDF ותמונה

### מבנה פרויקט

`client/`
- `src/`
  - רכיבים, דפים, ניהול סטייט, רוטינג
- `package.json`

`server/`
- `src/models/`
  - `user.model.js`
  - `profile.model.js`
  - `preference.model.js`
  - `interest.model.js`
- `src/controllers/`
  - `auth.controller.js`, `profile.controller.js`, `preference.controller.js`, `interest.controller.js`
- `src/routes/`
  - `auth.routes.js`, `profile.routes.js`, `preference.routes.js`, `interest.routes.js`
- `src/middleware/`
  - `auth.middleware.js`, `error.middleware.js`
- `src/config/`
  - `db.js`, `jwt.js`

### דף הרשמה

#### טופס פרטים אישיים
- שם
- תעודת זהות
- סיסמה
- גיל
- עיר
- גובה
- סגנון: שמור / קלאס / פתוח
- תיאור כללי
- קובץ PDF רזומה
- תמונה

#### טופס דרישות לבן/בת זוג
- טווח גיל
- עיר (אופציונלי)
- טווח גובה
- סגנון (אופציונלי)

### זרימת משתמש

1. משתמש נרשם וממלא פרטי פרופיל והעדפות.
2. המשתמש מתווסף למערכת.
3. המשתמש רואה הצעות מתאימות לפי ההעדפות.
4. לוחץ על "התעניינות" כדי לשלוח בקשה.
5. הבקשה מגיעה למשתמש השני כ"התעניינות ממתינה".
6. אם המשתמש השני מקבל, הסטטוס מתעדכן ל-accepted.
7. אם המשתמש השני דוחה, הסטטוס מתעדכן ל-rejected.

### תנאי גישה והרשאות

- משתמש רגיל רואה רק פרטי פרופיל בסיסיים של אחרים.
- קבצים רגישים (PDF ותמונה) מוצגים רק אחרי עניין הדדי או למנהל.
- מנהל רואה את כל המשתמשים ואת כל הפרטים.

### שלבי MVP

0. יצירת מודלים: User, Profile, Preference, Interest
1. הרשמה ופרופיל אישי
2. שמירת העדפות
3. הצגת התאמות בסיסיות
4. שליחת התעניינות וסטטוס פשוט
5. ממשק מנהל להצעות ממתינות

### מודלים ל-MVP

#### User
- name
- id
- password (hashed)
- role (user/admin)

#### Profile
- user (ref ל-User)
- age
- city
- height
- style
- description
- resumePdf
- image

#### Preference
- user (ref ל-User)
- ageMin
- ageMax
- city
- heightMin
- heightMax
- style

#### Interest
- sender (ref ל-User)
- receiver (ref ל-User)
- status: sent / accepted / rejected

### עקרונות עיקריים

- אין service layer מיותר.
- אין discriminator pattern.
- אין מודלים כפולים.
- שמרנו על CRUD פשוט וברור.
- התמקדות ב-API routes פשוטים וניהול נתונים ישיר.

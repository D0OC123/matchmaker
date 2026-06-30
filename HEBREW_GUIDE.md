# OGFN Matchmaker v27.11 - מדריך בעברית

## ✅ הושלם - שרת Matchmaking אמיתי!

המערכת שלך היא עכשיו **שרת WebSocket אמיתי** בדיוק כמו FortMatchmaker!

---

## 🎯 מה נבנה

### השרת החדש

✅ **שרת WebSocket בזמן אמת**
- פרוטוקול: WebSocket (ws://)
- ספרייה: `ws@8.18.0`
- פורט: 5353
- IP: 26.101.130.210 (VPN שלך)

✅ **תהליך Matchmaking ב-5 שלבים**
1. **Connecting** (200ms) - חיבור ראשוני
2. **Waiting** (1000ms) - ממתין לשחקנים
3. **Queued** (2000ms) - בתור
4. **SessionAssignment** (6000ms) - נמצא משחק
5. **Play** (8000ms) - מוכן להצטרף למשחק

✅ **מבוסס על FortMatchmaker**
- ארכיטקטורה זהה ל-FortMatchmaker של Lawin0129
- הותאם ל-OGFN v27.11
- נכתב ב-TypeScript

---

## 🚀 איך להפעיל

### הפעלת השרת

**דרך 1 - קובץ BAT (הכי פשוט):**
```bash
לחץ פעמיים על: start.bat
```

**דרך 2 - PowerShell:**
```powershell
.\start.ps1
```

**דרך 3 - ידנית:**
```bash
npm install
npm run build
npm start
```

### בדיקת השרת

```bash
node test-client.js
```

תראה משהו כזה:
```
✅ Connected to matchmaker
📥 [200ms] Received: StatusUpdate - Connecting
📥 [1000ms] Received: StatusUpdate - Waiting
📥 [2000ms] Received: StatusUpdate - Queued
📥 [6000ms] Received: StatusUpdate - SessionAssignment
📥 [8000ms] Received: Play
✅ MATCHMAKING COMPLETE!
```

---

## 📊 איך זה עובד

### תהליך המשחק

```
1. השחקן מתחבר לשרת ב-WebSocket
   ws://26.101.130.210:5353

2. השרת שולח 5 הודעות במשך 8 שניות:
   - Connecting (חיבור)
   - Waiting (ממתין)
   - Queued (בתור)
   - SessionAssignment (מצא משחק)
   - Play (מוכן לשחק)

3. ההודעה האחרונה (Play) מכילה:
   - matchId - מזהה המשחק
   - sessionId - מזהה השחקן
   - joinDelaySec - כמה זמן לחכות

4. השחקן מתנתק מהשרת ומתחבר למשחק
```

---

## 🎮 מה השתנה מהגרסה הקודמת

### לפני (HTTP Redirect):
```javascript
// פעם היה רק redirect פשוט
window.location.href = 'http://26.101.130.210:5353/game?mode=SOLO';
```

### עכשיו (WebSocket Matchmaking):
```javascript
// עכשיו יש matchmaking אמיתי בזמן אמת
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.name === 'Play') {
    // קיבלנו matchId ו-sessionId
    // עכשיו אפשר להתחבר למשחק
  }
};
```

### מה השתפר:
✅ עדכוני סטטוס בזמן אמת  
✅ מזהים ייחודיים לכל session  
✅ תהליך matchmaking נכון  
✅ תואם ללקוחות Fortnite  
✅ מבוסס על ארכיטקטורה מוכחת  
✅ פרוטוקול WebSocket (כמו Fortnite האמיתי)  

---

## 📁 הקבצים שנוצרו

### קבצי קוד
- ✅ **src/index.ts** - השרת הראשי (280 שורות)
- ✅ **dist/index.js** - הקוד הקומפלד
- ✅ **package.json** - הגדרות הפרויקט
- ✅ **test-client.js** - לקוח לבדיקה

### תיעוד
- ✅ **README.md** - סקירה כללית (300+ שורות)
- ✅ **API.md** - תיעוד ה-API (550+ שורות)
- ✅ **ARCHITECTURE.md** - פרטים טכניים (700+ שורות)
- ✅ **STARTUP.md** - מדריך הפעלה (450+ שורות)
- ✅ **CHANGELOG.md** - היסטוריית גרסאות
- ✅ **SUMMARY.md** - סיכום מהיר
- ✅ **HEBREW_GUIDE.md** - המדריך הזה

### סקריפטים
- ✅ **start.bat** - הפעלה ב-Windows
- ✅ **start.ps1** - הפעלה ב-PowerShell

### דף מידע
- ✅ **index.html** - דף מידע יפה על השרת

---

## 🔧 הגדרות

כדי לשנות הגדרות, ערוך את `src/index.ts`:

```typescript
// הגדרות שרת
const PORT = 5353;           // הפורט
const HOST = '26.101.130.210'; // ה-IP

// הגדרות זמנים
const TIMING = {
  CONNECTING: 200,          // זמן ההודעה הראשונה
  WAITING: 1000,            // זמן ההמתנה
  QUEUED: 2000,             // זמן התור
  SESSION_ASSIGNMENT: 6000, // זמן מציאת משחק
  JOIN: 8000                // זמן הצטרפות
};
```

אחרי שינויים:
```bash
npm run build
npm start
```

---

## 🎮 פיצ'רים

### מצבי משחק
- **SOLO** - שחקן אחד
- **ONLINE** - 2+ שחקנים

### אזורים
- **NA_EAST** - מזרח אמריקה
- **NA_WEST** - מערב אמריקה
- **EU** - אירופה
- **ASIA_PACIFIC** - אסיה
- **SOUTH_AMERICA** - דרום אמריקה
- **MIDDLE_EAST** - המזרח התיכון

### זמנים
- סה"כ matchmaking: **8 שניות**
- ניתן לשינוי ב-`src/index.ts`

---

## 🐛 פתרון בעיות

### הפורט תפוס

**הבעיה:**
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5353
```

**הפתרון:**
```bash
netstat -ano | findstr :5353
taskkill /PID <PID> /F
```

או פשוט הרץ `start.bat` - הוא מנקה את הפורט אוטומטית.

---

### לא מצליח להתחבר

**צ'קליסט:**
1. ✅ ה-VPN מחובר ל-26.101.130.210?
2. ✅ השרת רץ? (`npm start`)
3. ✅ ה-Firewall לא חוסם את פורט 5353?
4. ✅ אפשר לעשות ping ל-26.101.130.210?

**בדיקה:**
```bash
ping 26.101.130.210
telnet 26.101.130.210 5353
```

---

### שגיאות בבנייה

**הפתרון:**
```bash
# מחיקה ובנייה מחדש
rmdir /s /q dist node_modules
npm install
npm run build
```

---

## 📚 תיעוד מלא

| קובץ | תיאור |
|------|--------|
| **README.md** | סקירה כללית של הפרויקט |
| **API.md** | תיעוד מלא של ה-API |
| **ARCHITECTURE.md** | פרטים טכניים |
| **STARTUP.md** | מדריך הפעלה |
| **SUMMARY.md** | סיכום מהיר |
| **HEBREW_GUIDE.md** | המדריך הזה |

---

## 🔗 GitHub

הקוד ב-GitHub:
```
https://github.com/D0OC123/matchmaker
```

ה-Commit האחרון:
```
Complete rewrite: Implement real WebSocket matchmaking like FortMatchmaker
```

---

## 💡 איך להשתמש ב-Backend שלך

### מהמשחק שלך (OGFN Client)

```javascript
// התחבר לשרת המatchmaking
const ws = new WebSocket('ws://26.101.130.210:5353');

// כשמתחבר
ws.onopen = () => {
  console.log('מחובר ל-matchmaker');
};

// כשמקבל הודעה
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  // הצג את השלב הנוכחי
  if (message.name === 'StatusUpdate') {
    const state = message.payload.state;
    console.log('שלב:', state);
    
    if (state === 'Queued') {
      console.log('מספר כרטיס:', message.payload.ticketId);
    }
  }
  
  // כשמוכן להצטרף למשחק
  if (message.name === 'Play') {
    const matchId = message.payload.matchId;
    const sessionId = message.payload.sessionId;
    
    console.log('מוכן להצטרף למשחק!');
    console.log('Match ID:', matchId);
    console.log('Session ID:', sessionId);
    
    // סגור את החיבור ל-matchmaker
    ws.close();
    
    // התחבר לשרת המשחק עם ה-IDs
    connectToGameServer(matchId, sessionId);
  }
};
```

---

## ✨ השוואה ל-FortMatchmaker

| תכונה | FortMatchmaker | OGFN Matchmaker |
|--------|----------------|-----------------|
| **שפה** | JavaScript | TypeScript ✨ |
| **Type Safety** | ❌ לא | ✅ כן |
| **פורט** | 80 | 5353 |
| **IP** | כל ה-IPs | רק ה-VPN IP ✨ |
| **תיעוד** | בסיסי | מקיף מאוד ✨ |
| **לקוח בדיקה** | ❌ לא | ✅ כן |
| **לוגים** | בסיסי | עם אמוג'י ✨ |
| **מצבי משחק** | לא מוגדר | SOLO, ONLINE ✨ |
| **אזורים** | לא מוגדר | 6 אזורים ✨ |

---

## 🎉 הצלחנו!

השרת שלך הוא עכשיו **שרת matchmaking אמיתי** כמו FortMatchmaker!

### מה יש לך:
✅ שרת WebSocket בזמן אמת  
✅ תהליך matchmaking ב-5 שלבים  
✅ קוד TypeScript מסודר  
✅ תיעוד מקיף  
✅ לקוח בדיקה  
✅ סקריפטים להפעלה  
✅ מבוסס על ארכיטקטורה מוכחת  

### מוכן לשימוש:
```bash
# הפעל את השרת
start.bat

# בדוק אותו
node test-client.js
```

### פרטי השרת:
- **כתובת**: ws://26.101.130.210:5353
- **פרוטוקול**: WebSocket
- **זמן matchmaking**: 8 שניות
- **מצבי משחק**: SOLO, ONLINE
- **אזורים**: 6 נתמכים

---

## 📞 עזרה

אם צריך עזרה:
1. קרא את **STARTUP.md** לפתרון בעיות
2. קרא את **API.md** לשילוב במשחק
3. קרא את **ARCHITECTURE.md** לפרטים טכניים
4. בדוק את הלוגים של השרת לשגיאות

---

## 🚀 השלבים הבאים

### מה לעשות עכשיו:
1. ✅ הרץ את השרת עם `start.bat`
2. ✅ בדוק עם `node test-client.js`
3. ✅ שלב במשחק ה-OGFN שלך
4. ✅ קרא את ה-API documentation

### בעתיד:
- הוספת בחירת מצב משחק מהלקוח
- הוספת בחירת אזור מהלקוח
- ניהול תור אמיתי של שחקנים
- מערכת דירוג (MMR)
- אימות משתמשים

---

**גרסה**: 27.11.0  
**סטטוס**: ✅ עובד ומוכן לשימוש  
**מבוסס על**: FortMatchmaker מאת Lawin0129  
**הותאם ל**: OGFN v27.11  
**שפה**: TypeScript  
**פרוטוקול**: WebSocket (ws://)  

**נבנה בעזרת Kiro AI ❤️**

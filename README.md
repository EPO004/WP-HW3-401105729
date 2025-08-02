
# اپلیکیشن طراحی

این یک اپلیکیشن طراحی مبتنی بر وب است که به کاربران این امکان را می‌دهد که اشکال را به راحتی بر روی canvas بکشند، آنها را حذف کنند و طراحی‌های خود را Export یا Import کنند. این اپلیکیشن با استفاده از **React** ساخته شده و از **CSS** برای طراحی استفاده می‌کند. کاربران می‌توانند اشکال مختلف (مربع، دایره، مثلث) را از Sidebar انتخاب کرده و آنها را بر روی canvas قرار دهند. همچنین، اپلیکیشن قابلیت ذخیره کردن طراحی‌ به صورت فایل JSON و بارگذاری طراحی‌ قبلی هر کاربر را دارد.

## ویژگی‌ها

- **ویژگی Drag and Drop**: کاربران می‌توانند اشکال را از نوار ابزار بکشند و بر روی canvas قرار دهند.
- **شمارش اشکال**: تعداد هر نوع از اشکال قرار داده شده بر روی canvas نمایش داده می‌شود.
- **حذف اشکال**: کاربران می‌توانند هر شکل را با دوبار کلیک کردن بر روی آن حذف کنند.
- **قابلیت Export/Import**: کاربران می‌توانند طراحی‌های خود را به عنوان یک فایل JSON ذخیره کنند و طراحی‌های ذخیره شده قبلی را بارگذاری کنند.
- **قابلیت ذخیره و بارگذاری از سرور**: کاربران می‌توانند طراحی‌های خود را در سرور ذخیره کنند و از طریق نام یا شناسه بارگذاری کنند.

## ساختار پروژه

پروژه با نمای کلی، به صورت زیر دسته بندی شده است:

```
paint-app-front/
  src/
    components/
      Canvas.js          
      Header.js          
      ShapeCounter.js    
      Sidebar.js         
    App.js               
    App.css
paint-app-backend/
  drawings.json
  server.js
```

## توضیحات کامپوننت‌ها

### 1.فایل **Canvas.js**

کامپوننت `Canvas` ناحیه‌ای است که کاربران می‌توانند اشکال را بر روی آن قرار دهند. این کامپوننت مسئولیت قرار دادن اشکال بر روی canvas و جلوگیری از خروج آنها از محدوده canvas را دارد.

- تابع **handleDrop**: این تابع هنگام رها کردن یک شکل اجرا می‌شود. موقعیت قرار گرفتن شکل محاسبه شده و از خارج شدن آن از محدوده canvas جلوگیری می‌شود.
- تابع **onDropShape**: این تابع از طرف کامپوننت والد (`App`) به کامپوننت `Canvas` ارسال شده و با فراخوانی آن، وضعیت اشکال به روزرسانی می‌شود.

```jsx
const handleDrop = (e) => {
  e.preventDefault();
  const shape = e.dataTransfer.getData("shape");
  const rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  const shapeSize = 50;

  x = Math.max(0, Math.min(x, rect.width - shapeSize));
  y = Math.max(0, Math.min(y, rect.height - shapeSize));

  onDropShape(shape, x, y);
};
```

### 2.فایل **Header.js**

کامپوننت `Header` شامل هدر برنامه است که دو دکمه برای صادر کردن و وارد کردن اشکال دارد.

- توضیح **onExport**: اشکال موجود را به یک فایل `.json` صادر می‌کند.
- توضیح **onImport**: اشکال را از یک فایل `.json` وارد می‌کند.

```jsx
<button onClick={onExport}>Export</button>
<button onClick={onImport}>Import</button>
```

### 3.فایل **ShapeCounter.js**

کامپوننت `ShapeCounter` تعداد اشکال مختلفی که روی canvas قرار گرفته‌اند را نشان می‌دهد. این کامپوننت از آیکون‌های SVG برای نمایش انواع اشکال (مربع، دایره، مثلث) استفاده می‌کند.

```jsx
const counts = shapes.reduce((acc, shape) => {
  acc[shape.type] = (acc[shape.type] || 0) + 1;
  return acc;
}, {});

return (
  <div className="shape-counter">
    {Object.entries(counts).map(([type, count]) => (
      <div key={type}>
        {type === 'Square' && <SquareIcon />}
        {type === 'Circle' && <CircleIcon />}
        {type === 'Triangle' && <TriangleIcon />}
        {count}
      </div>
    ))}
  </div>
);
```

### 4.فایل **Sidebar.js**

کامپوننت `Sidebar` نوار ابزاری است که شامل اشکال قابل کشیدن است. هر زمان که یک شکل کشیده می‌شود، تابع `onSelect` از والد (کامپوننت `App`) فراخوانی می‌شود تا نشان دهد کدام شکل برای کشیدن انتخاب شده است.

```jsx
{shapes.map((shape) => (
  <div
    key={shape.type}
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData("shape", shape.type);
      onSelect(shape.type);
    }}
  >
    {shape.icon}
  </div>
))}
```

### 5.فایل **App.js**

کامپوننت `App` ریشه‌ی اپلیکیشن است که وضعیت برنامه را مدیریت می‌کند. این کامپوننت شامل توابع مختلف برای انتخاب شکل، قرار دادن شکل بر روی canvas، حذف شکل و صادر کردن و وارد کردن اشکال است.

- توضیح **handleSelect**: شکل انتخاب شده توسط کاربر برای کشیدن را تنظیم می‌کند.
- توضیح **handleDropShape**: شکل رها شده را به وضعیت `shapes` اضافه می‌کند.
- توضیح **handleDeleteShape**: یک شکل را از canvas حذف می‌کند.
- توضیح **handleExport**: اشکال را به صورت یک فایل `json.` صادر می‌کند.
- توضیح **handleImport**: اشکال را از یک فایل `json.` وارد می‌کند.

```jsx
  const handleExport = async () => {
    const name = prompt("Enter a name to save your drawing:"); 
    if (!name) return; 

    try {
      const response = await fetch('http://localhost:3001/api/drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, shapes }) 
      });

      if (response.ok) {
        alert('Drawing saved to server!');
      } else {
        alert('Error saving drawing to server');
      }
    } catch (error) {
      alert('Error saving drawing to server: ' + error.message);
    }
  };

  const handleImport = async () => {
    const name = prompt("Enter the name of the drawing to load:");
    if (!name) return;

    try {
      const response = await fetch(`http://localhost:3001/api/drawings/${name}`);
      if (response.ok) {
        const data = await response.json();
        setShapes(data.shapes); 
        alert('Drawing loaded from server!');
      } else {
        alert('Drawing not found');
      }
    } catch (error) {
      alert('Error loading drawing: ' + error.message);
    }
  };
```

### 6.بخش **App.css**

در این فایل، استایل‌های مختلفی برای طراحی canvas و sidebar، همچنین ویژگی‌های ریسپانسیو برای موبایل اعمال شده است.

```css
.canvas {
  width: 600px;
  height: 400px;
  border: 2px solid #000;
  background-color: #ffffff;
  position: relative;
  cursor: crosshair;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 7.بخش بک‌اند

برای ذخیره‌سازی طراحی‌ها و بارگذاری آن‌ها از سرور، از **Express** و **Node.js** استفاده شده است. API زیر برای ذخیره و بارگذاری طراحی‌ها به کار می‌رود، و هرکاربر فقط یک طراحی می تواند ذخیره یا بارگذاری کند:

#### **کد سرور (Express)**
```js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './drawings.json';

let db = fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : {};

app.post('/api/drawings', (req, res) => {
  const { name, shapes } = req.body;

  if (db[name]) {
    db[name] = shapes;
    console.log(`Updated drawing: ${name}`);
  } else {
    db[name] = shapes;
    console.log(`Saved new drawing: ${name}`);
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(db)); 
  res.sendStatus(200);
});

app.get('/api/drawings/:name', (req, res) => {
  const { name } = req.params;
  const shapes = db[name];
  if (shapes) {
    res.json({ shapes });
  } else {
    res.sendStatus(404);
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
```

## موارد استفاده از هوش مصنوعی

برای محتوای فایل App.css، برای محتوای بخش‌های مختلف کامپوننت‌ها کمک گرفته شده تا بهتر و راحت‌تر بتوان خروجی را با طراحی بهتر نمایش داد. برتری استفاده از هوش مصنوعی نسبت به سرچ در گوگل این است که زودتر و کامل‌تر می‌توان به خواسته خود برسیم.

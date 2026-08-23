// ข้อมูลอาหาร (เก็บใน LocalStorage)
let foodList = [];
let dailyCalorieTarget = 0;

// ฐานข้อมูลอาหารยอดนิยม (ชื่ออาหาร: แคลอรี่ต่อหน่วยบริโภค)
const foodDatabase = {
    // อาหารจานเดียว
    "ข้าวผัดกุ้ง": 350,
    "ข้าวผัดหมู": 400,
    "ข้าวมันไก่": 550,
    "ข้าวขาหมู": 600,
    "ข้าวราดแกง": 450,
    "ข้าวหน้าเป็ด": 500,
    "ข้าวหมูแดง": 450,
    "ข้าวหมูกรอบ": 550,
    "ข้าวคลุกกะปิ": 500,
    "ข้าวผัดกระเพรา": 400,
    "ข้าวผัดคะน้า": 350,
    "ข้าวต้ม": 200,
    "โจ๊ก": 250,
    "ก๋วยเตี๋ยว": 350,
    "ก๋วยเตี๋ยวต้มยำ": 300,
    "ก๋วยเตี๋ยวเย็นตาโฟ": 400,
    "ผัดไทย": 450,
    "ผัดซีอิ๊ว": 500,
    "ส้มตำ": 150,
    "ส้มตำปูปลาร้า": 200,
    "ต้มยำกุ้ง": 200,
    "แกงเขียวหวาน": 300,
    "แกงมัสมั่น": 350,
    "พะแนง": 350,
    "ผัดกะเพรา": 250,
    
    // อาหารจานเดียว (Fast Food)
    "เบอร์เกอร์": 500,
    "พิซซ่า": 300,
    "เฟรนช์ฟรายส์": 350,
    "ไก่ทอด": 350,
    "แซนวิช": 250,
    "สปาเก็ตตี้": 400,
    "มักกะโรนี": 350,
    "สเต็ก": 500,
    "ซูชิ": 300,
    "ราเมน": 450,
    
    // อาหารเช้า
    "ไข่เจียว": 200,
    "ไข่ต้ม": 75,
    "ไข่ดาว": 90,
    "ไข่คน": 100,
    "ขนมปัง": 80,
    "ขนมปังปิ้ง": 150,
    "ซีเรียล": 150,
    "โยเกิร์ต": 100,
    "นมสด": 120,
    "กาแฟ": 100,
    "ชา": 50,
    
    // ผลไม้
    "แอปเปิ้ล": 95,
    "กล้วย": 105,
    "ส้ม": 60,
    "องุ่น": 70,
    "แตงโม": 46,
    "มะม่วง": 60,
    "มะละกอ": 55,
    "สับปะรด": 50,
    "ฝรั่ง": 68,
    "ทุเรียน": 180,
    "มังคุด": 73,
    "เงาะ": 80,
    
    // เครื่องดื่ม
    "น้ำเปล่า": 0,
    "น้ำอัดลม": 150,
    "น้ำผลไม้": 120,
    "ชาไข่มุก": 350,
    "กาแฟเย็น": 200,
    "ชาเขียว": 180,
    "นมช็อกโกแลต": 200,
    "เบียร์": 150,
    "ไวน์": 120,
    
    // ขนม
    "ไอศครีม": 200,
    "เค้ก": 350,
    "คุกกี้": 80,
    "ช็อกโกแลต": 150,
    "ขนมไทย": 200,
    "โดนัท": 250,
    "มันฝรั่งทอด": 150,
    
    // อาหารอีสาน
    "ลาบ": 200,
    "น้ำตก": 200,
    "ตำแตง": 100,
    "ตำผลไม้": 120,
    "ไก่ย่าง": 250,
    "หมูย่าง": 300,
    "ปลาเผา": 250,
    
    // อาหารเหนือ
    "ข้าวซอย": 400,
    "แกงฮังเล": 350,
    "น้ำพริกหนุ่ม": 100,
    "แคบหมู": 200,
    "ไส้อั่ว": 250,
    
    // อาหารใต้
    "แกงไตปลา": 300,
    "ผัดสะตอ": 250,
    "ไก่ทอดหาดใหญ่": 400,
    "ข้าวยำ": 350,
    
    // อาหารญี่ปุ่น
    "ข้าวหน้าปลา": 350,
    "เทมปุระ": 400,
    "โซบะ": 300,
    "อุด้ง": 350
};

// โหลดข้อมูลจาก LocalStorage เมื่อเปิดแอพ
window.onload = function() {
    loadData();
    setupFoodSearch();
};

function calculateBMR() {
    const gender = document.getElementById('gender').value;
    const age = parseInt(document.getElementById('age').value);
    const weight = parseInt(document.getElementById('weight').value);
    const height = parseInt(document.getElementById('height').value);
    const activity = parseFloat(document.getElementById('activity').value);

    // คำนวณ BMR (Basal Metabolic Rate)
    let bmr;
    if (gender === 'male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    // คำนวณ TDEE (Total Daily Energy Expenditure)
    dailyCalorieTarget = Math.round(bmr * activity);

    // แสดงผล
    document.getElementById('bmrResult').style.display = 'block';
    document.getElementById('dailyCalories').textContent = dailyCalorieTarget.toLocaleString();
    
    // แสดงสรุป
    document.getElementById('summarySection').style.display = 'block';
    updateSummary();
    saveData();
}

// ตั้งค่าระบบค้นหาอาหาร
function setupFoodSearch() {
    const foodNameInput = document.getElementById('foodName');
    const searchResults = document.getElementById('searchResults');
    
    foodNameInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length === 0) {
            searchResults.style.display = 'none';
            document.getElementById('foodCalories').value = '';
            return;
        }
        
        // ค้นหาอาหารที่ตรงกับคำค้น
        const matches = Object.keys(foodDatabase)
            .filter(food => food.toLowerCase().includes(searchTerm))
            .slice(0, 10); // แสดงผลสูงสุด 10 รายการ
        
        if (matches.length > 0) {
            searchResults.innerHTML = '';
            matches.forEach(food => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `
                    <span>${food}</span>
                    <span class="food-calories">${foodDatabase[food]} kcal</span>
                `;
                div.onclick = function() {
                    document.getElementById('foodName').value = food;
                    document.getElementById('foodCalories').value = foodDatabase[food];
                    searchResults.style.display = 'none';
                };
                searchResults.appendChild(div);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-result">ไม่พบอาหารที่ค้นหา กรุณากรอกแคลอรี่เอง</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // ซ่อนผลการค้นหาเมื่อคลิกที่อื่น
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#foodName') && !e.target.closest('#searchResults')) {
            searchResults.style.display = 'none';
        }
    });
}

function addFood() {
    const foodName = document.getElementById('foodName').value.trim();
    const foodCalories = parseInt(document.getElementById('foodCalories').value);

    if (!foodName || !foodCalories || foodCalories <= 0) {
        alert('กรุณากรอกชื่ออาหารและจำนวนแคลอรี่ให้ถูกต้อง');
        return;
    }

    // ตรวจสอบว่าเป็นอาหารในฐานข้อมูลหรือไม่
    if (foodDatabase[foodName]) {
        // ถ้าเป็นอาหารในฐานข้อมูล ใช้แคลอรี่จากฐานข้อมูล
        foodList.push({
            name: foodName,
            calories: foodDatabase[foodName],
            timestamp: new Date().toISOString()
        });
    } else {
        // ถ้าไม่ใช่ ใช้แคลอรี่ที่ผู้ใช้กรอกเอง
        foodList.push({
            name: foodName,
            calories: foodCalories,
            timestamp: new Date().toISOString()
        });
    }

    // เคลียร์ฟอร์ม
    document.getElementById('foodName').value = '';
    document.getElementById('foodCalories').value = '';
    document.getElementById('searchResults').style.display = 'none';

    updateFoodList();
    updateSummary();
    saveData();
}

function removeFood(index) {
    foodList.splice(index, 1);
    updateFoodList();
    updateSummary();
    saveData();
}

function updateFoodList() {
    const foodListElement = document.getElementById('foodList');
    const totalCaloriesBox = document.getElementById('totalCaloriesBox');
    
    foodListElement.innerHTML = '';
    
    if (foodList.length === 0) {
        foodListElement.innerHTML = '<li style="text-align: center; color: #999;">ยังไม่มีรายการอาหาร</li>';
        totalCaloriesBox.style.display = 'none';
        return;
    }

    let totalCalories = 0;
    
    foodList.forEach((food, index) => {
        const li = document.createElement('li');
        li.className = 'food-item';
        li.innerHTML = `
            <div>
                <strong>${food.name}</strong>
                <br>
                <small style="color: #666;">${new Date(food.timestamp).toLocaleTimeString('th-TH')}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${food.calories} kcal</span>
                <button class="delete-btn" onclick="removeFood(${index})">ลบ</button>
            </div>
        `;
        foodListElement.appendChild(li);
        totalCalories += food.calories;
    });

    totalCaloriesBox.style.display = 'block';
    document.getElementById('totalCalories').textContent = totalCalories.toLocaleString();
}

function updateSummary() {
    if (dailyCalorieTarget === 0) return;

    const totalConsumed = foodList.reduce((sum, food) => sum + food.calories, 0);
    const remaining = dailyCalorieTarget - totalConsumed;
    const percentage = Math.round((totalConsumed / dailyCalorieTarget) * 100);

    document.getElementById('statConsumed').textContent = totalConsumed.toLocaleString();
    document.getElementById('statRemaining').textContent = remaining.toLocaleString();
    document.getElementById('statPercentage').textContent = percentage + '%';

    // อัปเดต progress bar
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = Math.min(percentage, 100) + '%';
    
    // เปลี่ยนสีตามสถานะ
    progressFill.className = 'progress-fill';
    if (percentage > 100) {
        progressFill.classList.add('danger');
    } else if (percentage > 80) {
        progressFill.classList.add('warning');
    }

    // แสดงข้อความสรุป
    const summaryMessage = document.getElementById('summaryMessage');
    if (totalConsumed === 0) {
        summaryMessage.innerHTML = '<h3>ยังไม่ได้ทานอาหาร</h3><p>เริ่มบันทึกอาหารมื้อแรกของคุณเลย!</p>';
        summaryMessage.className = 'result-box';
    } else if (remaining > 0) {
        summaryMessage.innerHTML = `<h3>✅ อยู่ในเกณฑ์ดี</h3><p>คุณทานไปแล้ว ${totalConsumed.toLocaleString()} kcal ยังเหลืออีก ${remaining.toLocaleString()} kcal</p>`;
        summaryMessage.className = 'result-box';
    } else if (remaining === 0) {
        summaryMessage.innerHTML = '<h3>⚠️ พอดี</h3><p>คุณทานครบตามเป้าหมายแล้ว!</p>';
        summaryMessage.className = 'result-box warning';
    } else {
        summaryMessage.innerHTML = `<h3>❌ เกินเป้าหมาย</h3><p>คุณทานเกินไป ${Math.abs(remaining).toLocaleString()} kcal ควรระวัง!</p>`;
        summaryMessage.className = 'result-box danger';
    }
}

function saveData() {
    const data = {
        foodList: foodList,
        dailyCalorieTarget: dailyCalorieTarget
    };
    localStorage.setItem('calorieTrackerData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('calorieTrackerData');
    if (savedData) {
        const data = JSON.parse(savedData);
        foodList = data.foodList || [];
        dailyCalorieTarget = data.dailyCalorieTarget || 0;
        
        if (dailyCalorieTarget > 0) {
            document.getElementById('bmrResult').style.display = 'block';
            document.getElementById('dailyCalories').textContent = dailyCalorieTarget.toLocaleString();
            document.getElementById('summarySection').style.display = 'block';
            updateFoodList();
            updateSummary();
        }
    }
}

// ============ ส่วนลงทะเบียน Service Worker ============
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker ลงทะเบียนสำเร็จ:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker ลงทะเบียนล้มเหลว:', error);
            });
    });
}
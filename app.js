// ข้อมูลอาหาร (เก็บใน LocalStorage)
let foodList = [];
let dailyCalorieTarget = 0;

// โหลดข้อมูลจาก LocalStorage เมื่อเปิดแอพ
window.onload = function() {
    loadData();
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

function addFood() {
    const foodName = document.getElementById('foodName').value.trim();
    const foodCalories = parseInt(document.getElementById('foodCalories').value);

    if (!foodName || !foodCalories || foodCalories <= 0) {
        alert('กรุณากรอกชื่ออาหารและจำนวนแคลอรี่ให้ถูกต้อง');
        return;
    }

    foodList.push({
        name: foodName,
        calories: foodCalories,
        timestamp: new Date().toISOString()
    });

    // เคลียร์ฟอร์ม
    document.getElementById('foodName').value = '';
    document.getElementById('foodCalories').value = '';

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
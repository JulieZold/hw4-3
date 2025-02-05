document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 กำลังโหลดข้อมูล...");
    displayAppointments();
});

document.getElementById("appointmentForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    let title = document.getElementById("title").value.trim();
    let date = document.getElementById("date").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;

    if (!title || !date || !startTime || !endTime) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    createAppointment({ title, date, startTime, endTime });
    this.reset();
});

// ✅ ฟังก์ชันบันทึกข้อมูลลง localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ บันทึกลง localStorage: ${key}`, data);
    } catch (error) {
        console.error("❌ Error saving to localStorage:", error);
    }
}

// ✅ ฟังก์ชันดึงข้อมูลจาก localStorage
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        console.log(`📂 อ่านจาก localStorage: ${key}`, data);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("❌ Error reading from localStorage:", error);
        return [];
    }
}

// ✅ ฟังก์ชันเพิ่มนัดหมาย
function createAppointment(appointmentData) {
    let appointments = getFromLocalStorage("appointments");
    
    appointmentData.id = Date.now().toString();
    appointmentData.status = "confirmed";
    appointments.push(appointmentData);

    saveToLocalStorage("appointments", appointments);
    displayAppointments();
}

// ✅ ฟังก์ชันยกเลิกนัดหมาย
function cancelAppointment(appointmentId) {
    let appointments = getFromLocalStorage("appointments");
    appointments = appointments.map(appt => 
        appt.id === appointmentId ? { ...appt, status: "cancelled" } : appt
    );

    saveToLocalStorage("appointments", appointments);
    displayAppointments();
}

// ✅ ฟังก์ชันแสดงนัดหมาย
function displayAppointments() {
    let appointments = getFromLocalStorage("appointments");
    let appointmentList = document.getElementById("appointmentList");
    appointmentList.innerHTML = "";

    if (appointments.length === 0) {
        console.log("⚠ ไม่มีรายการนัดหมาย");
        return;
    }

    appointments.forEach(appt => {
        if (appt.status !== "cancelled") {
            let li = document.createElement("li");
            li.innerHTML = `${appt.date} ${appt.startTime}-${appt.endTime} | ${appt.title}`;
            let cancelButton = document.createElement("button");
            cancelButton.textContent = "ยกเลิก";
            cancelButton.className = "cancel-btn";
            cancelButton.onclick = () => cancelAppointment(appt.id);
            li.appendChild(cancelButton);
            appointmentList.appendChild(li);
        }
    });

    console.log("📌 รายการนัดหมายที่โหลด:", appointments);
}

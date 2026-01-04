/**
 * Dữ liệu mẫu cho Lịch - Đã thêm dữ liệu tuần để test bộ lọc ngày
 */
const allSchedules = {
    teaching: [
        // Tuần 05/01 - 11/01
        { teacher: "Trần Văn B", subject: "Lịch sử", day: "Thứ 4", slot: "Tiết 1", class: "11A5", week: "05/01/2026 - 11/01/2026" },
        // Tuần 12/01 - 18/01 (Thầy B dạy lớp khác)
        { teacher: "Trần Văn B", subject: "Lịch sử", day: "Thứ 4", slot: "Tiết 1", class: "12A2", week: "12/01/2026 - 18/01/2026" },
        { teacher: "Nguyễn Văn A", subject: "Toán", day: "Thứ 2", slot: "Tiết 1", class: "10A1", week: "05/01/2026 - 11/01/2026" },
    ],
    learning: [
        // Tuần hiện tại: 05/01/2026 - 11/01/2026
        { class: "12A1", grade: "12", day: "Thứ 2", slot: "Tiết 1", subject: "Sử", status: "", week: "05/01/2026 - 11/01/2026" },
        { class: "12A1", grade: "12", day: "Thứ 3", slot: "Tiết 3", subject: "Toán", status: "online", week: "05/01/2026 - 11/01/2026" },
        
        // Tuần sau: 12/01/2026 - 18/01/2026 (Lịch thay đổi)
        { class: "12A1", grade: "12", day: "Thứ 2", slot: "Tiết 1", subject: "Văn", status: "", week: "12/01/2026 - 18/01/2026" },
        { class: "12A1", grade: "12", day: "Thứ 3", slot: "Tiết 3", subject: "Anh", status: "", week: "12/01/2026 - 18/01/2026" },
    ]
};

// Hàm bổ trợ: Lấy ngày Thứ 2 và Chủ Nhật của tuần chứa ngày d
function getWeekRange(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(new Date(d).setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${monday.toLocaleDateString('vi-VN', options)} - ${sunday.toLocaleDateString('vi-VN', options)}`;
}

// MỚI: Hàm cập nhật danh sách Lớp dựa trên Khối được chọn
function updateClassOptions(grade) {
    const classSelect = document.getElementById('filter-class');
    if (!classSelect) return;
    
    const classesByGrade = {
        "12": ["12A1", "12A2", "12A3"],
        "11": ["11A1", "11A2", "11B1"],
        "10": ["10A1", "10C2"]
    };

    const classes = classesByGrade[grade] || [];
    classSelect.innerHTML = classes.map(c => `<option value="${c}">${c}</option>`).join('');
}

const scheduleTemplate = `
<div class="schedule-manager">
    <div class="content-tabs">
        <div class="tab active" data-type="learning">Lịch học <i class="fas fa-times" id="close-tab-schedule"></i></div>
        <div class="tab" data-type="teaching">Lịch dạy</div>
    </div>

    <div class="content-body">
        <div id="filter-learning" class="schedule-filters-container">
            <div class="filter-group">
                <label>Khối</label>
                <select id="filter-grade" class="modern-select">
                    <option value="12">Khối 12</option>
                    <option value="11">Khối 11</option>
                    <option value="10">Khối 10</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Lớp</label>
                <select id="filter-class" class="modern-select">
                    </select>
            </div>
            <div class="filter-group">
                <label>Ngày chọn</label>
                <input type="date" id="filter-date-learning" class="modern-input">
            </div>
        </div>

        <div id="filter-teaching" class="schedule-filters-container" style="display: none;">
            <div class="filter-group">
                <label>Môn học</label>
                <select id="filter-subject" class="modern-select">
                    <option value="Lịch sử">Lịch sử</option>
                    <option value="Toán">Toán</option>
                    <option value="Vật lý">Vật lý</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Giáo viên</label>
                <select id="filter-teacher" class="modern-select">
                    <option value="Trần Văn B">Trần Văn B</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Ngày chọn</label>
                <input type="date" id="filter-date-teaching" class="modern-input">
            </div>
        </div>

        <div class="schedule-container">
            <div class="schedule-header-info" style="margin-bottom: 15px;">
                <h3 id="week-display" class="schedule-week-title" style="color: var(--primary-color); font-weight: 700;"></h3>
            </div>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th style="width: 100px;">Tiết</th>
                        <th>Thứ 2</th>
                        <th>Thứ 3</th>
                        <th>Thứ 4</th>
                        <th>Thứ 5</th>
                        <th>Thứ 6</th>
                        <th>Thứ 7</th>
                        <th>Chủ nhật</th>
                    </tr>
                </thead>
                <tbody id="schedule-body"></tbody>
            </table>
        </div>
    </div>
</div>
`;

function initScheduleEvents() {
    const tabs = document.querySelectorAll('.schedule-manager .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.getAttribute('data-type');
            document.getElementById('filter-learning').style.display = type === 'learning' ? 'flex' : 'none';
            document.getElementById('filter-teaching').style.display = type === 'teaching' ? 'flex' : 'none';
            updateSchedule();
        });
    });

    // MỚI: Lắng nghe đổi Khối để đổi Lớp
    const gradeSelect = document.getElementById('filter-grade');
    if (gradeSelect) {
        gradeSelect.addEventListener('change', (e) => {
            updateClassOptions(e.target.value);
            updateSchedule();
        });
    }

    const filters = ['filter-class', 'filter-subject', 'filter-teacher', 'filter-date-learning', 'filter-date-teaching'];
    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateSchedule);
    });

    const today = new Date().toISOString().split('T')[0];
    if(document.getElementById('filter-date-learning')) document.getElementById('filter-date-learning').value = today;
    if(document.getElementById('filter-date-teaching')) document.getElementById('filter-date-teaching').value = today;

    // Khởi tạo lớp lần đầu cho khối 12
    updateClassOptions("12");
    updateSchedule();
}

function updateSchedule() {
    const activeTab = document.querySelector('.schedule-manager .tab.active');
    if (!activeTab) return;
    const type = activeTab.getAttribute('data-type');
    
    const dateVal = document.getElementById(`filter-date-${type}`).value;
    const weekDisplay = document.getElementById('week-display');
    if (weekDisplay && dateVal) {
        weekDisplay.innerText = "Tuần: " + getWeekRange(dateVal);
    }

    let filters = {};
    if (type === 'learning') {
        filters = {
            grade: document.getElementById('filter-grade').value,
            className: document.getElementById('filter-class').value
        };
    } else {
        filters = {
            subject: document.getElementById('filter-subject').value,
            teacher: document.getElementById('filter-teacher').value
        };
    }
    renderSchedule(type, filters);
}

function renderSchedule(type, filters = {}) {
    const tbody = document.getElementById('schedule-body');
    if (!tbody) return;

    // Lấy khoảng tuần hiện tại để lọc dữ liệu
    const dateVal = document.getElementById(`filter-date-${type}`).value;
    const currentWeekRange = getWeekRange(dateVal);

    const slots = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5"];
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
    
    let html = '';
    slots.forEach(slot => {
        html += `<tr><td class="slot-name">${slot}</td>`;
        days.forEach(day => {
            let content = "";
            
            if (type === 'teaching') {
                const match = allSchedules.teaching.find(s => 
                    s.day === day && 
                    s.slot === slot && 
                    s.teacher === filters.teacher && 
                    s.subject === filters.subject &&
                    s.week === currentWeekRange // LỌC THEO TUẦN
                );
                if(match) content = `<div class="schedule-item teaching">${match.class}</div>`;
            } else {
                const match = allSchedules.learning.find(s => 
                    s.day === day && 
                    s.slot === slot && 
                    s.class === filters.className && 
                    s.grade === filters.grade &&
                    s.week === currentWeekRange // LỌC THEO TUẦN
                );
                if(match) {
                    let badge = match.status === 'online' ? '<span class="badge badge-online">Học Online</span>' : '';
                    content = `<div class="schedule-item learning">${match.subject}${badge}</div>`;
                }
            }
            html += `<td>${content}</td>`;
        });
        html += `</tr>`;
    });
    tbody.innerHTML = html;
}
/**
 * Dữ liệu mẫu cho Lịch
 */
const allSchedules = {
    teaching: [
        { teacher: "Trần Văn B", subject: "Lịch sử", day: "Thứ 4", slot: "Tiết 1", class: "11A5" },
        { teacher: "Trần Văn B", subject: "Lịch sử", day: "Thứ 4", slot: "Tiết 2", class: "11A4" },
        { teacher: "Trần Văn B", subject: "Lịch sử", day: "Thứ 6", slot: "Tiết 1", class: "12A2" },
        { teacher: "Nguyễn Văn A", subject: "Toán", day: "Thứ 2", slot: "Tiết 1", class: "10A1" },
    ],
    learning: [
        { class: "12A1", grade: "12", day: "Thứ 4", slot: "Tiết 1", subject: "Toán" },
        { class: "12A1", grade: "12", day: "Thứ 5", slot: "Tiết 1", subject: "Lý" },
        { class: "11A2", grade: "11", day: "Thứ 3", slot: "Tiết 2", subject: "Hóa" },
    ]
};

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
                    <option value="12A1">12A1</option>
                    <option value="12A2">12A2</option>
                    <option value="11A1">11A1</option>
                    <option value="11A2">11A2</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Ngày</label>
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
                <label>Ngày</label>
                <input type="date" id="filter-date-teaching" class="modern-input">
            </div>
        </div>

        <div class="schedule-container">
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
                <tbody id="schedule-body">
                    </tbody>
            </table>
        </div>
    </div>
</div>
`;

/**
 * Hàm khởi tạo các sự kiện cho bộ lọc
 */
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

    // Lắng nghe sự thay đổi trên tất cả các ô select/input
    const filters = ['filter-grade', 'filter-class', 'filter-subject', 'filter-teacher', 'filter-date-learning', 'filter-date-teaching'];
    filters.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateSchedule);
    });

    // Chạy lần đầu
    updateSchedule();
}

/**
 * Lấy giá trị từ bộ lọc và vẽ lại bảng
 */
function updateSchedule() {
    const activeTab = document.querySelector('.schedule-manager .tab.active');
    const type = activeTab.getAttribute('data-type');
    
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

    const slots = ["Tiết 1", "Tiết 2", "Tiết 3", "Tiết 4", "Tiết 5"];
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
    
    let html = '';
    slots.forEach(slot => {
        html += `<tr><td class="slot-name">${slot}</td>`;
        days.forEach(day => {
            let info = "";
            if (type === 'teaching') {
                const match = allSchedules.teaching.find(s => 
                    s.day === day && 
                    s.slot === slot && 
                    s.teacher === filters.teacher &&
                    s.subject === filters.subject
                );
                info = match ? `<div class="schedule-item teaching">Lớp: ${match.class}</div>` : "";
            } else {
                const match = allSchedules.learning.find(s => 
                    s.day === day && 
                    s.slot === slot && 
                    s.class === filters.className &&
                    s.grade === filters.grade
                );
                info = match ? `<div class="schedule-item learning">${match.subject}</div>` : "";
            }
            html += `<td>${info}</td>`;
        });
        html += `</tr>`;
    });
    tbody.innerHTML = html;
}
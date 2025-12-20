/**
 * Dữ liệu mẫu bảng điểm
 */
let allScores = [
    { studentId: '00000001', name: 'Nguyễn A', quiz: 8, test: 8.5, exam: 7 },
    { studentId: '00000002', name: 'Trần Bích', quiz: 7, test: 9, exam: 8 },
    { studentId: '00000003', name: 'Lê Cường', quiz: 6, test: 8.25, exam: 7 },
    { studentId: '00000004', name: 'Phạm dung', quiz: 8, test: 7, exam: 7 },
    { studentId: '00000005', name: 'Minh Đức', quiz: 9, test: 9, exam: 5 },
    { studentId: '00000006', name: 'Vũ Hạnh', quiz: 5, test: 6, exam: 5 },
    { studentId: '00000007', name: 'Bùi Hoàng', quiz: 10, test: 6.5, exam: 7 }
];

/**
 * Hàm tính điểm trung bình môn
 * Công thức giả định: (15p + 1 tiết * 2 + ThiHK * 3) / 6
 */
function calculateGPA(quiz, test, exam) {
    const gpa = (quiz + test * 2 + exam * 3) / 6;
    return gpa.toFixed(1); // Làm tròn 1 chữ số thập phân
}

/**
 * Template Quản lý điểm
 */
const scoreTemplate = `
<div class="score-manager">
    <div class="content-tabs">
        <div class="tab active">Quản lý điểm <i class="fas fa-times" id="close-tab-score"></i></div>
    </div>

    <div class="content-body">
        <div class="filter-section">
            <div class="filter-group">
                <label>Năm học</label>
                <div class="search-input-wrapper">
                    <input type="text" placeholder="Năm học">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="filter-group">
                <label>Học kì</label>
                <input type="text" placeholder="HK1/HK2">
            </div>
            <div class="filter-group">
                <label>Khối</label>
                <select><option>Tất cả</option></select>
            </div>
            <div class="filter-group">
                <label>Lớp</label>
                <select><option>Tất cả</option></select>
            </div>
            <div class="filter-group">
                <label>Môn học</label>
                <select><option>Tất cả</option></select>
            </div>
        </div>

        <div class="action-bar">
            <button class="btn btn-add" id="btn-import-score"><i class="fas fa-plus-circle"></i> Nhập điểm</button>
            <button class="btn btn-edit-score" style="background-color: #0b808e;"><i class="fas fa-user-edit"></i> Sửa điểm</button>
            <button class="btn btn-print" style="background-color: #168a7d;"><i class="fas fa-print"></i> In bảng điểm</button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th><input type="checkbox"></th>
                    <th>Mã học sinh</th>
                    <th>Họ tên</th>
                    <th>15p</th>
                    <th>1 tiết</th>
                    <th>Thi HK</th>
                    <th>TB môn</th>
                </tr>
            </thead>
            <tbody id="score-table-body"></tbody>
        </table>
    </div>
</div>
`;

function renderScoreTable(data) {
    const tbody = document.getElementById('score-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = data.map(item => {
        const avg = calculateGPA(item.quiz, item.test, item.exam);
        return `
        <tr data-id="${item.studentId}">
            <td><input type="checkbox"></td>
            <td class="bold">${item.studentId}</td>
            <td>
                <div class="user-info">
                    <div class="avatar-circle"><i class="fas fa-user"></i></div>
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${item.quiz}</td>
            <td>${item.test}</td>
            <td class="bold">${item.exam}</td>
            <td class="bold" style="color: #168a7d">${avg}</td>
        </tr>
    `}).join('');
}
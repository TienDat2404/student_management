/**
 * Dữ liệu mẫu (Mock Data)
 */
let allStudents = [
    { id: '00000001', name: 'Nguyễn Thanh Độ', gender: 'Nam', class: '66CNTT1', ethnic: 'Tày' },
    { id: '00000002', name: 'Nguyễn Thị Lý', gender: 'Nữ', class: '66CNTT1', ethnic: 'Tày' },
    { id: '00000003', name: 'Tày Tuấn Tú', gender: 'Nam', class: '66CNTT1', ethnic: 'Tày' },
    { id: '00000004', name: 'Phạm Dung', gender: 'Nữ', class: '66CNTT1', ethnic: 'Tày' },
    { id: '00000005', name: 'Minh Đức', gender: 'Nam', class: '66CNTT1', ethnic: 'Tày' },
    { id: '00000006', name: 'Vũ Hạnh', gender: 'Nữ', class: '66CNTT1', ethnic: 'Tày' },
    { id: '00000007', name: 'Bùi Hoàng', gender: 'Nam', class: '66CNTT1', ethnic: 'Tày' }
];

/**
 * Template HTML cho trang Quản lý học sinh
 */
const studentTemplate = `
<div class="student-manager">
    <div class="content-tabs">
        <div class="tab active">
            Danh sách học sinh 
            <i class="fas fa-times" id="close-tab-student" title="Đóng trang"></i>
        </div>
    </div>

    <div class="content-body">
        <div class="filter-section">
            <div class="filter-group">
                <label>Tên học sinh</label>
                <div class="search-input-wrapper">
                    <input type="text" id="input-search-name" placeholder="Tìm kiếm tài khoản hoặc mã số...">
                    <i class="fas fa-search"></i>
                </div>
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
                <label>Dân tộc</label>
                <select><option>Tất cả</option></select>
            </div>
        </div>

        <div class="action-bar">
            <button class="btn btn-add" id="btn-add-student">
                <i class="fas fa-user-plus"></i> Thêm học sinh
            </button>
            <button class="btn btn-delete">
                <i class="fas fa-user-minus"></i> Xóa học sinh
            </button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="check-all"></th>
                    <th>Mã học sinh</th>
                    <th>Họ tên</th>
                    <th>Giới tính</th>
                    <th>Lớp</th>
                    <th>Dân tộc</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="student-table-body">
                </tbody>
        </table>
    </div>
</div>

<div id="modal-add-student" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modal-title"><i class="fas fa-user-plus"></i> Thông tin học sinh mới</h2>
            <span class="close-modal">&times;</span>
        </div>
        <form id="form-add-student">
            <input type="hidden" id="edit-index" value="">

            <div class="form-grid">
                <div class="form-group avatar-upload">
                    <div class="avatar-preview">
                        <i class="fas fa-user"></i>
                    </div>
                    <button type="button" class="btn-upload">Chọn ảnh</button>
                </div>
                
                <div class="form-inputs">
                    <div class="input-row">
                        <div class="input-box">
                            <label>Họ và tên <span class="required">*</span></label>
                            <input type="text" id="add-name" required placeholder="Nguyễn Văn A">
                        </div>
                        <div class="input-box">
                            <label>Năm sinh <span class="required">*</span></label>
                            <input type="date" id="add-dob" required>
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-box">
                            <label>Giới tính <span class="required">*</span></label>
                            <select id="add-gender">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                        <div class="input-box">
                            <label>Dân tộc</label>
                            <input type="text" id="add-ethnic" placeholder="Kinh, Tày, Nùng...">
                        </div>
                    </div>

                    <div class="input-row">
                        <div class="input-box">
                            <label>Khối <span class="required">*</span></label>
                            <select id="add-grade">
                                <option value="6">Khối 6</option>
                                <option value="7">Khối 7</option>
                                <option value="8">Khối 8</option>
                                <option value="9">Khối 9</option>
                            </select>
                        </div>
                        <div class="input-box">
                            <label>Lớp <span class="required">*</span></label>
                            <input type="text" id="add-class" required placeholder="VD: 6A1">
                        </div>
                    </div>

                    <div class="input-box full-width">
                        <label>Địa chỉ thường trú</label>
                        <textarea id="add-address" rows="2" placeholder="Nhập địa chỉ chi tiết..."></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-btn">Hủy bỏ</button>
                <button type="submit" class="btn btn-add">Lưu thông tin</button>
            </div>
        </form>
    </div>
</div>
`;

function renderStudentTable(data) {
    const tbody = document.getElementById('student-table-body');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #888;">Không tìm thấy kết quả</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(student => `
        <tr data-id="${student.id}">
            <td><input type="checkbox" class="student-checkbox"></td>
            <td class="bold">${student.id}</td>
            <td>
                <div class="user-info">
                    <div class="avatar-circle"><i class="fas fa-user"></i></div>
                    <span>${student.name}</span>
                </div>
            </td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td class="bold">${student.ethnic}</td>
            <td class="actions">
                <i class="fas fa-pencil-alt edit" title="Sửa thông tin"></i>
                <i class="fas fa-lock lock" title="Xem chi tiết/Khóa"></i>
                <i class="fas fa-trash-alt delete" title="Xóa học sinh"></i>
            </td>
        </tr>
    `).join('');
}
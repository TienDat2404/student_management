let allAccounts = [
    { id: '00000001', username: 'nguyenvana@tinviet.com', phone: '0123456789', name: 'Nguyễn A', role: 'Giáo viên', status: 'Hoạt động' },
    { id: '00000002', username: 'tranthibich2@tinviet.com', phone: '0901000002', name: 'Trần Bích', role: 'Học sinh', status: 'Tạm dừng' },
    { id: '00000003', username: 'levancuong@tinviet.com', phone: '0901000003', name: 'Lê Cường', role: 'Học sinh', status: 'Hoạt động' }
];

/**
 * Template Quản lý tài khoản
 */
const authTemplate = `
<div class="account-manager">
    <div class="content-tabs">
        <div class="tab active">Danh sách tài khoản <i class="fas fa-times" id="close-tab-auth"></i></div>
    </div>

    <div class="content-body">
        <div class="filter-section">
            <div class="filter-group">
                <label>Tên tài khoản</label>
                <div class="search-input-wrapper">
                    <input type="text" id="input-search-account" placeholder="Tìm kiếm tài khoản...">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="filter-group">
                <label>Họ tên</label>
                <div class="search-input-wrapper">
                    <input type="text" placeholder="Tìm kiếm họ tên">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="filter-group">
                <label>Vai trò</label>
                <select id="filter-role"><option>Tất cả</option><option>Giáo viên</option><option>Học sinh</option></select>
            </div>
            <div class="filter-group">
                <label>Trạng thái</label>
                <select id="filter-status"><option>Tất cả</option><option>Hoạt động</option><option>Tạm dừng</option></select>
            </div>
        </div>

        <div class="action-bar">
            <button class="btn btn-add" id="btn-add-account"><i class="fas fa-plus"></i> Thêm tài khoản</button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th><input type="checkbox"></th>
                    <th>Mã tài khoản</th>
                    <th>Tên tài khoản</th>
                    <th>Họ tên</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="auth-table-body"></tbody>
        </table>
    </div>
</div>

<div id="modal-auth" class="modal">
    <div class="modal-content" style="max-width: 550px;">
        <div class="modal-header">
            <h2 id="modal-auth-title">Thông tin tài khoản</h2>
            <span class="close-modal" id="close-modal-auth">&times;</span>
        </div>
        <form id="form-auth">
            <input type="hidden" id="edit-auth-index" value="">
            <div class="padding-20">
                <div class="input-box margin-b-15">
                    <label>Họ và tên *</label>
                    <input type="text" id="auth-name" required>
                </div>
                <div class="input-box margin-b-15">
                    <label>Email (Tên tài khoản) *</label>
                    <input type="email" id="auth-email" required>
                </div>
                <div class="input-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div class="input-box" style="flex: 1;">
                        <label>Vai trò</label>
                        <select id="auth-role">
                            <option value="Giáo viên">Giáo viên</option>
                            <option value="Học sinh">Học sinh</option>
                        </select>
                    </div>
                    <div class="input-box" style="flex: 1;">
                        <label>Trạng thái</label>
                        <select id="auth-status">
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Tạm dừng">Tạm dừng</option>
                        </select>
                    </div>
                </div>
                <div class="input-box margin-b-15">
                    <label>Số điện thoại *</label>
                    <input type="tel" id="auth-phone" placeholder="Nhập số điện thoại" pattern="[0-9]{10}" title="Vui lòng nhập đúng định dạng số điện thoại" required>
                </div>
                <div id="permission-section" style="display:none; border-top: 1px solid #eee; padding-top: 10px;">
                    <label style="font-weight:600; font-size:14px;">Phân quyền chi tiết:</label>
                    <div style="margin-top:10px; font-size:13px;">
                        <label><input type="checkbox" checked disabled> Xem thông tin</label><br>
                        <label><input type="checkbox"> Quyền nhập điểm</label><br>
                        <label><input type="checkbox"> Quyền quản lý tài liệu</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="btn-cancel-auth">Hủy bỏ</button>
                <button type="submit" class="btn btn-add" id="btn-save-auth">Lưu dữ liệu</button>
            </div>
        </form>
    </div>
</div>
`;

function renderAuthTable(data) {
    const tbody = document.getElementById('auth-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = data.map(acc => `
        <tr data-id="${acc.id}">
            <td><input type="checkbox"></td>
            <td class="bold">${acc.id}</td>
            <td>
                <div class="user-info">
                    <div class="avatar-circle"><i class="fas fa-user"></i></div>
                    <div style="display:flex; flex-direction:column">
                        <span class="bold">${acc.username}</span>
                        <span style="font-size:11px; color:#888">${acc.phone}</span>
                    </div>
                </div>
            </td>
            <td>${acc.name}</td>
            <td>${acc.role}</td>
            <td class="bold">${acc.status}</td>
            <td class="actions">
                <i class="fas fa-pencil-alt edit-auth" title="Sửa thông tin"></i>
                <i class="fas fa-lock permission-auth" title="Phân quyền"></i>
                <i class="fas fa-trash-alt delete-auth" title="Xóa tài khoản"></i>
            </td>
        </tr>
    `).join('');
}
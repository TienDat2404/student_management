/**
 * Dữ liệu mẫu danh mục quyền
 */
let permissionGroups = [
    {
        module: "Quản lý học sinh",
        permissions: [
            { id: "p1", name: "Xem danh sách", roles: ["Admin", "Giáo viên"] },
            { id: "p2", name: "Thêm mới học sinh", roles: ["Admin"] },
            { id: "p3", name: "Sửa thông tin", roles: ["Admin", "Giáo viên"] },
            { id: "p4", name: "Xóa học sinh", roles: ["Admin"] }
        ]
    },
    {
        module: "Quản lý điểm",
        permissions: [
            { id: "p5", name: "Xem bảng điểm", roles: ["Admin", "Giáo viên", "Học sinh"] },
            { id: "p6", name: "Nhập/Sửa điểm", roles: ["Admin", "Giáo viên"] },
            { id: "p7", name: "Tổng kết điểm", roles: ["Admin"] }
        ]
    },
    {
        module: "Quản lý tài liệu",
        permissions: [
            { id: "p8", name: "Xem/Tải tài liệu", roles: ["Admin", "Giáo viên", "Học sinh"] },
            { id: "p9", name: "Đăng tải tài liệu", roles: ["Admin", "Giáo viên"] },
            { id: "p10", name: "Xóa tài liệu", roles: ["Admin"] }
        ]
    }
];

let activeRoles = ["Admin", "Giáo viên", "Học sinh"];

/**
 * 1. TEMPLATE GIAO DIỆN PHÂN QUYỀN
 */
const permissionTemplate = `
<div class="permission-manager">
    <div class="content-tabs">
        <div class="tab active">Thiết lập phân quyền <i class="fas fa-times" id="close-tab-perm"></i></div>
    </div>

    <div class="content-body">
        <div class="perm-container" style="display: flex; gap: 20px;">
            <div class="role-sidebar" style="width: 200px; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 10px;">
                <h3 style="font-size: 14px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">Vai trò hệ thống</h3>
                <ul id="role-list" style="list-style: none; padding: 0;">
                    <li class="role-item active" data-role="Admin" style="padding: 10px; cursor: pointer; border-radius: 4px; margin-bottom: 5px; background: #168a7d; color: #fff;">Admin</li>
                    <li class="role-item" data-role="Giáo viên" style="padding: 10px; cursor: pointer; border-radius: 4px; margin-bottom: 5px;">Giáo viên</li>
                    <li class="role-item" data-role="Học sinh" style="padding: 10px; cursor: pointer; border-radius: 4px; margin-bottom: 5px;">Học sinh</li>
                </ul>
            </div>

            <div class="perm-matrix" style="flex: 1; background: #fff; border: 1px solid #eee; border-radius: 8px;">
                <div class="perm-header" style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="current-role-title" style="font-size: 16px; color: #168a7d; margin: 0;">Quyền hạn cho: Admin</h3>
                    <button class="btn btn-add" id="btn-save-perm"><i class="fas fa-save"></i> Lưu thay đổi</button>
                </div>
                
                <div class="perm-table-wrapper" style="padding: 15px;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 70%;">Tên chức năng / Quyền hạn</th>
                                <th style="text-align: center;">Cho phép</th>
                            </tr>
                        </thead>
                        <tbody id="perm-table-body">
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
`;

/**
 * 2. HÀM VẼ BẢNG QUYỀN THEO VAI TRÒ
 */
function renderPermissionTable(roleName) {
    const tbody = document.getElementById('perm-table-body');
    if (!tbody) return;

    let html = '';
    permissionGroups.forEach(group => {
        // Dòng tiêu đề Module
        html += `
            <tr style="background: #f8f9fa;">
                <td colspan="2" style="font-weight: 600; color: #168a7d; padding: 10px;">
                    <i class="fas fa-folder-open"></i> ${group.module}
                </td>
            </tr>
        `;

        // Danh sách quyền con
        group.permissions.forEach(p => {
            const isChecked = p.roles.includes(roleName) ? 'checked' : '';
            html += `
                <tr>
                    <td style="padding-left: 30px;">${p.name}</td>
                    <td style="text-align: center;">
                        <input type="checkbox" class="perm-checkbox" data-id="${p.id}" ${isChecked}>
                    </td>
                </tr>
            `;
        });
    });

    tbody.innerHTML = html;
}

/**
 * 3. HÀM CẬP NHẬT DỮ LIỆU KHI TÍCH CHECKBOX
 */
function updateRolePermission(permId, roleName, isChecked) {
    permissionGroups.forEach(group => {
        const permission = group.permissions.find(p => p.id === permId);
        if (permission) {
            if (isChecked) {
                if (!permission.roles.includes(roleName)) {
                    permission.roles.push(roleName);
                }
            } else {
                permission.roles = permission.roles.filter(role => role !== roleName);
            }
        }
    });
    console.log(`Đã cập nhật quyền ${permId} cho vai trò ${roleName}`);
}
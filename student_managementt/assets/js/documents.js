/**
 * Dữ liệu mẫu tài liệu
 */
let allDocuments = [
    { id: 'DOC01', title: 'Ôn tập HK1 Toán', subject: 'Toán', grade: '10', uploader: 'Giáo viên', status: 'Public' },
    { id: 'DOC02', title: 'Ôn tập HK2 Toán', subject: 'Toán', grade: '11', uploader: 'Giáo viên', status: 'Public' },
    { id: 'DOC03', title: 'Ôn tập HK1 Văn', subject: 'Văn', grade: '10', uploader: 'Giáo viên', status: 'Public' },
    { id: 'DOC04', title: 'Ôn tập HK2 Văn', subject: 'Văn', grade: '12', uploader: 'Giáo viên', status: 'Public' },
    { id: 'DOC05', title: 'Ôn tập HK1 Anh', subject: 'Anh', grade: '11', uploader: 'Giáo viên', status: 'Public' }
];

/**
 * Template Quản lý tài liệu
 */
const documentTemplate = `
<div class="document-manager">
    <div class="content-tabs">
        <div class="tab active">Quản lý tài liệu <i class="fas fa-times" id="close-tab-doc"></i></div>
    </div>

    <div class="content-body">
        <div class="filter-section">
            <div class="filter-group">
                <label>Tên tài liệu</label>
                <div class="search-input-wrapper">
                    <input type="text" id="input-search-doc" placeholder="Tìm kiếm tài liệu...">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="filter-group">
                <label>Môn học</label>
                <div class="search-input-wrapper">
                    <input type="text" placeholder="Tìm kiếm môn học">
                    <i class="fas fa-search"></i>
                </div>
            </div>
            <div class="filter-group">
                <label>Khối</label>
                <select><option>Tất cả</option><option>10</option><option>11</option><option>12</option></select>
            </div>
            <div class="filter-group">
                <label>Loại tài liệu</label>
                <select><option>Tất cả</option><option>Bài tập</option><option>Lý thuyết</option></select>
            </div>
        </div>

        <div class="action-bar">
            <button class="btn btn-add" id="btn-add-doc">
                <i class="fas fa-plus"></i> Thêm tài liệu
            </button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th><input type="checkbox"></th>
                    <th>Tên tài liệu</th>
                    <th>Môn</th>
                    <th>Khối</th>
                    <th>Người đăng</th>
                    <th>Quyền xem</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody id="document-table-body"></tbody>
        </table>
    </div>
</div>

<div id="modal-doc" class="modal">
    <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
            <h2 id="modal-doc-title">Thêm tài liệu mới</h2>
            <span class="close-modal" id="close-modal-doc">&times;</span>
        </div>
        <form id="form-doc">
            <input type="hidden" id="edit-doc-index" value="">
            <div class="padding-20">
                <div class="input-box margin-b-15">
                    <label>Tên tài liệu <span class="required" style="color:red">*</span></label>
                    <input type="text" id="doc-title" required placeholder="Nhập tên tài liệu">
                </div>
                
                <div class="input-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div class="input-box" style="flex: 1;">
                        <label>Môn học</label>
                        <select id="doc-subject" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="Toán">Toán</option>
                            <option value="Văn">Văn</option>
                            <option value="Anh">Anh</option>
                            <option value="Sử">Sử</option>
                            <option value="Địa">Địa</option>
                        </select>
                    </div>
                    <div class="input-box" style="flex: 1;">
                        <label>Khối</label>
                        <select id="doc-grade" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                    </div>
                </div>

                <div class="input-box margin-b-15" id="doc-file-group">
                    <label>File tài liệu</label>
                    <input type="file" id="doc-file" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary close-btn" id="btn-cancel-doc">Hủy bỏ</button>
                <button type="submit" class="btn btn-add" id="btn-save-doc">Lưu lại</button>
            </div>
        </form>
    </div>
</div>
`;

function renderDocumentTable(data) {
    const tbody = document.getElementById('document-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = data.map(doc => `
        <tr data-id="${doc.id}">
            <td><input type="checkbox"></td>
            <td class="bold">${doc.title}</td>
            <td style="color: #888">${doc.subject}</td>
            <td>${doc.grade}</td>
            <td>${doc.uploader}</td>
            <td class="bold">${doc.status}</td>
            <td class="actions">
                <i class="fas fa-eye view-doc" title="Xem chi tiết"></i>
                <i class="fas fa-file-download download-doc" title="Tải xuống"></i>
                <i class="fas fa-pencil-alt edit-doc" title="Sửa"></i>
                <i class="fas fa-trash-alt delete-doc" title="Xóa"></i>
            </td>
        </tr>
    `).join('');
}
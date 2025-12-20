document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');
    const menuItems = document.querySelectorAll('.menu-item');

    const clearActiveMenu = () => {
        menuItems.forEach(item => item.classList.remove('active'));
    };

    // 1. Xử lý click cho "Trang chủ"
    document.getElementById('menu-home').addEventListener('click', function() {
        clearActiveMenu();
        this.classList.add('active');
        contentArea.innerHTML = `
            <div class="welcome-screen">
                <h1>Xin Chào</h1>
            </div>
        `;
    });

    // 2. Xử lý click cho "Quản lý học sinh"
    document.getElementById('menu-students').addEventListener('click', function() {
        clearActiveMenu();
        this.classList.add('active');
        
        contentArea.innerHTML = studentTemplate;
        renderStudentTable(allStudents);

        // --- LOGIC TRANG HỌC SINH ---
        const searchInput = document.getElementById('input-search-name');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const keyword = e.target.value.toLowerCase().trim();
                const filteredData = allStudents.filter(student => 
                    student.name.toLowerCase().includes(keyword) || 
                    student.id.includes(keyword)
                );
                renderStudentTable(filteredData);
            });
        }

        const modal = document.getElementById('modal-add-student');
        const modalTitle = document.getElementById('modal-title');
        const editIndexInput = document.getElementById('edit-index');
        const btnOpenModal = document.getElementById('btn-add-student');
        const btnCloseX = document.querySelector('.close-modal');
        const btnCancel = document.querySelector('.close-btn');
        const formAdd = document.getElementById('form-add-student');
        const submitBtn = formAdd.querySelector('button[type="submit"]');

        const showModal = () => { modal.style.display = "flex"; };
        const hideModal = () => { 
            modal.style.display = "none";
            formAdd.reset();
            editIndexInput.value = "";
            modalTitle.innerHTML = `<i class="fas fa-user-plus"></i> Thông tin học sinh mới`;
            formAdd.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
            submitBtn.style.display = 'block';
        };

        if (btnOpenModal) btnOpenModal.onclick = showModal;
        if (btnCloseX) btnCloseX.onclick = hideModal;
        if (btnCancel) btnCancel.onclick = hideModal;
        window.onclick = (event) => { if (event.target == modal) hideModal(); };

        const tableBody = document.getElementById('student-table-body');
        tableBody.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const studentId = row.getAttribute('data-id');
            const index = allStudents.findIndex(s => s.id === studentId);
            const student = allStudents[index];

            if (e.target.classList.contains('edit')) {
                modalTitle.innerHTML = `<i class="fas fa-pencil-alt"></i> Chỉnh sửa học sinh: ${student.id}`;
                editIndexInput.value = index;
                document.getElementById('add-name').value = student.name;
                document.getElementById('add-gender').value = student.gender;
                document.getElementById('add-class').value = student.class;
                document.getElementById('add-ethnic').value = student.ethnic;
                showModal();
            }

            if (e.target.classList.contains('lock')) {
                modalTitle.innerHTML = `<i class="fas fa-eye"></i> Chi tiết học sinh: ${student.id}`;
                document.getElementById('add-name').value = student.name;
                document.getElementById('add-gender').value = student.gender;
                document.getElementById('add-class').value = student.class;
                document.getElementById('add-ethnic').value = student.ethnic;
                formAdd.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
                submitBtn.style.display = 'none';
                showModal();
            }

            if (e.target.classList.contains('delete')) {
                if (confirm(`Bạn có chắc chắn muốn xóa học sinh ${student.name} không?`)) {
                    allStudents.splice(index, 1);
                    renderStudentTable(allStudents);
                }
            }
        });

        if (formAdd) {
            formAdd.onsubmit = (e) => {
                e.preventDefault();
                const index = editIndexInput.value;
                const studentData = {
                    name: document.getElementById('add-name').value,
                    gender: document.getElementById('add-gender').value,
                    class: document.getElementById('add-class').value,
                    ethnic: document.getElementById('add-ethnic').value || "Kinh"
                };

                if (index === "") {
                    const newStudent = { id: "0000000" + (allStudents.length + 1), ...studentData };
                    allStudents.unshift(newStudent);
                } else {
                    allStudents[index] = { ...allStudents[index], ...studentData };
                }
                renderStudentTable(allStudents);
                hideModal();
            };
        }
    });

    // 3. Xử lý click cho "Quản lý tài liệu"
    document.getElementById('menu-docs').addEventListener('click', function() {
        clearActiveMenu();
        this.classList.add('active');
        
        contentArea.innerHTML = documentTemplate;
        renderDocumentTable(allDocuments);

        const modalDoc = document.getElementById('modal-doc');
        const formDoc = document.getElementById('form-doc');
        const modalDocTitle = document.getElementById('modal-doc-title');
        const editDocIndex = document.getElementById('edit-doc-index');
        const btnSaveDoc = document.getElementById('btn-save-doc');
        const fileGroup = document.getElementById('doc-file-group');

        const hideModalDoc = () => {
            modalDoc.style.display = "none";
            formDoc.reset();
            formDoc.classList.remove('view-only');
            formDoc.querySelectorAll('input, select').forEach(el => el.disabled = false);
            btnSaveDoc.style.display = 'block';
            if(fileGroup) fileGroup.style.display = 'block';
        };

        document.getElementById('btn-add-doc').onclick = () => {
            hideModalDoc();
            editDocIndex.value = "";
            modalDocTitle.innerText = "Thêm tài liệu mới";
            modalDoc.style.display = "flex";
        };

        document.getElementById('close-modal-doc').onclick = hideModalDoc;
        document.getElementById('btn-cancel-doc').onclick = hideModalDoc;

        const docTableBody = document.getElementById('document-table-body');
        docTableBody.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const docId = row.getAttribute('data-id');
            const index = allDocuments.findIndex(d => d.id === docId);
            const doc = allDocuments[index];

            if (e.target.classList.contains('view-doc')) {
                modalDocTitle.innerHTML = `<i class="fas fa-eye"></i> Chi tiết tài liệu: ${doc.id}`;
                document.getElementById('doc-title').value = doc.title;
                document.getElementById('doc-subject').value = doc.subject;
                document.getElementById('doc-grade').value = doc.grade;
                formDoc.classList.add('view-only');
                formDoc.querySelectorAll('input, select').forEach(el => el.disabled = true);
                btnSaveDoc.style.display = 'none';
                if(fileGroup) fileGroup.style.display = 'none';
                modalDoc.style.display = "flex";
            }

            if (e.target.classList.contains('edit-doc')) {
                hideModalDoc();
                modalDocTitle.innerText = "Chỉnh sửa tài liệu";
                editDocIndex.value = index;
                document.getElementById('doc-title').value = doc.title;
                document.getElementById('doc-subject').value = doc.subject;
                document.getElementById('doc-grade').value = doc.grade;
                modalDoc.style.display = "flex";
            }

            if (e.target.classList.contains('delete-doc')) {
                if(confirm(`Xóa tài liệu: ${doc.title}?`)) {
                    allDocuments.splice(index, 1);
                    renderDocumentTable(allDocuments);
                }
            }
        });

        formDoc.onsubmit = (e) => {
            e.preventDefault();
            const index = editDocIndex.value;
            const docData = {
                title: document.getElementById('doc-title').value,
                subject: document.getElementById('doc-subject').value,
                grade: document.getElementById('doc-grade').value,
                uploader: "Giáo viên",
                status: "Public"
            };

            if (index === "") {
                const newDoc = { id: 'DOC0' + (allDocuments.length + 1), ...docData };
                allDocuments.unshift(newDoc);
            } else {
                allDocuments[index] = { ...allDocuments[index], ...docData };
            }
            renderDocumentTable(allDocuments);
            hideModalDoc();
        };
    });

    // 4. Xử lý click cho "Quản lý điểm"
    document.getElementById('menu-scores').addEventListener('click', function() {
        clearActiveMenu();
        this.classList.add('active');
        contentArea.innerHTML = scoreTemplate;
        renderScoreTable(allScores);

        const btnPrint = document.querySelector('.btn-print');
        if (btnPrint) btnPrint.onclick = () => window.print();
    });

    // 5. Xử lý click cho "Danh sách tài khoản"
    // 5. Xử lý click cho "Danh sách tài khoản"
    document.getElementById('menu-user-list').addEventListener('click', function() {
        clearActiveMenu();
        this.closest('.menu-item').classList.add('active');
        contentArea.innerHTML = authTemplate;
        renderAuthTable(allAccounts);

        const modalAuth = document.getElementById('modal-auth');
        const formAuth = document.getElementById('form-auth');
        const modalTitle = document.getElementById('modal-auth-title');
        const permissionSection = document.getElementById('permission-section');
        const saveBtn = document.getElementById('btn-save-auth');

        // Hàm đóng modal và RESET TRẠNG THÁI
        const hideModal = () => {
            modalAuth.style.display = "none";
            formAuth.reset();
            permissionSection.style.display = "none";
            
            // Mở khóa lại tất cả để đảm bảo nút Lưu hoạt động cho lần sau
            formAuth.querySelectorAll('input, select').forEach(el => el.disabled = false);
            saveBtn.style.display = "block";
            saveBtn.disabled = false; // Mở khóa nút lưu
        };

        // Mở modal thêm tài khoản
        document.getElementById('btn-add-account').onclick = () => {
            hideModal();
            modalTitle.innerHTML = "Thêm tài khoản mới";
            modalAuth.style.display = "flex";
        };

        const authTableBody = document.getElementById('auth-table-body');
        authTableBody.onclick = (e) => {
            const row = e.target.closest('tr');
            if (!row) return;
            const accId = row.getAttribute('data-id');
            const index = allAccounts.findIndex(a => a.id === accId);
            const acc = allAccounts[index];

            // SỬA THÔNG TIN (icon bút chì) - FIX LỖI TẠI ĐÂY
            if (e.target.classList.contains('edit-auth')) {
                modalTitle.innerHTML = "Sửa thông tin tài khoản: " + acc.id;
                document.getElementById('edit-auth-index').value = index;
                document.getElementById('auth-name').value = acc.name;
                document.getElementById('auth-email').value = acc.username;
                document.getElementById('auth-role').value = acc.role;
                document.getElementById('auth-status').value = acc.status;

                // GIẢI PHÓNG TRẠNG THÁI KHÓA
                formAuth.querySelectorAll('input, select').forEach(el => el.disabled = false);
                saveBtn.style.display = "block";
                saveBtn.disabled = false; // Quan trọng: Đảm bảo nút không bị disabled
                permissionSection.style.display = "none"; 
                
                modalAuth.style.display = "flex";
            }

            // PHÂN QUYỀN (icon khóa)
            if (e.target.classList.contains('permission-auth')) {
                modalTitle.innerHTML = "Phân quyền người dùng: " + acc.name;
                document.getElementById('auth-name').value = acc.name;
                document.getElementById('auth-email').value = acc.username;
                
                // Khóa form để chỉ xem thông tin email/tên
                formAuth.querySelectorAll('input, select').forEach(el => el.disabled = true);
                permissionSection.style.display = "block";
                
                // Tùy chỉnh: Bạn có thể ẩn nút lưu hoặc để lại tùy vào logic lưu quyền
                saveBtn.style.display = "block"; 
                saveBtn.disabled = false; 

                modalAuth.style.display = "flex";
            }

            // XÓA TÀI KHOẢN
            if (e.target.classList.contains('delete-auth')) {
                if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${acc.username}?`)) {
                    allAccounts.splice(index, 1);
                    renderAuthTable(allAccounts);
                }
            }
        };

        document.getElementById('close-modal-auth').onclick = hideModal;
        document.getElementById('btn-cancel-auth').onclick = hideModal;

        // Xử lý submit form Lưu dữ liệu
        formAuth.onsubmit = (e) => {
            e.preventDefault();
            
            // 1. Lấy vị trí index từ input ẩn (được gán khi bấm icon bút chì)
            const index = document.getElementById('edit-auth-index').value;
            
            // 2. Thu thập dữ liệu mới từ form
            const accountData = {
                name: document.getElementById('auth-name').value,
                username: document.getElementById('auth-email').value,
                role: document.getElementById('auth-role').value,
                status: document.getElementById('auth-status').value,
                // Giữ nguyên số điện thoại cũ hoặc gán mặc định nếu thêm mới
                phone: index !== "" ? allAccounts[index].phone : "0123456789"
            };

            if (index === "") {
                // TRƯỜNG HỢP: THÊM MỚI
                const newAccount = {
                    id: "0000000" + (allAccounts.length + 1),
                    ...accountData
                };
                allAccounts.unshift(newAccount); // Thêm vào đầu mảng
                alert("Thêm tài khoản mới thành công!");
            } else {
                // TRƯỜNG HỢP: SỬA DỮ LIỆU
                // Cập nhật phần tử tại vị trí index
                allAccounts[index] = { 
                    ...allAccounts[index], 
                    ...accountData 
                };
                alert("Cập nhật thông tin tài khoản thành công!");
            }

            // 3. QUAN TRỌNG: Gọi hàm render lại bảng để hiển thị dữ liệu mới
            renderAuthTable(allAccounts);
            
            // 4. Đóng modal và reset trạng thái form
            hideModal();
        };
    });

    // 6. Xử lý click cho "Phân quyền"
    document.getElementById('menu-permission').addEventListener('click', function() {
        clearActiveMenu();
        this.closest('.menu-item').classList.add('active');
        contentArea.innerHTML = permissionTemplate;
        renderPermissionTable("Admin");

        const roleItems = document.querySelectorAll('.role-item');
        roleItems.forEach(item => {
            item.onclick = function() {
                roleItems.forEach(ri => {
                    ri.classList.remove('active');
                    ri.style.background = 'transparent';
                    ri.style.color = '#333';
                });
                this.classList.add('active');
                this.style.background = '#168a7d';
                this.style.color = '#fff';
                const role = this.getAttribute('data-role');
                document.getElementById('current-role-title').innerText = "Quyền hạn cho: " + role;
                renderPermissionTable(role);
            };
        });

        const tableBodyPerm = document.getElementById('perm-table-body');
        if (tableBodyPerm) {
            tableBodyPerm.addEventListener('change', (e) => {
                if (e.target.classList.contains('perm-checkbox')) {
                    const permId = e.target.getAttribute('data-id');
                    const activeRoleItem = document.querySelector('.role-item.active');
                    const roleName = activeRoleItem.getAttribute('data-role');
                    updateRolePermission(permId, roleName, e.target.checked);
                }
            });
        }

        const btnSave = document.getElementById('btn-save-perm');
        if (btnSave) btnSave.onclick = () => alert("Đã cập nhật cấu hình phân quyền!");
    });

    // 7. Xử lý đóng/mở Submenu Sidebar
    const submenuHeader = document.querySelector('.submenu-header');
    if (submenuHeader) {
        submenuHeader.addEventListener('click', () => {
            const parent = submenuHeader.parentElement;
            const arrow = submenuHeader.querySelector('.arrow');
            parent.classList.toggle('open');
            arrow.style.transform = parent.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    }

    // 8. Điều hướng dấu X trên tab (Dùng chung)
    contentArea.addEventListener('click', (e) => {
        if (e.target.id === 'close-tab-student' || e.target.id === 'close-tab-doc' || 
            e.target.id === 'close-tab-score' || e.target.id === 'close-tab-auth' || 
            e.target.id === 'close-tab-perm' || e.target.classList.contains('fa-times')) {
            document.getElementById('menu-home').click(); 
        }
    });
});
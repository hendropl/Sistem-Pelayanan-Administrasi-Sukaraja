<<<<<<< HEAD


let dataLayanan = [];
let formModal = null;


document.addEventListener("DOMContentLoaded", async () => {
   
    const { data: { session } } = await supabaseClient.auth.getSession();
    
   
    if (!session) {
        window.location.replace("login.html");
        return; 
    }

   
    formModal = new bootstrap.Modal(document.getElementById('formModal'));
    ambilDataLayanan();
});


async function logoutAdmin() {
    Swal.fire({ title: 'Keluar sistem...', didOpen: () => { Swal.showLoading(); } });
    await supabaseClient.auth.signOut();
    window.location.replace("login.html");
}


async function ambilDataLayanan() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Memuat data...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('layanan')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        Swal.fire('Error!', 'Gagal mengambil data.', 'error');
        return;
    }

    dataLayanan = data;
    document.getElementById("totalData").textContent = `${data.length} Layanan Aktif`;
    renderTabel(data);
}

function renderTabel(data) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="fw-bold text-muted">${index + 1}</td>
            <td class="fw-bold">${item.name}</td>
            <td><span class="badge bg-light text-primary border">${item.category}</span></td>
            <td class="text-center">
                <button class="btn-edit me-1" onclick="bukaModalEdit(${item.id})" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-delete" onclick="hapusData(${item.id})" title="Hapus">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function bukaModalTambah() {
  
    document.getElementById("formId").value = "";
    document.getElementById("formName").value = "";
    document.getElementById("formCategory").value = "Administrasi Kependudukan";
    document.getElementById("formDescription").value = "";
    document.getElementById("formRequirements").value = "";
    
   
    document.getElementById("formIconHidden").value = "bi bi-file-earmark-text-fill";

    document.getElementById("modalTitle").innerHTML = '<i class="bi bi-plus-circle text-primary me-2"></i> Tambah Layanan Baru';
    formModal.show();
}


function bukaModalEdit(id) {
    const item = dataLayanan.find(layanan => layanan.id === id);
    if (!item) return;

    document.getElementById("formId").value = item.id;
    document.getElementById("formName").value = item.name;
    document.getElementById("formCategory").value = item.category;
    document.getElementById("formDescription").value = item.description;
    
   
    document.getElementById("formIconHidden").value = item.icon || "bi bi-file-earmark-text-fill";
    
 
    document.getElementById("formRequirements").value = item.requirements ? item.requirements.join(", ") : "";

    document.getElementById("modalTitle").innerHTML = '<i class="bi bi-pencil-square text-primary me-2"></i> Edit Layanan';
    formModal.show();
}

async function simpanData() {
    const id = document.getElementById("formId").value;
    const name = document.getElementById("formName").value;
    const category = document.getElementById("formCategory").value;
    const description = document.getElementById("formDescription").value;
    

    const icon = document.getElementById("formIconHidden").value;
    
   
    const reqText = document.getElementById("formRequirements").value;
    const requirementsArray = reqText.split(",").map(item => item.trim()).filter(item => item !== "");

  
    if (!name || !description) {
        Swal.fire('Peringatan', 'Nama dan Deskripsi tidak boleh kosong!', 'warning');
        return;
    }

    Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    let hasilRequest;

  
    if (id === "") {
       
        const maxId = dataLayanan.length > 0 ? Math.max(...dataLayanan.map(d => d.id)) : 0;
        const newId = maxId + 1;

        hasilRequest = await supabaseClient
            .from('layanan')
            .insert([{ 
                id: newId, 
                name: name, 
                category: category, 
                icon: icon, 
                description: description, 
                requirements: requirementsArray 
            }]);
    } 
  
    else {
        hasilRequest = await supabaseClient
            .from('layanan')
            .update({
                name: name,
                category: category,
                icon: icon, 
                description: description,
                requirements: requirementsArray
            })
            .eq('id', id);
    }

    if (hasilRequest.error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan sistem.', 'error');
        console.error(hasilRequest.error);
    } else {
        formModal.hide();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data layanan berhasil disimpan.',
            timer: 1500,
            showConfirmButton: false
        });
        ambilDataLayanan(); 
    }
}


function hapusData(id) {
    
    Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#6c757d',  
        confirmButtonText: 'Ya, Hapus Data!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        
     
        if (result.isConfirmed) {
            Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

            const { error } = await supabaseClient
                .from('layanan')
                .delete()
                .eq('id', id);

            if (error) {
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus data.', 'error');
            } else {
                Swal.fire('Terhapus!', 'Data layanan telah dihapus.', 'success');
                ambilDataLayanan(); 
            }
        }
    });
=======


let dataLayanan = [];
let formModal = null;


document.addEventListener("DOMContentLoaded", async () => {
   
    const { data: { session } } = await supabaseClient.auth.getSession();
    
   
    if (!session) {
        window.location.replace("login.html");
        return; 
    }

   
    formModal = new bootstrap.Modal(document.getElementById('formModal'));
    ambilDataLayanan();
});


async function logoutAdmin() {
    Swal.fire({ title: 'Keluar sistem...', didOpen: () => { Swal.showLoading(); } });
    await supabaseClient.auth.signOut();
    window.location.replace("login.html");
}


async function ambilDataLayanan() {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4">Memuat data...</td></tr>`;

    const { data, error } = await supabaseClient
        .from('layanan')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        Swal.fire('Error!', 'Gagal mengambil data.', 'error');
        return;
    }

    dataLayanan = data;
    document.getElementById("totalData").textContent = `${data.length} Layanan Aktif`;
    renderTabel(data);
}

function renderTabel(data) {
    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

    data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="fw-bold text-muted">${index + 1}</td>
            <td class="fw-bold">${item.name}</td>
            <td><span class="badge bg-light text-primary border">${item.category}</span></td>
            <td class="text-center">
                <button class="btn-edit me-1" onclick="bukaModalEdit(${item.id})" title="Edit">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-delete" onclick="hapusData(${item.id})" title="Hapus">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


function bukaModalTambah() {
  
    document.getElementById("formId").value = "";
    document.getElementById("formName").value = "";
    document.getElementById("formCategory").value = "Administrasi Kependudukan";
    document.getElementById("formDescription").value = "";
    document.getElementById("formRequirements").value = "";
    
   
    document.getElementById("formIconHidden").value = "bi bi-file-earmark-text-fill";

    document.getElementById("modalTitle").innerHTML = '<i class="bi bi-plus-circle text-primary me-2"></i> Tambah Layanan Baru';
    formModal.show();
}


function bukaModalEdit(id) {
    const item = dataLayanan.find(layanan => layanan.id === id);
    if (!item) return;

    document.getElementById("formId").value = item.id;
    document.getElementById("formName").value = item.name;
    document.getElementById("formCategory").value = item.category;
    document.getElementById("formDescription").value = item.description;
    
   
    document.getElementById("formIconHidden").value = item.icon || "bi bi-file-earmark-text-fill";
    
 
    document.getElementById("formRequirements").value = item.requirements ? item.requirements.join(", ") : "";

    document.getElementById("modalTitle").innerHTML = '<i class="bi bi-pencil-square text-primary me-2"></i> Edit Layanan';
    formModal.show();
}

async function simpanData() {
    const id = document.getElementById("formId").value;
    const name = document.getElementById("formName").value;
    const category = document.getElementById("formCategory").value;
    const description = document.getElementById("formDescription").value;
    

    const icon = document.getElementById("formIconHidden").value;
    
   
    const reqText = document.getElementById("formRequirements").value;
    const requirementsArray = reqText.split(",").map(item => item.trim()).filter(item => item !== "");

  
    if (!name || !description) {
        Swal.fire('Peringatan', 'Nama dan Deskripsi tidak boleh kosong!', 'warning');
        return;
    }

    Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    let hasilRequest;

  
    if (id === "") {
       
        const maxId = dataLayanan.length > 0 ? Math.max(...dataLayanan.map(d => d.id)) : 0;
        const newId = maxId + 1;

        hasilRequest = await supabaseClient
            .from('layanan')
            .insert([{ 
                id: newId, 
                name: name, 
                category: category, 
                icon: icon, 
                description: description, 
                requirements: requirementsArray 
            }]);
    } 
  
    else {
        hasilRequest = await supabaseClient
            .from('layanan')
            .update({
                name: name,
                category: category,
                icon: icon, 
                description: description,
                requirements: requirementsArray
            })
            .eq('id', id);
    }

    if (hasilRequest.error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan sistem.', 'error');
        console.error(hasilRequest.error);
    } else {
        formModal.hide();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Data layanan berhasil disimpan.',
            timer: 1500,
            showConfirmButton: false
        });
        ambilDataLayanan(); 
    }
}


function hapusData(id) {
    
    Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Data yang dihapus tidak bisa dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444', 
        cancelButtonColor: '#6c757d',  
        confirmButtonText: 'Ya, Hapus Data!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        
     
        if (result.isConfirmed) {
            Swal.fire({ title: 'Menghapus...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

            const { error } = await supabaseClient
                .from('layanan')
                .delete()
                .eq('id', id);

            if (error) {
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus data.', 'error');
            } else {
                Swal.fire('Terhapus!', 'Data layanan telah dihapus.', 'success');
                ambilDataLayanan(); 
            }
        }
    });
>>>>>>> 015bb4b ((+))
}


"use strict";


const titleElement = document.getElementById("serviceTitle");
const descriptionElement = document.getElementById("serviceDescription");
const categoryElement = document.getElementById("serviceCategory");
const requirementElement = document.getElementById("requirementsList");
const noteElement = document.getElementById("notesList");
const flowElement = document.getElementById("flowList");
const totalRequirement = document.getElementById("totalRequirement");
const loading = document.getElementById("loading");
const scrollTop = document.getElementById("scrollTop");


let layananAktif = null;



document.addEventListener("DOMContentLoaded", init);



async function init() {
    showLoading();
    await fetchDetailDariSupabase();
    renderData();
    initScrollTop();
    hideLoading();
}



function showLoading() {
    if (!loading) return;
    loading.classList.remove("d-none");
}

function hideLoading() {
    if (!loading) return;
    loading.classList.add("d-none");
}



async function fetchDetailDariSupabase() {
   
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    if (!id) {
        layananAktif = null;
        return;
    }

    try {
       
        const { data, error } = await supabaseClient
            .from('layanan')
            .select('*')
            .eq('id', id)
            .single(); 

        if (error) throw error;
        
       
        layananAktif = data;

    } catch (err) {
        console.error("Gagal mengambil detail dari Supabase:", err.message);
        layananAktif = null;
    }
}



function renderData() {
    if (!layananAktif) {
        document.body.innerHTML = `
        <div class="container py-5">
            <div class="empty-state">
                <i class="bi bi-exclamation-circle"></i>
                <h2>Layanan Tidak Ditemukan</h2>
                <p>Data yang Anda cari tidak tersedia di database.</p>
                <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
            </div>
        </div>
        `;
        return;
    }

    renderHeader();
    renderRequirement();
    renderNotes();
    renderFlow();
}



function renderHeader() {
    document.title = layananAktif.name + " | Kelurahan Sukaraja";
    titleElement.textContent = layananAktif.name;
    descriptionElement.textContent = layananAktif.description;
    categoryElement.textContent = layananAktif.category;
    totalRequirement.textContent = layananAktif.requirements ? layananAktif.requirements.length : 0;
    categoryElement.className = "status-badge";
}



function renderRequirement() {
    if (!requirementElement) return;
    requirementElement.innerHTML = "";
 
    if (!layananAktif.requirements || layananAktif.requirements.length === 0) {
        requirementElement.innerHTML = `<div class="requirement-item"><i class="bi bi-info-circle"></i><span>Belum ada persyaratan yang ditambahkan.</span></div>`;
        return;
    }

    layananAktif.requirements.forEach(item => {
        requirementElement.innerHTML += `
        <div class="requirement-item">
            <i class="bi bi-check-circle-fill"></i>
            <span>${item}</span>
        </div>
        `;
    });
}



function renderNotes() {
    if (!noteElement) return;
    noteElement.innerHTML = "";

   
    if (!layananAktif.notes || layananAktif.notes.length === 0) {
        noteElement.innerHTML = `
        <div class="note-item">
            <i class="bi bi-info-circle-fill"></i>
            <span>Pastikan seluruh persyaratan dibawa dalam bentuk asli maupun fotokopi sesuai kebutuhan.</span>
        </div>
        `;
        return;
    }

    layananAktif.notes.forEach(note => {
        noteElement.innerHTML += `
        <div class="note-item">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>${note}</span>
        </div>
        `;
    });
}



function renderFlow() {
    if (!flowElement) return;
    flowElement.innerHTML = "";

    const steps = [
        { title: "Menyiapkan Persyaratan", desc: "Lengkapi seluruh dokumen sesuai persyaratan layanan." },
        { title: "Datang ke Kantor Kelurahan", desc: "Serahkan seluruh berkas kepada petugas pelayanan." },
        { title: "Verifikasi Berkas", desc: "Petugas memeriksa kelengkapan dan keabsahan dokumen." },
        { title: "Proses Administrasi", desc: "Berkas diproses sesuai prosedur pelayanan yang berlaku." },
        { title: "Dokumen Selesai", desc: "Pemohon menerima dokumen yang telah selesai diproses." }
    ];

    steps.forEach((step, index) => {
        flowElement.innerHTML += `
        <div class="flow-item">
            <div class="flow-number">${index + 1}</div>
            <div class="flow-content">
                <h6>${step.title}</h6>
                <p>${step.desc}</p>
            </div>
        </div>
        `;
    });
}


function initScrollTop() {
    if (!scrollTop) return;
    window.addEventListener("scroll", () => {
        if (window.scrollY > 250) {
            scrollTop.classList.add("show");
        } else {
            scrollTop.classList.remove("show");
        }
    });

    scrollTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;
    if (window.scrollY > 40) {
        navbar.classList.add("navbar-scrolled");
    } else {
        navbar.classList.remove("navbar-scrolled");
    }
});
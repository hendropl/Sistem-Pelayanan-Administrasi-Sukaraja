/* =====================================================
   PELAYANAN ADMINISTRASI KELURAHAN SUKARAJA
   script.js
===================================================== */

"use strict";

/* =====================================================
   GLOBAL
===================================================== */

let layanan = [];
let layananFilter = [];
let kategoriAktif = "Semua";

/* =====================================================
   ELEMENT
===================================================== */

const serviceContainer =
    document.getElementById("serviceContainer");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const totalLayanan =
    document.getElementById("totalLayanan");

const loading =
    document.getElementById("loading");

const flowContainer =
    document.getElementById("flowContainer");

const scrollTopButton =
    document.getElementById("scrollTop");

/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLayanan();

        loadFlow();

        navbarEffect();

        scrollButton();

        smoothScroll();

    }
);

/* =====================================================
   LOADING
===================================================== */

function showLoading() {

    if (!loading) return;

    loading.classList.remove("d-none");

}

function hideLoading() {

    if (!loading) return;

    loading.classList.add("d-none");

}

/* =====================================================
   LOAD DARI SUPABASE
===================================================== */
async function loadLayanan() {
    try {
        showLoading();

        // Mengambil data dari tabel 'layanan' di Supabase
        const { data, error } = await supabaseClient
            .from('layanan')
            .select('*')
            .order('id', { ascending: true }); 

        if (error) throw error;

        layanan = data;
        layananFilter = [...layanan];

        renderLayanan(layananFilter);
        updateStatistik();
        initSearch();
        initFilter();
        
        hideLoading();

    } catch (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
        hideLoading();
        serviceContainer.innerHTML =
        `
        <div class="empty-state">
            <i class="bi bi-database-x"></i>
            <h3>Koneksi Terputus</h3>
            <p>Gagal memuat data dari database layanan.</p>
        </div>
        `;
    }
}

/* =====================================================
   RENDER CARD
===================================================== */

function renderLayanan(data) {

    if (!serviceContainer) return;

    serviceContainer.innerHTML = "";

    if (data.length === 0) {

        serviceContainer.innerHTML =

        `
        <div class="empty-state">

            <i class="bi bi-search"></i>

            <h3>

                Tidak Ada Hasil

            </h3>

            <p>

                Coba gunakan kata kunci lain.

            </p>

        </div>
        `;

        return;

    }

    data.forEach(item => {

        const card = document.createElement("div");

        card.className =
            "service-card fade-up";

        card.innerHTML =

        `
        <div class="service-content">

            <div class="service-icon">

                <i class="${item.icon}"></i>

            </div>

            <span class="service-category">

                ${item.category}

            </span>

            <h3 class="service-title">

                ${item.name}

            </h3>

            <p class="service-desc">

                ${item.description}

            </p>

            <div class="service-footer">

                <span class="service-meta">

                    ${item.requirements.length}
                    Persyaratan

                </span>

                <a

                    href="detail.html?id=${item.id}"

                    class="btn-detail">

                    Lihat Detail

                    <i class="bi bi-arrow-right"></i>

                </a>

            </div>

        </div>
        `;

        serviceContainer.appendChild(card);

    });

}
/* =====================================================
   SEARCH
===================================================== */

function initSearch() {

    if (!searchInput) return;

    let timer;

    searchInput.addEventListener("input", function () {

        clearTimeout(timer);

        timer = setTimeout(() => {

            const keyword =
                this.value.toLowerCase().trim();

            layananFilter = layanan.filter(item => {

                const cocokNama =
                    item.name
                    .toLowerCase()
                    .includes(keyword);

                const cocokKategori =
                    item.category
                    .toLowerCase()
                    .includes(keyword);

                const cocokDeskripsi =
                    item.description
                    .toLowerCase()
                    .includes(keyword);

                const cocokFilter =
                    kategoriAktif === "Semua"
                    ||
                    item.category === kategoriAktif;

                return (
                    cocokFilter &&
                    (
                        cocokNama ||
                        cocokKategori ||
                        cocokDeskripsi
                    )
                );

            });

            renderLayanan(layananFilter);

            updateStatistik();

        }, 250);

    });

}

/* =====================================================
   FILTER
===================================================== */

function initFilter() {

    if (!filterButtons.length) return;

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn =>

                btn.classList.remove("active")

            );

            button.classList.add("active");

            kategoriAktif =
                button.dataset.category;

            applyFilter();

        });

    });

}

function applyFilter() {

    const keyword =
        searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    layananFilter = layanan.filter(item => {

        const sesuaiKategori =
            kategoriAktif === "Semua"
            ||
            item.category === kategoriAktif;

        const sesuaiSearch =

            item.name
                .toLowerCase()
                .includes(keyword)

            ||

            item.description
                .toLowerCase()
                .includes(keyword)

            ||

            item.category
                .toLowerCase()
                .includes(keyword);

        return sesuaiKategori && sesuaiSearch;

    });

    renderLayanan(layananFilter);

    updateStatistik();

}

/* =====================================================
   STATISTIK
===================================================== */

function updateStatistik() {

    if (!totalLayanan) return;

    totalLayanan.textContent =
        layananFilter.length;

}

/* =====================================================
   FLOW
===================================================== */

function loadFlow() {

    if (!flowContainer) return;

    const steps = [

        {
            nomor: 1,
            judul: "Datang ke Kantor",
            deskripsi:
                "Datang ke Kantor Kelurahan Sukaraja dengan membawa seluruh persyaratan."
        },

        {
            nomor: 2,
            judul: "Verifikasi Berkas",
            deskripsi:
                "Petugas akan memeriksa kelengkapan seluruh dokumen."
        },

        {
            nomor: 3,
            judul: "Proses Administrasi",
            deskripsi:
                "Dokumen diproses sesuai jenis pelayanan yang dipilih."
        },

        {
            nomor: 4,
            judul: "Dokumen Selesai",
            deskripsi:
                "Pemohon menerima dokumen yang telah selesai diproses."
        }

    ];

    flowContainer.innerHTML = "";

    steps.forEach(step => {

        flowContainer.innerHTML += `

        <div class="col-lg-3 col-md-6">

            <div class="stat-card">

                <i class="bi bi-${step.nomor}-circle-fill"></i>

                <h4>

                    ${step.judul}

                </h4>

                <p>

                    ${step.deskripsi}

                </p>

            </div>

        </div>

        `;

    });

}
/* =====================================================
   SCROLL TO TOP
===================================================== */

function scrollButton() {

    if (!scrollTopButton) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            scrollTopButton.classList.add("show");

        } else {

            scrollTopButton.classList.remove("show");

        }

    });

    scrollTopButton.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* =====================================================
   NAVBAR EFFECT
===================================================== */

function navbarEffect() {

    const navbar =
        document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 60) {

            navbar.classList.add("navbar-scrolled");

        } else {

            navbar.classList.remove("navbar-scrolled");

        }

    });

}

/* =====================================================
   SMOOTH SCROLL
===================================================== */

function smoothScroll() {

    document.querySelectorAll('a[href^="#"]')

        .forEach(anchor => {

            anchor.addEventListener("click", function (e) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (!target) return;

                e.preventDefault();

                window.scrollTo({

                    top:
                        target.offsetTop - 80,

                    behavior: "smooth"

                });

            });

        });

}

/* =====================================================
   INTERSECTION ANIMATION
===================================================== */

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("fade-up");

                observer.unobserve(entry.target);

            }

        });

    },

    {

        threshold: 0.15

    }

);



/* =====================================================
   HELPER
===================================================== */

function formatText(text) {

    if (!text) return "";

    return text

        .replace(/\s+/g, " ")

        .trim();

}

function capitalize(text) {

    return text

        .toLowerCase()

        .replace(/\b\w/g,

            char => char.toUpperCase()

        );

}

/* =====================================================
   PRELOAD JSON
===================================================== */


/* =====================================================
   PERFORMANCE
===================================================== */

window.addEventListener(

    "load",

    preloadData

);

/* =====================================================
   DEBUG (DEV ONLY)
===================================================== */

// console.log(layanan);

/* =====================================================
   END
===================================================== */
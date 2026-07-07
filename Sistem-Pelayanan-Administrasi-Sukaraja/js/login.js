
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        window.location.href = "admin.html";
    }
});

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    Swal.fire({ title: 'Memeriksa Data...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        Swal.fire('Gagal Login', 'Email atau Password yang Anda masukkan salah!', 'error');
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Akses Diterima',
            text: 'Mengalihkan ke panel admin...',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "admin.html";
        });
    }
});
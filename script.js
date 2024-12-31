const apiURL = "https://67710dd32ffbd37a63ce1278.mockapi.io/emiten"; // Ganti dengan URL mockAPI kamu
const modalAPIURL = "https://67710dd32ffbd37a63ce1278.mockapi.io/emitenModal";

// Menangani submit form untuk menambah emiten
document.getElementById("form-emiten").addEventListener("submit", async (e) => {
    e.preventDefault();

    const kodeEmiten = document.getElementById("kode-emiten").value;
    const namaEmiten = document.getElementById("nama-emiten").value;
    const harga = document.getElementById("harga").value;
    const penawaranAwal = document.getElementById("penawaran-awal").value;

    const emitenData = {
        kodeEmiten,
        namaEmiten,
        harga,
        penawaranAwal,
    };

    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emitenData),
        });

        if (response.ok) {
            alert("Emiten berhasil ditambahkan!");
            loadEmitens(); // Refresh daftar emiten
        } else {
            alert("Gagal menambahkan emiten.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// Fungsi untuk memuat daftar emiten dari mockAPI
async function loadEmitens() {
    const tbody = document.querySelector("#daftar-emiten tbody");
    tbody.innerHTML = ""; // Kosongkan tabel

    try {
        const response = await fetch(apiURL);
        const emitens = await response.json();

        emitens.forEach((emiten) => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${emiten.namaEmiten}</td>
            <td>
                <button onclick="showEmitenDetail('${emiten.id}')">Detail</button>
                <button class="delete-btn" onclick="deleteEmiten('${emiten.id}')">Hapus</button>
            </td>
        `;

            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fungsi untuk menampilkan detail emiten
async function showEmitenDetail(id) {
    try {
        const response = await fetch(`${apiURL}/${id}`);
        const emiten = await response.json();

        document.getElementById("info-kode").textContent = `Kode Emiten: ${emiten.kodeEmiten}`;
        document.getElementById("info-nama").textContent = `Nama Emiten: ${emiten.namaEmiten}`;
        document.getElementById("info-harga").textContent = `Harga: ${emiten.harga}`;
        document.getElementById("info-penawaran").textContent = `Penawaran Awal: ${emiten.penawaranAwal}`;

        document.getElementById("informasi-emiten").style.display = "block";
    } catch (error) {
        console.error("Error:", error);
    }
}

//fungsi untuk hapus emiten
async function deleteEmiten(id) {
    if (!confirm("Apakah Anda Yakin ingin menghapus emiten ini?")) {
        return;
    }
    try {
        const response = await fetch(`${apiURL}/${id}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Emiten berhasil dihapus!");
            loadEmitens();
        } else {
            alert("Gagal menghapus emiten.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

let selectedEmiten = null; // Untuk menyimpan emiten yang dipilih

// Fungsi untuk menghitung modal berdasarkan jumlah lot dan harga manual
function hitungModal() {
    const jumlahLot = document.getElementById('jumlah-lot').value;
    const hargaPerLembar = document.getElementById('input-harga').value; // Ambil harga dari input harga

    if (!hargaPerLembar || !jumlahLot) {
        alert("Harap masukkan harga dan jumlah lot!");
        return;
    }

    // Hitung modal
    const modal = jumlahLot * 100 * hargaPerLembar;

    // Menampilkan hasil modal di kolom informasi emiten
    document.getElementById('info-modal').textContent = `Modal Dibutuhkan: Rp ${modal.toLocaleString()}`;
}

// Fungsi untuk menampilkan detail emiten dan meng-update informasi modal
async function showEmitenDetail(id) {
    try {
        const response = await fetch(`${apiURL}/${id}`);
        const emiten = await response.json();

        document.getElementById("info-kode").textContent = `Kode Emiten: ${emiten.kodeEmiten}`;
        document.getElementById("info-nama").textContent = `Nama Emiten: ${emiten.namaEmiten}`;
        document.getElementById("info-harga").textContent = `Harga: ${emiten.harga}`;
        document.getElementById("info-penawaran").textContent = `Penawaran Awal: ${emiten.penawaranAwal}`;

        // Update harga dan tampilkan modal di informasi emiten
        selectedEmiten = emiten; // Simpan emiten yang dipilih
        document.getElementById("informasi-emiten").style.display = "block";
        
    } catch (error) {
        console.error("Error:", error);
    }
}


// Fungsi untuk menambahkan emiten yang sudah dihitung modalnya ke sub-resource 'emiten-modal'
async function addToEmitenModal() {
    if (!selectedEmiten) {
        alert("Pilih emiten terlebih dahulu!");
        return;
    }

    const modal = document.getElementById('info-modal').textContent.split(": ")[1];
    if (!modal) {
        alert("Modal tidak ditemukan!");
        return;
    }

    // Data yang akan ditambahkan ke 'emiten-modal'
    const emitenModalData = {
        namaEmiten: selectedEmiten.namaEmiten,
        modal: parseInt(modal.replace(/[^\d]/g, '')), // Mengambil nilai modal dan menghapus karakter non-digit
    };

    try {
        const response = await fetch("https://67710dd32ffbd37a63ce1278.mockapi.io/emitenModal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(emitenModalData),
        });

        if (response.ok) {
            alert("Emiten berhasil ditambahkan ke daftar modal!");
            loadEmitenModal(); // Refresh daftar modal
        } else {
            alert("Gagal menambahkan emiten ke daftar modal.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function loadEmitenModal() {
    const tbody = document.querySelector("#daftar-emiten-modal tbody");
    tbody.innerHTML = ""; // Kosongkan tabel modal

    try {
        const response = await fetch(modalAPIURL);
        const emitens = await response.json();

        emitens.forEach((emitenModal) => {
            const row = document.createElement("tr");

            const namaEmitenCell = document.createElement("td");
            namaEmitenCell.textContent = emitenModal.namaEmiten;

            const modalCell = document.createElement("td");
            modalCell.textContent = `Rp ${emitenModal.modal.toLocaleString()}`;

            const aksiCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Hapus";
            deleteButton.classList.add("delete-button");

            // Tambahkan fungsi hapus untuk tombol
            deleteButton.addEventListener("click", () => hapusEmitenModal(emitenModal.id));

            aksiCell.appendChild(deleteButton);

            row.appendChild(namaEmitenCell);
            row.appendChild(modalCell);
            row.appendChild(aksiCell);

            tbody.appendChild(row);
        });

        // Hitung total modal setelah data dimuat
        calculateTotalModal();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function hapusEmitenModal(idEmiten) {
    if (!confirm("Apakah Anda yakin ingin menghapus emiten ini?")) {
        return; // Jika pengguna membatalkan, hentikan fungsi
    }

    try {
        const response = await fetch(`${modalAPIURL}/${idEmiten}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Emiten berhasil dihapus!");
            loadEmitenModal(); // Refresh daftar modal setelah penghapusan
        } else {
            alert("Gagal menghapus emiten.");
        }
    } catch (error) {
        console.error("Error saat menghapus emiten:", error);
    }
}


// Fungsi untuk menghitung total modal dari daftar emiten-modal
function calculateTotalModal() {
    const tbody = document.querySelector("#daftar-emiten-modal tbody");
    let totalModal = 0;

    // Loop melalui semua baris di tabel dan ambil nilai modal
    tbody.querySelectorAll("tr").forEach((row) => {
        const modalText = row.children[1]?.textContent || "Rp 0";
        const modalValue = parseInt(modalText.replace(/[^\d]/g, "")) || 0;
        totalModal += modalValue;
    });

    // Tampilkan total modal di elemen "auto-sum"
    document.getElementById("auto-sum").textContent = `Rp ${totalModal.toLocaleString()}`;
}


// Memanggil loadEmitenModal untuk memuat data saat halaman dimuat
window.addEventListener("DOMContentLoaded", loadEmitenModal);

// Menambahkan event listener untuk tombol "Add"
document.getElementById('add-emiten-modal-btn').addEventListener("click", addToEmitenModal);


// Memuat daftar emiten saat halaman dimuat
window.addEventListener("DOMContentLoaded", loadEmitens);

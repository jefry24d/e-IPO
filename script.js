const apiUrl = "https://67635f6417ec5852cae8c563.mockapi.io/ipos"; // URL MockAPI kamu

function addRow() {
    const company = document.getElementById('company').value;
    const price = document.getElementById('price').value;
    const offerStartDate = document.getElementById('offerStartDate').value;
    const offerEndDate = document.getElementById('offerEndDate').value;
    const capital = document.getElementById('capital').value;

    if (company && price && offerStartDate && offerEndDate && capital) {
        const table = document.getElementById('ipoTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();

        newRow.innerHTML = `
            <td>${company}</td>
            <td>${parseInt(price).toLocaleString('id-ID')}</td>
            <td>${offerStartDate}</td>
            <td>${offerEndDate}</td>
            <td>${parseInt(capital).toLocaleString('id-ID')}</td>
            <td>
                <button onclick="editRow(this)">Edit</button>
                <button onclick="deleteRow(this)">Hapus</button>
            </td>
        `;

        updateTotal();

        // Kirim data ke MockAPI
        const newData = {
            company,
            price: parseInt(price),  // pastikan harga dalam format number
            offerStartDate,
            offerEndDate,
            capital: parseInt(capital) // pastikan modal dalam format number
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)  // kirim data dalam format JSON
        })
        .then(response => response.json())
        .then(data => console.log('Data disimpan:', data))
        .catch(error => console.error('Error:', error));

        // Clear input fields setelah data disubmit
        document.getElementById('company').value = '';
        document.getElementById('price').value = '';
        document.getElementById('offerStartDate').value = '';
        document.getElementById('offerEndDate').value = '';
        document.getElementById('capital').value = '';
    } else {
        alert('Semua kolom harus diisi!');
    }
}

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    updateTotal();
}

function editRow(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');

    document.getElementById('company').value = cells[0].innerText;
    document.getElementById('price').value = cells[1].innerText.replace(/\D/g, '');  // Menghapus karakter non-digit
    document.getElementById('offerStartDate').value = cells[2].innerText;
    document.getElementById('offerEndDate').value = cells[3].innerText;
    document.getElementById('capital').value = cells[4].innerText.replace(/\D/g, ''); // Menghapus karakter non-digit

    deleteRow(button);
}

function updateTotal() {
    const table = document.getElementById('ipoTable').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');
    let total = 0;

    for (const row of rows) {
        const capital = parseInt(row.cells[4].innerText.replace(/\D/g, ''));
        if (!isNaN(capital)) {
            total += capital;
        }
    }

    document.getElementById('totalCapital').innerText = total.toLocaleString('id-ID');
}

// Ambil data awal dari MockAPI saat halaman dimuat
function loadInitialData() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
                const table = document.getElementById('ipoTable').getElementsByTagName('tbody')[0];
                const newRow = table.insertRow();

                newRow.innerHTML = `
                    <td>${row.company}</td>
                    <td>${parseInt(row.price).toLocaleString('id-ID')}</td>
                    <td>${row.offerStartDate}</td>
                    <td>${row.offerEndDate}</td>
                    <td>${parseInt(row.capital).toLocaleString('id-ID')}</td>
                    <td>
                        <button onclick="editRow(this)">Edit</button>
                        <button onclick="deleteRow(this)">Hapus</button>
                    </td>
                `;
            });
            updateTotal();
        })
        .catch(error => console.error('Error:', error));
}

// Panggil fungsi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', loadInitialData);

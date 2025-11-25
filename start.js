// D:\semester 5\pws\praktikum7\start.js

const { spawn } = require('child_process');

// Perbaikan: Import modul 'open' dan pastikan mengambil fungsi default-nya.
// Kita gunakan variabel 'open' lagi, tapi kita akan periksa apakah fungsi default-nya ada saat dipanggil.
const open = require('open'); 

const url = 'http://localhost:3001'; 
const serverCommand = 'node';
const serverArgs = ['app.js'];

console.log('Mencoba menjalankan server...');
const serverProcess = spawn(serverCommand, serverArgs, { 
    stdio: 'inherit',
    shell: true 
});

serverProcess.on('error', (err) => {
    console.error(`Gagal menjalankan proses server: ${err.message}`);
});

setTimeout(() => {
    console.log(`Membuka browser ke ${url} (Pastikan server tidak mengalami error EADDRINUSE)`);

    // Panggil fungsi 'open' yang sudah diimpor.
    // Cek apakah 'open' itu sendiri atau properti '.default' yang merupakan fungsi.
    const openFunction = open.default || open; 

    openFunction(url)
        .then(() => {
            console.log('Browser berhasil dibuka.');
        })
        .catch(err => {
            console.error(`Gagal membuka browser otomatis. Buka manual: ${url}. Error: ${err.message}`);
        });
}, 3000);
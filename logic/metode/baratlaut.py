from metode.hitung_biaya import hitung_total_biaya  # Import fungsi untuk menghitung total biaya dari alokasi

def barat_laut(cost_matrix, supply, demand):
    # Validasi input awal, jika ada yang kosong, kembalikan hasil kosong
    if not cost_matrix or not supply or not demand:
        return {
            "allocation": [],
            "total_cost": 0
        }

    m = len(supply)     # Jumlah baris (sumber/supply)
    n = len(demand)     # Jumlah kolom (tujuan/demand)

    # Salin list agar tidak mengubah data asli (mencegah efek samping)
    supply = supply[:]
    demand = demand[:]

    # Inisialisasi matriks alokasi dengan 0 (ukuran m x n)
    allocation = [[0 for _ in range(n)] for _ in range(m)]

    i = 0  # Indeks baris
    j = 0  # Indeks kolom

    # Algoritma Barat Laut: mulai dari kiri atas dan bergerak ke kanan/bawah
    while i < m and j < n:
        alloc = min(supply[i], demand[j])  # Alokasikan sebanyak mungkin sesuai supply & demand
        allocation[i][j] = alloc           # Simpan alokasi di posisi (i,j)
        supply[i] -= alloc                 # Kurangi supply yang tersedia
        demand[j] -= alloc                 # Kurangi demand yang tersedia

        # Jika supply habis, pindah ke baris berikutnya
        if supply[i] == 0 and i < m:
            i += 1
        # Jika demand habis, pindah ke kolom berikutnya
        elif demand[j] == 0 and j < n:
            j += 1

    # Kembalikan hasil alokasi dan total biaya yang dihitung dari hasil alokasi
    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix)
    }

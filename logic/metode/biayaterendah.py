import copy
from metode.hitung_biaya import hitung_total_biaya  # Import fungsi untuk menghitung total biaya alokasi

def biaya_terendah(cost_matrix, supply, demand):
    m = len(supply)  # Jumlah baris (sumber/supply)
    n = len(demand)  # Jumlah kolom (tujuan/demand)

    costs = copy.deepcopy(cost_matrix)  # Salin matriks biaya agar tidak mengubah data aslinya
    supply = supply[:]  # Salin list supply agar tidak mengubah data asli
    demand = demand[:]  # Salin list demand agar tidak mengubah data asli

    allocation = [[0 for _ in range(n)] for _ in range(m)]  # Inisialisasi matriks alokasi 0
    used = [[False for _ in range(n)] for _ in range(m)]    # Matriks penanda sel yang sudah digunakan

    # Selama masih ada supply dan demand yang belum 0
    while sum(supply) > 0 and sum(demand) > 0:
        # Cari biaya terkecil di antara sel yang belum digunakan
        min_cost = float('inf')  # Nilai awal biaya minimum
        pos = (-1, -1)           # Posisi awal
        for i in range(m):
            for j in range(n):
                if not used[i][j] and costs[i][j] < min_cost:
                    min_cost = costs[i][j]
                    pos = (i, j)

        i, j = pos  # Ambil posisi dengan biaya terkecil

        # Tentukan jumlah alokasi minimum dari supply dan demand
        alloc = min(supply[i], demand[j])
        allocation[i][j] = alloc       # Simpan nilai alokasi
        supply[i] -= alloc             # Kurangi supply
        demand[j] -= alloc             # Kurangi demand

        # Tandai baris atau kolom sebagai sudah digunakan jika supply atau demand-nya habis
        if supply[i] == 0:
            for col in range(n):
                used[i][col] = True  # Tandai seluruh kolom di baris i sebagai digunakan
        if demand[j] == 0:
            for row in range(m):
                used[row][j] = True  # Tandai seluruh baris di kolom j sebagai digunakan

    # Kembalikan matriks alokasi dan total biaya dari hasil alokasi
    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix)
    }

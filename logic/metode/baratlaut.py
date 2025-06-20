from metode.hitung_biaya import hitung_total_biaya
def barat_laut(cost_matrix, supply, demand):
    # Validasi input awal
    if not cost_matrix or not supply or not demand:
        return {
            "allocation": [],
            "total_cost": 0
        }

    m = len(supply)     # jumlah baris
    n = len(demand)     # jumlah kolom

    # Salin list agar tidak mengubah data asli
    supply = supply[:]
    demand = demand[:]

    # Inisialisasi matriks alokasi dengan nol
    allocation = [[0 for _ in range(n)] for _ in range(m)]

    i = 0
    j = 0

    # Algoritma Barat Laut
    while i < m and j < n:
        alloc = min(supply[i], demand[j])
        allocation[i][j] = alloc
        supply[i] -= alloc
        demand[j] -= alloc

        if supply[i] == 0 and i < m:
            i += 1
        elif demand[j] == 0 and j < n:
            j += 1

    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix)
    }





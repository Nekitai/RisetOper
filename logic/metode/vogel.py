import copy
from metode.hitung_biaya import hitung_total_biaya  # Fungsi untuk menghitung total biaya dari alokasi

def vogel_approximation_method(cost_matrix, supply, demand):
    m = len(supply)  # Jumlah baris (sumber)
    n = len(demand)  # Jumlah kolom (tujuan)

    # Salin data agar tidak merusak input asli
    costs = copy.deepcopy(cost_matrix)
    supply = supply[:]
    demand = demand[:]

    # Inisialisasi matriks alokasi 0
    allocation = [[0 for _ in range(n)] for _ in range(m)]

    # Set untuk melacak baris dan kolom yang sudah habis (supply/demand = 0)
    done_rows = set()
    done_cols = set()

    # Loop sampai semua baris dan kolom selesai (supply dan demand = 0)
    while len(done_rows) < m or len(done_cols) < n:

        # Step 1: Hitung penalty baris
        row_penalty = []
        for i in range(m):
            if i in done_rows:
                row_penalty.append((-1, -1))  # Skip baris yang sudah selesai
                continue
            # Ambil semua elemen biaya di baris yang belum digunakan
            row = [(costs[i][j], j) for j in range(n) if j not in done_cols]
            row.sort()  # Urutkan berdasarkan biaya terkecil
            # Hitung selisih dua biaya terkecil sebagai penalty
            penalty = row[1][0] - row[0][0] if len(row) > 1 else row[0][0]
            row_penalty.append((penalty, i))

        # Step 2: Hitung penalty kolom
        col_penalty = []
        for j in range(n):
            if j in done_cols:
                col_penalty.append((-1, -1))  # Skip kolom yang sudah selesai
                continue
            # Ambil semua elemen biaya di kolom yang belum digunakan
            col = [(costs[i][j], i) for i in range(m) if i not in done_rows]
            col.sort()
            # Hitung selisih dua biaya terkecil sebagai penalty
            penalty = col[1][0] - col[0][0] if len(col) > 1 else col[0][0]
            col_penalty.append((penalty, j))

        # Step 3: Pilih penalty terbesar dari baris atau kolom
        max_row_penalty = max(row_penalty)  # (penalty, indeks_baris)
        max_col_penalty = max(col_penalty)  # (penalty, indeks_kolom)

        # Jika sama besar atau baris lebih besar, prioritaskan baris
        if max_row_penalty[0] >= max_col_penalty[0]:
            i = max_row_penalty[1]
            # Ambil posisi dengan biaya terkecil di baris tersebut
            row = [(costs[i][j], j) for j in range(n) if j not in done_cols]
            row.sort()
            j = row[0][1]  # Pilih kolom dengan biaya terkecil
        else:
            j = max_col_penalty[1]
            # Ambil posisi dengan biaya terkecil di kolom tersebut
            col = [(costs[i][j], i) for i in range(m) if i not in done_rows]
            col.sort()
            i = col[0][1]  # Pilih baris dengan biaya terkecil

        # Step 4: Lakukan alokasi ke posisi (i, j)
        alloc = min(supply[i], demand[j])  # Alokasi maksimum yang bisa dilakukan
        allocation[i][j] = alloc
        supply[i] -= alloc
        demand[j] -= alloc

        # Tandai baris atau kolom selesai jika supply atau demand sudah habis
        if supply[i] == 0:
            done_rows.add(i)
        if demand[j] == 0:
            done_cols.add(j)

    # Kembalikan hasil akhir berupa matriks alokasi dan total biaya
    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix)
    }

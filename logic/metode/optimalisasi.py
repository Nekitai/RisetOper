def cek_optimalitas(allocation, cost_matrix):
    m = len(allocation)      # Jumlah baris (sumber)
    n = len(allocation[0])   # Jumlah kolom (tujuan)

    u = [None] * m  # Potensial baris (dual variable u)
    v = [None] * n  # Potensial kolom (dual variable v)

    # Step 1: Buat list posisi sel yang terisi (alokasi > 0)
    filled = [(i, j) for i in range(m) for j in range(n) if allocation[i][j] > 0]

    # Step 2: Set u[0] = 0 dan hitung u[i] dan v[j] berdasarkan persamaan: u[i] + v[j] = C[i][j]
    u[0] = 0  # Inisialisasi salah satu nilai u (biasanya u[0]) dengan 0
    while True:
        updated = False
        for i, j in filled:
            if u[i] is not None and v[j] is None:
                v[j] = cost_matrix[i][j] - u[i]  # Hitung v[j]
                updated = True
            elif v[j] is not None and u[i] is None:
                u[i] = cost_matrix[i][j] - v[j]  # Hitung u[i]
                updated = True
        if not updated:
            break  # Keluar dari loop jika tidak ada pembaruan lagi

    # Step 3: Hitung Δ[i][j] untuk setiap sel kosong (tidak dialokasikan)
    delta = [[None for _ in range(n)] for _ in range(m)]  # Matriks selisih biaya
    optimal = True  # Anggap solusi optimal, akan dicek kemudian

    for i in range(m):
        for j in range(n):
            if allocation[i][j] == 0:  # Hanya sel kosong yang dihitung delta-nya
                if u[i] is not None and v[j] is not None:
                    # Rumus: delta = C[i][j] - (u[i] + v[j])
                    delta[i][j] = cost_matrix[i][j] - (u[i] + v[j])
                    if delta[i][j] < 0:
                        optimal = False  # Jika ada delta negatif, solusi tidak optimal
                else:
                    delta[i][j] = None  # Jika u[i] atau v[j] belum terdefinisi

    # Kembalikan hasil:
    return {
        "is_optimal": optimal,  # True jika tidak ada delta negatif
        "delta": delta,         # Matriks delta
        "u": u,                 # Nilai potensial baris
        "v": v                  # Nilai potensial kolom
    }

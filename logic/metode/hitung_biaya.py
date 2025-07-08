def hitung_total_biaya(allocation, cost_matrix):
    # Validasi: pastikan matriks alokasi tidak kosong
    if not allocation or not allocation[0]:
        raise ValueError("Matriks alokasi kosong.")

    total_cost = 0  # Inisialisasi total biaya

    # Loop setiap sel dalam matriks alokasi
    for i in range(len(allocation)):
        for j in range(len(allocation[0])):
            if allocation[i][j] is not None:
                # Kalikan jumlah alokasi dengan biaya per unit-nya, lalu jumlahkan
                total_cost += allocation[i][j] * cost_matrix[i][j]

    return total_cost  # Kembalikan total biaya keseluruhan

def hitung_total_biaya(allocation, cost_matrix):
    if not allocation or not allocation[0]:
        raise ValueError("Matriks alokasi kosong.")
    
    total_cost = 0
    for i in range(len(allocation)):
        for j in range(len(allocation[0])):
            if allocation[i][j] is not None:
                total_cost += allocation[i][j] * cost_matrix[i][j]
    return total_cost
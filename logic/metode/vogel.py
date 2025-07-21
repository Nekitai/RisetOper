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
    step = []
    iteration = 1

    # Loop sampai semua baris dan kolom selesai (supply dan demand = 0)
    while len(done_rows) < m or len(done_cols) < n:

        # Step 1: Hitung penalty baris
        row_penalty = []
        for i in range(m):
            if i in done_rows:
                row_penalty.append((-1, -1))  # Skip baris yang sudah selesai
                continue
            row = [(costs[i][j], j) for j in range(n) if j not in done_cols]
            row.sort()
            penalty = row[1][0] - row[0][0] if len(row) > 1 else row[0][0]
            row_penalty.append((penalty, i))

        # Step 2: Hitung penalty kolom
        col_penalty = []
        for j in range(n):
            if j in done_cols:
                col_penalty.append((-1, -1))  # Skip kolom yang sudah selesai
                continue
            col = [(costs[i][j], i) for i in range(m) if i not in done_rows]
            col.sort()
            penalty = col[1][0] - col[0][0] if len(col) > 1 else col[0][0]
            col_penalty.append((penalty, j))

        # Step 3: Pilih penalty terbesar dari baris atau kolom
        max_row_penalty = max(row_penalty)
        max_col_penalty = max(col_penalty)

        if max_row_penalty[0] >= max_col_penalty[0]:
            i = max_row_penalty[1]
            row = [(costs[i][j], j) for j in range(n) if j not in done_cols]
            row.sort()
            j = row[0][1]
        else:
            j = max_col_penalty[1]
            col = [(costs[i][j], i) for i in range(m) if i not in done_rows]
            col.sort()
            i = col[0][1]

        # Step 4: Alokasi
        alloc = min(supply[i], demand[j])
        allocation[i][j] = alloc
        supply[i] -= alloc
        demand[j] -= alloc

        if supply[i] == 0:
            done_rows.add(i)
        if demand[j] == 0:
            done_cols.add(j)

        pinalty_format_row = [p if p[0] != -1 else "-" for p in row_penalty]
        pinalty_format_col = [p if p[0] != -1 else "-" for p in col_penalty]

        step.append({
            "iteration": iteration,
            "supply": supply[:],
            "demand": demand[:],
            "cost_matrix": copy.deepcopy(costs),
            "row_penalty": [p[0] if p[0] != -1 else "-" for p in pinalty_format_row],
            "col_penalty": [p[0] if p[0] != -1 else "-" for p in pinalty_format_col],
            "selected": {"row": i, "col": j},
            "allocated": alloc
        })
        iteration += 1

    row_pinalty_all = [step["row_penalty"] for step in step]
    col_pinalty_all = [step["col_penalty"] for step in step]
    

    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix),
        "steps": step,
        "row_penalty": row_pinalty_all,
        "col_penalty": col_pinalty_all
    }

import copy
from metode.hitung_biaya import hitung_total_biaya
def vogel_approximation_method(cost_matrix, supply, demand):
    m = len(supply)
    n = len(demand)
    costs = copy.deepcopy(cost_matrix)
    supply = supply[:]
    demand = demand[:]

    allocation = [[0 for _ in range(n)] for _ in range(m)]
    done_rows = set()
    done_cols = set()

    while len(done_rows) < m or len(done_cols) < n:
        # Step 1: Hitung penalty baris
        row_penalty = []
        for i in range(m):
            if i in done_rows:
                row_penalty.append((-1, -1))
                continue
            row = [(costs[i][j], j) for j in range(n) if j not in done_cols]
            row.sort()
            penalty = row[1][0] - row[0][0] if len(row) > 1 else row[0][0]
            row_penalty.append((penalty, i))

        # Step 2: Hitung penalty kolom
        col_penalty = []
        for j in range(n):
            if j in done_cols:
                col_penalty.append((-1, -1))
                continue
            col = [(costs[i][j], i) for i in range(m) if i not in done_rows]
            col.sort()
            penalty = col[1][0] - col[0][0] if len(col) > 1 else col[0][0]
            col_penalty.append((penalty, j))

        # Step 3: Pilih penalty terbesar (jika sama, default ke baris)
        max_row_penalty = max(row_penalty)
        max_col_penalty = max(col_penalty)

        if max_row_penalty[0] >= max_col_penalty[0]:
            i = max_row_penalty[1]
            # Pilih biaya terendah di baris i
            row = [(costs[i][j], j) for j in range(n) if j not in done_cols]
            row.sort()
            j = row[0][1]
        else:
            j = max_col_penalty[1]
            col = [(costs[i][j], i) for i in range(m) if i not in done_rows]
            col.sort()
            i = col[0][1]

        # Step 4: Alokasikan
        alloc = min(supply[i], demand[j])
        allocation[i][j] = alloc
        supply[i] -= alloc
        demand[j] -= alloc

        if supply[i] == 0:
            done_rows.add(i)
        if demand[j] == 0:
            done_cols.add(j)

    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix)
    }


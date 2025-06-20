def cek_optimalitas(allocation, cost_matrix):
    m = len(allocation)
    n = len(allocation[0])

    u = [None] * m
    v = [None] * n

    # Step 1: Buat list posisi sel yang terisi
    filled = [(i, j) for i in range(m) for j in range(n) if allocation[i][j] > 0]

    # Step 2: Set u[0] = 0 dan gunakan persamaan u[i] + v[j] = C[i][j]
    u[0] = 0
    while True:
        updated = False
        for i, j in filled:
            if u[i] is not None and v[j] is None:
                v[j] = cost_matrix[i][j] - u[i]
                updated = True
            elif v[j] is not None and u[i] is None:
                u[i] = cost_matrix[i][j] - v[j]
                updated = True
        if not updated:
            break

    # Step 3: Hitung Δ[i][j] untuk sel kosong
    delta = [[None for _ in range(n)] for _ in range(m)]
    optimal = True
    for i in range(m):
        for j in range(n):
            if allocation[i][j] == 0:
                if u[i] is not None and v[j] is not None:
                    delta[i][j] = cost_matrix[i][j] - (u[i] + v[j])
                    if delta[i][j] < 0:
                        optimal = False
                else:
                    delta[i][j] = None

    return {
        "is_optimal": optimal,
        "delta": delta,
        "u": u,
        "v": v
    }

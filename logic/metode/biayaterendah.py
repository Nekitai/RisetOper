import copy

def biaya_terendah(cost_matrix, supply, demand):
    m = len(supply)
    n = len(demand)
    costs = copy.deepcopy(cost_matrix)
    supply = supply[:]
    demand = demand[:]

    allocation = [[0 for _ in range(n)] for _ in range(m)]
    used = [[False for _ in range(n)] for _ in range(m)]

    while sum(supply) > 0 and sum(demand) > 0:
        # Cari biaya terkecil yang belum digunakan
        min_cost = float('inf')
        pos = (-1, -1)
        for i in range(m):
            for j in range(n):
                if not used[i][j] and costs[i][j] < min_cost:
                    min_cost = costs[i][j]
                    pos = (i, j)

        i, j = pos
        alloc = min(supply[i], demand[j])
        allocation[i][j] = alloc
        supply[i] -= alloc
        demand[j] -= alloc

        # Tandai baris atau kolom yang sudah selesai
        if supply[i] == 0:
            for col in range(n):
                used[i][col] = True
        if demand[j] == 0:
            for row in range(m):
                used[row][j] = True

    return {
        "allocation": allocation,
        "total_cost": hitung_total_biaya(allocation, cost_matrix)
    }

def hitung_total_biaya(allocation, cost_matrix):
    total = 0
    for i in range(len(allocation)):
        for j in range(len(allocation[0])):
            total += allocation[i][j] * cost_matrix[i][j]
    return total

def barat_laut(cost_matrix, supply, demand):
    m = len(supply)
    n = len(demand)

    supply = supply[:]
    demand = demand[:]
    allocation = [[0 for _ in range(n)] for _ in range(m)]

    i = 0
    j = 0

    while i < m and j < n:
        alloc = min(supply[i], demand[j])
        allocation[i][j] = alloc
        supply[i] -= alloc
        demand[j] -= alloc

        if supply[i] == 0:
            i += 1
        elif demand[j] == 0:
            j += 1

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

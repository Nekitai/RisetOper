from scipy.optimize import linprog

def solve_min(problem):
    # Koefisien fungsi tujuan (langsung untuk minimisasi)
    c = problem["coefficients"]

    # Siapkan constraint
    A_ub, b_ub = [], []
    A_eq, b_eq = [], []

    for cons in problem["constraints"]:
        coefs = cons["coefficients"]
        rhs = cons["rhs"]
        sign = cons["sign"]

        if sign == "<=":
            A_ub.append(coefs)
            b_ub.append(rhs)
        elif sign == ">=":
            A_ub.append([-x for x in coefs])
            b_ub.append(-rhs)
        elif sign == "=":
            A_eq.append(coefs)
            b_eq.append(rhs)
        else:
            raise ValueError(f"Unsupported sign: {sign}")

    # Gunakan bounds default jika tidak ada
    bounds = problem.get("bounds", [(0, None)] * len(c))

    # Solve menggunakan linprog
    result = linprog(
        c,
        A_ub=A_ub or None,
        b_ub=b_ub or None,
        A_eq=A_eq or None,
        b_eq=b_eq or None,
        bounds=bounds,
        method="highs"
    )

    return {
        "success": result.success,
        "solution": result.x.tolist(),
        "optimal_value": result.fun,
        "message": result.message
    }

from scipy.optimize import linprog  # Import fungsi linprog dari SciPy untuk menyelesaikan masalah LP

def solve_min(problem):
    # Ambil koefisien fungsi objektif (asumsi masalah minimisasi)
    c = problem["coefficients"]

    # Inisialisasi constraint
    A_ub, b_ub = [], []  # Untuk ketaksamaan (<= dan >=)
    A_eq, b_eq = [], []  # Untuk persamaan (=)

    # Parsing constraint satu per satu
    for cons in problem["constraints"]:
        coefs = cons["coefficients"]  # Koefisien sisi kiri constraint
        rhs = cons["rhs"]             # Right-hand side / nilai di sisi kanan constraint
        sign = cons["sign"]           # Tanda constraint: <=, >=, atau =

        # Klasifikasikan constraint berdasarkan tanda
        if sign == "<=":
            A_ub.append(coefs)
            b_ub.append(rhs)
        elif sign == ">=":
            A_ub.append([-x for x in coefs])  # Ubah menjadi bentuk <= dengan mengalikan -1
            b_ub.append(-rhs)
        elif sign == "=":
            A_eq.append(coefs)
            b_eq.append(rhs)
        else:
            raise ValueError(f"Unsupported sign: {sign}")  # Tanda tidak didukung

    # Ambil bounds untuk tiap variabel (default: ≥ 0)
    bounds = problem.get("bounds", [(0, None)] * len(c))

    # Selesaikan masalah LP menggunakan metode 'highs'
    result = linprog(
        c,
        A_ub=A_ub or None,  # None jika tidak ada constraint <=
        b_ub=b_ub or None,
        A_eq=A_eq or None,  # None jika tidak ada constraint =
        b_eq=b_eq or None,
        bounds=bounds,
        method="highs"      # Metode solver modern dan efisien
    )

    # Kembalikan hasil dalam bentuk dictionary
    return {
        "success": result.success,              # True jika solusi ditemukan
        "solution": result.x.tolist(),          # Nilai variabel optimal
        "optimal_value": result.fun,            # Nilai minimum dari fungsi objektif
        "message": result.message               # Pesan status dari solver
    }

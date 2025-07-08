from scipy.optimize import linprog  # Import solver linprog dari SciPy

def solve_max(problem):
    # Ambil koefisien fungsi objektif dan ubah tanda karena linprog hanya mendukung minimisasi
    # Untuk maksimisasi, kita ubah max Z → min (-Z)
    c = [-x for x in problem["coefficients"]]

    # Inisialisasi list constraint
    A_ub, b_ub = [], []  # Ketaksamaan (<= atau dikonversi dari >=)
    A_eq, b_eq = [], []  # Persamaan (=)

    # Loop semua constraint
    for cons in problem["constraints"]:
        coefs = cons["coefficients"]  # Koefisien kiri constraint
        rhs = cons["rhs"]             # Nilai kanan constraint
        sign = cons["sign"]           # Operator constraint: <=, >=, =

        if sign == "<=":
            A_ub.append(coefs)
            b_ub.append(rhs)
        elif sign == ">=":
            # Konversi menjadi <= dengan mengalikan -1
            A_ub.append([-x for x in coefs])
            b_ub.append(-rhs)
        elif sign == "=":
            A_eq.append(coefs)
            b_eq.append(rhs)
        else:
            raise ValueError(f"Unsupported sign: {sign}")  # Validasi jika tanda tidak dikenal

    # Ambil bounds untuk tiap variabel, default ≥ 0
    bounds = problem.get("bounds", [(0, None)] * len(c))

    # Panggil solver linprog
    result = linprog(
        c,                      # Koefisien objektif yang sudah dikonversi ke minimisasi
        A_ub=A_ub or None,      # Constraint <=
        b_ub=b_ub or None,
        A_eq=A_eq or None,      # Constraint =
        b_eq=b_eq or None,
        bounds=bounds,          # Batas variabel
        method="highs"          # Gunakan metode modern & cepat
    )

    # Kembalikan hasil dalam bentuk dict
    return {
        "success": result.success,              # True jika solusi ditemukan
        "solution": result.x.tolist(),          # Nilai optimal variabel
        "optimal_value": -result.fun,           # Ubah kembali ke bentuk maksimisasi
        "message": result.message               # Pesan dari solver (jika error atau sukses)
    }

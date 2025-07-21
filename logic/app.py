from flask import Flask, request, jsonify
from flask_cors import CORS
from metode.vogel import vogel_approximation_method
from metode.optimalisasi import cek_optimalitas
from metode.biayaterendah import biaya_terendah
from metode.baratlaut import barat_laut 
from metode.lp_max import solve_max
from metode.lp_min import solve_min
from metode.hitung_biaya import hitung_total_biaya
import os

app = Flask(__name__)
# Konfigurasi CORS: Opsi 2 (Direkomendasikan untuk Produksi)
# Menggunakan Environment Variable 'ALLOWED_ORIGINS'
ALLOWED_ORIGINS_STR = os.environ.get("ALLOWED_ORIGINS", "").split(',')
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS_STR if origin.strip()]

CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS, "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type"]}})

@app.route('/vogel', methods=['POST'])
def solve_vogel():
    data = request.json
    cost_matrix = data.get('cost_matrix')
    supply = data.get('supply')
    demand = data.get('demand')

    if not cost_matrix or not supply or not demand:
        return jsonify({"error": "Missing required input"}), 400

    result = vogel_approximation_method(cost_matrix, supply, demand)

    response = {
        **result,
        
    }
    return jsonify(response)

@app.route('/biayaterendah', methods=['POST'])
def solve_least_cost():
    data = request.json
    cost_matrix = data.get('cost_matrix')
    supply = data.get('supply')
    demand = data.get('demand')

    if not cost_matrix or not supply or not demand:
        return jsonify({"error": "Missing required input"}), 400

    result = biaya_terendah(cost_matrix, supply, demand)
    

    response = {
        **result,
    }
    return jsonify(response)


@app.route('/barat_laut', methods=['POST'])
def solve_northwest():
    data = request.json
    cost_matrix = data.get('cost_matrix')
    supply = data.get('supply')
    demand = data.get('demand')

    if not cost_matrix or not supply or not demand:
        return jsonify({"error": "Missing required input"}), 400

    result = barat_laut(cost_matrix, supply, demand)

    response = {
        **result,
    }
    return jsonify(response)


@app.route("/runall", methods=["POST"])
def run_all_methods():
    data = request.get_json()
    biaya = data["cost_matrix"]
    supply = data["supply"]
    demand = data["demand"]

    # Metode Barat Laut
    barat_laut_result = barat_laut(biaya, supply, demand)
    barat_laut_alloc = barat_laut_result["allocation"]
    barat_laut_cost = barat_laut_result["total_cost"]
    barat_laut_opt = cek_optimalitas(barat_laut_alloc, biaya)

    # Metode Biaya Terendah
    biaya_terendah_result = biaya_terendah(biaya, supply, demand)
    biaya_terendah_alloc = biaya_terendah_result["allocation"]
    biaya_terendah_cost = biaya_terendah_result["total_cost"]
    biaya_terendah_opt = cek_optimalitas(biaya_terendah_alloc, biaya)

    # Metode Vogel
    vogel_result = vogel_approximation_method(biaya, supply, demand)
    vogel_alloc = vogel_result["allocation"]
    vogel_cost = vogel_result["total_cost"]
    vogel_opt = cek_optimalitas(vogel_alloc, biaya)

    return jsonify({
        "barat_laut": {
            "allocation": barat_laut_alloc,
            "total_cost": barat_laut_cost,
            **barat_laut_opt
        },
        "biaya_terendah": {
            "allocation": biaya_terendah_alloc,
            "total_cost": biaya_terendah_cost,
            **biaya_terendah_opt
        },
        "vogel": {
            "allocation": vogel_alloc,
            "total_cost": vogel_cost,
            "row_penalty": vogel_result["row_penalty"],
            "col_penalty": vogel_result["col_penalty"],
            **vogel_opt
        }
    })


@app.route('/optimize', methods=['POST'])
def optimize_solution():
    data = request.get_json()
    allocation = data['allocation']
    biaya = data['biaya']

    result = cek_optimalitas(allocation, biaya)

    # Tambahkan total biaya agar frontend bisa menampilkan seperti metode lainnya
    result['allocation'] = allocation
    # Use hitung_total_biaya_vogel as a general cost calculator (adjust if needed)
    result['total_cost'] = hitung_total_biaya(allocation, biaya)
    return jsonify(result)

# endpoint lp_max
@app.route('/lp_max', methods=['POST'])
def solve_lp_max():
    data = request.get_json()
    result = solve_max(data)
    return jsonify(result)

@app.route('/lp_min', methods=['POST'])
def solve_lp_mix():
    data = request.get_json()
    result = solve_min(data)
    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

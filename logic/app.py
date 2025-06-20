# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from metode.vogel import vogel_approximation_method, hitung_total_biaya
from metode.optimalisasi import cek_optimalitas
from metode.biayaterendah import biaya_terendah
from metode.baratlaut import barat_laut
from metode.lp_max import solve_max
from metode.lp_min import solve_min

app = Flask(__name__)
CORS(app)

@app.route('/vogel', methods=['POST'])
def solve_vogel():
    data = request.json
    cost_matrix = data.get('cost_matrix')
    supply = data.get('supply')
    demand = data.get('demand')

    if not cost_matrix or not supply or not demand:
        return jsonify({"error": "Missing required input"}), 400

    allocation = vogel_approximation_method(cost_matrix, supply, demand)
    total_cost = hitung_total_biaya(allocation, cost_matrix)
    optimal_check = cek_optimalitas(allocation, cost_matrix)

    response = {
        "allocation": allocation,
        "total_cost": total_cost,
        "is_optimal": optimal_check["is_optimal"],
        "delta": optimal_check["delta"],
        "u": optimal_check["u"],
        "v": optimal_check["v"]
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

    allocation = biaya_terendah(cost_matrix, supply, demand)
    total_cost = hitung_total_biaya(allocation, cost_matrix)
    optimal_check = cek_optimalitas(allocation, cost_matrix)

    response = {
        "allocation": allocation,
        "total_cost": total_cost,
        "is_optimal": optimal_check["is_optimal"],
        "delta": optimal_check["delta"],
        "u": optimal_check["u"],
        "v": optimal_check["v"]
    }

    return jsonify(response)

@app.route('/baratlaut', methods=['POST'])
def solve_northwest():
    data = request.json
    cost_matrix = data.get('cost_matrix')
    supply = data.get('supply')
    demand = data.get('demand')

    if not cost_matrix or not supply or not demand:
        return jsonify({"error": "Missing required input"}), 400

    allocation = barat_laut(cost_matrix, supply, demand)
    total_cost = hitung_total_biaya(allocation, cost_matrix)
    optimal_check = cek_optimalitas(allocation, cost_matrix)

    response = {
        "allocation": allocation,
        "total_cost": total_cost,
        "is_optimal": optimal_check["is_optimal"],
        "delta": optimal_check["delta"],
        "u": optimal_check["u"],
        "v": optimal_check["v"]
    }

    return jsonify(response)

@app.route('/runall', methods=['POST'])
def run_all_methods():
    data = request.get_json()
    biaya = data['cost_matrix']
    supply = data['supply']
    demand = data['demand']

    # 1. Vogel
    vogel = vogel_approximation_method(biaya, supply.copy(), demand.copy())
    vogel_opt = cek_optimalitas(vogel['allocation'], biaya)
    vogel.update(vogel_opt)

    # 2. Least Cost
    lcm = biaya_terendah(biaya, supply.copy(), demand.copy())
    lcm_opt = cek_optimalitas(lcm['allocation'], biaya)
    lcm.update(lcm_opt)

    # 3. Northwest
    nw = barat_laut(biaya, supply.copy(), demand.copy())
    nw_opt = cek_optimalitas(nw['allocation'], biaya)
    nw.update(nw_opt)

    return jsonify({
        "vogel": vogel,
        "biaya terendah": lcm,
        "barat laut": nw
    })

@app.route('/optimize', methods=['POST'])
def optimize_solution():
    data = request.get_json()
    allocation = data['allocation']
    biaya = data['biaya']

    result = cek_optimalitas(allocation, biaya)
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
    app.run(debug=True)

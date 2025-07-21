import React, { useState } from "react";
import LPGraph from "../components/LPGrahp";
import generateLinesFromConstraints from "../components/GrahpHelper";

function LinearProgrammingmax() {
  const [coefficients, setCoefficients] = useState([0]);
  const [constraints, setConstraints] = useState([{ coefficients: [0], sign: "<=", rhs: 0 }]);
  const [result, setResult] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const handleCoefficientChange = (i, value) => {
    const newCoefs = [...coefficients];
    newCoefs[i] = parseFloat(value || 0);
    setCoefficients(newCoefs);
  };

  const handleConstraintChange = (index, field, subIndex, value) => {
    const newConstraints = [...constraints];
    if (field === "coefficients") {
      newConstraints[index][field][subIndex] = parseFloat(value || 0);
    } else if (field === "rhs") {
      newConstraints[index][field] = parseFloat(value || 0);
    } else {
      newConstraints[index][field] = value;
    }
    setConstraints(newConstraints);
  };

  const addVariable = () => {
    setCoefficients([...coefficients, 0]);
    setConstraints(
      constraints.map((c) => ({
        ...c,
        coefficients: [...c.coefficients, 0],
      }))
    );
  };

  const removeVariable = () => {
    if (coefficients.length > 1) {
      setCoefficients(coefficients.slice(0, -1));
      setConstraints(
        constraints.map((c) => ({
          ...c,
          coefficients: c.coefficients.slice(0, -1),
        }))
      );
    }
  };

  const addConstraint = () => {
    setConstraints([...constraints, { coefficients: Array(coefficients.length).fill(0), sign: "<=", rhs: 0 }]);
  };

  const removeConstraint = (index) => {
    const newConstraints = constraints.filter((_, i) => i !== index);
    setConstraints(newConstraints);
  };

  const getMaxXY = (lines, solution) => {
    let allPoints = [];

    lines.constraintLines.forEach((line) => {
      allPoints = allPoints.concat(line);
    });
    allPoints = allPoints.concat(lines.objectiveLine, [solution]);

    const maxX = Math.ceil(Math.max(...allPoints.map((p) => p.x)) + 1);
    const maxY = Math.ceil(Math.max(...allPoints.map((p) => p.y)) + 1);

    return { maxX, maxY };
  };

  const handleSubmit = async () => {
    const payload = {
      coefficients,
      constraints,
    };

    try {
      const res = await fetch("/lp_max", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);

      if (data.success && data.solution.length >= 2) {
        const solutionPoint = { x: data.solution[0], y: data.solution[1] };
        const lines = generateLinesFromConstraints(constraints, coefficients, solutionPoint);
        const { maxX, maxY } = getMaxXY(lines, solutionPoint);

        setGraphData({
          ...lines,
          solutionPoint,
          maxX,
          maxY,
        });
        console.log("Graph Data:", {
          constraintsLines: lines.constraintLines,
          objectiveLine: lines.objectiveLine,
          solutionPoint,
          maxX,
          maxY,
        });
      } else {
        setGraphData(null);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="py-8 sm:py-16 lg:py-36 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white">
      <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8">
        Pemrograman Linear - Maximasi
      </h2>

      {/* Objective Function Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Fungsi Tujuan (Max)</h3>
        
        {/* Mobile: Stack inputs vertically */}
        <div className="sm:hidden space-y-2 mb-4">
          {coefficients.map((val, i) => (
            <div key={i} className="flex items-center space-x-2">
              <label className="text-sm font-medium w-12">x{i + 1}:</label>
              <input 
                type="number" 
                value={val} 
                onChange={(e) => handleCoefficientChange(i, e.target.value)} 
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none" 
                placeholder={`Koefisien x${i + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden sm:flex gap-3 flex-wrap mb-4">
          {coefficients.map((val, i) => (
            <div key={i} className="flex flex-col">
              <label className="text-xs text-gray-400 mb-1">x{i + 1}</label>
              <input 
                type="number" 
                value={val} 
                onChange={(e) => handleCoefficientChange(i, e.target.value)} 
                className="w-20 lg:w-24 px-2 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-center" 
                placeholder="0"
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={addVariable} 
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            + Tambah Variabel
          </button>
          {coefficients.length > 1 && (
            <button 
              onClick={removeVariable} 
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              - Hapus Variabel
            </button>
          )}
        </div>
      </div>

      {/* Constraints Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Kendala</h3>
        
        <div className="space-y-4">
          {constraints.map((cons, i) => (
            <div key={i} className="bg-gray-800/50 p-3 sm:p-4 rounded-lg border border-gray-700">
              <div className="mb-2 text-sm text-gray-400">Kendala {i + 1}</div>
              
              {/* Mobile: Stack constraint inputs */}
              <div className="sm:hidden space-y-3">
                {/* Coefficients */}
                <div className="space-y-2">
                  {cons.coefficients.map((val, j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <label className="text-sm font-medium w-12">x{j + 1}:</label>
                      <input 
                        type="number" 
                        value={val} 
                        onChange={(e) => handleConstraintChange(i, "coefficients", j, e.target.value)} 
                        className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Sign and RHS */}
                <div className="flex items-center space-x-2">
                  <select 
                    value={cons.sign} 
                    onChange={(e) => handleConstraintChange(i, "sign", null, e.target.value)} 
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="<=">≤ (Kurang dari sama dengan)</option>
                    <option value=">=">&gt; (Lebih dari sama dengan)</option>
                    <option value="=">&#61; (Sama dengan)</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium w-12">b:</label>
                  <input 
                    type="number" 
                    value={cons.rhs} 
                    onChange={(e) => handleConstraintChange(i, "rhs", null, e.target.value)} 
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none" 
                    placeholder="Nilai batas"
                  />
                </div>
              </div>

              {/* Desktop: Horizontal layout */}
              <div className="hidden sm:flex gap-2 lg:gap-3 items-center flex-wrap">
                {cons.coefficients.map((val, j) => (
                  <div key={j} className="flex flex-col">
                    <label className="text-xs text-gray-400 mb-1">x{j + 1}</label>
                    <input 
                      type="number" 
                      value={val} 
                      onChange={(e) => handleConstraintChange(i, "coefficients", j, e.target.value)} 
                      className="w-16 lg:w-20 px-2 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-center" 
                      placeholder="0"
                    />
                  </div>
                ))}
                <select 
                  value={cons.sign} 
                  onChange={(e) => handleConstraintChange(i, "sign", null, e.target.value)} 
                  className="px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="<=">≤</option>
                  <option value=">=">≥</option>
                  <option value="=">=</option>
                </select>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">b</label>
                  <input 
                    type="number" 
                    value={cons.rhs} 
                    onChange={(e) => handleConstraintChange(i, "rhs", null, e.target.value)} 
                    className="w-20 lg:w-24 px-2 py-2 bg-gray-900 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-center" 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Constraint Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
          <button 
            onClick={addConstraint} 
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            + Tambah Kendala
          </button>
          {constraints.length > 1 && (
            <button 
              onClick={() => removeConstraint(constraints.length - 1)} 
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
            >
              - Hapus Kendala
            </button>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 sm:mb-8 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold mb-2 text-blue-400">Petunjuk Penggunaan:</h4>
        <div className="space-y-1 text-xs sm:text-sm text-gray-300">
          <p>• Jika nilai koefisien x adalah 1, masukkan 1. Jika tidak ada, masukkan 0</p>
          <p>• Contoh kendala: 2x₁ + 3x₂ ≤ 5 → masukkan 2 pada x₁, 3 pada x₂, dan 5 pada b</p>
          <p>• Contoh fungsi tujuan: 3x₁ + 4x₂ → masukkan 3 pada x₁ dan 4 pada x₂</p>
          <p>• Contoh kendala: x₁ ≤ 2 → masukkan 1 pada x₁, 0 pada x₂, dan 2 pada b</p>
          <p>• Pastikan semua nilai diisi dengan benar sebelum menghitung solusi</p>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        onClick={handleSubmit} 
        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        Hitung Solusi Optimal
      </button>

      {/* Results Section */}
      {result && (
        <div className="mt-6 sm:mt-8 bg-gray-800/50 p-4 sm:p-6 rounded-lg border border-gray-700">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-blue-400">Hasil Perhitungan:</h3>
          {result.success ? (
            <div className="space-y-3">
              <div className="bg-green-900/30 p-3 rounded-lg border border-green-700">
                <p className="text-sm text-gray-300">Nilai Maksimum:</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{result.optimal_value}</p>
              </div>
              <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-700">
                <p className="text-sm text-gray-300 mb-2">Solusi Optimal:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {result.solution.map((val, i) => (
                    <div key={i} className="bg-gray-800 p-2 rounded text-center">
                      <span className="text-blue-300 font-semibold">x{i + 1} = {val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-900/30 p-4 rounded-lg border border-red-700">
              <p className="text-red-400 font-medium">{result.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Graph Section */}
      {graphData && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-semibold mb-4 text-purple-400">Visualisasi Grafik:</h3>
          <div className="bg-gray-800/50 p-2 sm:p-4 rounded-lg border border-gray-700 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <LPGraph 
                constraints={graphData.constraintLines} 
                objectiveLine={graphData.objectiveLine} 
                solutionPoint={graphData.solutionPoint} 
                xMax={graphData.maxX} 
                yMax={graphData.maxY} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinearProgrammingmax;
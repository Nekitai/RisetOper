import React, { useState } from "react";
import LPGraph from "../components/LPGrahp";
import generateLinesFromConstraints from "../components/GrahpHelper";

function LinearProgrammingInput() {
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

    const maxX = Math.min(Math.max(...allPoints.map((p) => p.x)) + 2, 10);
    const maxY = Math.min(Math.max(...allPoints.map((p) => p.y)) + 2, 10);

    return { maxX, maxY };
  };

  const handleSubmit = async () => {
    const payload = {
      coefficients,
      constraints,
    };

    try {
      const res = await fetch("/lp_min", {
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
    <div className="py-4 sm:py-8 md:py-16 lg:py-36 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-white min-h-screen">
      <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8">
        Pemrograman Linear - Minimasi
      </h2>

      {/* Objective Function Section */}
      <div className="mb-6 sm:mb-8 bg-gray-800/50 p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Fungsi Tujuan (Min)</h3>
        
        {/* Mobile-first grid layout for coefficients */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
          {coefficients.map((val, i) => (
            <div key={i} className="flex flex-col">
              <label className="text-xs sm:text-sm text-gray-400 mb-1">x{i + 1}</label>
              <input
                type="number"
                value={val}
                onChange={(e) => handleCoefficientChange(i, e.target.value)}
                className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-gray-700 text-white rounded-md text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        {/* Button group */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={addVariable}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm sm:text-base font-medium"
          >
            + Variabel
          </button>
          {coefficients.length > 1 && (
            <button
              onClick={removeVariable}
              className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors text-sm sm:text-base font-medium"
            >
              - Variabel
            </button>
          )}
        </div>
      </div>

      {/* Constraints Section */}
      <div className="mb-6 sm:mb-8 bg-gray-800/50 p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Kendala</h3>
        
        <div className="space-y-4">
          {constraints.map((cons, i) => (
            <div key={i} className="border border-gray-700 p-3 sm:p-4 rounded-md bg-gray-900/50">
              <div className="text-sm text-gray-400 mb-2">Kendala {i + 1}</div>
              
              {/* Mobile constraint layout */}
              <div className="space-y-3">
                {/* Coefficients row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {cons.coefficients.map((val, j) => (
                    <div key={j} className="flex flex-col">
                      <label className="text-xs text-gray-400 mb-1">x{j + 1}</label>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => handleConstraintChange(i, "coefficients", j, e.target.value)}
                        className="w-full px-2 py-2 bg-gray-700 text-white rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>

                {/* Sign and RHS row */}
                <div className="flex gap-2 items-end">
                  <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-400 mb-1">Tanda</label>
                    <select
                      value={cons.sign}
                      onChange={(e) => handleConstraintChange(i, "sign", null, e.target.value)}
                      className="w-full px-2 py-2 bg-gray-700 text-white rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="<=">≤</option>
                      <option value=">=">≥</option>
                      <option value="=">=</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-400 mb-1">Nilai</label>
                    <input
                      type="number"
                      value={cons.rhs}
                      onChange={(e) => handleConstraintChange(i, "rhs", null, e.target.value)}
                      className="w-full px-2 py-2 bg-gray-700 text-white rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>

                  {/* Remove constraint button for individual constraints */}
                  {constraints.length > 1 && (
                    <button
                      onClick={() => removeConstraint(i)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                      title="Hapus kendala"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add constraint button */}
        <button
          onClick={addConstraint}
          className="w-full sm:w-auto mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors text-sm sm:text-base font-medium"
        >
          + Kendala Baru
        </button>
      </div>

      {/* Instructions Section */}
      <div className="mb-6 sm:mb-8 bg-gray-800/30 p-4 sm:p-6 rounded-lg">
        <h4 className="text-base sm:text-lg font-semibold mb-3 text-yellow-400">Petunjuk Penggunaan:</h4>
        <div className="space-y-2 text-xs sm:text-sm text-gray-300">
          <p>• Jika nilai x saja itu 1 dan jika tidak ada maka bernilai 0</p>
          <p>• Contoh: Untuk kendala 2x₁ + 3x₂ ≤ 5, masukkan 2 pada x₁, 3 pada x₂, dan 5 pada nilai</p>
          <p>• Contoh: Untuk fungsi tujuan 3x₁ + 4x₂, masukkan 3 pada x₁ dan 4 pada x₂</p>
          <p>• Contoh: Untuk kendala x₁ ≤ 2, masukkan 1 pada x₁ dan 2 pada nilai</p>
          <p>• Pastikan semua nilai diisi dengan benar sebelum menghitung solusi</p>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-base sm:text-lg font-semibold shadow-lg"
        >
          Hitung Solusi
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="mb-6 sm:mb-8 bg-gray-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Hasil:</h3>
          {result.success ? (
            <div className="space-y-3">
              <p className="text-base sm:text-lg">
                Nilai Minimum: <span className="text-green-400 font-bold text-xl">{result.optimal_value}</span>
              </p>
              <div className="bg-gray-900/50 p-3 sm:p-4 rounded-md">
                <h4 className="text-sm sm:text-base font-semibold mb-2 text-gray-300">Solusi Optimal:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {result.solution.map((val, i) => (
                    <div key={i} className="bg-gray-800 p-2 sm:p-3 rounded text-center">
                      <span className="text-gray-400 text-sm">x{i + 1} =</span>
                      <span className="text-white font-bold ml-2">{val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-900/30 border border-red-600 p-4 rounded-md">
              <p className="text-red-300 text-sm sm:text-base">{result.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Graph Section */}
      {graphData && (
        <div className="bg-gray-800/50 p-4 sm:p-6 rounded-lg">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Visualisasi Grafik:</h3>
          <div className="overflow-x-auto">
            <LPGraph
              constraints={graphData.constraintLines}
              objectiveLine={graphData.objectiveLine}
              solutionPoint={graphData.solutionPoint}
              xMax={graphData.maxX}
              yMax={graphData.maxY}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LinearProgrammingInput;
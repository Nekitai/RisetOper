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
      const res = await fetch("http://localhost:5000/lp_min", {
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
    <div className="py-36 max-w-3xl mx-auto text-white">
      <h2 className="text-center text-xl font-bold mb-4">Pemrograman Linear - Minimasi</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Fungsi Tujuan (Min)</h3>
        <div className="flex gap-2 flex-wrap">
          {coefficients.map((val, i) => (
            <input key={i} type="number" value={val} onChange={(e) => handleCoefficientChange(i, e.target.value)} className="w-20 px-2 py-1 bg-gray-800 text-white rounded" placeholder={`x${i + 1}`} />
          ))}
          <button onClick={addVariable} className="px-3 py-1 bg-blue-600 rounded">
            + Variabel
          </button>
          {coefficients.length > 1 && (
            <button onClick={removeVariable} className="px-3 py-1 bg-red-600 rounded">
              - Variabel
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Kendala</h3>
        {constraints.map((cons, i) => (
          <div key={i} className="flex gap-2 mb-2 flex-wrap items-center">
            {cons.coefficients.map((val, j) => (
              <input key={j} type="number" value={val} onChange={(e) => handleConstraintChange(i, "coefficients", j, e.target.value)} className="w-20 px-2 py-1 bg-gray-800 text-white rounded" placeholder={`x${j + 1}`} />
            ))}
            <select value={cons.sign} onChange={(e) => handleConstraintChange(i, "sign", null, e.target.value)} className="px-2 py-1 bg-gray-700 rounded">
              <option value="<=">&#8804;</option>
              <option value=">=">&#8805;</option>
              <option value="=">=</option>
            </select>
            <input type="number" value={cons.rhs} onChange={(e) => handleConstraintChange(i, "rhs", null, e.target.value)} className="w-24 px-2 py-1 bg-gray-800 text-white rounded" placeholder="b" />
          </div>
        ))}
        <button onClick={addConstraint} className="px-3 py-1 bg-blue-600 rounded mt-2">
          + Kendala
        </button>
        {constraints.length > 1 && (
          <button onClick={() => removeConstraint(constraints.length - 1)} className="px-3 py-1 bg-red-600 rounded mt-2 ml-2">
            - Kendala
          </button>
        )}
      </div>
      {/* buatkan catatan untuk jika nilai x saja itu 1 dan jika tidak ada maka bernilai 0 */}
      <p className="text-sm text-gray-400 mb-4">Catatan: Jika nilai x saja itu 1 dan jika tidak ada maka bernilai 0</p>
      <p className="text-sm text-gray-400 mb-4">
        Contoh: Untuk kendala 2x1 + 3x2 <span>&#8804;</span>= 5, masukkan 2 pada x1, 3 pada x2, dan 5 pada b.
      </p>
      <p className="text-sm text-gray-400 mb-4">Contoh: Untuk fungsi tujuan 3x1 + 4x2, masukkan 3 pada x1 dan 4 pada x2.</p>
      <p className="text-sm text-gray-400 mb-4">
        Contoh: Untuk fungsi kendala x1 <span>&#8804;</span>= 2, masukkan 1 pada x1 dan 2 pada b. dan begitu juga untuk x2
      </p>
      <p className="text-sm text-gray-400 mb-4">Pastikan semua nilai diisi dengan benar sebelum menghitung solusi.</p>
      <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 rounded">
        Hitung Solusi
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Hasil:</h3>
          {result.success ? (
            <>
              <p className="mb-1">
                Nilai Minimum: <span className="text-green-400 font-bold">{result.optimal_value}</span>
              </p>
              <ul className="list-disc pl-6">
                {result.solution.map((val, i) => (
                  <li key={i}>
                    x{i + 1} = {val.toFixed(2)}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-red-400">{result.message}</p>
          )}
        </div>
      )}
      {graphData && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Visualisasi Grafik:</h3>
          <LPGraph constraints={graphData.constraintLines} objectiveLine={graphData.objectiveLine} solutionPoint={graphData.solutionPoint} xMax={graphData.maxX} yMax={graphData.maxY} />
        </div>
      )}
    </div>
  );
}

export default LinearProgrammingInput;

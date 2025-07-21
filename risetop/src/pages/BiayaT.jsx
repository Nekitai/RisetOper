import React, { useState } from "react";

function BiayaT() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [costMatrix, setCostMatrix] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [supply, setSupply] = useState([0, 0]);
  const [demand, setDemand] = useState([0, 0]);
  const [results, setResults] = useState({
    barat_laut: null,
    biaya_terendah: null,
    vogel: null,
    optimize: null,
  });
  const [activeMethod, setActiveMethod] = useState(null);
  const [showOptimize, setShowOptimize] = useState(false);

  const handleCostChange = (i, j, value) => {
    const newMatrix = [...costMatrix];
    newMatrix[i][j] = parseInt(value || 0);
    setCostMatrix(newMatrix);
  };

  const handleSupplyChange = (i, value) => {
    const newSupply = [...supply];
    newSupply[i] = parseInt(value || 0);
    setSupply(newSupply);
  };

  const handleDemandChange = (j, value) => {
    const newDemand = [...demand];
    newDemand[j] = parseInt(value || 0);
    setDemand(newDemand);
  };

  const preparePayload = () => ({
    cost_matrix: costMatrix,
    supply,
    demand,
  });

  const handleSubmit = async (endpoint) => {
    const payload = preparePayload();
    try {
      const res = await fetch(`/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [endpoint]: data, optimize: null }));
      setActiveMethod(endpoint);
      setShowOptimize(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleOptimize = async () => {
    if (!activeMethod || !results[activeMethod]) return;
    try {
      const res = await fetch(`/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biaya: costMatrix,
          allocation: results[activeMethod].allocation,
        }),
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, optimize: data }));
      setShowOptimize(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleRunall = async () => {
    const payload = preparePayload();
    try {
      const res = await fetch("/runall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResults({
        barat_laut: data.barat_laut,
        biaya_terendah: data.biaya_terendah,
        vogel: data.vogel,
        optimize: data.optimize,
      });
      setActiveMethod("runall");
      setShowOptimize(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handlereset = () => {
    setCostMatrix(Array.from({ length: rows }, () => Array(cols).fill(0)));
    setSupply(Array(rows).fill(0));
    setDemand(Array(cols).fill(0));
    setResults({ barat_laut: null, biaya_terendah: null, vogel: null, optimize: null });
    setActiveMethod(null);
    setShowOptimize(false);
  };

  const updateDimensions = () => {
    setCostMatrix(Array.from({ length: rows }, () => Array(cols).fill(0)));
    setSupply(Array(rows).fill(0));
    setDemand(Array(cols).fill(0));
  };

  const renderOptimizationDetails = (result) => {
    if (!result || !result.u || !result.v || !result.delta) return null;

    return (
      <div className="mt-4 w-full px-2 sm:px-4">
        <h4 className="text-sm sm:text-md font-semibold text-center mb-3">Detail Optimalisasi</h4>

        <div className="flex flex-col gap-4 text-xs sm:text-sm">
          {/* Nilai u dan v - stack pada mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded">
              <h5 className="font-bold mb-2 text-center">Nilai u:</h5>
              <div className="grid grid-cols-2 gap-1">
                {result.u.map((val, i) => (
                  <div key={i} className="text-center">
                    u{i} = {val !== null ? val : "∅"}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded">
              <h5 className="font-bold mb-2 text-center">Nilai v:</h5>
              <div className="grid grid-cols-2 gap-1">
                {result.v.map((val, j) => (
                  <div key={j} className="text-center">
                    v{j} = {val !== null ? val : "∅"}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delta table - responsive */}
          <div className="bg-gray-800 p-3 rounded">
            <h5 className="font-bold mb-2 text-center">Δ (Delta):</h5>
            <div className="overflow-x-auto">
              <table className="border border-gray-500 mx-auto text-xs">
                <tbody>
                  {result.delta.map((row, i) => (
                    <tr key={i}>
                      {row.map((val, j) => (
                        <td key={j} className={`border px-2 py-1 text-center min-w-8 ${val !== null && val < 0 ? "text-red-400 font-bold" : ""}`}>
                          {val !== null ? val : "∅"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-xs sm:text-sm">
          <span className="inline-block bg-gray-800 px-3 py-2 rounded">
            Status: {result.is_optimal ? "✅ Solusi Sudah Optimal" : "❌ Belum Optimal"}
          </span>
        </div>
      </div>
    );
  };

  const renderResultTable = (title, result) => {
    if (!result) return null;

    const isVogel = title.toLowerCase().includes("vogel");
    const allocation = result.allocation || [];
    const rowPenaltyAll = result.row_penalty || [];
    const colPenaltyAll = result.col_penalty || [];

    return (
      <div className="w-full px-2 mt-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3 text-center bg-gray-800 py-2 rounded">{title}</h3>

        <div className="overflow-x-auto">
          <table className="border border-gray-500 mx-auto text-xs sm:text-sm min-w-full">
            <tbody>
              {allocation.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="border px-2 py-2 text-center min-w-12 bg-gray-900">
                      {val}
                    </td>
                  ))}

                  {/* Row penalty untuk semua iterasi */}
                  {isVogel && (
                    <td className="border px-2 py-2 text-yellow-300 font-semibold bg-gray-700">
                      <div className="flex gap-1 justify-center flex-wrap">
                        {rowPenaltyAll.map((penalties, stepIdx) => (
                          <span key={stepIdx} className="text-xs">{penalties[i] !== "-" ? penalties[i] : "-"}</span>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {/* Column penalty untuk semua iterasi */}
              {isVogel && (
                <tr>
                  {allocation[0].map((_, j) => (
                    <td key={j} className="border px-2 py-2 text-yellow-300 font-semibold text-center bg-gray-700">
                      <div className="flex flex-col items-center gap-1">
                        {colPenaltyAll.map((penalties, stepIdx) => (
                          <div key={stepIdx} className="text-xs">{penalties[j] !== "-" ? penalties[j] : "-"}</div>
                        ))}
                      </div>
                    </td>
                  ))}
                  <td className="bg-gray-700"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-3">
          <span className="inline-block bg-green-800 px-3 py-2 rounded text-sm">
            Total Cost: <span className="text-green-400 font-bold">{result.total_cost}</span>
          </span>
        </div>
      </div>
    );
  };

  const renderVogelMatrixStep = (step) => {
    const { cost_matrix, supply, demand, selected, allocated, row_penalty, col_penalty } = step;

    return (
      <div className="overflow-x-auto mt-2 mb-4">
        <table className="border border-gray-600 text-xs min-w-full">
          <thead>
            <tr>
              <th className="border px-1 py-1 bg-gray-700 text-xs">FROM\TO</th>
              {demand.map((_, j) => (
                <th key={j} className="border px-1 py-1 bg-gray-700 text-xs min-w-12">
                  D{j + 1}
                </th>
              ))}
              <th className="border px-1 py-1 bg-gray-700 text-xs">SUPPLY</th>
              <th className="border px-1 py-1 bg-gray-700 text-xs">PENALTY</th>
            </tr>
          </thead>
          <tbody>
            {cost_matrix.map((row, i) => (
              <tr key={i}>
                <td className="border px-1 py-1 bg-gray-700 text-xs">S{i + 1}</td>
                {row.map((val, j) => {
                  const isSelected = selected.row === i && selected.col === j;
                  return (
                    <td key={j} className={`border px-1 py-1 text-center min-w-12 ${isSelected ? "bg-green-700 text-white font-bold" : ""}`}>
                      <div>{val}</div>
                      {isSelected && <div className="text-red-400 font-bold text-xs">({allocated})</div>}
                    </td>
                  );
                })}
                <td className="border px-1 py-1 text-center">{supply[i]}</td>
                <td className="border px-1 py-1 text-center">{row_penalty[i] !== -1 ? row_penalty[i] : "-"}</td>
              </tr>
            ))}
            <tr>
              <td className="border px-1 py-1 bg-gray-700 text-xs">DEMAND</td>
              {demand.map((val, j) => (
                <td key={j} className="border px-1 py-1 text-center text-xs">
                  {val}
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="border px-1 py-1 bg-gray-700 text-xs">PENALTY</td>
              {col_penalty.map((val, j) => (
                <td key={j} className="border px-1 py-1 text-center text-xs">
                  {val !== -1 ? val : "-"}
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderVogelSteps = (steps) => {
    if (!steps || !Array.isArray(steps)) return null;

    return (
      <div className="mt-6 w-full text-sm px-2">
        <h3 className="text-base sm:text-lg font-bold mb-4 text-center text-yellow-300 bg-gray-800 py-2 rounded">
          Langkah Iterasi Metode Vogel
        </h3>
        {steps.map((step, index) => (
          <div key={index} className="border border-gray-600 rounded p-2 sm:p-4 mb-4 bg-gray-900">
            <h4 className="font-bold mb-2 text-blue-400 text-center">Iterasi {step.iteration}</h4>
            {renderVogelMatrixStep(step)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-4 sm:py-8 px-2 text-white bg-gray-900">
      <div className="w-full max-w-6xl">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Input Data Transportasi</h2>
        
        {/* Input dimensions - responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 bg-gray-800 p-4 rounded">
          <div className="flex flex-col">
            <label className="text-sm mb-1">Jumlah Baris (Supply):</label>
            <input 
              type="number" 
              value={rows} 
              min="1" 
              onChange={(e) => setRows(Number(e.target.value))} 
              className="bg-gray-700 text-white px-2 py-2 rounded border border-gray-600 focus:border-blue-500" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm mb-1">Jumlah Kolom (Demand):</label>
            <input 
              type="number" 
              value={cols} 
              min="1" 
              onChange={(e) => setCols(Number(e.target.value))} 
              className="bg-gray-700 text-white px-2 py-2 rounded border border-gray-600 focus:border-blue-500" 
            />
          </div>
          <div className="flex flex-col justify-end">
            <button 
              onClick={updateDimensions} 
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Terapkan Ukuran
            </button>
          </div>
        </div>

        {/* Cost matrix input - scrollable on mobile */}
        <div className="overflow-x-auto bg-gray-800 p-4 rounded mb-4">
          <table className="border border-gray-500 mx-auto">
            <tbody>
              {costMatrix.map((row, i) => (
                <tr key={i}>
                  {row.map((val, j) => (
                    <td key={j} className="border px-1 py-1">
                      <input 
                        type="number" 
                        value={costMatrix[i][j]} 
                        onChange={(e) => handleCostChange(i, j, e.target.value)} 
                        className="w-12 sm:w-16 bg-gray-700 text-white px-1 py-1 text-center rounded border border-gray-600 focus:border-blue-500" 
                      />
                    </td>
                  ))}
                  <td className="pl-2 text-xs sm:text-sm text-gray-400 whitespace-nowrap">Supply:</td>
                  <td>
                    <input 
                      type="number" 
                      value={supply[i]} 
                      onChange={(e) => handleSupplyChange(i, e.target.value)} 
                      className="w-12 sm:w-16 bg-gray-700 text-white px-1 py-1 text-center rounded border border-gray-600 focus:border-blue-500" 
                    />
                  </td>
                </tr>
              ))}
              <tr>
                {costMatrix[0].map((_, j) => (
                  <td key={j}></td>
                ))}
                <td className="pl-2 text-xs sm:text-sm text-gray-400 whitespace-nowrap">Demand:</td>
                <td></td>
              </tr>
              <tr>
                {demand.map((val, j) => (
                  <td key={j}>
                    <input 
                      type="number" 
                      value={demand[j]} 
                      onChange={(e) => handleDemandChange(j, e.target.value)} 
                      className="w-12 sm:w-16 bg-gray-700 text-white px-1 py-1 text-center rounded border border-gray-600 focus:border-blue-500" 
                    />
                  </td>
                ))}
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mb-4">
          <button 
            onClick={handlereset} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Results section */}
        <div className="flex flex-col w-full">
          {activeMethod === "runall" ? (
            <>
              {renderResultTable("Metode Barat Laut", results.barat_laut)}
              {renderOptimizationDetails(results.barat_laut)}

              {renderResultTable("Metode Biaya Terendah", results.biaya_terendah)}
              {renderOptimizationDetails(results.biaya_terendah)}

              {renderResultTable("Metode Vogel", results.vogel)}
              {renderOptimizationDetails(results.vogel)}
            </>
          ) : (
            <>
              {renderResultTable(`Metode ${activeMethod?.replace("_", " ")}`, results[activeMethod])}
              {activeMethod === "vogel" && results.vogel && renderVogelSteps(results.vogel.steps)}
              {showOptimize && results.optimize && renderResultTable("Optimalisasi", results.optimize)}
            </>
          )}
        </div>

        {/* Action buttons - responsive grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <button 
            onClick={() => handleSubmit("barat_laut")} 
            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            Barat Laut
          </button>
          <button 
            onClick={() => handleSubmit("biayaterendah")} 
            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            Biaya Terendah
          </button>
          <button 
            onClick={() => handleSubmit("vogel")} 
            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            Vogel
          </button>
          <button 
            onClick={handleOptimize} 
            className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            Optimalisasi
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button 
            onClick={handleRunall} 
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            Run All
          </button>
        </div>
      </div>
    </div>
  );
}

export default BiayaT;
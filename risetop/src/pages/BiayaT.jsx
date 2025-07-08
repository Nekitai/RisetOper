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
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
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
      const res = await fetch(`http://localhost:5000/optimize`, {
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
      const res = await fetch("http://localhost:5000/runall", {
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
      <div className="mt-4 w-full px-4">
        <h4 className="text-md font-semibold text-center mb-2">Detail Optimalisasi</h4>

        <div className="flex flex-col md:flex-row justify-around gap-6 text-sm">
          <div>
            <h5 className="font-bold mb-1">Nilai u:</h5>
            <ul className="list-disc pl-5">
              {result.u.map((val, i) => (
                <li key={i}>
                  u{i} = {val !== null ? val : "∅"}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-1">Nilai v:</h5>
            <ul className="list-disc pl-5">
              {result.v.map((val, j) => (
                <li key={j}>
                  v{j} = {val !== null ? val : "∅"}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-1">Δ (Delta):</h5>
            <table className="border border-gray-500">
              <tbody>
                {result.delta.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j} className={`border px-3 py-1 text-center ${val !== null && val < 0 ? "text-red-400 font-bold" : ""}`}>
                        {val !== null ? val : "∅"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-yellow-300 font-semibold">Status: {result.is_optimal ? "✅ Solusi Sudah Optimal" : "❌ Belum Optimal"}</p>
      </div>
    );
  };

  const renderResultTable = (title, result) => {
    if (!result) return null;
    return (
      <div className="w-full md:w-1/3 px-2 mt-4">
        <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
        <table className="border border-gray-500 mb-2 mx-auto">
          <tbody>
            {result.allocation.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j} className="border px-3 py-1 text-center">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-md text-center">
          Total Cost: <span className="text-green-400 font-bold">{result.total_cost}</span>
        </p>
        {title === "Optimalisasi" && renderOptimizationDetails(result)}
      </div>
    );
  };

  return (
    <div className="items-center justify-center flex flex-col py-36 text-white">
      <h2 className="text-xl font-bold mb-4">Input Data Transportasi</h2>
      <div className="flex gap-4 mb-4">
        <div>
          <label>Jumlah Baris (Supply): </label>
          <input type="number" value={rows} min="1" onChange={(e) => setRows(Number(e.target.value))} className="text-white px-2 py-1" />
        </div>
        <div>
          <label>Jumlah Kolom (Demand): </label>
          <input type="number" value={cols} min="1" onChange={(e) => setCols(Number(e.target.value))} className="text-white px-2 py-1" />
        </div>
        <button onClick={updateDimensions} className="px-3 py-1 bg-blue-600 rounded">
          Terapkan Ukuran
        </button>
      </div>

      <div className="overflow-auto">
        <table className="border border-gray-500">
          <tbody>
            {costMatrix.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => (
                  <td key={j} className="border px-2 py-1">
                    <input type="number" value={costMatrix[i][j]} onChange={(e) => handleCostChange(i, j, e.target.value)} className="w-16 white px-1" />
                  </td>
                ))}
                <td className="pl-2 text-sm text-gray-400">Supply:</td>
                <td>
                  <input type="number" value={supply[i]} onChange={(e) => handleSupplyChange(i, e.target.value)} className="w-16 text-white px-1" />
                </td>
              </tr>
            ))}
            <tr>
              {costMatrix[0].map((_, j) => (
                <React.Fragment key={j}>
                  <td></td>
                </React.Fragment>
              ))}
              <td className="pl-2 text-sm text-gray-400">Demand →</td>
              {demand.map((val, j) => (
                <td key={j}>
                  <input type="number" value={demand[j]} onChange={(e) => handleDemandChange(j, e.target.value)} className="w-16 text-white px-1" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={handlereset} className="mt-4 px-6 py-2 bg-red-600 hover:bg-gray-700 rounded">
        Reset
      </button>

      <div className="flex flex-wrap justify-center w-full">
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
            {showOptimize && results.optimize && renderResultTable("Optimalisasi", results.optimize)}
          </>
        )}
      </div>

      <div className="items-center mt-4 grid grid-cols-4 gap-4">
        <button onClick={() => handleSubmit("barat_laut")} className="mt-6 px-6 py-2 bg-green-600 hover:bg-blue-700 rounded">
          Barat Laut
        </button>
        <button onClick={() => handleSubmit("biayaterendah")} className="mt-6 px-6 py-2 bg-green-600 hover:bg-blue-700 rounded">
          Biaya Terendah
        </button>
        <button onClick={() => handleSubmit("vogel")} className="mt-6 px-6 py-2 bg-green-600 hover:bg-blue-700 rounded">
          Vogel
        </button>
        <button onClick={handleOptimize} className="mt-6 px-6 py-2 bg-green-600 hover:bg-blue-700 rounded">
          Optimalisasi
        </button>
      </div>
      <button onClick={handleRunall} className="mt-6 px-6 py-2 bg-green-600 hover:bg-blue-700 rounded">
        Run All
      </button>
    </div>
  );
}

export default BiayaT;

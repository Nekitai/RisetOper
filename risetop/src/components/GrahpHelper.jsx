function generateLinesFromConstraints(constraints, objectiveCoefficients, solutionPoint) {
  if (objectiveCoefficients.length !== 2)
    return {
      constraintLines: [],
      objectiveLine: [],
      solutionPoint: null,
      xMax: 10,
      yMax: 10,
    };

  const constraintLines = constraints.map((constraint) => {
    if (constraint.coefficients.length !== 2) return [];

    const [a, b] = constraint.coefficients;
    const c = constraint.rhs;
    const points = [];

    if (b !== 0) {
      // Garis normal: ax + by = c => y = (c - ax) / b
      for (let x = 0; x <= 100; x += 0.5) {
        const y = (c - a * x) / b;
        if (y >= 0 && y <= 100) {
          points.push({ x, y });
        }
      }
    } else if (a !== 0) {
      // Garis vertikal: a ≠ 0 dan b = 0 => x = c / a
      const x = c / a;
      if (x >= 0 && x <= 100) {
        points.push({ x, y: 0 });
        points.push({ x, y: 100 });
      }
    }

    return points.length >= 2 ? points : [];
  });

  const [c1, c2] = objectiveCoefficients;
  const z = c1 * solutionPoint.x + c2 * solutionPoint.y;
  const objectiveLine = [];

  if (c2 !== 0) {
    // Garis tujuan (bukan vertikal)
    for (let x = 0; x <= 100; x += 0.5) {
      const y = (z - c1 * x) / c2;
      if (y >= 0 && y <= 100) {
        objectiveLine.push({ x, y });
      }
    }
  } else if (c1 !== 0) {
    // Garis tujuan vertikal
    const x = z / c1;
    if (x >= 0 && x <= 100) {
      objectiveLine.push({ x, y: 0 });
      objectiveLine.push({ x, y: 100 });
    }
  }

  const allPoints = [...constraintLines.flat(), ...objectiveLine, solutionPoint];
  const xMax = Math.ceil(Math.max(...allPoints.map((p) => p.x)));
  const yMax = Math.ceil(Math.max(...allPoints.map((p) => p.y)));

  return {
    constraintLines: constraintLines.filter((line) => line.length > 0),
    objectiveLine: objectiveLine.length >= 2 ? objectiveLine : [],
    solutionPoint,
    xMax,
    yMax,
  };
}

export default generateLinesFromConstraints;

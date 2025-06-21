function generateLinesFromConstraints(constraints, objectiveCoefficients, solutionPoint) {
  if (objectiveCoefficients.length !== 2) return { constraintLines: [], objectiveLine: [] };

  const constraintLines = constraints.map((constraint) => {
    if (constraint.coefficients.length !== 2) return [];

    const [a, b] = constraint.coefficients;
    const c = constraint.rhs;
    const points = [];

    for (let x = 0; x <= 20; x += 0.5) {
      if (b !== 0) {
        const y = (c - a * x) / b;
        if (y >= 0 && y <= 20) points.push({ x, y });
      }
    }

    return points.length >= 2 ? points : [];
  });

  const [c1, c2] = objectiveCoefficients;
  const z = c1 * solutionPoint.x + c2 * solutionPoint.y;
  const objectiveLine = [];

  for (let x = 0; x <= 20; x += 0.5) {
    if (c2 !== 0) {
      const y = (z - c1 * x) / c2;
      if (y >= 0 && y <= 20) objectiveLine.push({ x, y });
    }
  }

  return {
    constraintLines: constraintLines.filter(line => line.length > 0),
    objectiveLine: objectiveLine.length >= 2
      ? objectiveLine
      : [],
    solutionPoint: solutionPoint,
    xMax: 20,
    yMax: 20,
  };
}

export default generateLinesFromConstraints;


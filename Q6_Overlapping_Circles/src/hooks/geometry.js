export function doCirclesOverlap(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) < a.r + b.r;
}

export function getOverlappingIds(circles) {
  const overlapping = new Set();
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      if (doCirclesOverlap(circles[i], circles[j])) {
        overlapping.add(circles[i].id);
        overlapping.add(circles[j].id);
      }
    }
  }
  return overlapping;
}

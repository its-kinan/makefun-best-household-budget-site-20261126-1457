// charts.js — hand-rolled SVG charts. No library, no canvas, no network.
// Both builders take already-computed numbers and return an SVG string.

function polar(cx, cy, radius, angleDegrees) {
  const angle = (angleDegrees - 90) * Math.PI / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const [x1, y1] = polar(cx, cy, radius, startAngle);
  const [x2, y2] = polar(cx, cy, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
}

// Donut of spending by category. `slices` = [{ name, value, color }].
// The centre label is the total, passed in already summed by the caller.
export function donutChart(slices, centreLabel, centreSub) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = 110;
  const cy = 110;
  const radius = 88;
  let angle = 0;
  let paths = '';
  for (const slice of slices) {
    if (slice.value <= 0) continue;
    const sweep = slice.value / total * 360;
    // A hairline gap between slices so neighbours stay readable.
    const start = angle + 0.6;
    const end = angle + sweep - 0.6;
    if (end > start) paths += `<path d="${arcPath(cx, cy, radius, start, end)}" fill="${slice.color}"><title>${slice.name}: ${slice.value}</title></path>`;
    angle += sweep;
  }
  return `<svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Donat belanja per kategori">
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#f0ece2"></circle>
    ${paths}
    <circle cx="${cx}" cy="${cy}" r="58" fill="#ffffff"></circle>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="15" font-weight="800" fill="#1d2b26" class="donut-center">${centreLabel}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11.5" fill="#4c5d55">${centreSub}</text>
  </svg>`;
}

// Vertical bars for weekly spending. `bars` = [{ label, sub, value }].
export function barChart(bars, maxLabel) {
  const width = 520;
  const height = 220;
  const base = 190;
  const top = 24;
  const max = Math.max(...bars.map((b) => b.value), 1);
  const slot = width / bars.length;
  const barWidth = Math.min(72, slot * 0.52);
  let shapes = '';
  let labels = '';
  bars.forEach((bar, i) => {
    const h = Math.max(4, (bar.value / max) * (base - top));
    const x = slot * i + (slot - barWidth) / 2;
    const y = base - h;
    shapes += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${h.toFixed(1)}" rx="5" fill="#0e5d4b"><title>${bar.label}: ${bar.value}</title></rect>`;
    shapes += `<text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - 7).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#1d2b26">${maxLabel(bar.value)}</text>`;
    labels += `<text x="${(slot * i + slot / 2).toFixed(1)}" y="210" text-anchor="middle" font-size="12.5" fill="#4c5d55">${bar.label} (${bar.sub})</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" role="img" aria-label="Grafik batang belanja mingguan" style="display:block">
    <line x1="0" y1="${base}" x2="${width}" y2="${base}" stroke="#e3ddd0" stroke-width="1"></line>
    ${shapes}
    ${labels}
  </svg>`;
}

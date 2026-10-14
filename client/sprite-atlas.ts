/** Pure atlas sampling, shared by the renderer and regression tests. */
export type AtlasFrame = { x: number; y: number; w: number; h: number; time: number };
export type AtlasMetadata = {
  cellWidth: number; cellHeight: number; columns: number; rows: number;
  duration: number; loop: boolean; directionsDegrees: number[];
  anchor: { x: number; y: number }; frames: AtlasFrame[][];
  camera?: { orthographicHeight: number; azimuthDegrees?: number };
};

export function validateAtlas(value: unknown): AtlasMetadata {
  const a = value as AtlasMetadata;
  if (!a || ![a.cellWidth, a.cellHeight, a.columns, a.rows].every(n => Number.isInteger(n) && n > 0)
    || !Number.isFinite(a.duration) || a.duration <= 0 || typeof a.loop !== 'boolean'
    || !Array.isArray(a.directionsDegrees) || a.directionsDegrees.length !== a.rows
    || !a.directionsDegrees.every(Number.isFinite) || new Set(a.directionsDegrees).size !== a.rows
    || (a.camera && (!Number.isFinite(a.camera.orthographicHeight) || a.camera.orthographicHeight <= 0))
    || !a.anchor || !Number.isFinite(a.anchor.x) || !Number.isFinite(a.anchor.y)
    || a.anchor.x < 0 || a.anchor.x > a.cellWidth || a.anchor.y < 0 || a.anchor.y > a.cellHeight
    || !Array.isArray(a.frames) || a.frames.length !== a.rows) throw new Error('Invalid atlas metadata');
  for (const row of a.frames) {
    if (!Array.isArray(row) || row.length !== a.columns) throw new Error('Invalid atlas frame count');
    let previous = -1;
    for (const f of row) {
      if (!f || ![f.x, f.y, f.w, f.h].every(Number.isInteger) || f.x < 0 || f.y < 0
        || f.w !== a.cellWidth || f.h !== a.cellHeight
        || f.x + f.w > a.columns * a.cellWidth || f.y + f.h > a.rows * a.cellHeight
        || !Number.isFinite(f.time) || f.time < 0 || f.time < previous || f.time > a.duration) throw new Error('Invalid atlas frame');
      previous = f.time;
    }
  }
  return a;
}

export function atlasFrame(a: AtlasMetadata, seconds: number, direction: number): AtlasFrame {
  const row = a.frames[((direction % a.rows) + a.rows) % a.rows];
  const t = a.loop ? Math.max(0, seconds) % a.duration : Math.min(a.duration, Math.max(0, seconds));
  let frame = row[0];
  for (const f of row) { if (f.time > t) break; frame = f; }
  return frame;
}

export function atlasUV(a: AtlasMetadata, frame: AtlasFrame) {
  const width = a.cellWidth * a.columns, height = a.cellHeight * a.rows;
  // Keep sampling inside the texel centres, including when minified or rotated.
  return { x: (frame.x + 0.5) / width, y: 1 - (frame.y + frame.h - 0.5) / height,
    w: (frame.w - 1) / width, h: (frame.h - 1) / height };
}

export function atlasDirection(a: AtlasMetadata, facing: number, cameraYaw: number) {
  // Simulation forward is +X, models forward +Z; baked camera is at azimuth 45°.
  const degrees = (-facing - cameraYaw + (a.camera?.azimuthDegrees ?? 45) * Math.PI / 180 + Math.PI / 2) * 180 / Math.PI;
  let nearest = 0, distance = Infinity;
  a.directionsDegrees.forEach((angle, i) => {
    const d = Math.abs(((angle - degrees) % 360 + 540) % 360 - 180);
    if (d < distance) { distance = d; nearest = i; }
  });
  return nearest;
}

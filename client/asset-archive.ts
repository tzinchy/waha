// Small ZIP writer (stored entries) so PNG and frame metadata download together.
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let bit = 0; bit < 8; bit++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c >>> 0;
}
function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const b of bytes) crc = crcTable[(crc ^ b) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
export function assetArchive(entries: { name: string; data: Uint8Array<ArrayBuffer> }[]) {
  const parts: BlobPart[] = [], directory: BlobPart[] = [];
  let offset = 0, directorySize = 0;
  for (const entry of entries) {
    const name = new TextEncoder().encode(entry.name), crc = crc32(entry.data);
    const local = new Uint8Array(30), l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x800, true); l.setUint16(12, 33, true);
    l.setUint32(14, crc, true); l.setUint32(18, entry.data.length, true); l.setUint32(22, entry.data.length, true); l.setUint16(26, name.length, true);
    parts.push(local, name, entry.data);
    const central = new Uint8Array(46), c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x800, true); c.setUint16(14, 33, true);
    c.setUint32(16, crc, true); c.setUint32(20, entry.data.length, true); c.setUint32(24, entry.data.length, true); c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
    directory.push(central, name); directorySize += central.length + name.length; offset += local.length + name.length + entry.data.length;
  }
  const end = new Uint8Array(22), e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, entries.length, true); e.setUint16(10, entries.length, true); e.setUint32(12, directorySize, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], { type: 'application/zip' });
}

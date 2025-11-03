import React, { useRef } from 'react';

interface PieceData {
  id: number;
  x: number; // posición actual X en px dentro del área del puzzle
  y: number; // posición actual Y en px dentro del área del puzzle
  targetX: number; // posición objetivo
  targetY: number;
  imageX: number; // columna en la imagen
  imageY: number; // fila en la imagen
  tabs: { top: number; right: number; bottom: number; left: number };
}

interface Props {
  imageSrc: string;
  piece: PieceData | undefined;
  pieceSize: number;
  gridSize: number;
  zIndex?: number;
  isDragging?: boolean;
  onDragStart: (id: number, pointerX: number, pointerY: number, offsetX: number, offsetY: number) => void;
  onDragMove: (id: number, pointerX: number, pointerY: number) => void;
  onDragEnd: (id: number, pointerX: number, pointerY: number) => void;
}

function generatePiecePath(size: number, tabs: { top: number; right: number; bottom: number; left: number }) {
  const w = size;
  const h = size;
  const t = Math.max(6, Math.round(size * 0.18));
  const cx = w / 2;
  const cy = h / 2;

  let d = `M 0 0 `;

  // Top
  if (tabs.top === 0) d += `L ${w} 0 `;
  else {
    const dir = tabs.top;
    const tabW = t * 1.6;
    const x1 = (w - tabW) / 2;
    const x2 = x1 + tabW;
    const by = dir * t;
    d += `L ${x1} 0 `;
    d += `C ${x1 + tabW * 0.08} 0 ${cx - tabW * 0.15} ${by} ${cx} ${by} `;
    d += `C ${cx + tabW * 0.15} ${by} ${x2 - tabW * 0.08} 0 ${x2} 0 `;
    d += `L ${w} 0 `;
  }

  // Right
  if (tabs.right === 0) d += `L ${w} ${h} `;
  else {
    const dir = tabs.right;
    const tabW = t * 1.6;
    const y1 = (h - tabW) / 2;
    const y2 = y1 + tabW;
    const bx = w + dir * t;
    d += `L ${w} ${y1} `;
    d += `C ${w} ${y1 + tabW * 0.08} ${bx} ${cy - tabW * 0.15} ${bx} ${cy} `;
    d += `C ${bx} ${cy + tabW * 0.15} ${w} ${y2 - tabW * 0.08} ${w} ${y2} `;
    d += `L ${w} ${h} `;
  }

  // Bottom
  if (tabs.bottom === 0) d += `L 0 ${h} `;
  else {
    const dir = tabs.bottom;
    const tabW = t * 1.6;
    const x1 = (w + tabW) / 2;
    const x2 = x1 - tabW;
    const by = h + dir * t;
    const midx = cx;
    d += `L ${x1} ${h} `;
    d += `C ${x1 - tabW * 0.08} ${h} ${midx - tabW * 0.15} ${by} ${midx} ${by} `;
    d += `C ${midx + tabW * 0.15} ${by} ${x2 + tabW * 0.08} ${h} ${x2} ${h} `;
    d += `L 0 ${h} `;
  }

  // Left
  if (tabs.left === 0) d += `Z`;
  else {
    const dir = tabs.left;
    const tabW = t * 1.6;
    const y1 = (h + tabW) / 2;
    const y2 = y1 - tabW;
    const bx = 0 + dir * t;
    d += `L 0 ${y1} `;
    d += `C 0 ${y1 - tabW * 0.08} ${bx} ${cy + tabW * 0.15} ${bx} ${cy} `;
    d += `C ${bx} ${cy - tabW * 0.15} 0 ${y2 + tabW * 0.08} 0 ${y2} `;
    d += `Z`;
  }

  return d;
}

export default function PuzzlePiece({ imageSrc, piece, pieceSize, gridSize, zIndex = 1, isDragging = false, onDragStart, onDragMove, onDragEnd }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  if (!piece) {
    return <div style={{ width: `${pieceSize}px`, height: `${pieceSize}px` }} />;
  }

  const row = piece.imageY;
  const col = piece.imageX;

  // Use tabs provided by the parent so edges are complementary between neighbors
  const { top, right, bottom, left } = piece.tabs;
  const path = generatePiecePath(pieceSize, { top, right, bottom, left });
  const clipId = `puzzle-clip-${piece.id}`;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const target = ref.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    (e.target as Element).setPointerCapture(e.pointerId);
    onDragStart(piece.id, e.clientX, e.clientY, offsetX, offsetY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if ((e.buttons ?? 0) === 0) return;
    onDragMove(piece.id, e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try { (e.target as Element).releasePointerCapture(e.pointerId); } catch {}
    onDragEnd(piece.id, e.clientX, e.clientY);
  };

  return (
    <div
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="button"
      aria-label={`Pieza ${piece.id}`}
      style={{
        position: 'absolute',
        left: `${piece.x}px`,
        top: `${piece.y}px`,
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
        zIndex: zIndex,
        touchAction: 'none',
        cursor: 'grab',
      }}
      className={`${isDragging ? 'scale-105 shadow-2xl' : ''}`}
    >
      <svg width={pieceSize} height={pieceSize} viewBox={`0 0 ${pieceSize} ${pieceSize}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={path} />
          </clipPath>
        </defs>

        <image
          href={imageSrc}
          x={-piece.imageX * pieceSize}
          y={-piece.imageY * pieceSize}
          width={pieceSize * gridSize}
          height={pieceSize * gridSize}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />

        <path d={path} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} pointerEvents="none" />
      </svg>
    </div>
  );
}

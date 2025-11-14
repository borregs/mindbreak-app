import React, { useRef } from 'react';

interface PieceData {
  id: number;
  x: number; // posición actual X en px dentro del área del puzzle
  y: number; // posición actual Y en px dentro del área del puzzle
  targetX: number; // posición objetivo
  targetY: number;
  imageX: number; // columna en la imagen
  imageY: number; // fila en la imagen
  // tabs removed — pieces are simple squares now
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
  onSelect?: (id: number) => void;
}

function generatePiecePath(size: number) {
  const w = size;
  const h = size;
  // Simple rectangle path (no tabs) for square pieces
  return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
}

export default function PuzzlePiece({ imageSrc, piece, pieceSize, gridSize, zIndex = 1, isDragging = false, onDragStart, onDragMove, onDragEnd, onSelect }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  if (!piece) {
    return <div style={{ width: `${pieceSize}px`, height: `${pieceSize}px` }} />;
  }

  const row = piece.imageY;
  const col = piece.imageX;

  // Simple square piece path
  const path = generatePiecePath(pieceSize);
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
      onClick={() => piece && typeof onSelect === 'function' && onSelect(piece.id)}
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

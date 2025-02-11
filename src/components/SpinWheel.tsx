import React, { useRef, useState, useEffect } from 'react';

interface SpinWheelProps {
  options: string[];
  onSelect: (selection: string) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ options, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);          // Current rotation (degrees)
  const [spinVelocity, setSpinVelocity] = useState(0);  // Spin speed
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Each slice angle (radians)
  const sliceAngle = (2 * Math.PI) / options.length;

  // Draw wheel slices & text
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);
    const radius = size / 2;       // Wheel radius
    const centerX = size / 2;
    const centerY = size / 2;

    ctx.clearRect(0, 0, size, size);

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEEAD', '#D4A5A5', '#9ED2C6', '#FFB6B9'
    ];

    for (let i = 0; i < options.length; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Draw the slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.closePath();

      // Optional slice border
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Add text
      ctx.save();
      ctx.translate(centerX, centerY);
      // Rotate so text appears centered in slice
      const textAngle = startAngle + sliceAngle / 2;
      ctx.rotate(textAngle);

      // Center text horizontally & vertically
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px sans-serif';

      // Draw text closer to center so it doesn't clip
      ctx.fillText(options[i], radius * 0.6, 0);
      ctx.restore();
    }
  };

  // Redraw when rotation changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = Math.min(canvas.width, canvas.height);

    // Rotate canvas by `rotation` degrees
    ctx.save();
    ctx.clearRect(0, 0, size, size);

    const rotationInRadians = (rotation * Math.PI) / 180;
    ctx.translate(size / 2, size / 2);
    ctx.rotate(rotationInRadians);
    ctx.translate(-size / 2, -size / 2);

    drawWheel();
    ctx.restore();
  }, [rotation]);

  // Spin animation using requestAnimationFrame
  useEffect(() => {
    let animFrame: number;
  
    const animate = () => {
      if (spinVelocity > 0.1) {
        // Keep spinning
        setRotation((prev) => (prev + spinVelocity) % 360);
        setSpinVelocity((prev) => prev * 0.97); // friction
        animFrame = requestAnimationFrame(animate);
      } else {
        // Wheel stops
        setSpinVelocity(0);
        setIsSpinning(false);
  
        // -- START of corrected selection logic --
        const pointerAngle = 245; // if pointer is visually at top
        const degreesPerSlice = 360 / options.length;
  
        let finalRotation = rotation % 360;
        if (finalRotation < 0) finalRotation += 360;
  
        let angleToPointer = (pointerAngle - finalRotation + 360) % 360;
        // Round to the closest slice center
        angleToPointer = (angleToPointer + degreesPerSlice / 2) % 360;
  
        let index = Math.floor(angleToPointer / degreesPerSlice);
        // -- END of corrected selection logic --
  
        setSelectedIndex(index);
        onSelect(options[index]);
      }
    };
  
    if (isSpinning) {
      animFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isSpinning, spinVelocity, rotation, options, onSelect]);
  
  // Start the spin
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Give a random initial velocity
    setSpinVelocity(20 + Math.random() * 15);
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '400px', 
      margin: '0 auto',
      padding: '0 15px' 
    }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ 
          display: 'block', 
          margin: '0 auto',
          width: '100%',
          height: 'auto',
          maxWidth: '400px'
        }}
      />

      {/* Updated Pointer */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: 'min(20px, 5vw) solid transparent',
          borderRight: 'min(20px, 5vw) solid transparent',
          borderTop: 'min(30px, 7.5vw) solid #dc3545',
          zIndex: 3,
        }}
      />

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="btn btn-primary btn-block mt-3"
        style={{ width: '100%' }}
      >
        {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
      </button>

      {selectedIndex !== null && !isSpinning && (
        <div className="mt-3 text-center">
          <strong>Current Selection: </strong>
          {options[selectedIndex]}
        </div>
      )}
    </div>
  );
};

export default SpinWheel;

import { useCallback, useRef, useEffect, useState } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatLabel?: (value: number) => string;
  label?: string;
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel = (v) => String(v),
  label = 'Range',
}: RangeSliderProps) {
  const [minVal, maxVal] = value;
  const range = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);

  // Convert value to percentage
  const getPercent = useCallback(
    (val: number) => Math.round(((val - min) / (max - min)) * 100),
    [min, max]
  );

  // Update the range track fill
  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxVal - step);
    onChange([newMin, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minVal + step);
    onChange([minVal, newMax]);
  };

  return (
    <div className="relative pt-1 pb-4">
      {/* Track background */}
      <div className="h-2 bg-gray-200 rounded-full relative">
        {/* Active range fill */}
        <div
          ref={range}
          className="absolute h-2 bg-primary-500 rounded-full"
        />
      </div>

      {/* Min thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        onMouseDown={() => setDragging('min')}
        onMouseUp={() => setDragging(null)}
        onTouchStart={() => setDragging('min')}
        onTouchEnd={() => setDragging(null)}
        aria-label={`Minimum ${label}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={minVal}
        aria-valuetext={formatLabel(minVal)}
        className="range-thumb absolute w-full h-2 top-1 appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-primary-500
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-primary-500
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer"
        style={{ zIndex: dragging === 'min' ? 5 : minVal > max - 100 ? 5 : 3 }}
      />

      {/* Max thumb */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        onMouseDown={() => setDragging('max')}
        onMouseUp={() => setDragging(null)}
        onTouchStart={() => setDragging('max')}
        onTouchEnd={() => setDragging(null)}
        aria-label={`Maximum ${label}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={maxVal}
        aria-valuetext={formatLabel(maxVal)}
        className="range-thumb absolute w-full h-2 top-1 appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-primary-500
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:h-5
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-primary-500
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer"
        style={{ zIndex: dragging === 'max' ? 5 : 4 }}
      />

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{formatLabel(minVal)}</span>
        <span>{formatLabel(maxVal)}</span>
      </div>
    </div>
  );
}

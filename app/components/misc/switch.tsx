"use client";

interface SwitchProps {
  label?: string;
  onChange: (checked: boolean) => void;
  value: boolean
}

export default function Switch({ label, onChange, value}: SwitchProps) {

  const handleToggle = () => {
    const newState = !value;
    onChange(newState);
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      {/* Hidden Native Checkbox for Accessibility */}
      <input 
        type="checkbox" 
        checked={value} 
        onChange={handleToggle}        
        className="sr-only" 
      />
      
      {/* Switch Track */}
      <div 
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
          value ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        {/* Switch Knob */}
        <div 
          className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>

      {/* Optional Label */}
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    </label>
  );
}

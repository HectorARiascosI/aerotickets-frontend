import { FaCalendarAlt } from "react-icons/fa";

interface DateSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function DateSelector({ value, onChange, label }: DateSelectorProps) {
  // Obtener la fecha mínima (hoy)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Obtener la fecha máxima (1 año desde hoy)
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <FaCalendarAlt className="inline mr-2 text-success" />
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={minDate}
        max={maxDate}
        className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-success focus:border-transparent transition-all cursor-pointer"
        style={{
          colorScheme: 'light',
        }}
      />
    </div>
  );
}

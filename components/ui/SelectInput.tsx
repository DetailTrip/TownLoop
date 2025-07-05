import React from 'react';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

export default function SelectInput({ label, id, name, options, error, required, ...rest }: SelectInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select 
        id={id} 
        name={name} 
        className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        {...rest}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
    </div>
  );
}

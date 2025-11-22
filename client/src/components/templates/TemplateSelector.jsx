import React from "react";

const TemplateSelector = ({ onSelectTemplate }) => {
  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select a Template
      </label>

      <select
        className="
          w-full border border-gray-300 rounded-md p-3 bg-white 
          shadow-sm focus:outline-none focus:ring-2 
          focus:ring-[#0A66C2] focus:border-[#0A66C2]
          text-gray-700
        "
        onChange={(e) => onSelectTemplate(e.target.value)}
      >
        <option value="">-- Choose Template --</option>
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;

import React from "react";

const TemplateForm = ({ template, onSubmit, isEdit = false }) => {
  return (
    <form>
      {/* Template Form - Form for creating/editing templates (name, content, variables) */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Live Preview
        </h2>

        <h3 className="text-lg font-medium">{template.name}</h3>

        <p className="text-gray-600 mt-2 whitespace-pre-line">
          {template.text || "Start typing the template to see preview"}
        </p>

        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Detected Variables:</h4>
          <ul className="text-sm text-gray-600 mt-2">
            {template.variables.map((v) => (
              <li key={v}>• {v}</li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
};

export default TemplateForm;

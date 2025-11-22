import React from "react";

const TemplateCard = ({ template, onSelect }) => {
  return (
    // Outer container centers the card. min-h-[60vh] keeps it vertically centered without forcing full-screen.
    <div className="flex items-center justify-center w-full min-h-[60vh] px-4">
      <div className="w-full max-w-3xl bg-white round-[16px] border border-gray-200 shadow-lg p-8 hover:shadow-2xl transition-all duration-200 rounded-2xl ">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-3">
          {template?.title ?? "Untitled Template"}
        </h2>

        <p className="text-base md:text-lg text-gray-600 mb-6">
          {template?.preview ?? "No preview available."}
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSelect && onSelect(template)}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
          >
            Select Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
//

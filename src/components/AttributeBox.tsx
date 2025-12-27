import React from "react";

interface AttributeBoxProps {
  label: string;
  value: string;
}

const AttributeBox: React.FC<AttributeBoxProps> = ({ label, value }) => (
  <div className="p-4 bg-white border border-slate-200 rounded-lg">
    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block mb-1">
      {label}
    </span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

export default AttributeBox;

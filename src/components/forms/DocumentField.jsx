import React from "react";

const DocumentField = ({
    name,
    label,
    accept,
    multiple = false,
    renderStatus,
    onChange,
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <div className="flex items-center gap-3">
            {renderStatus()}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition-colors">
                {multiple ? "Upload Files" : "Upload File"}
                <input
                    type="file"
                    name={name}
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={onChange}
                />
            </label>
        </div>
    </div>
);

export default DocumentField;

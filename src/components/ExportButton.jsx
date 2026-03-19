import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, FileSpreadsheet, FileText, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ExportButton = ({ data, filename = "export", columns }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExportExcel = () => {
        // 1. Filter data based on columns if provided, otherwise export all
        // If columns (headers) are provided, we should probably map them.
        // For simplicity, verify if data is array of objects.

        if (!data || data.length === 0) {
            alert("No data to export");
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
        setIsOpen(false);
    };

    const handleExportPDF = () => {
        if (!data || data.length === 0) {
            alert("No data to export");
            return;
        }

        const doc = new jsPDF();

        // Extract headers (keys) from first object or use columns prop
        const headers = columns ? columns : Object.keys(data[0]);
        const tableData = data.map(row => Object.values(row));

        doc.text(`${filename} Report`, 14, 15);
        autoTable(doc, {
            head: [headers],
            body: tableData,
            startY: 20,
        });

        doc.save(`${filename}.pdf`);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Upload className="w-4 h-4" />
                Export
                <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-[9999] transform origin-top animate-in fade-in slide-in-from-top-2">
                    <button
                        onClick={handleExportExcel}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                    >
                        <div className="p-1.5 bg-green-100 rounded-md">
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                        </div>
                        Export as Excel
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                    >
                        <div className="p-1.5 bg-red-100 rounded-md">
                            <FileText className="w-4 h-4 text-red-600" />
                        </div>
                        Export as PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExportButton;

import React from 'react';
import axios from 'axios';
import { FileDown, FileText, BarChart, Printer, Clock, FileSpreadsheet } from 'lucide-react';

// Card component for individual reports
const ReportCard = ({ name, downloadUrl, icon: Icon, description }) => {
    const handleDownload = async (url) => {
        try {
            const response = await axios.get(url, { responseType: 'blob' });
            const blob = new Blob([response.data]);
            const link = document.createElement('a');

            link.href = window.URL.createObjectURL(blob);
            link.download = name + ".pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-50 p-3 rounded-full">
                    <Icon size={24} className="text-amber-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-amber-800">{name}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{description}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    Last updated: Today
                </span>
                <button
                    onClick={() => handleDownload(downloadUrl)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-200 flex items-center gap-2"
                >
                    <FileDown size={16} />
                    Download
                </button>
            </div>
        </div>
    );
};

function Reports() {
    // Sample reports data
    const reports = [
        {
            id: 1,
            name: "Stock Summary Report",
            icon: FileSpreadsheet,
            description: "Complete overview of current inventory levels and stock valuation",
            downloadUrl: "http://localhost:5000/api/product-management/report/stock-summary"
        },
        {
            id: 2,
            name: "Supplies Summary Report",
            icon: BarChart,
            description: "Analysis of supplier performance and delivery statistics",
            downloadUrl: "http://localhost:5000/api/product-management/report/supplier-stock"
        },
        {
            id: 3,
            name: "Quarterly Sales Report",
            icon: FileText,
            description: "Comprehensive breakdown of sales performance by quarter",
            downloadUrl: "http://localhost:5000/api/sales/report/quarterly"
        },
        {
            id: 4,
            name: "Inventory Valuation",
            icon: Printer,
            description: "Financial valuation of current inventory with depreciation data",
            downloadUrl: "http://localhost:5000/api/inventory/report/valuation"
        },
    ];

    return (
        <div className="min-h-screen bg-amber-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText size={32} className="text-amber-700" />
                        <h1 className="text-3xl font-bold text-amber-800">Business Reports</h1>
                    </div>
                    <p className="text-amber-700">Access and download all your important business reports</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reports.map((report) => (
                        <ReportCard
                            key={report.id}
                            name={report.name}
                            icon={report.icon}
                            description={report.description}
                            downloadUrl={report.downloadUrl}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reports;
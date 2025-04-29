import { AlertCircle } from "lucide-react";

const LowStockAlertCard = () => {
    const lowStockItems = [
        { id: 1, name: "Caramel Fudge", stock: 2 },
        { id: 2, name: "Hazelnut Pralines", stock: 3 },
        { id: 3, name: "Vanilla Cupcakes", stock: 1 },
        { id: 4, name: "Strawberry Macarons", stock: 4 },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-lg font-semibold mb-6 text-amber-800">Sweet Shortages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {lowStockItems.map((item) => (
                    <div key={item.id} className="border border-amber-200 bg-amber-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-600 mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-amber-900">{item.name}</p>
                                <p className="text-sm text-amber-700">Only {item.stock} left in stock</p>
                                <button className="text-amber-600 text-sm mt-2 hover:text-amber-700">
                                    Order Ingredients
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LowStockAlertCard;
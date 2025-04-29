import React, { useState, useEffect } from 'react';
import StockAddingForm from '../../components/Stock/StockAddingForm';
import StockDetails from '../../components/Stock/StockDetails';
import { Package, Boxes, Loader } from 'lucide-react';
import axios from 'axios';

const Stock = () => {
    const [stockEntries, setStockEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch stocks from the backend and update state with transformed data
    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:5000/api/product-management/stock')
            .then((response) => {
                if (response.data && response.data.stocks) {
                    const transformedStocks = response.data.stocks.map(stock => {
                        // Transform each stock to include the expected properties:
                        // Use current date as a placeholder if no date is provided,
                        // and use supplierId as the supplier (or transform as needed)
                        // Calculate totalValue by summing up product prices * quantity.
                        const totalValue = stock.products.reduce((acc, prod) => acc + (prod.price * prod.quantity), 0);
                        return {
                            id: stock.id,
                            date: new Date().toISOString().split("T")[0],
                            supplier: stock.supplierId,
                            products: stock.products.map(prod => ({
                                name: prod.product, // using product id as name if no name is provided
                                quantity: prod.quantity,
                                buyPrice: prod.price,
                                sellPrice: prod.sellingPrice
                            })),
                            totalValue: totalValue
                        };
                    });
                    setStockEntries(transformedStocks);
                }
            })
            .catch((error) => {
                console.error("Error fetching stocks:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleStockAdded = (newStockEntry) => {
        setStockEntries([newStockEntry, ...stockEntries]);
    };

    return (
        <div className="min-h-screen bg-amber-50 p-6 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <Package className="absolute top-20 left-10 w-16 h-16 text-amber-200 opacity-30 animate-float" />
                <Boxes className="absolute bottom-1/4 right-20 w-14 h-14 text-amber-200 opacity-30 animate-float-delay" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                <div className="text-left">
                    <h1 className="text-3xl font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <Boxes className="w-8 h-8" />
                        Inventory Management
                    </h1>
                    <p className="text-amber-600">Manage your product stock and suppliers</p>
                </div>

                <StockAddingForm onStockAdded={handleStockAdded} />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
                        <Loader className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                        <p className="text-amber-700 font-medium">Loading inventory data...</p>
                    </div>
                ) : (
                    <StockDetails stockEntries={stockEntries} />
                )}
            </div>

            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out 1.5s infinite;
        }
      `}</style>
        </div>
    );
};

export default Stock;
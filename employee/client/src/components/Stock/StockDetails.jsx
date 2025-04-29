import React, { useState, useEffect } from 'react';
import { Boxes, Truck } from 'lucide-react';
import axios from 'axios';

const StockDetails = ({ stockEntries }) => {
    const [productNames, setProductNames] = useState({});

    useEffect(() => {
        const fetchProductNames = async () => {
            const names = {};
            await Promise.all(
                stockEntries.flatMap(entry =>
                    entry.products.map(async (product) => {
                        try {
                            const response = await axios.get(`http://localhost:5000/api/product-management/product/${product.name}`);
                            if (response.data && response.data.product) {
                                names[product.name] = response.data.product.name;
                            } else {
                                names[product.name] = 'Unknown Product';
                            }
                        } catch (error) {
                            console.error("Error fetching product name:", error);
                            names[product.name] = 'Error Loading';
                        }
                    })
                )
            );
            setProductNames(names);
        };

        fetchProductNames();
    }, [stockEntries]);

    return (
        <div className="bg-white/95 rounded-lg shadow p-6 border border-amber-100 backdrop-blur-sm">
            <div className="text-left mb-6">
                <h2 className="text-2xl font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <Boxes className="w-6 h-6" />
                    Stock Inventory
                </h2>
                <p className="text-amber-600">View and manage your current stock entries</p>
            </div>

            <div className="space-y-6">
                {stockEntries.length === 0 ? (
                    <div className="text-center py-8 text-amber-600">
                        No stock entries found. Add your first stock entry above.
                    </div>
                ) : (
                    stockEntries.map((entry) => (
                        <div
                            key={entry.id}
                            className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-900">Stock Entry #{entry.id}</h3>
                                    <p className="text-sm text-amber-600 mb-2">
                                        Added on {entry.date} • Supplier: {entry.supplier}
                                    </p>
                                    <p className="text-amber-800 font-medium">
                                        Total Value: Rs.{entry.totalValue.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 border-t border-amber-100 pt-4">
                                <h4 className="text-md font-semibold text-amber-800 mb-3">Products:</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-amber-200">
                                        <thead className="bg-amber-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Product</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Quantity</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Buy Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Sell Price</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-amber-500 uppercase tracking-wider">Subtotal</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-200">
                                        {entry.products.map((product, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50">
                                                <td className="px-4 py-2 whitespace-nowrap text-amber-900">
                                                    {productNames[product.name] || 'Loading...'}
                                                </td>
                                                <td className="px-4 py-2 whitespace-nowrap text-amber-800">{product.quantity}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-amber-800">Rs.{product.buyPrice.toFixed(2)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-amber-800">Rs.{product.sellPrice.toFixed(2)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-amber-800">Rs.{(product.quantity * product.buyPrice).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StockDetails;
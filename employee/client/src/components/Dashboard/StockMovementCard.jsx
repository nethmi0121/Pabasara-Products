import { TrendingUp, TrendingDown } from "lucide-react";

const StockMovementCard = () => {
    const movementData = [
        { name: "Chocolate Truffles", category: "Chocolates", movement: "fast", change: "+42%" },
        { name: "Fruit Gummies", category: "Candies", movement: "fast", change: "+38%" },
        { name: "Sugar Cookies", category: "Bakery", movement: "slow", change: "-8%" },
        { name: "Marshmallow Pops", category: "Seasonal", movement: "slow", change: "-5%" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
            <h2 className="text-lg font-semibold mb-6 text-amber-800">Sweet Movement</h2>
            <div className="space-y-4">
                {movementData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-amber-900">{item.name}</p>
                            <p className="text-sm text-amber-600">{item.category}</p>
                        </div>
                        <div className={`flex items-center ${item.movement === 'fast' ? 'text-amber-600' : 'text-amber-500'}`}>
                            {item.movement === 'fast' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            <span className="ml-1">{item.change}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StockMovementCard;
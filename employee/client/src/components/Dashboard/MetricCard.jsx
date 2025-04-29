import { ArrowUp, ArrowDown } from "lucide-react";

const MetricCard = ({ title, value, change, trend, icon }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-amber-600">{title}</p>
                    <p className="text-2xl font-bold mt-2 text-amber-800">{value}</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                    {icon}
                </div>
            </div>
            <div className={`flex items-center mt-4 text-sm ${trend === 'up' ? 'text-amber-600' : 'text-amber-500'}`}>
                {trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1">{change}</span>
                <span className="text-amber-400 ml-2">vs last period</span>
            </div>
        </div>
    );
};

export default MetricCard;
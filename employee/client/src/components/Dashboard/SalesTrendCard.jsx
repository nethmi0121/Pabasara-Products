import { BarChart2, ChevronDown } from "lucide-react";

const SalesTrendCard = () => {
    const data = [30, 50, 70, 60, 90, 80, 100];
    const maxValue = Math.max(...data);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2 border border-amber-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-amber-800">Sweet Sales Trends</h2>
                <div className="relative">
                    <select className="text-sm border border-amber-200 rounded-md px-3 py-1 bg-white appearance-none pr-8 text-amber-700">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last quarter</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-2 top-2 text-amber-400 pointer-events-none" />
                </div>
            </div>

            <div className="h-64 flex flex-col justify-between">
                <div className="flex h-full">
                    <div className="flex flex-col justify-between mr-2 text-xs text-amber-400">
                        <span>100%</span>
                        <span>75%</span>
                        <span>50%</span>
                        <span>25%</span>
                        <span>0%</span>
                    </div>

                    <div className="relative flex-1">
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[0, 25, 50, 75, 100].map((percent) => (
                                <div
                                    key={percent}
                                    className="border-t border-amber-100"
                                    style={{ bottom: `${percent}%` }}
                                ></div>
                            ))}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-full">
                            {data.map((value, index) => {
                                const left = `${(index / (data.length - 1)) * 100}%`;
                                const bottom = `${(value / maxValue) * 100}%`;

                                return (
                                    <div key={index} className="absolute" style={{ left, bottom }}>
                                        <div className="relative">
                                            <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-amber-500 border-4 border-amber-100"></div>

                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                {value}%
                                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-amber-500"></div>
                                            </div>
                                        </div>

                                        {index < data.length - 1 && (
                                            <div
                                                className="absolute top-0 left-4 h-1 bg-amber-300"
                                                style={{
                                                    width: `calc(${100 / (data.length - 1)}% - 16px)`,
                                                    transform: `rotate(${Math.atan2(
                                                        data[index + 1] - value,
                                                        100 / (data.length - 1)
                                                    )}rad)`
                                                }}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-amber-400">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                <span key={day} style={{ left: `${(index / (data.length - 1)) * 100}%` }}>
                  {day}
                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesTrendCard;
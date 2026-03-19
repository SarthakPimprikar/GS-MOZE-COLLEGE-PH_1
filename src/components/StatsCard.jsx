import React from "react";
import Card from "./Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    const trendColors = {
        up: "text-green-600 bg-green-50",
        down: "text-red-600 bg-red-50",
        neutral: "text-gray-600 bg-gray-50",
    };

    return (
        <Card hover={true} className="h-full">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            {trend && (
                <div className="mt-4 flex items-center">
                    <span
                        className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${trend === "up" ? trendColors.up : trendColors.down
                            }`}
                    >
                        {trend === "up" ? (
                            <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                            <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {trendValue}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">vs last month</span>
                </div>
            )}
        </Card>
    );
};

export default StatsCard;

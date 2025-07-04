import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface TitleChartItem {
  title: string;
  total: number;
}

const MonthlyTitleChart = () => {
  const [chartData, setChartData] = useState<TitleChartItem[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("title, amount, date");

      if (error) {
        console.error("خطا در دریافت داده‌ها", error);
        return;
      }

      const grouped: Record<string, number> = {};
      (data ?? []).forEach(({ title, amount }) => {
        grouped[title] = (grouped[title] || 0) + Number(amount);
      });

      const result: TitleChartItem[] = Object.entries(grouped)
        .map(([title, total]) => ({ title, total }))
        .sort((a, b) => b.total - a.total); // ← سورت نزولی بر اساس total

      setChartData(result);
    };

    fetchChartData();
  }, []);

  return (
    <div className="bg-base-300 p-4 rounded-xl shadow">
      <h3 className="text-sm font-bold mb-2 text-accent text-end">
        نمودار هزینه‌ها بر اساس عنوان
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="title"
            interval={0}
            angle={-90}
            textAnchor="end"
            tick={{ fontSize: 12, fontWeight: "bold", fill: "#00d3bb" }}
          />
          <YAxis
            tick={{ fontSize: 12, fontWeight: "bold" }}
            tickFormatter={(value) => value.toLocaleString("fa-IR")}
          />
          <Tooltip
            formatter={(value: number) =>
              `${value.toLocaleString("fa-IR")} تومان`
            }
          />
          <Legend
            wrapperStyle={{ paddingTop: 70, fontSize: 10, fontWeight: "bold" }}
          />
          <Bar dataKey="total" fill="#00d3bb" name="جمع هزینه بر اساس عنوان" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTitleChart;

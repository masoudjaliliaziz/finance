// فایل: src/components/MonthlyTitleChart.tsx
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
} from "recharts";

interface TitleChartItem {
  title: string;
  total: number;
}

const MonthlyTitleChart = () => {
  const [chartData, setChartData] = useState<TitleChartItem[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const start = new Date(year, month - 1, 1).toISOString().slice(0, 10);
      const end = new Date(year, month, 0).toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("expenses")
        .select("title, amount, date")
        .gte("date", start)
        .lte("date", end);

      if (error) {
        console.error("خطا در دریافت داده‌ها", error);
        return;
      }

      const grouped: Record<string, number> = {};
      (data ?? []).forEach(({ title, amount }) => {
        grouped[title] = (grouped[title] || 0) + Number(amount);
      });

      const result: TitleChartItem[] = Object.entries(grouped).map(
        ([title, total]) => ({ title, total })
      );

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
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `${value.toLocaleString()} تومان`}
          />
          <Bar dataKey="total" fill="#00d3bb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTitleChart;

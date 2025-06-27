import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface ChartItem {
  date: string;
  total: number;
}

function getMonthRange(year: number, month: number) {
  const start = new Date(year, month - 1, 1).toISOString().slice(0, 10);
  const end = new Date(year, month, 0).toISOString().slice(0, 10);
  return { start, end };
}

const ExpenseChart = () => {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      const today = new Date();
      const { start, end } = getMonthRange(
        today.getFullYear(),
        today.getMonth() + 1
      );

      const { data, error } = await supabase
        .from("expenses")
        .select("amount, date")
        .gte("date", start)
        .lte("date", end);

      if (error) {
        console.error("خطا در دریافت داده‌های نمودار:", error.message);
        setLoading(false);
        return;
      }

      const grouped: Record<string, number> = {};

      (data ?? []).forEach(({ date, amount }) => {
        const day = date.slice(0, 10);
        grouped[day] = (grouped[day] || 0) + Number(amount);
      });

      const chartFormatted: ChartItem[] = Object.entries(grouped).map(
        ([date, total]) => ({
          date,
          total,
        })
      );

      setChartData(chartFormatted);
      setLoading(false);
    };

    fetchChartData();
  }, []);

  if (loading) return <p>در حال بارگذاری نمودار...</p>;

  return (
    <div className="w-full h-64 bg-base-300 text-accent text-end rounded-xl shadow p-4">
      <h3 className="text-sm font-bold mb-2">نمودار مخارج این ماه</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#00d3bb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;

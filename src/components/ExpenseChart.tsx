import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

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

  const formatToPersianDate = (isoDate: string) => {
    const obj = new DateObject({
      date: isoDate,
      calendar: persian,
      locale: persian_fa,
    });
    return `${obj.day} ${obj.month.name}`;
  };

  return (
    <div className="w-full h-100 bg-base-300 text-accent text-end rounded-xl shadow p-4">
      <h3 className="text-sm font-bold mb-2 text-accent">
        نمودار مخارج این ماه
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 60, left: 0 }}
        >
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fontSize: 10, fontWeight: "bold", fill: "#00d3bb" }}
            tickFormatter={(value: string) => formatToPersianDate(value)}
          />
          <YAxis
            tick={{ fontSize: 12, fontWeight: "bold" }}
            tickFormatter={(value) => value.toLocaleString("fa-IR")}
          />
          <Tooltip
            labelFormatter={(label) => formatToPersianDate(label)}
            formatter={(value: number) =>
              `${value.toLocaleString("fa-IR")} تومان`
            }
          />
          <Legend
            wrapperStyle={{ paddingTop: 30, fontSize: 10, fontWeight: "bold" }}
          />
          <Bar dataKey="total" fill="#00d3bb" name={"جمع کل مخارج این ماه"} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import moment from "moment-jalaali";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartItem {
  date: string;
  total: number;
}

// بارگذاری تنظیمات فارسی و اعداد فارسی
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

const ExpenseChart = () => {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("expenses")
        .select("amount, date");

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

  // فرمت تاریخ شمسی با روز هفته و اعداد فارسی
  const formatToJalaliDate = (isoDate: string) => {
    return moment(isoDate, "YYYY-MM-DD").format("dddd jD jMMMM");
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
            tickFormatter={(value: string) => formatToJalaliDate(value)}
          />
          <YAxis
            tick={{ fontSize: 12, fontWeight: "bold" }}
            tickFormatter={(value) => value.toLocaleString("fa-IR")}
          />
          <Tooltip
            labelFormatter={(label) => formatToJalaliDate(label)}
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

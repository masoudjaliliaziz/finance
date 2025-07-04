import moment from "moment-jalaali";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Expense {
  title: string;
  amount: number;
  date: string;
  description?: string;
}

const MonthlySummaryByTitle = () => {
  const [summary, setSummary] = useState<{ title: string; total: number }[]>(
    []
  );
  const [details, setDetails] = useState<Record<string, Expense[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("title, amount, date, description");

      if (error) {
        console.error("خطا در دریافت داده‌ها", error);
        return;
      }

      const grouped: Record<string, number> = {};
      const detailMap: Record<string, Expense[]> = {};

      (data as Expense[]).forEach((item) => {
        grouped[item.title] = (grouped[item.title] || 0) + Number(item.amount);
        if (!detailMap[item.title]) detailMap[item.title] = [];
        detailMap[item.title].push(item);
      });

      const result = Object.entries(grouped)
        .map(([title, total]) => ({ title, total }))
        .sort((a, b) => b.total - a.total); // ← سورت بر اساس بیشترین

      setSummary(result);
      setDetails(detailMap);
    };

    fetchSummary();
  }, []);

  moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
  // تابع کمکی برای تبدیل تاریخ میلادی به شمسی همراه با روز هفته
  const formatJalaliDate = (gregorianDate: string) => {
    return moment(gregorianDate, "YYYY-MM-DD").format("  dddd jD jMMMM");
  };

  return (
    <div className="bg-base-300 p-4 rounded-xl shadow">
      <h3 className="text-sm font-bold text-accent text-end mb-3">
        جمع مخارج این ماه بر اساس عنوان
      </h3>
      <ul className="space-y-2">
        {summary.map((item, i) => (
          <li
            key={i}
            className="border-accent border-2 rounded-lg p-3 font-black text-base-content text-sm"
          >
            <button
              onClick={() =>
                setExpanded(expanded === item.title ? null : item.title)
              }
              className="flex justify-between w-full text-right "
            >
              <div className="flex justify-center items-center flex-row-reverse gap-1">
                <span>{item.total.toLocaleString()} </span>
                <span className="text-xs text-accent">تومان</span>
              </div>
              <span>{item.title}</span>
            </button>
            {expanded === item.title && details[item.title] && (
              <ul className="mt-2 text-sm space-y-1">
                {details[item.title].map((detail, j) => (
                  <li
                    key={j}
                    className="flex justify-between text-accent font-bold text-xs"
                  >
                    <span>{formatJalaliDate(detail.date.slice(0, 10))}</span>
                    <span>{detail.amount.toLocaleString()} تومان</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlySummaryByTitle;

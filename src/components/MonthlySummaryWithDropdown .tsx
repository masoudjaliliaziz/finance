import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Expense = {
  id?: number;
  title: string;
  amount: number;
  date: string;
  description?: string;
};

type SummaryItem = {
  title: string;
  total: number;
};

const MonthlySummaryWithDropdown = () => {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, Expense[]>>({});

  useEffect(() => {
    const fetchSummary = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("title, amount");

      if (error) {
        console.error("خطا در دریافت داده‌ها", error);
        return;
      }

      const grouped: Record<string, number> = {};
      data?.forEach(({ title, amount }) => {
        grouped[title] = (grouped[title] || 0) + Number(amount);
      });

      const result = Object.entries(grouped).map(([title, total]) => ({
        title,
        total,
      }));

      setSummary(result);
    };

    fetchSummary();
  }, []);

  const toggleDetails = async (title: string) => {
    if (expandedTitle === title) {
      setExpandedTitle(null);
      return;
    }

    if (!details[title]) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const start = new Date(year, month - 1, 1).toISOString().slice(0, 10);
      const end = new Date(year, month, 0).toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from("expenses")
        .select("id, title, amount, date, description")
        .eq("title", title)
        .gte("date", start)
        .lte("date", end);

      if (error) {
        console.error("خطا در دریافت جزئیات", error);
        return;
      }

      setDetails((prev) => ({ ...prev, [title]: data || [] }));
    }

    setExpandedTitle(title);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        📊 جمع مخارج این ماه بر اساس عنوان
      </h3>
      <ul>
        {summary.map(({ title, total }) => (
          <li key={title} className="mb-2 border-b pb-2">
            <button
              className="flex justify-between w-full text-left focus:outline-none"
              onClick={() => toggleDetails(title)}
            >
              <span>{title}</span>
              <span>{total.toLocaleString()} تومان</span>
            </button>
            {expandedTitle === title && details[title] && (
              <ul className="mt-2 ml-4 space-y-1 text-sm text-gray-700">
                {details[title].map((item) => (
                  <li key={item.id}>
                    {item.date.slice(0, 10)} - {item.amount.toLocaleString()}{" "}
                    تومان
                    {item.description && ` — ${item.description}`}
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

export default MonthlySummaryWithDropdown;

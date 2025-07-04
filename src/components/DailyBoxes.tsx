import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import clsx from "clsx";

interface Expense {
  title: string;
  amount: number;
  description?: string;
}

const DailyBoxes = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      const { data, error } = await supabase.from("expenses").select("date");

      if (!error && data) {
        const uniqueDates = Array.from(
          new Set(data.map((item) => item.date.slice(0, 10)))
        );
        setDates(uniqueDates);
      }
    };

    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      supabase
        .from("expenses")
        .select("title, amount, description")
        .eq("date", selectedDate)
        .then(({ data }) => {
          setExpenses((data ?? []) as Expense[]);
        });
    }
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">📆 روزهای ثبت شده</h3>
      <div className="flex flex-wrap gap-2">
        {dates.map((date) => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={clsx(
              "px-4 py-2 rounded-xl border",
              selectedDate === date ? "bg-blue-600 text-white" : "bg-white"
            )}
          >
            {date}
          </button>
        ))}
      </div>
      {selectedDate && (
        <div className="bg-gray-100 p-4 rounded-xl">
          <h4 className="font-bold mb-2">جزئیات مخارج {selectedDate}</h4>
          {expenses.length === 0 ? (
            <p>خرجی ثبت نشده.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((exp, i) => (
                <li key={i} className="border p-2 rounded bg-white">
                  <p>
                    <strong>{exp.title}</strong>: {exp.amount} تومان
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-500">{exp.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyBoxes;

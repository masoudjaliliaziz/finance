import { supabase } from "../lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface SalarySummaryProps {
  year: number;
  month: number;
}

const SalarySummary = ({ year, month }: SalarySummaryProps) => {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  const {
    data: salary,
    isLoading: loadingSalary,
    error: errorSalary,
  } = useQuery<number, Error>({
    queryKey: ["salary", year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("salaries")
        .select("amount")
        .gte("month", startDate)
        .lt("month", endDate);

      if (error) throw error;
      return data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    },
  });

  const {
    data: expenses,
    isLoading: loadingExpenses,
    error: errorExpenses,
  } = useQuery<number, Error>({
    queryKey: ["expenses-summary", year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("amount, date")
        .gte("date", startDate)
        .lt("date", endDate);

      if (error) throw error;
      return data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
    },
  });

  if (loadingSalary || loadingExpenses) return <p>در حال بارگذاری...</p>;
  if (errorSalary || errorExpenses)
    return (
      <p className="text-red-500">
        خطا: {(errorSalary || errorExpenses)?.message}
      </p>
    );

  const remaining = (salary || 0) - (expenses || 0);
  const dateObj = new DateObject({
    year,
    month,
    day: 1,
    calendar: persian,
    locale: persian_fa,
  });
  const persianDate = `${dateObj.month.name} ${dateObj.year}`;

  return (
    <div className="my-4 p-4 rounded shadow bg-base-300 border-2 border-accent flex flex-col items-end">
      <div className="w-full flex flex-row-reverse justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">جمع حقوق ماه</h3>
        <p className="text-sm font-bold">{persianDate}</p>
      </div>
      <div className="flex gap-2 justify-start flex-row-reverse items-center w-full">
        <p className="font-black text-accent">
          {salary?.toLocaleString("fa-IR") || "0"}
        </p>
        <span className="text-base-content font-semibold text-xs">تومان</span>
      </div>
      <div className="flex gap-2 justify-start flex-row-reverse items-center w-full mt-2">
        <span className="text-sm font-medium">جمع کل مخارج</span>
        <p className="font-bold text-yellow-600">
          {expenses?.toLocaleString("fa-IR") || "0"}
        </p>
        <span className="text-base-content font-semibold text-xs">تومان</span>
      </div>
      <div className="flex gap-2 justify-start flex-row-reverse items-center w-full mt-2">
        <span className="text-sm font-medium">مانده</span>
        <p className="font-bold text-accent">
          {remaining.toLocaleString("fa-IR")}
        </p>
        <span className="text-base-content font-semibold text-xs">تومان</span>
      </div>
    </div>
  );
};

export default SalarySummary;

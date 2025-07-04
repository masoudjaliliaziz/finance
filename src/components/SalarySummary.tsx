import { supabase } from "../lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface SalarySummaryProps {
  year: number;
  month: number;
}

const SalarySummary = ({ year, month }: SalarySummaryProps) => {
  const {
    data: salary,
    isLoading: loadingSalary,
    error: errorSalary,
  } = useQuery<number, Error>({
    queryKey: ["salary", year, month],
    queryFn: async () => {
      const { data, error } = await supabase.from("salaries").select("amount");

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
        .select("amount, date");

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

  // تبدیل تاریخ شروع ماه میلادی به شمسی با روز هفته

  return (
    <div className="my-4 p-4 rounded shadow bg-base-300 border-2 border-accent flex flex-col items-end">
      <div className="w-full flex flex-row-reverse justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">جمع حقوق ماه</h3>
        <p className="text-sm font-bold"></p>
      </div>
      <div className="flex gap-2 justify-start flex-row-reverse items-center w-full">
        <p className="font-black text-accent">
          {salary?.toLocaleString("fa-IR") || "۰"}
        </p>
        <span className="text-base-content font-semibold text-xs">تومان</span>
      </div>
      <div className="flex gap-2 justify-start flex-row-reverse items-center w-full mt-2">
        <span className="text-sm font-medium">جمع کل مخارج</span>
        <p className="font-bold text-yellow-600">
          {expenses?.toLocaleString("fa-IR") || "۰"}
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

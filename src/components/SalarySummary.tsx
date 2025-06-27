import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

interface SalarySummaryProps {
  year: number;
  month: number;
}

const SalarySummary = ({ year, month }: SalarySummaryProps) => {
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const endDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  const { data, isLoading, error } = useQuery({
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

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error)
    return <p className="text-red-500">خطا: {(error as Error).message}</p>;

  return (
    <div className="my-4 p-4   rounded shadow bg-base-300 border-2 border-accent flex flex-col items-end">
      <div className=" w-full flex flex-row-reverse justify-between items-center ">
        <h3 className="text-lg font-semibold mb-2">جمع حقوق ماه</h3>
        <p className="text-sm font-bold ">
          {year} / {String(month).padStart(2, "0")}
        </p>
      </div>
      <div className="flex gap-2 justify-start flex-row-reverse items-center w-full">
        <p className="font-black text-accent">
          {data?.toLocaleString("fa-IR") || "0"}
        </p>
        <span className="text-base-content font-semibold text-xs">تومان</span>
      </div>
    </div>
  );
};

export default SalarySummary;

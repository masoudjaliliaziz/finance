import { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";

const addDay = async (date: string) => {
  const { error } = await supabase
    .from("expenses")
    .insert([{ title: "", amount: 0, date }]);
  if (error) throw error;
};

const DayAdder = () => {
  const [selectedDay, setSelectedDay] = useState<DateObject | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (date: string) => addDay(date),
    onSuccess: () => {
      toast.success("روز جدید اضافه شد");
      setSelectedDay(null);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error: Error) => {
      console.error("خطا در افزودن روز", error);
      toast.error("خطا در افزودن روز");
    },
  });

  const handleAddDay = () => {
    if (!selectedDay) return toast.error("لطفاً تاریخ را انتخاب کنید");
    const fullDate = selectedDay.toDate().toISOString().split("T")[0];
    mutation.mutate(fullDate);
  };

  return (
    <div className="my-4 p-4 rounded shadow bg-base-300 border-2 border-accent flex flex-col items-end justify-center gap-3">
      <h3 className="text-md font-black text-accent ">افزودن روز جدید</h3>
      <div className="flex flex-row-reverse sm:flex-row gap-2 items-center w-full">
        <DatePicker
          value={selectedDay}
          onChange={setSelectedDay}
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right input w-full "
          inputClass="px-4 py-1 rounded w-full sm:w-auto input-accent bg-base-100 border-2 border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-bold  text-sm "
          format="YYYY/MM/DD"
        />
        <button
          onClick={handleAddDay}
          disabled={mutation.isPending}
          className="bg-accent text-white px-4 py-1 rounded whitespace-nowrap disabled:opacity-50 cursor-pointer hover:bg-accent-content"
        >
          {mutation.isPending ? "در حال افزودن..." : "افزودن "}
        </button>
      </div>
    </div>
  );
};

export default DayAdder;

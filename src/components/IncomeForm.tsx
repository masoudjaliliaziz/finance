import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const IncomeForm = () => {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    if (!month || !amount) return alert("ماه و مبلغ را وارد کنید");
    const { error } = await supabase.from("salaries").upsert([
      {
        month: `${month}-01`,
        amount: parseFloat(amount),
      },
    ]);
    if (error) {
      console.error("خطا در ذخیره درآمد", error);
      alert("خطا در ذخیره درآمد");
    } else {
      alert("درآمد ذخیره شد");
      setAmount("");
    }
  };

  return (
    <div className="mb-6 bg-base-300 p-4 rounded border-2 border-accent flex flex-col justify-center items-end w-full gap-3">
      <h3 className="text-md font-semibold mb-2">ثبت درآمد ماه</h3>
      <div className="flex flex-col w-full  gap-3">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-2 py-1 rounded w-full sm:w-auto input-accent bg-base-100 border-2 border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <input
          type="number"
          placeholder="مبلغ درآمد"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="px-4 py-1 rounded w-full sm:w-auto input-accent bg-base-100 border-2 border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent font-bold  text-sm"
        />
        <button
          onClick={handleSubmit}
          className="bg-accent w-2/8 text-white px-4 py-1 rounded hover:bg-accent-content transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
};

export default IncomeForm;

// components/ExpenseForm.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const ExpenseForm = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("expenses").insert([
      {
        title,
        amount: parseFloat(amount),
        date,
        description,
      },
    ]);

    if (error) {
      alert("❌ خطا در ثبت خرج: " + error.message);
    } else {
      alert("✅ خرج با موفقیت ثبت شد!");
      setTitle("");
      setAmount("");
      setDate("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="عنوان خرج (مثلاً نهار)"
        className="w-full border rounded p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="مبلغ (تومان)"
        className="w-full border rounded p-2"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        type="date"
        className="w-full border rounded p-2"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <textarea
        placeholder="توضیحات (اختیاری)"
        className="w-full border rounded p-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ثبت خرج
      </button>
    </form>
  );
};

export default ExpenseForm;

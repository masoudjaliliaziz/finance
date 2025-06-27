// components/DailyExpenseForm.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

type ExpenseItem = {
  title: string;
  amount: string;
  description: string;
};

const DailyExpenseForm = () => {
  const [date, setDate] = useState("");
  const [items, setItems] = useState<ExpenseItem[]>([
    { title: "", amount: "", description: "" },
  ]);

  const addItem = () => {
    setItems([...items, { title: "", amount: "", description: "" }]);
  };

  const updateItem = (
    index: number,
    field: keyof ExpenseItem,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert("لطفاً تاریخ را وارد کنید");
      return;
    }

    const formattedItems = items.map((item) => ({
      ...item,
      amount: parseFloat(item.amount),
      date,
    }));

    const { error } = await supabase.from("expenses").insert(formattedItems);

    if (error) {
      alert("❌ خطا در ثبت خرج‌ها: " + error.message);
    } else {
      alert("✅ همه خرج‌ها با موفقیت ثبت شدند!");
      setItems([{ title: "", amount: "", description: "" }]);
      setDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">تاریخ</label>
        <input
          type="date"
          className="w-full border rounded p-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {items.map((item, index) => (
        <div key={index} className="border p-4 rounded-xl bg-gray-50 space-y-2">
          <input
            type="text"
            placeholder="عنوان خرج"
            className="w-full border rounded p-2"
            value={item.title}
            onChange={(e) => updateItem(index, "title", e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="مبلغ"
            className="w-full border rounded p-2"
            value={item.amount}
            onChange={(e) => updateItem(index, "amount", e.target.value)}
            required
          />
          <textarea
            placeholder="توضیحات"
            className="w-full border rounded p-2"
            value={item.description}
            onChange={(e) => updateItem(index, "description", e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
      >
        ➕ افزودن خرج جدید
      </button>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ✅ ثبت همه خرج‌ها
      </button>
    </form>
  );
};

export default DailyExpenseForm;

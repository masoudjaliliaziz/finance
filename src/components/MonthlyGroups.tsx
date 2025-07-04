import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import moment from "moment-jalaali";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  description?: string;
}

const MonthlyGroups = () => {
  const [dataByMonth, setDataByMonth] = useState<
    Record<string, Record<string, Expense[]>>
  >({});
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    description: "",
  });
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("id, title, amount, date, description");

    if (error) {
      console.error("خطا در دریافت اطلاعات", error);
      return;
    }

    const grouped: Record<string, Record<string, Expense[]>> = {};

    data?.forEach((item) => {
      const date = item.date.slice(0, 10);
      const [year, month, day] = date.split("-");
      const monthKey = `${year}-${month}`;
      const dayKey = `${year}-${month}-${day}`;

      if (!grouped[monthKey]) grouped[monthKey] = {};
      if (!grouped[monthKey][dayKey]) grouped[monthKey][dayKey] = [];

      grouped[monthKey][dayKey].push(item);
    });

    setDataByMonth(grouped);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async () => {
    if (!targetDate) return;
    const { title, amount, description } = newExpense;
    if (!title || !amount) return alert("لطفاً عنوان و مبلغ را وارد کنید");

    setIsAdding(true);

    const { error } = await supabase.from("expenses").insert([
      {
        title,
        amount: parseFloat(amount),
        description,
        date: targetDate,
      },
    ]);

    setIsAdding(false);

    if (error) {
      console.error("خطا در افزودن خرج", error);
    } else {
      setNewExpense({ title: "", amount: "", description: "" });
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) console.error("خطا در حذف", error);
    else fetchData();
  };

  const handleEdit = async (item: Expense) => {
    const newTitle = prompt("عنوان جدید:", item.title);
    const newAmount = prompt("مبلغ جدید:", String(item.amount));
    const newDescription = prompt("توضیح جدید:", item.description || "");

    if (!newTitle || !newAmount) return;

    const { error } = await supabase
      .from("expenses")
      .update({
        title: newTitle,
        amount: parseFloat(newAmount),
        description: newDescription,
      })
      .eq("id", item.id);

    if (error) console.error("خطا در ویرایش", error);
    else fetchData();
  };

  return (
    <div className="space-y-6 rounded bg-base-300 text-base-content p-4">
      {Object.entries(dataByMonth)
        .sort(
          ([a], [b]) => moment(b, "YYYY-MM").diff(moment(a, "YYYY-MM")) // مرتب‌سازی ماه‌ها نزولی
        )
        .map(([month, days]) => (
          <div key={month} className="rounded-xl shadow bg-base-100 p-4">
            <div className="space-y-3">
              {Object.entries(days)
                .sort(
                  ([a], [b]) =>
                    moment(b, "YYYY-MM-DD").diff(moment(a, "YYYY-MM-DD")) // مرتب‌سازی روزها نزولی
                )
                .map(([day, expenses]) => {
                  const persianDay = moment(day, "YYYY-MM-DD").format(
                    "dddd jD jMMMM jYYYY"
                  );
                  const totalAmount = expenses.reduce(
                    (sum, item) => sum + item.amount,
                    0
                  );

                  return (
                    <div
                      key={day}
                      className="bg-base-200 rounded-lg p-3 border-2 border-accent"
                    >
                      <button
                        onClick={() =>
                          setExpandedDay(expandedDay === day ? null : day)
                        }
                        className="font-bold text-sm flex justify-between items-center w-full"
                      >
                        <span>{persianDay}</span>
                        <div className="flex gap-1 items-center">
                          <span className="text-sm font-bold text-accent">
                            {totalAmount.toLocaleString()}
                          </span>
                          <span className="text-xs">تومان</span>
                        </div>
                      </button>

                      {expandedDay === day && (
                        <>
                          <ul className="mt-2 space-y-1 text-sm bg-base-300 font-bold text-base-content p-2 rounded border-2 border-accent">
                            {expenses.map((item) => (
                              <li
                                key={item.id}
                                className="flex justify-between items-center gap-2 text-gray-700"
                              >
                                <span>{item.title}</span>
                                <span>
                                  {item.amount.toLocaleString()} تومان
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    className="text-xs text-accent font-semibold hover:text-accent-content"
                                    onClick={() => handleEdit(item)}
                                  >
                                    ویرایش
                                  </button>
                                  <button
                                    className="text-xs text-error font-semibold hover:text-error-content"
                                    onClick={() => handleDelete(item.id)}
                                  >
                                    حذف
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>

                          {/* فرم افزودن خرج */}
                          <div className="mt-4 space-y-2">
                            <input
                              type="text"
                              placeholder="عنوان"
                              className="input input-bordered w-full"
                              value={newExpense.title}
                              onChange={(e) =>
                                setNewExpense({
                                  ...newExpense,
                                  title: e.target.value,
                                })
                              }
                            />
                            <input
                              type="number"
                              placeholder="مبلغ"
                              className="input input-bordered w-full"
                              value={newExpense.amount}
                              onChange={(e) =>
                                setNewExpense({
                                  ...newExpense,
                                  amount: e.target.value,
                                })
                              }
                            />
                            <input
                              type="text"
                              placeholder="توضیحات (اختیاری)"
                              className="input input-bordered w-full"
                              value={newExpense.description}
                              onChange={(e) =>
                                setNewExpense({
                                  ...newExpense,
                                  description: e.target.value,
                                })
                              }
                            />
                            <button
                              onClick={() => {
                                setTargetDate(day);
                                handleAddExpense();
                              }}
                              className="btn btn-accent w-full"
                              disabled={isAdding}
                            >
                              {isAdding ? "در حال افزودن..." : "افزودن"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MonthlyGroups;

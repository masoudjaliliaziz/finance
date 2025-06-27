import MonthlyGroups from "../components/MonthlyGroups";

import IncomeForm from "../components/IncomeForm";
import DayAdder from "../components/DayAdder";
import SalarySummary from "../components/SalarySummary";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

const AddExpensePage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return (
    <div className="px-2 sm:px-4 md:px-8 py-4 max-w-3xl mx-auto bg-base-100 min-h-screen text-base-content transition-colors pb-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center flex-1">
          ثبت مخارج روزانه
        </h2>
      </div>

      <IncomeForm />

      <SalarySummary year={year} month={month} />

      <DayAdder />

      <MonthlyGroups />
    </div>
  );
};

export default AddExpensePage;

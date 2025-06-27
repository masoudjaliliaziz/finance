import ExpenseChart from "../components/ExpenseChart";
import SalarySummary from "../components/SalarySummary";
import MonthlySummaryByTitle from "../components/MonthlySummaryByTitle";
import MonthlyTitleChart from "../components/MonthlyTitleChart";

const HomePage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 py-4 max-w-4xl mx-auto text-base-content bg-base-300 pb-16  ">
      <SalarySummary year={year} month={month} />
      <ExpenseChart />
      <MonthlyTitleChart />
      <MonthlySummaryByTitle />
    </div>
  );
};

export default HomePage;

import React from "react";
import InvoicesTable from "@/components/general/InvoicesTable";

const Dashboard = () => {
  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto py-3 gap-5 my-5">
      <ChartSection />
      <InvoicesListing />
    </div>
  );
};

export default Dashboard;

// ==========================
// Dashboard page components
// ==========================

// 1. Charts component
const ChartSection = () => {
  return (
    <section id="charts-section" className="w-full flex flex-col py-3">
      <h1 className="text-2xl font-extrabold tracking-tight text-balance">
        Charts
      </h1>
      <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
        Charts will be added later
      </p>
    </section>
  );
};

// 2. Invoices listing component
const InvoicesListing = () => {
  return (
    <section id="invoices-section" className="w-full flex flex-col py-3">
      <h1 className="text-2xl font-extrabold tracking-tight text-balance">
        Invoices
      </h1>
      <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
        Following are the invoices you have created
      </p>
      <InvoicesTable />
    </section>
  );
};

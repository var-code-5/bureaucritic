import Link from "next/link";
import React from "react";
import PieChart from "@/components/PieChart";
import FormLineGraph from "@/components/LineGraph";

export default function Metrics() {
  const formData = {
    form_title: "Application Form",
    approved: 10,
    rejected: 5,
    draft: 8,
    total: 23,
  };

  const formData_l = [
    {
      "form_title": "FORM XIV - APPLICATION FOR REGISTRATION OF COPYRIGHT [SEE RULE 70]",
      "approved": 1,
      "rejected": 0,
      "draft": 1,
      "total": 2
    },
    {
      "form_title": "Leave Application Form",
      "approved": 1,
      "rejected": 0,
      "draft": 0,
      "total": 1
    }
  ]

  return (
    <div className="w-full min-h-screen bg-foreground text-background flex items-end px-12 py-12">
      <div className="w-[40%] h-[80vh]">
        <div className="min-h-[30%] flex flex-col justify-between ">
          <h1 className="text-7xl font-bold font-inter">Dashboard</h1>
          <p className="font-roboto-mono text-2xl">
            Devil&apos;s in the details and here they are.
          </p>
        </div>
        <div className="h-[70%] font-inter flex">
          <div className="w-[30%] flex flex-col justify-end h-full">
            <Link href="/metrics">
              <button className="w-full border-2 border-primary px-4 py-2 text-3xl text-primary font-bold">
                Options
              </button>
            </Link>
            <Link href="/forms">
              <button className="w-full border-2 border-primary px-4 py-2 text-3xl text-primary font-bold">
                Manage Approvals
              </button>
            </Link>
            <Link href="/chat">
              <button className="w-full border-2 border-primary px-4 py-2 text-3xl text-primary font-bold">
                Chat
              </button>
            </Link>
          </div>
          <div className="w-[70%] flex flex-col justify-end h-full">
            <PieChart data={formData} />
          </div>
        </div>
      </div>
      <div className="w-[60%] h-[80vh] flex">
        <div className="w-[45%] min-h-full h-full">
            <div className="w-full h-[50%] p-12 border-2 border-background">
                <p className="text-9xl text-primary font-bold">{formData.approved}</p>
                <p className="text-6xl font-bold text-background ">Tasks <br/> completed</p>
            </div>
            <div className="w-full h-[50%] p-12 border-2 border-background flex flex-col justify-center">
                <p className="text-6xl text-background font-bold">Your time,<br/> your terms.</p>
            </div>
        </div>
        <div className="w-[55%]">
            <div className="w-full h-[60%] border-2 border-background py-16">
            <FormLineGraph data={formData_l} />
            </div>
            <div className="w-full h-[40%] p-12 border-2 border-background">
            <p className="text-9xl text-background font-bold">{formData.draft}</p>
            <p className="text-6xl font-bold text-background ">Tasks Pending</p>
            </div>
        </div>
      </div>
    </div>
  );
}

import Navbar from "./navbar";
import { AdminData } from "../context/Admindatamaintenance";
import { useState } from "react";
import axios from "../../../config/api";
import { ClipboardList, Clock, UserCheck, Wrench, CheckCircle2 } from "lucide-react";

export default function WorkOrder() {

  const [requestid, setRequestid] = useState("")
  const [technicianid, setTechnicianid] = useState("")
  const [showform, setShowform] = useState(false)
  const { allraiserequest, setAllraiserequest, alltechnicians } = AdminData();

  const totalCount = allraiserequest.length;
  const pendingCount = allraiserequest.filter((r) => r.status === "pending").length;
  const assignedCount = allraiserequest.filter((r) => r.status === "assigned").length;
  const inProcessCount = allraiserequest.filter((r) => r.status === "in-process").length;
  const completedCount = allraiserequest.filter((r) => r.status === "completed").length;

  const handleAssign = () => {
    if (!technicianid || !requestid) {
      alert("Please select a technician");
      return;
    }

    const technicianObj = alltechnicians.find((t) => t._id === technicianid);

    axios
      .put(`/assigntechnician/${requestid}`, { technicianid })
      .then((res) => {
        console.log("Updated request:", res.data);

        setAllraiserequest((prev) =>
          prev.map((req) =>
            req._id === requestid
              ? { ...req, assignedto: technicianObj }
              : req
          )
        );
        setTechnicianid("");
        setShowform(false);
      })
      .catch((err) => console.log(err.message));
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-800",
      assigned: "bg-blue-100 text-blue-800",
      "in-process": "bg-purple-100 text-purple-800",
      completed: "bg-emerald-100 text-emerald-800",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-green-100 text-green-700",
    };
    return styles[priority] || "bg-gray-100 text-gray-600";
  };

  const kpiCards = [
    { label: "Total Requests", value: totalCount, icon: ClipboardList, iconBg: "bg-gray-100", iconColor: "text-gray-600", valueBg: "text-gray-800" },
    { label: "Pending", value: pendingCount, icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600", valueBg: "text-amber-700" },
    { label: "Assigned", value: assignedCount, icon: UserCheck, iconBg: "bg-blue-100", iconColor: "text-blue-600", valueBg: "text-blue-700" },
    { label: "In Process", value: inProcessCount, icon: Wrench, iconBg: "bg-purple-100", iconColor: "text-purple-600", valueBg: "text-purple-700" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, iconBg: "bg-emerald-100", iconColor: "text-emerald-600", valueBg: "text-emerald-700" },
  ];

  return (
    <div className="p-4 md:p-8 mt-4 font-sans">

      {showform && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative w-[400px] max-w-[90%] rounded-xl bg-white p-6 shadow-xl">
            <button
              onClick={() => {
                setTechnicianid("");
                setShowform(false);
              }}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-lg transition"
            >
              ✕
            </button>

            <h1 className="mb-1 text-xl font-serif font-semibold text-gray-900">
              Assign Technician
            </h1>
            <p className="mb-5 text-sm text-gray-500">
              Choose a technician to handle this service request.
            </p>

            <div className="mb-6">
              <label
                htmlFor="technician"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Technician
              </label>
              <select
                id="technician"
                value={technicianid}
                onChange={(e) => setTechnicianid(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="">Select technician</option>
                {alltechnicians.map((ele) => (
                  <option key={ele._id} value={ele._id}>
                    {ele.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setTechnicianid("");
                  setShowform(false);
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                     hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
                     hover:bg-blue-700 transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-900 mb-6">Work Orders</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpiCards.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow duration-200"
          >
            <div className={`w-12 h-12 ${kpi.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
              <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide leading-tight">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.valueBg} leading-tight mt-1`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-blue-600 rounded-full inline-block"></span>Visual Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {allraiserequest.map((ele) => (
          <div
            key={ele._id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="w-full h-40 bg-gray-50 flex items-center justify-center p-2 overflow-hidden">
              {ele.assetid?.assetImg ? (
                <img
                  src={ele.assetid.assetImg}
                  alt={ele.assetid?.assetName}
                  className="max-h-35 max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">No Image</span>
              )}
            </div>
            <div className="p-3 space-y-1.5">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {ele.assetid?.assetName || ele.assetid || "Unknown Asset"}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                <span className="font-medium text-gray-600">Raised By:</span> {ele.userid?.name || ele.userid || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {ele.description || "No description"}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusStyle(ele.status)}`}>
                  {ele.status}
                </span>
                <span className="text-[10px] text-gray-400 font-medium truncate max-w-[80px]">
                  {ele.assignedto?.name || "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-1 h-5 bg-blue-600 rounded-full inline-block"></span>Actionable Details</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Asset</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Issue</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Technician</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {allraiserequest.map((ele) => (
                <tr
                  key={ele._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-5 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                    {ele.assetid?.assetName || "Unknown Asset"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(ele.status)}`}>
                      {ele.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getPriorityStyle(ele.aiPriority)}`}>
                      {ele.aiPriority || "N/A"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 max-w-[220px] truncate">
                    {ele.description || "No description"}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium whitespace-nowrap">
                    <span className={ele.assignedto ? "text-gray-800" : "text-red-500"}>
                      {ele.assignedto?.name || "Unassigned"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {ele.assignedto ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Assigned
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setRequestid(ele._id);
                          setShowform(true);
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

import { useEffect, useState } from "react";
import { AdminData } from "../context/Admindatamaintenance";
import axios from "../../../config/api";
import AdminDashboardPieChart from "./Admindashboardpiechart";
import AdminDashboardLineBarChart from "./Admindashboardlinechart";
import AdminRequestTrendChart from "./AdminRequestTrendChart";


export default function Admin() {
  //made changes
  const token = localStorage.getItem("token")
  // console.log(token)


  const [assets, setAssets] = useState([])
  // console.log(assets)
  const [admindashboardstats, setAdmindashboardstats] = useState(null);
  const [admindashboardraiserequeststats, setAdmindashboardraiserequeststats] = useState(null);
  const { allraiserequest } = AdminData();
  // console.log(allraiserequest)
  const [showdetails, setShowdetails] = useState(false);
  const [requestid, setRequestid] = useState("");
  // console.log(requestid)
  const [requestinfo, setRequestinfo] = useState(null);

  const handleRequestid = (reqid) => {
    setRequestid(reqid);
    const allinfo = allraiserequest.find((ele) => ele._id === reqid);
    setRequestinfo(allinfo);
  };

  useEffect(() => {
    axios
      .get("/dashboardstats")
      .then((res) => setAdmindashboardstats(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("/raiserequeststats")
      .then((res) => setAdmindashboardraiserequeststats(res.data))
      .catch((err) => console.log(err.message));
  }, []);
  useEffect(() => {
    axios.get("/assets")
      .then(res => setAssets(res.data))
      .catch(err => console.log(err));
  }, []);




  const recentAssigned = allraiserequest
    .filter(a => a.assignedto)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div>
      {admindashboardstats && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm w-full">
          <h1 className="text-2xl font-bold text-gray-950 tracking-tight mb-6">
            Assets Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="h-[140px] bg-white border border-gray-100 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-blue-200 hover:bg-blue-50/5 transition-all duration-300 group cursor-pointer">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-sans">
                  Total Assets
                </p>
                <p className="text-3xl font-extrabold text-gray-900 font-mono mt-1.5">
                  {admindashboardstats.totalAssets}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-blue-600 text-3xl">📦</span>
              </div>
            </div>

            <div className="h-[140px] bg-white border border-gray-100 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-green-200 hover:bg-green-50/5 transition-all duration-300 group cursor-pointer">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-sans">
                  Working
                </p>
                <p className="text-3xl font-extrabold text-gray-900 font-mono mt-1.5">
                  {admindashboardstats.workingAssets}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-green-600 text-3xl">✔️</span>
              </div>
            </div>

            <div className="h-[140px] bg-white border border-gray-100 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-orange-200 hover:bg-orange-50/5 transition-all duration-300 group cursor-pointer">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-sans">
                  Under Maintenance
                </p>
                <p className="text-3xl font-extrabold text-gray-900 font-mono mt-1.5">
                  {admindashboardstats.undermaintance}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-orange-600 text-3xl">🔧</span>
              </div>
            </div>

            <div className="h-[140px] bg-white border border-gray-100 rounded-2xl px-6 py-5 flex justify-between items-center shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:border-yellow-200 hover:bg-yellow-50/5 transition-all duration-300 group cursor-pointer">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-sans">
                  Pending Requests
                </p>
                <p className="text-3xl font-extrabold text-gray-900 font-mono mt-1.5">
                  {admindashboardstats.pendingRequests}
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-yellow-600 text-3xl">🕒</span>
              </div>
            </div>

          </div>
        </div>
      )}








      <div className="mt-10 px-4">
        {admindashboardstats && admindashboardraiserequeststats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <AdminDashboardPieChart stats={admindashboardstats} />
            <AdminRequestTrendChart requests={allraiserequest} />
            <AdminDashboardLineBarChart stats={admindashboardraiserequeststats} />
          </div>
        )}
      </div>

      <div className="p-4 md:p-8 mt-10 font-sans">
        {showdetails && requestinfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-950">
                  Service Request Details
                </h2>
                <button
                  onClick={() => {
                    setRequestinfo(null);
                    setShowdetails(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <div className="mb-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Status</span>
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-full ${requestinfo.status === "pending"
                      ? "bg-amber-50 text-amber-600"
                      : requestinfo.status === "in-process"
                        ? "bg-blue-50 text-blue-600"
                        : requestinfo.status === "completed"
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-50 text-slate-600"
                      }`}
                  >
                    {requestinfo.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Asset Name</span>
                  <span className="text-slate-900 font-semibold">{requestinfo.assetid?.assetName || "Not Assigned"}</span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100/50">
                {requestinfo.description}
              </div>

              <div className="mb-6 space-y-2 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Raised By</span>
                  <span className="text-slate-900 font-medium">{requestinfo.userid?.name || "N/A"}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span className="font-medium">Assigned Technician</span>
                  <span className="text-slate-950 font-medium">{requestinfo.assignedto?.name || "Not Assigned"}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowdetails(false);
                    setRequestinfo(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h1 className="text-lg font-bold text-gray-950 mb-1">
            Recent Service Requests
          </h1>

          <p className="text-sm text-gray-500 mb-6 max-w-3xl">
            Displays the latest asset-related issues raised by users, along with their
            current service status and assigned technicians.
          </p>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 rounded-xl overflow-hidden border border-gray-100">
              <thead className="bg-gray-50/70">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Asset Name
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Issue
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Raised By
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {allraiserequest.slice(-5).reverse().map((ele, index) => (
                  <tr
                    key={ele._id || index}
                    className="hover:bg-slate-50/80 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {ele.assetid?.assetName || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {ele.description || "No description"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {ele.userid?.name || "Unknown"}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono ${ele.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : ele.status === "in-process"
                            ? "bg-purple-100 text-purple-800"
                            : ele.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
                      </span>
                    </td>


                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <button
                        onClick={() => {
                          setShowdetails(true);
                          handleRequestid(ele._id);
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all text-xs font-semibold shadow-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>









      <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto font-sans">
        <h2 className="mb-5 text-lg font-bold text-gray-950">
          Recently Added Assets
        </h2>

        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold">
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                Asset
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                Image
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                Category
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                Assigned To
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs w-[400px] whitespace-nowrap">
                Description
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                Created
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {assets.slice(-5).reverse().map((ele) => (
              <tr
                key={ele._id}
                className="hover:bg-slate-50/80 transition-colors duration-150"
              >
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {ele.assetName}
                </td>

                <td className="px-4 py-3">
                  <img
                    src={ele.assetImg}
                    alt={ele.assetName}
                    className="h-16 w-16 rounded-sm object-cover border border-gray-200"
                  />
                </td>

                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {ele.category}
                </td>

                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {ele.assignedTo?.name || "Not Assigned"}
                </td>

                <td className="px-4 py-3 text-gray-700 w-[400px]">
                  {ele.description}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono ${ele.status === "assigned"
                      ? "bg-green-100 text-green-800"
                      : ele.status === "unassigned"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {ele.status.charAt(0).toUpperCase() + ele.status.slice(1)}
                  </span>
                </td>


                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {new Date(ele.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {assets.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No assets to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>



      <div className="mt-10 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto font-sans">
        <h2 className="mb-5 text-lg font-bold text-gray-950">
          Recently Assigned Work Orders
        </h2>

        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-500 font-semibold">
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs">
                Asset
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs">
                Image
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs">
                Assigned To
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs">
                Category
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs">
                Status
              </th>
              <th className="px-4 py-3.5 text-left font-semibold uppercase tracking-wider text-xs w-[400px]">
                Description
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {recentAssigned.map((asset, index) => (
              <tr
                key={asset._id || index}
                className="align-top hover:bg-slate-50/80 transition-colors duration-150"
              >
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {asset.assetid?.assetName || "N/A"}
                </td>

                <td className="px-4 py-3">
                  {asset.assetid?.assetImg ? (
                    <img
                      src={asset.assetid.assetImg}
                      alt={asset.assetid?.assetName || "asset"}
                      className="h-16 w-16 rounded-sm object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-sm bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                  )}
                </td>

                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {asset.assignedto?.name || "Not Assigned"}
                </td>

                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {asset.aiCategory}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono ${asset.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : asset.status === "in-process"
                        ? "bg-purple-100 text-purple-800"
                        : asset.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700 w-[400px]">
                  {asset.description}
                </td>
              </tr>
            ))}

            {recentAssigned.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No recently assigned work orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
}

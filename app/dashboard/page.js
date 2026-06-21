"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  SearchIcon,
  FilterIcon,
  PlusIcon,
  EditIcon,
  DeleteIcon,
  XIcon,
} from "lucide-react";
import { ProtectedRoute } from "../components/ProtectedRoute";

function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFamilies, setExpandedFamilies] = useState({});

  const toggleExpanded = (familyId) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [familyId]: !prev[familyId],
    }));
  };

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await fetch("/api/families");
        const data = await response.json();
        if (data.success) {
          setFamilies(data.data);
        }
      } catch (error) {
        console.error("Error fetching families:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  const handleLiftedChange = async (familyId, lifted) => {
    setFamilies((prev) =>
      prev.map((family) =>
        family._id === familyId ? { ...family, lifted } : family,
      ),
    );
    try {
      const response = await fetch(`/api/families/${familyId}/lifted`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lifted }),
      });
    } catch (error) {
      console.error("Error updating family lifted status:", error);
    }
  };

  const handleDelete = async (familyId) => {
    if (!confirm("Are you sure you want to delete this family?")) {
      return;
    }
    try {
      const response = await fetch(`/api/families/${familyId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setFamilies((prev) => prev.filter((family) => family._id !== familyId));
      }
    } catch (error) {
      console.error("Error deleting family:", error);
    }
  };

  // Filter and search
  const filteredFamilies = useMemo(() => {
    return families.filter((family) => {
      const queryLower = searchQuery.toLowerCase();

      // Check if search matches family ID, head name, or phone
      const matchesHeadOrFamily =
        family.headName.toLowerCase().includes(queryLower) ||
        String(family.familyId).toLowerCase().includes(queryLower) ||
        family.phone.includes(searchQuery);

      // Check if search matches any member's name or card number
      const matchesMember = family.members.some(
        (member) =>
          member.name.toLowerCase().includes(queryLower) ||
          String(member.cardNumber).toLowerCase().includes(queryLower),
      );

      const matchesSearch = matchesHeadOrFamily || matchesMember;

      const matchesStatus =
        filterStatus === "all" || family.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, filterStatus, families]);

  // Stats
  const stats = [
    { label: "Total Families", value: families.length, color: "blue" },
    {
      label: "Active",
      value: families.filter((f) => f.status === "active").length,
      color: "green",
    },
    {
      label: "Inactive",
      value: families.filter((f) => f.status === "inactive").length,
      color: "red",
    },
    {
      label: "Pending",
      value: families.filter((f) => f.status === "pending").length,
      color: "yellow",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "complete":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatColorClass = (color) => {
    const colors = {
      blue: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
      green:
        "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700",
      red: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700",
      yellow:
        "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Families</h1>
          <Link
            href="/family/add"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            <PlusIcon size={16} />
            <span>Add Family</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {stats.map((stat, index) => {
            const colorMap = {
              blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
              green: "bg-green-50 text-green-700 ring-1 ring-green-200",
              red: "bg-red-50 text-red-700 ring-1 ring-red-200",
              yellow: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
            };
            const dotMap = {
              blue: "bg-blue-500",
              green: "bg-green-500",
              red: "bg-red-500",
              yellow: "bg-amber-500",
            };
            return (
              <div
                key={index}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colorMap[stat.color]}`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotMap[stat.color]}`}></span>
                <span className="font-bold">{stat.value}</span>
                <span className="opacity-70 font-medium">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar - Search & Filter */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          {/* Search - full width on mobile */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, ID, card no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <XIcon size={15} />
              </button>
            )}
          </div>
          {/* Status Filter */}
          <div className="relative flex-shrink-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-3 pr-7 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer font-medium"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <FilterIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 px-1">{filteredFamilies.length} of {families.length} families</p>
      </div>

      {/* Content */}
      <div className="p-0 sm:p-4 lg:p-6">

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center m-3 sm:m-0">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 text-sm">Loading families...</p>
            </div>
          )}

          {/* Families Table */}
          {!loading && filteredFamilies.length > 0 && (
            <div className="bg-white rounded-none sm:rounded-xl border-0 sm:border border-gray-200 overflow-hidden sm:shadow-sm">
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  {/* <thead className="bg-blue-600 dark:bg-blue-900 text-white border-b border-blue-400">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider w-12"></th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Sl No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Card No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        HOF Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Members Info
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                        Mobile
                      </th>
                      <th
                        colSpan="3"
                        className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider"
                      >
                        Action
                      </th>
                    </tr>
                  </thead> */}
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Family ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Names
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Card No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Mobile
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFamilies
                      .map((family, members, familyIndex) => [
                        <tr
                          key={`${family._id}-header`}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {/* Expand */}
                          {/* <td className="px-2 py-4">
                            <button
                              onClick={() => toggleExpanded(family._id)}
                              className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center"
                            >
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  expandedFamilies[family._id]
                                    ? "rotate-90"
                                    : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </td> */}
                          {/* Family ID */}
                          <td className="px-4 py-4">
                            <span className="font-medium">
                              {family.familyId || "-"}
                            </span>
                          </td>

                          {/* Family */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {/* <div className="px-2 w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                                {family.members?.[0]?.name
                                ?.charAt(0)?.toUpperCase()}
                              </div> */}

                              <div>
                                {/* <p className="px-2  font-semibold text-slate-900 dark:text-white">
                                  {family.members?.[0]?.name}
                                </p> */}
                                <p className="px-2  text-sm text-slate-500 dark:text-slate-400">
                                  {family.members?.map((member, index) => (
                                    <span
                                      key={index}
                                      className="block text-xs text-slate-900"
                                    >
                                      {member.name}
                                    </span>
                                  ))}
                                </p>

                                {/* <p className="px-2 text-xs text-slate-500">
                                  Family #{family.familyId}
                                </p> */}
                              </div>
                            </div>
                          </td>

                          {/* Card */}
                          <td className="px-4 py-4">
                            {family.members?.map((member, index) => (
                                    <span
                                      key={index}
                                      className="block text-xs text-slate-900"
                                    >
                                      {member.cardNumber || "-"}
                                    </span>
                                  ))}
                          </td>

                          {/* Category */}
                          <td className="px-4 py-4">
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-medium">
                              {family.category}
                            </span>
                          </td>

                          {/* Members */}
                          {/* <td className="px-4 py-4">
                            <span className="font-semibold">
                              {family.members.length}
                            </span>
                          </td> */}

                          {/* Mobile */}
                          <td className="px-4 py-4">{family.phone}</td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                family.lifted
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {family.lifted ? "Lifted" : "Pending"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4">
                            <div className="flex justify-center gap-2">
                              <Link
                                href={`/family/add?id=${family._id}`}
                                className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center"
                              >
                                <EditIcon size={16} />
                              </Link>

                              <button
                                onClick={() => handleDelete(family._id)}
                                className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                              >
                                <DeleteIcon size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>,

                        ...(expandedFamilies[family._id]
                          ? family.members.map((member, memberIndex) => (
                              <tr
                                key={`${family._id}-${memberIndex}`}
                                className="bg-slate-50 dark:bg-slate-800/50"
                              >
                                <td></td>
                                {/* <td className="px-2 py-3 text-sm text-slate-500">
                                  Member {memberIndex + 1}
                                </td> */}
                                <td className="px-4 py-3 text-sm">-</td>

                                <td>
                                  <div className="px-2 w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                                    {member.name?.charAt(0)}
                                  </div>
                                </td>

                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="px-4  font-semibold text-slate-900 dark:text-white">
                                        {member.name}
                                      </div>

                                      <div className="text-xs text-slate-500">
                                        {member.gender} • Age {member.age}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-4">
                                  {member.cardNumber || "-"}
                                </td>

                                <td className="px-4 py-3 text-sm">
                                  {family.category}
                                </td>

                                <td className="px-4 py-4">{family.phone}</td>

                                {/* <td className="px-4 py-3 text-sm">-</td>

                                <td className="px-4 py-3 text-sm">-</td> */}
                              </tr>
                            ))
                          : []),
                      ])
                      .flat()}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredFamilies.map((family) => (
                  <div key={family._id} className="bg-white">
                    {/* Status accent bar */}
                    <div className={`h-0.5 w-full ${family.lifted ? 'bg-green-400' : 'bg-amber-400'}`} />
                    
                    <div className="p-4">
                      {/* Card Header: avatar + name + status badge */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-bold text-base">{family.familyId}</span>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="font-semibold text-gray-900 text-base leading-tight truncate">{family.headName}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{family.phone}</p>
                        </div>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-0.5 ${
                          family.lifted
                            ? 'bg-green-100 text-green-700 ring-1 ring-green-200'
                            : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            family.lifted ? 'bg-green-500' : 'bg-amber-500'
                          }`}></span>
                          {family.lifted ? 'Lifted' : 'Pending'}
                        </span>
                      </div>

                      {/* Info chips row */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
                          {family.category}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                          {family.members.length} member{family.members.length !== 1 ? 's' : ''}
                        </span>
                        {family.rationCardNo && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-mono">
                            {family.rationCardNo}
                          </span>
                        )}
                      </div>

                      {/* Members list */}
                      {family.members.length > 0 && (
                        <div className="mb-3 bg-gray-50 rounded-2xl overflow-hidden">
                          {family.members.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 last:border-0">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-500 shadow-sm">
                                  {member.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                                  {(member.gender || member.age) && (
                                    <p className="text-xs text-gray-400">
                                      {[member.gender, member.age ? `Age ${member.age}` : null].filter(Boolean).join(' · ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {member.cardNumber && (
                                <span className="text-xs text-gray-500 font-mono ml-2 flex-shrink-0 bg-white px-2 py-1 rounded-lg border border-gray-200">
                                  {member.cardNumber}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="space-y-2">
                        {/* Lifted toggle */}
                        <div className="flex rounded-xl overflow-hidden border border-gray-200">
                          <button
                            onClick={() => handleLiftedChange(family._id, true)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors ${
                              family.lifted === true
                                ? 'bg-green-500 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Lifted
                          </button>
                          <div className="w-px bg-gray-200"></div>
                          <button
                            onClick={() => handleLiftedChange(family._id, false)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors ${
                              family.lifted === false
                                ? 'bg-amber-500 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            Pending
                          </button>
                        </div>
                        {/* Edit / Delete */}
                        <div className="flex gap-2">
                          <Link
                            href={`/family/add?id=${family._id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors"
                          >
                            <EditIcon size={14} />Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(family._id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-sm font-semibold transition-colors"
                          >
                            <DeleteIcon size={14} />Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredFamilies.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 py-16 text-center m-3 sm:m-0">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SearchIcon size={20} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No families found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
    </div>
  );
}

export default function DashboardPageWrapper() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}

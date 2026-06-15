"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, FilterIcon, PlusIcon, EditIcon, DeleteIcon, XIcon } from "lucide-react";
import { ProtectedRoute } from "../components/ProtectedRoute";

function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFamilies, setExpandedFamilies] = useState({});

  // Hide nav when searching on mobile
  useEffect(() => {
    const nav = document.querySelector("nav");
    if (nav) {
      if (searchQuery.trim() !== "") {
        nav.classList.add("hidden");
        nav.classList.remove("md:flex");
      } else {
        nav.classList.remove("hidden");
      }
    }
    return () => {
      if (nav) {
        nav.classList.remove("hidden");
      }
    };
  }, [searchQuery]);

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
        family._id === familyId ? { ...family, lifted } : family
      )
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

  const toggleExpanded = (familyId) => {
    setExpandedFamilies((prev) => ({
      ...prev,
      [familyId]: !prev[familyId],
    }));
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
      const matchesMember = family.members.some((member) =>
        member.name.toLowerCase().includes(queryLower) ||
        String(member.cardNumber).toLowerCase().includes(queryLower)
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex justify-between items-start gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Dashboard
              </h1>
              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
                Manage and search ration families
              </p>
            </div>
            <Link
              href="/family/add"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-xs sm:text-base rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              <PlusIcon size={18} className="sm:size-5" />
              <span className="hidden sm:inline">Add Family</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Floating Mobile Search Bar */}
        {searchQuery.trim() !== "" && (
          <div className="fixed md:hidden top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-3 z-50">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <XIcon size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Add top padding when search is active on mobile */}
        <div className={searchQuery.trim() !== "" ? "md:pt-0 pt-16" : ""}>
        {/* Stats Cards - Hide on mobile when searching */}
        {searchQuery.trim() === "" && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`border rounded-lg p-3 sm:p-6 ${getStatColorClass(stat.color)}`}
            >
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                {stat.label}
              </p>
              <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        )}

        {/* Search and Filter Section - Hide on mobile when searching */}
        {searchQuery.trim() === "" && (
        <div className="sticky top-0 md:relative bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-3 sm:p-6 mb-6 sm:mb-8 z-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FilterIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
                size={18}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none transition"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        )}

        {/* Results Count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {filteredFamilies.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900 dark:text-white">
              {families.length}
            </span>{" "}
            families
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 px-3 sm:px-6 py-8 sm:py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">Loading families...</p>
          </div>
        )}

        {/* Families Table - Desktop Only */}
        {!loading && filteredFamilies.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 dark:bg-blue-900 text-white border-b border-blue-400">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider w-12">
                      
                    </th>
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
                    <th colSpan="3" className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredFamilies.map((family, familyIndex) => [
                    /* Family Header Row */
                    <tr key={`${family._id}-header`} className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/50 dark:hover:to-blue-900/70 transition-colors">
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => toggleExpanded(family._id)}
                          className="inline-flex items-center justify-center w-6 h-6 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          <svg
                            className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform ${expandedFamilies[family._id] ? 'rotate-90' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">{familyIndex + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium">{family.rationCardNo || '-'}</td>
                      <td className="px-4 py-3 text-sm">{family.category}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{family.headName}</td>
                      <td colSpan="2" className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {family.members.length} member{family.members.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3 text-sm">{family.phone}</td>
                      <td className="px-4 py-3 text-center text-xs">
                        <Link href={`/family/add?id=${family._id}`} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</Link>
                      </td>
                    </tr>,
                    /* Member Rows (show when expanded) */
                    ...(expandedFamilies[family._id] ? family.members.map((member, memberIndex) => (
                      <tr key={`${family._id}-${memberIndex}`} className="bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <td colSpan="1" className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{familyIndex + 1}.{memberIndex + 1}</td>
                        <td className="px-4 py-3 text-sm">{member.cardNumber || '-'}</td>
                        <td className="px-4 py-3 text-sm">{family.category}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{member.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Gender: {member.gender || '-'} | Age: {member.age || '-'}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">FH: {member.fathersHusbandName || '-'}</div>
                        </td>
                        <td colSpan="2" className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-center text-xs"></td>
                      </tr>
                    )) : []),
                  ]).flat()}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-3 p-3 sm:p-4">
              {filteredFamilies.map((family) => (
                <div
                  key={family._id}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 hover:shadow-md transition-shadow"
                >
                  {/* Header with ID and Status */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Family ID</p>
                      <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">{family.familyId}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(family.status)}`}
                    >
                      {family.status.charAt(0).toUpperCase() + family.status.slice(1)}
                    </span>
                  </div>

                  {/* Head Information */}
                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Head / Details</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{family.headName}</p>
                    {family.rationCardNo && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ration Card: {family.rationCardNo}</p>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Category: {family.category}</p>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 7.985a1 1 0 00.502.756l4.06 2.256a1 1 0 001.466-.742c.166-.86-.023-1.467-.6-1.605L9.753 7.75a1 1 0 00-.502-.756L5.733 2.5a2 2 0 00-1.414-.586H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3.28a1 1 0 00-.948-.684l-1.498-7.985a1 1 0 00-.502-.756L5.733 2.5" />
                      </svg>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{family.phone}</p>
                    </div>
                  </div>

                  {/* Members */}
                  {family.members.length > 0 && (
                    <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Members</p>
                      <div className="space-y-2">
                        {family.members.map((member, idx) => (
                          <div key={idx} className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 p-2 rounded">
                            <div className="font-medium text-gray-900 dark:text-white mb-1">{member.name}</div>
                            <div className="space-y-0.5 text-gray-600 dark:text-gray-400">
                              {member.gender && <div>Gender: {member.gender}</div>}
                              {member.age && <div>Age: {member.age}</div>}
                              {member.fathersHusbandName && <div>Father/Husband: {member.fathersHusbandName}</div>}
                              {member.cardNumber && <div>Card No: {member.cardNumber}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* Lifted Status - Mobile Friendly Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLiftedChange(family._id, true)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                          family.lifted === true
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Lifted</span>
                      </button>

                      <button
                        onClick={() => handleLiftedChange(family._id, false)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                          family.lifted === false
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Non-Lifted</span>
                      </button>
                    </div>

                    {/* Lifted Complete Badge */}
                    {family.lifted === true && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Complete
                      </span>
                    )}

                    {/* Edit and Delete Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/family/add?id=${family._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded text-xs font-medium transition-colors"
                      >
                        <EditIcon size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(family._id)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded text-xs font-medium transition-colors"
                      >
                        <DeleteIcon size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredFamilies.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 px-3 sm:px-6 py-8 sm:py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">
              No families found matching your criteria
            </p>
          </div>
        )}
        </div>
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

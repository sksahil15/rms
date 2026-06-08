"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SearchIcon, FilterIcon, PlusIcon, EditIcon, DeleteIcon } from "lucide-react";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and search ration families
              </p>
            </div>
            <Link
              href="/family/add"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <PlusIcon size={20} />
              Add Family
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`border rounded-lg p-6 ${getStatColorClass(stat.color)}`}
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <SearchIcon
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by family ID, head name, card number, or member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FilterIcon
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
                size={20}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none transition"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
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

        {/* Families Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
          {filteredFamilies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Family ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Address
                    </th> */}
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredFamilies.map((family) => (
                    <tr
                      key={family._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Show Family ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400">
                        {family.familyId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {family.headName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {family.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {/* Family Head - highlighted */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {family.headName}
                          </span>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                            Head
                          </span>
                        </div>

                        {/* All Members */}
                        {family.members.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 py-0.5 pl-4 border-l-2 border-gray-200 dark:border-slate-600 ml-1 mb-1"
                          >
                            <div>
                              <span className="font-medium text-gray-800 dark:text-gray-200">
                                {member.name}
                              </span>
                              <span className="mx-1 text-gray-400">·</span>
                              <span className="text-gray-500 dark:text-gray-400 text-xs">
                                {member.cardNumber}
                              </span>
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {family.phone}
                      </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {family.address}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            family.status,
                          )}`}
                        >
                          {family.status.charAt(0).toUpperCase() +
                            family.status.slice(1)}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm"> */}
                        {/* <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition">
                          View
                        </button> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 cursor-pointer group">
                                <input
                                  type="radio"
                                  name={`lifted-${family._id}`}
                                  value="lifted"
                                  checked={family.lifted === true}
                                  onChange={() =>
                                    handleLiftedChange(family._id, true)
                                  }
                                  className="accent-green-500 w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors">
                                  Lifted
                                </span>
                              </label>

                              <label className="flex items-center gap-1.5 cursor-pointer group">
                                <input
                                  type="radio"
                                  name={`lifted-${family._id}`}
                                  value="non-lifted"
                                  checked={family.lifted === false}
                                  onChange={() =>
                                    handleLiftedChange(family._id, false)
                                  }
                                  className="accent-red-500 w-3.5 h-3.5 cursor-pointer"
                                />
                                <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-red-600 transition-colors">
                                  Non-Lifted
                                </span>
                              </label>
                            </div>

                            {family.lifted === true && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                                <svg
                                  className="w-3 h-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Complete
                              </span>
                            )}

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/family/add?id=${family._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded transition-colors"
                              >
                                <EditIcon size={16} />
                                <span className="text-xs font-medium">Edit</span>
                              </Link>
                              <button
                                onClick={() => handleDelete(family._id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded transition-colors"
                              >
                                <DeleteIcon size={16} />
                                <span className="text-xs font-medium">Delete</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      {/* </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No families found matching your criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

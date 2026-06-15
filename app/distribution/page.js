'use client';

import { useState, useMemo, useEffect } from 'react';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
import { ProtectedRoute } from '../components/ProtectedRoute';

function DistributionPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [liftedFilter, setLiftedFilter] = useState('all'); // 'all', 'lifted', 'non-lifted'
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await fetch('/api/families');
        const data = await response.json();
        if (data.success) {
          setFamilies(data.data);
        }
      } catch (error) {
        console.error('Error fetching families:', error);
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
        filterStatus === 'all' || family.status === filterStatus;

      const matchesLifted =
        liftedFilter === 'all' ||
        (liftedFilter === 'lifted' && family.lifted === true) ||
        (liftedFilter === 'non-lifted' && family.lifted !== true);

      return matchesSearch && matchesStatus && matchesLifted;
    });
  }, [searchQuery, filterStatus, liftedFilter, families]);
  
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  //     case 'inactive':
  //       return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  //     case 'pending':
  //       return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  //     default:
  //       return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      {/* <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Distribution
            </h1>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400">
              Manage and view your distribution information
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Mobile Search Input - Always Visible on Mobile */}
        <div className="md:hidden mb-4 sm:mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
            <input
              type="number"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 sm:py-3 text-sm border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition"
              >
                <XIcon size={18} className="text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-gray-500 dark:text-gray-400 px-1 mt-1">
              Showing {filteredFamilies.length} results
            </p>
          )}
        </div>

        {/* Floating Mobile Search Bar - REMOVED, using fixed input above instead */}

        {/* Add top padding when search is active on mobile */}
        <div>
        {/* Lifted/Non-Lifted Toggle - Hide on mobile when searching */}
        {searchQuery.trim() === "" && (
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => setLiftedFilter('all')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-base transition duration-200 ${
              liftedFilter === 'all'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setLiftedFilter('lifted')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-base transition duration-200 ${
              liftedFilter === 'lifted'
                ? 'bg-green-600 text-white dark:bg-green-500'
                : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            Lifted
          </button>
          <button
            onClick={() => setLiftedFilter('non-lifted')}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-base transition duration-200 ${
              liftedFilter === 'non-lifted'
                ? 'bg-yellow-600 text-white dark:bg-yellow-500'
                : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            Non-Lifted
          </button>
        </div>
        )}

        {/* Search and Filter Section */}
        <div className={`sticky top-16 sm:top-20 md:relative bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-3 sm:p-6 mb-6 sm:mb-8 z-30 hidden md:block ${
          searchQuery.trim() !== "" ? "md:block" : ""
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <div className="relative mb-2">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
                <input
                  type="number"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
                Search by Family ID, Card No, Name, or Member Name
              </p>
            </div>

            {/* Filter */}
            {/* <div className="relative">
              <FilterIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
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
            </div> */}
          </div>
        </div>


        {/* Results Count */}
        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{filteredFamilies.length}</span> of{' '}
            <span className="font-bold text-gray-900 dark:text-white">{families.length}</span> families
          </p>
        </div>

        {/* Families Table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
          {loading ? (
            <div className="px-3 sm:px-6 py-8 sm:py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">Loading families...</p>
            </div>
          ) : filteredFamilies.length > 0 ? (
            <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Family ID
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Card No
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                          {family.familyId}
                        </div>
                      </td>
                      
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                        {/* Family Head - highlighted */}
                        <div className="flex items-center gap-2 mb-2">
                          {/* <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span> */}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {/* {family.headName} */}
                          </span>
                          {/* <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                            Head
                          </span> */}
                        </div>

                        {/* All Members */}
                        {family.members.map((member, index) => (
                          <div key={index} className="flex items-center gap-2 mb-2">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                              {member.name}
                              </span>
                            </div>
                        ))}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col gap-1">
                          {family.members.map((member, index) => (
                            <div key={index} className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                              {member.cardNumber}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleLiftedChange(family._id, true)}
                                className={`px-3 py-1 rounded text-xs font-medium transition ${
                                  family.lifted === true
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                              >
                                Lifted
                              </button>
                              <button
                                onClick={() => handleLiftedChange(family._id, false)}
                                className={`px-3 py-1 rounded text-xs font-medium transition ${
                                  family.lifted === false
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                                }`}
                              >
                                Non-Lifted
                              </button>
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
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 sm:space-y-4 p-0">
              {filteredFamilies.map((family) => (
                <div
                  key={family._id}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">Family ID</p>
                    <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400">
                      {family.familyId}
                    </p>
                  </div>

                  {/* Members */}
                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">Members</p>
                    <div className="space-y-2">
                      {family.members.map((member, idx) => (
                        <div key={idx} className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{member.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Card: {member.cardNumber}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLiftedChange(family._id, true)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                          family.lifted === true
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Lifted</span>
                      </button>
                      <button
                        onClick={() => handleLiftedChange(family._id, false)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 ${
                          family.lifted === false
                            ? 'bg-red-500 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                        }`}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Non-Lifted</span>
                      </button>
                    </div>

                    {family.lifted === true && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Complete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="px-3 sm:px-6 py-8 sm:py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">
                No families found matching your criteria
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default function DistributionPageWrapper() {
  return (
    <ProtectedRoute>
      <DistributionPage />
    </ProtectedRoute>
  );
}

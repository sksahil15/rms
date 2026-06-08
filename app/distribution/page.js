'use client';

import { useState, useMemo, useEffect } from 'react';
import { SearchIcon, FilterIcon } from 'lucide-react';

export default function DistributionPage() {
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
      <div className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Distribution
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage and view your distribution information
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lifted/Non-Lifted Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => setLiftedFilter('all')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              liftedFilter === 'all'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setLiftedFilter('lifted')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              liftedFilter === 'lifted'
                ? 'bg-green-600 text-white dark:bg-green-500'
                : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            Lifted
          </button>
          <button
            onClick={() => setLiftedFilter('non-lifted')}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition ${
              liftedFilter === 'non-lifted'
                ? 'bg-yellow-600 text-white dark:bg-yellow-500'
                : 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            Non-Lifted
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600" size={20} />
              <input
                type="text"
                placeholder="Search by family ID, head name, card number, or member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
              />
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
            <div className="hidden md:block overflow-x-auto">
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
                        <div className="flex flex-col gap-1">
                          <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                            {family.familyId}
                          </div>
                          {family.members.map((member, index) => (
                            <div key={index} className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                              {member.cardNumber}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 dark:text-white">
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
                          <div key={index} className="flex items-center gap-2 mb-2">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                              {member.name}
                              </span>
                            </div>
                        ))}
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
          ) : (
            <div className="px-3 sm:px-6 py-8 sm:py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg">
                No families found matching your criteria
              </p>
            </div>
          )}

          {/* Mobile Card View */}
          {!loading && filteredFamilies.length > 0 && (
            <div className="md:hidden space-y-3 sm:space-y-4 p-3 sm:p-4">
              {filteredFamilies.map((family) => (
                <div
                  key={family._id}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-slate-800"
                >
                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">
                      Family ID: {family.familyId}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {family.headName}
                      </span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-medium">
                        Head
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Members</p>
                    <div className="space-y-1">
                      {family.members.map((member, idx) => (
                        <div key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-gray-500 dark:text-gray-400"> - Card: {member.cardNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>

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
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 w-fit">
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

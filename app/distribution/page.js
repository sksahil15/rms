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
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Distribution</h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            <span className="font-bold text-sm">{families.length}</span>
            <span className="opacity-80">Total</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-green-50 text-green-700 border-green-200">
            <span className="font-bold text-sm">{families.filter(f => f.lifted).length}</span>
            <span className="opacity-80">Lifted</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-amber-50 text-amber-700 border-amber-200">
            <span className="font-bold text-sm">{families.filter(f => !f.lifted).length}</span>
            <span className="opacity-80">Pending</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2.5 sticky top-0 z-40 flex items-center gap-2 sm:gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="number"
            placeholder="Search by ID or Card No..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <XIcon size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {[['all', 'All', 'bg-blue-600'], ['lifted', 'Lifted', 'bg-green-600'], ['non-lifted', 'Pending', 'bg-amber-500']].map(([val, label, activeColor]) => (
            <button
              key={val}
              onClick={() => setLiftedFilter(val)}
              className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                liftedFilter === val ? `${activeColor} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{label}</button>
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-auto whitespace-nowrap">
          <span className="font-semibold text-gray-700">{filteredFamilies.length}</span> of {families.length}
        </span>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-gray-500 text-sm">Loading families...</p>
            </div>
          ) : filteredFamilies.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">No families found matching your criteria</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Family ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Members</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Card No</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFamilies.map((family) => (
                      <tr key={family._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-blue-600">{family.familyId}</span>
                        </td>
                        <td className="px-4 py-3">
                          {family.members.map((member, index) => (
                            <div key={index} className="flex items-center gap-1.5 mb-1 last:mb-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                              <span className="text-sm text-gray-900">{member.name}</span>
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3">
                          {family.members.map((member, index) => (
                            <div key={index} className="text-sm text-gray-600 mb-1 last:mb-0">{member.cardNumber || '-'}</div>
                          ))}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            family.lifted
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${family.lifted ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            {family.lifted ? 'Lifted' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleLiftedChange(family._id, true)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                family.lifted === true ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >Lifted</button>
                            <button
                              onClick={() => handleLiftedChange(family._id, false)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                family.lifted === false ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >Pending</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3 p-3">
                {filteredFamilies.map((family) => (
                  <div key={family._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-blue-600">{family.familyId}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        family.lifted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${family.lifted ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        {family.lifted ? 'Lifted' : 'Pending'}
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-3 pb-3 border-b border-gray-100">
                      {family.members.map((member, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                            <span className="text-sm font-medium text-gray-900">{member.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">{member.cardNumber}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleLiftedChange(family._id, true)}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          family.lifted === true ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >✓ Lifted</button>
                      <button
                        onClick={() => handleLiftedChange(family._id, false)}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          family.lifted === false ? 'bg-amber-500 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >○ Pending</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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

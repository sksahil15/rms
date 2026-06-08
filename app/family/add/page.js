"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";

export default function AddFamilyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const familyId = searchParams.get("id");
  const isEditing = !!familyId;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [memberCount, setMemberCount] = useState(1);
  const [members, setMembers] = useState([
    { name: "", cardNumber: "" },
  ]);

  const [formData, setFormData] = useState({
    familyId: "",
    headName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    category: "",
    memberCount: 1,
    members: [{ name: "", cardNumber: "" }],
    monthlyIncome: "",
    status: "pending",
    notes: "",
  });

  // Fetch existing family data if editing
  useEffect(() => {
    setIsMounted(true);
    if (isEditing) {
      setPageLoading(true);
      const fetchFamily = async () => {
        try {
          const response = await fetch(`/api/families/${familyId}`);
          const data = await response.json();
          if (data.success) {
            setFormData(data.data);
          }
        } catch (error) {
          console.error("Error fetching family:", error);
          setMessage({
            type: "error",
            text: "Failed to load family data",
          });
        } finally {
          setPageLoading(false);
        }
      };
      fetchFamily();
    }
  }, [familyId, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMemberCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      memberCount: count,
    }));

    const newMembers = Array(count)
      .fill(null)
      .map(
        (_, i) =>
          formData.members[i] || { name: "", cardNumber: "" },
      );
    setFormData((prev) => ({
      ...prev,
      members: newMembers,
    }));
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      members: newMembers,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const url = isEditing ? `/api/families/${familyId}` : "/api/families";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: isEditing ? "Family updated successfully!" : "Family added successfully!",
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to save family",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-4"
          >
            <ArrowLeftIcon size={20} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Edit Family" : "Add New Family"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isEditing ? "Update family information in the system" : "Register a new ration family in the system"}
          </p>
        </div>

        {/* Loading State - only show after mount to prevent hydration mismatch */}
        {isMounted && pageLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-600 dark:text-gray-400">Loading family data...</div>
          </div>
        )}

        {!pageLoading && (
          <>
        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircleIcon size={20} />
            ) : (
              <AlertCircleIcon size={20} />
            )}
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Family Information Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Family Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Family ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ration Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="familyId"
                  value={formData.familyId}
                  onChange={handleInputChange}
                  placeholder="e.g., FAM-001"
                  required
                  disabled={isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Head Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="headName"
                  value={formData.headName}
                  onChange={handleInputChange}
                  placeholder="Full name of family head"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 300 1234567"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="AAY">AAY (Below Poverty Line)</option>
                  <option value="PHH">PHH (Priority Household)</option>
                  <option value="SPHH">SPHH (Special Priority Household)</option>
                  <option value="RKSY I">RKSY I (Rural Kisan Yojana I)</option>
                  <option value="RKSY II">RKSY II (Rural Kisan Yojana II)</option>
                </select>
              </div>

              {/* Status */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div> */}
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Family Members Section */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Family Members
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Members
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={formData.memberCount}
                  onChange={handleMemberCountChange}
                  min="0"
                  max="20"
                  className="w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newCount = formData.memberCount + 1;
                    if (newCount <= 20) {
                      setFormData((prev) => ({
                        ...prev,
                        memberCount: newCount,
                        members: [
                          ...prev.members,
                          { name: "", cardNumber: "" },
                        ],
                      }));
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-xl">+</span>
                  Add Member
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Optional - You can add member details later</p>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Card Number 
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Age
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      CNIC
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {formData.members.map((member, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, "name", e.target.value)
                          }
                          placeholder="Name"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={member.cardNumber}
                          onChange={(e) =>
                            handleMemberChange(
                              index,
                              "cardNumber",
                              e.target.value,
                            )
                          }
                          placeholder="Card Number"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      {/* <td className="px-4 py-3">
                        <input
                          type="number"
                          value={member.age}
                          onChange={(e) =>
                            handleMemberChange(index, "age", e.target.value)
                          }
                          placeholder="Age"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={member.cnic}
                          onChange={(e) =>
                            handleMemberChange(index, "cnic", e.target.value)
                          }
                          placeholder="CNIC"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (isEditing ? "Updating Family..." : "Adding Family...") : (isEditing ? "Update Family" : "Add Family")}
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
}

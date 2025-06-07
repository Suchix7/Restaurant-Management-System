import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const InquiriesView = () => {
  const [inquiries, setInquiries] = useState([]);

  const fetchInquiries = async () => {
    try {
      const res = await axiosInstance.get("/contact");
      setInquiries(res.data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/contact/${id}`);
      toast.success("Inquiry deleted.");
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete inquiry.");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">Customer Inquiries</h2>
      <p className="text-slate-600">Review and respond to user inquiries.</p>

      {inquiries.length > 0 ? (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full table-auto text-sm text-left text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-medium">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="border-t">
                  <td className="px-4 py-3">{inquiry.name}</td>
                  <td className="px-4 py-3">{inquiry.email}</td>
                  <td className="px-4 py-3">{inquiry.message}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        window.location.href = `mailto:${inquiry.email}`;
                      }}
                      className="text-black cursor-pointer bg-green-500"
                    >
                      Reply
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(inquiry._id)}
                      className="text-black cursor-pointer bg-red-500"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 italic">No inquiries found.</p>
      )}
    </div>
  );
};

export default InquiriesView;

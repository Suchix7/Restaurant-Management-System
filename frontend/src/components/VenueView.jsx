import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance.js";
import { toast } from "react-hot-toast";

const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const VenueView = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Replace with real API call
    const fetchData = async () => {
      // const data = [
      //   {
      //     _id: "1",
      //     name: "Anish Shrestha",
      //     email: "anish@example.com",
      //     bookingType: "Birthday",
      //     phone: "9800000000",
      //     eventType: "Party",
      //     estimatedGuests: 50,
      //     reserveDate: "2025-06-15",
      //     startTime: "18:00",
      //     endTime: "22:00",
      //     specialRequests: "Vegan food",
      //     file: "",
      //     status: "pending",
      //   },
      //   {
      //     _id: "2",
      //     name: "Ram Bahadur",
      //     email: "ram@example.com",
      //     bookingType: "Wedding",
      //     phone: "9812345678",
      //     eventType: "Reception",
      //     estimatedGuests: 120,
      //     reserveDate: "2025-06-20",
      //     startTime: "14:00",
      //     endTime: "20:00",
      //     specialRequests: "",
      //     file: "",
      //     status: "confirmed",
      //   },
      // ];

      try {
        const response = await axiosInstance.get("/venue-reservations");
        const data = response.data || [];
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setReservations([]);
        // Handle error (e.g., show toast notification)
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setReservations((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const response = await axiosInstance.put(`/venue-reservations/${id}`, {
        status: newStatus,
      });
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
      // Revert the status change in case of error
      setReservations((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: item.status } : item
        )
      );
    }

    // TODO: Update on server
    console.log(`Updated ${id} to ${newStatus}`);
  };

  const handleExport = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Booking Type",
      "Event Type",
      "Guests",
      "Reserve Date",
      "Start Time",
      "End Time",
      "Special Requests",
      "Status",
    ];

    const rows = reservations.map((r) => [
      r.name,
      r.email,
      r.phone,
      r.bookingType,
      r.eventType,
      r.guestCount,
      new Date(r.date).toLocaleDateString(),
      r.startTime,
      r.endTime,
      r.specialRequests,
      r.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((field) => `"${field}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "venue_reservations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          Venue Reservations
        </h2>
        <Button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Export CSV
        </Button>
      </div>

      {reservations.length === 0 ? (
        <p className="text-slate-600">No reservations found.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reservations.map((res) => (
            <Card key={res._id} className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">{res.name}</CardTitle>
                <p className="text-sm text-slate-500">
                  {res.email} | {res.phone}
                </p>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-700">
                <p>
                  <strong>Booking Type:</strong> {res.bookingType}
                </p>
                <p>
                  <strong>Event Type:</strong> {res.eventType}
                </p>
                <p>
                  <strong>Guests:</strong> {res.guestCount}
                </p>
                <p>
                  <strong>Time:</strong> {res.startTime} - {res.endTime}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(res.date).toLocaleDateString()}
                </p>
                {res.specialRequests && (
                  <p>
                    <strong>Requests:</strong> {res.specialRequests}
                  </p>
                )}

                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      res.status
                    )}`}
                  >
                    {res.status}
                  </span>
                  <Select
                    value={res.status}
                    onValueChange={(val) => handleStatusChange(res._id, val)}
                  >
                    <SelectTrigger className="w-[140px] border-slate-300">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueView;

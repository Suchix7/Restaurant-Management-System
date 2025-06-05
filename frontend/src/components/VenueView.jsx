import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

  // Replace with real API call
  useEffect(() => {
    const fetchData = async () => {
      // Simulated API response
      const data = [
        {
          _id: "1",
          name: "Anish Shrestha",
          email: "anish@example.com",
          bookingType: "Birthday",
          phone: "9800000000",
          eventType: "Party",
          estimatedGuests: 50,
          reserveDate: "2025-06-15",
          startTime: "18:00",
          endTime: "22:00",
          specialRequests: "Vegan food",
          file: "",
          status: "pending",
        },
        {
          _id: "2",
          name: "Ram Bahadur",
          email: "ram@example.com",
          bookingType: "Wedding",
          phone: "9812345678",
          eventType: "Reception",
          estimatedGuests: 120,
          reserveDate: "2025-06-20",
          startTime: "14:00",
          endTime: "20:00",
          specialRequests: "",
          file: "",
          status: "confirmed",
        },
      ];
      setReservations(data);
    };

    fetchData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, status: newStatus } : item
      )
    );

    // TODO: Send update to server
    console.log(`Status for ${id} updated to: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Venue Reservations</h2>

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
                  <strong>Guests:</strong> {res.estimatedGuests}
                </p>
                <p>
                  <strong>Time:</strong> {res.startTime} - {res.endTime}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(res.reserveDate).toLocaleDateString()}
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

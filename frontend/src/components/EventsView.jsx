import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance.js";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";

const EventsView = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [posterImageFile, setPosterImageFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    category: "",
    price: "",
    capacity: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/events");
      setEvents(res.data || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      date: event.date.split("T")[0],
      time: event.time,
      description: event.description,
      location: event.location,
      category: event.category,
      price: event.price,
      capacity: event.capacity,
    });
    setPosterImageFile(null);
    setPosterPreview(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (posterImageFile) {
        data.append("posterImage", posterImageFile);
      }

      await axiosInstance.put(`/events/${editingEvent._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event updated successfully");
      setEditingEvent(null);
      fetchEvents();
      setLoading(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update event");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Event Scheduling
      </h2>
      <p className="text-slate-600 mb-6">Create or update upcoming events.</p>

      {events.length === 0 ? (
        <p className="text-slate-500 italic">No events scheduled.</p>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="border border-slate-200 rounded-lg p-4 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-slate-800">
                  {event.title}
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditClick(event)}
                    className="bg-yellow-400"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <p className="text-slate-600">{event.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-700">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {event.time}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
                <p>
                  <strong>Category:</strong> {event.category}
                </p>
                <p>
                  <strong>Price:</strong> {event.price}
                </p>
                <p>
                  <strong>Capacity:</strong> {event.capacity}
                </p>
                <p>
                  <strong>RSVPs:</strong> {event.rsvpCount}
                </p>
              </div>

              {event.posterImage?.imageUrl && (
                <div className="mt-3">
                  <img
                    src={event.posterImage.imageUrl}
                    alt="Event Poster"
                    className="w-full max-w-md rounded shadow"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Form Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-xl max-h-screen overflow-y-auto space-y-4 relative">
            <h3 className="text-xl font-semibold text-slate-800">Edit Event</h3>

            <Input
              name="title"
              value={formData.title || ""}
              onChange={handleFormChange}
              placeholder="Title"
            />
            <Input
              name="date"
              type="date"
              value={formData.date || ""}
              onChange={handleFormChange}
            />
            <Input
              name="time"
              type="time"
              value={formData.time || ""}
              onChange={handleFormChange}
            />
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleFormChange}
            />
            <Input
              name="location"
              value={formData.location || ""}
              onChange={handleFormChange}
            />
            <Input
              name="category"
              value={formData.category || ""}
              onChange={handleFormChange}
            />
            <Input
              name="price"
              value={formData.price || ""}
              onChange={handleFormChange}
            />
            <Input
              name="capacity"
              type="number"
              value={formData.capacity ?? ""}
              onChange={handleFormChange}
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Poster Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPosterImageFile(file);
                  if (file) {
                    setPosterPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Preview"
                  className="mt-2 w-full max-w-xs h-48 object-cover rounded shadow"
                />
              )}
            </div>

            <div className="flex justify-end gap-2 sticky bottom-0 bg-white pt-4 pb-2">
              {loading ? (
                <Button
                  onClick={handleUpdate}
                  className="bg-blue-400 cursor-pointer"
                >
                  <Loader className="animate-spin" />
                  Update
                </Button>
              ) : (
                <Button
                  onClick={handleUpdate}
                  className="bg-blue-400 cursor-pointer"
                >
                  Update
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setEditingEvent(null)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsView;

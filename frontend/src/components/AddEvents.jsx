import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const AddEvents = () => {
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
  const [posterImage, setPosterImage] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPosterImage(file);
    setPosterPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (posterImage) {
      data.append("posterImage", posterImage);
    }

    try {
      await axiosInstance.post("/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Event created successfully");
      // Reset form
      setFormData({
        title: "",
        date: "",
        time: "",
        description: "",
        location: "",
        category: "",
        price: "",
        capacity: "",
      });
      setPosterImage(null);
      setPosterPreview(null);
      setLoading(false);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Title"
          value={formData.title || ""}
          onChange={handleChange}
          required
        />
        <Input
          name="date"
          type="date"
          value={formData.date || ""}
          onChange={handleChange}
          required
        />
        <Input
          name="time"
          type="time"
          value={formData.time || ""}
          onChange={handleChange}
          required
        />
        <Textarea
          name="description"
          placeholder="Description"
          value={formData.description || ""}
          onChange={handleChange}
          required
        />
        <Input
          name="location"
          placeholder="Location"
          value={formData.location || ""}
          onChange={handleChange}
          required
        />
        <Input
          name="category"
          placeholder="Category"
          value={formData.category || ""}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          placeholder="Price"
          value={formData.price || ""}
          onChange={handleChange}
          required
        />
        <Input
          name="capacity"
          type="number"
          placeholder="Capacity"
          value={formData.capacity ?? ""}
          onChange={handleChange}
          required
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Poster Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {posterPreview && (
            <img
              src={posterPreview}
              alt="Poster Preview"
              className="mt-2 w-full max-w-xs h-48 object-cover rounded shadow"
            />
          )}
        </div>
        {loading ? (
          <Button disabled className="bg-blue-500">
            <Loader className="animate-spin" />
            Create Event
          </Button>
        ) : (
          <Button type="submit" className="bg-blue-500 cursor-pointer">
            Create Event
          </Button>
        )}
      </form>
    </div>
  );
};

export default AddEvents;

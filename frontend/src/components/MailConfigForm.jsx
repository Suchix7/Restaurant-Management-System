import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance.js";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const MailConfigForm = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const fetchConfig = async () => {
    try {
      const res = await axiosInstance.get("/mail-config");
      if (res.data) {
        setEmail(res.data.email);
        setPass(res.data.pass);
        setIsExisting(true);
      }
    } catch (err) {
      // No config exists; this is okay
      console.log("No existing MailConfig found.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isExisting) {
        const res = await axiosInstance.put("/mail-config", { email, pass });
        toast.success("Mail configuration updated!");
      } else {
        const res = await axiosInstance.post("/mail-config", { email, pass });
        toast.success("Mail configuration created!");
        setIsExisting(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-4">
        {isExisting ? "Edit Mail Configuration" : "Add Mail Configuration"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <label className="block font-medium mb-1">Password:</label>
          <input
            type={showPass ? "text" : "password"}
            className="w-full border rounded px-3 py-2 pr-10"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isExisting ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default MailConfigForm;

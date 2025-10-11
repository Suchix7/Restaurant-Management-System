import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axiosInstance.js";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyHourRow = () => ({
  days: [],
  open: "",
  close: "",
  closed: false,
  note: "",
});

const ContactSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contactId, setContactId] = useState(null); // not needed for API, but handy for debug
  const [form, setForm] = useState({
    locationLabel: "",
    blurb: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      geo: { coordinates: ["", ""], type: "Point" }, // [lng, lat] as strings in UI
    },
    openingHours: [emptyHourRow()],
    published: true,
  });

  // Fetch existing singleton (if any)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/contactus");
        if (data) {
          setContactId(data._id);
          setForm({
            locationLabel: data.locationLabel || "",
            blurb: data.blurb || "",
            phone: data.phone || "",
            email: data.email || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              state: data.address?.state || "",
              postalCode: data.address?.postalCode || "",
              country: data.address?.country || "",
              geo: {
                type: "Point",
                coordinates: [
                  data.address?.geo?.coordinates?.[0]?.toString() || "",
                  data.address?.geo?.coordinates?.[1]?.toString() || "",
                ],
              },
            },
            openingHours: (data.openingHours || []).map((row) => ({
              days: row.days || [],
              open: row.open || "",
              close: row.close || "",
              closed: !!row.closed,
              note: row.note || "",
            })) || [emptyHourRow()],
            published: data.published ?? true,
          });
        }
      } catch (err) {
        // 404 means no document yet — that’s fine
        if (err?.response?.status !== 404) {
          console.error(err);
          toast.error("Failed to load contact info");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const update = (path, value) => {
    setForm((prev) => {
      const clone = structuredClone(prev);
      const keys = Array.isArray(path) ? path : path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys.at(-1)] = value;
      return clone;
    });
  };

  const addHoursRow = () =>
    update("openingHours", [...form.openingHours, emptyHourRow()]);
  const removeHoursRow = (idx) =>
    update(
      "openingHours",
      form.openingHours.length > 1
        ? form.openingHours.filter((_, i) => i !== idx)
        : [emptyHourRow()]
    );

  const toggleDay = (idx, day) => {
    const rows = [...form.openingHours];
    const set = new Set(rows[idx].days);
    set.has(day) ? set.delete(day) : set.add(day);
    rows[idx].days = Array.from(set);
    update("openingHours", rows);
  };

  const onRowChange = (idx, key, value) => {
    const rows = [...form.openingHours];
    rows[idx][key] = value;
    if (key === "closed" && value) {
      rows[idx].open = "";
      rows[idx].close = "";
    }
    update("openingHours", rows);
  };

  const payload = useMemo(() => {
    // Convert strings to numbers for coordinates if provided
    const lng = form.address.geo.coordinates[0];
    const lat = form.address.geo.coordinates[1];
    const hasGeo =
      lng !== "" && lat !== "" && !Number.isNaN(+lng) && !Number.isNaN(+lat);
    return {
      locationLabel: form.locationLabel?.trim() || undefined,
      blurb: form.blurb?.trim() || undefined,
      phone: form.phone?.trim(),
      email: form.email?.trim(),
      address: {
        street: form.address.street?.trim(),
        city: form.address.city?.trim(),
        state: form.address.state?.trim(),
        postalCode: form.address.postalCode?.trim(),
        country: form.address.country?.trim(),
        ...(hasGeo
          ? { geo: { type: "Point", coordinates: [+lng, +lat] } }
          : {}),
      },
      openingHours: form.openingHours
        .filter((r) => r.days?.length)
        .map((r) => ({
          days: r.days,
          open: r.closed ? null : r.open || null,
          close: r.closed ? null : r.close || null,
          closed: !!r.closed,
          note: r.note?.trim() || undefined,
        })),
      published: !!form.published,
    };
  }, [form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // PUT upserts the singleton
      const { data } = await axiosInstance.put("/contactus", payload);
      setContactId(data?._id ?? null);
      toast.success("Contact info saved");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to save contact";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Contact Settings
          </h2>
          <p className="text-slate-600">
            Manage the “Get in Touch” block content.
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-blue-500"
          disabled={saving || loading}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <>
          {/* Basics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Location label (optional) – e.g., The Rocks, Sydney"
              value={form.locationLabel}
              onChange={(e) => update("locationLabel", e.target.value)}
            />
            <Input
              placeholder="Phone (e.g., +61 2 1234 5678)"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Street"
                value={form.address.street}
                onChange={(e) => update("address.street", e.target.value)}
              />
              <Input
                placeholder="City"
                value={form.address.city}
                onChange={(e) => update("address.city", e.target.value)}
              />
              <Input
                placeholder="State / Province"
                value={form.address.state}
                onChange={(e) => update("address.state", e.target.value)}
              />
              <Input
                placeholder="Postal Code"
                value={form.address.postalCode}
                onChange={(e) => update("address.postalCode", e.target.value)}
              />
              <Input
                placeholder="Country"
                value={form.address.country}
                onChange={(e) => update("address.country", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Longitude"
                  value={form.address.geo.coordinates[0]}
                  onChange={(e) =>
                    update(["address", "geo", "coordinates", 0], e.target.value)
                  }
                />
                <Input
                  placeholder="Latitude"
                  value={form.address.geo.coordinates[1]}
                  onChange={(e) =>
                    update(["address", "geo", "coordinates", 1], e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-800">Opening Hours</h3>
              <Button
                variant="secondary"
                onClick={addHoursRow}
                className="cursor-pointer"
              >
                + Add Row
              </Button>
            </div>

            <div className="space-y-4">
              {form.openingHours.map((row, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Row {idx + 1}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => removeHoursRow(idx)}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>

                  {/* Days selector */}
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d) => (
                      <label
                        key={d}
                        className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                          row.days.includes(d)
                            ? "bg-slate-900 text-white border-slate-900"
                            : "border-slate-300 text-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={row.days.includes(d)}
                          onChange={() => toggleDay(idx, d)}
                        />
                        {d}
                      </label>
                    ))}
                  </div>

                  {/* Time + Closed */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        id={`closed-${idx}`}
                        type="checkbox"
                        checked={row.closed}
                        onChange={(e) =>
                          onRowChange(idx, "closed", e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`closed-${idx}`}
                        className="text-sm text-slate-700"
                      >
                        Closed
                      </label>
                    </div>
                    <Input
                      type="time"
                      placeholder="Open (HH:mm)"
                      value={row.open || ""}
                      disabled={row.closed}
                      onChange={(e) => onRowChange(idx, "open", e.target.value)}
                    />
                    <Input
                      type="time"
                      placeholder="Close (HH:mm)"
                      value={row.close || ""}
                      disabled={row.closed}
                      onChange={(e) =>
                        onRowChange(idx, "close", e.target.value)
                      }
                    />
                  </div>

                  <Input
                    placeholder="Note (optional)"
                    value={row.note}
                    onChange={(e) => onRowChange(idx, "note", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              className="bg-blue-500"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Contact"}
            </Button>
          </div>

          {contactId && (
            <p className="text-xs text-slate-400 mt-2">
              Document ID: {contactId}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ContactSettings;

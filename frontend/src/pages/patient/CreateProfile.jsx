import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMyProfile } from "../../services/patientService";
import PatientNavbar from "../../components/PatientNavbar";

export default function CreateProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phone: "",
    dob: "",
    gender: "",
    nic: "",
    bloodGroup: "",
    heightCm: "",
    weightKg: "",
    address: {
      district: "",
      city: "",
      line1: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    medicalHistory: {
      allergies: "",
      chronicDiseases: "",
      medications: "",
      surgeries: "",
      notes: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const convertCommaSeparated = (value) => {
    if (!value) return [];
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        phone: form.phone.trim(),
        dob: form.dob || null,
        gender: form.gender || "",
        nic: form.nic.trim(),
        bloodGroup: form.bloodGroup || "",
        heightCm: form.heightCm ? Number(form.heightCm) : null,
        weightKg: form.weightKg ? Number(form.weightKg) : null,
        address: {
          district: form.address.district.trim(),
          city: form.address.city.trim(),
          line1: form.address.line1.trim(),
        },
        emergencyContact: {
          name: form.emergencyContact.name.trim(),
          relationship: form.emergencyContact.relationship.trim(),
          phone: form.emergencyContact.phone.trim(),
        },
        medicalHistory: {
          allergies: convertCommaSeparated(form.medicalHistory.allergies),
          chronicDiseases: convertCommaSeparated(
            form.medicalHistory.chronicDiseases
          ),
          medications: convertCommaSeparated(form.medicalHistory.medications),
          surgeries: convertCommaSeparated(form.medicalHistory.surgeries),
          notes: form.medicalHistory.notes.trim(),
        },
      };

      const res = await createMyProfile(payload);

      setMessage(res.message || "Profile created successfully");

      setTimeout(() => {
        navigate("/patient/dashboard");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <PatientNavbar />
      <div className="mx-auto max-w-6xl px-4 mt-5">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Create Patient Profile
          </h1>
          <p className="mt-2 text-slate-600">
            Complete your personal, medical, and emergency details to activate
            your patient dashboard.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Basic Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0771234567"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  NIC
                </label>
                <input
                  type="text"
                  name="nic"
                  value={form.nic}
                  onChange={handleChange}
                  placeholder="Enter NIC"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="heightCm"
                  value={form.heightCm}
                  onChange={handleChange}
                  placeholder="170"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weightKg"
                  value={form.weightKg}
                  onChange={handleChange}
                  placeholder="65"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Address Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  District
                </label>
                <input
                  type="text"
                  value={form.address.district}
                  onChange={(e) =>
                    handleNestedChange("address", "district", e.target.value)
                  }
                  placeholder="Jaffna"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  value={form.address.city}
                  onChange={(e) =>
                    handleNestedChange("address", "city", e.target.value)
                  }
                  placeholder="Nallur"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Address Line
                </label>
                <input
                  type="text"
                  value={form.address.line1}
                  onChange={(e) =>
                    handleNestedChange("address", "line1", e.target.value)
                  }
                  placeholder="Street / House number"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Emergency Contact
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={form.emergencyContact.name}
                  onChange={(e) =>
                    handleNestedChange(
                      "emergencyContact",
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Parent / Guardian"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Relationship
                </label>
                <input
                  type="text"
                  value={form.emergencyContact.relationship}
                  onChange={(e) =>
                    handleNestedChange(
                      "emergencyContact",
                      "relationship",
                      e.target.value
                    )
                  }
                  placeholder="Mother"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={form.emergencyContact.phone}
                  onChange={(e) =>
                    handleNestedChange(
                      "emergencyContact",
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="0771234567"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Medical History
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Allergies
                </label>
                <input
                  type="text"
                  value={form.medicalHistory.allergies}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicalHistory",
                      "allergies",
                      e.target.value
                    )
                  }
                  placeholder="Comma separated values"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Chronic Diseases
                </label>
                <input
                  type="text"
                  value={form.medicalHistory.chronicDiseases}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicalHistory",
                      "chronicDiseases",
                      e.target.value
                    )
                  }
                  placeholder="Comma separated values"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Medications
                </label>
                <input
                  type="text"
                  value={form.medicalHistory.medications}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicalHistory",
                      "medications",
                      e.target.value
                    )
                  }
                  placeholder="Comma separated values"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Surgeries
                </label>
                <input
                  type="text"
                  value={form.medicalHistory.surgeries}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicalHistory",
                      "surgeries",
                      e.target.value
                    )
                  }
                  placeholder="Comma separated values"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  rows="5"
                  value={form.medicalHistory.notes}
                  onChange={(e) =>
                    handleNestedChange(
                      "medicalHistory",
                      "notes",
                      e.target.value
                    )
                  }
                  placeholder="Additional medical notes"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/patient/dashboard")}
              className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { getMyProfile, updateMyProfile, uploadMyAvatar } from "../../services/patientService";
import PatientNavbar from "../../components/PatientNavbar";

function getLoginIdentity() {
  const keys = ["user", "auth", "me", "profile"];
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);

      const email = obj?.email || obj?.user?.email || obj?.data?.email;
      const name =
        obj?.name ||
        obj?.fullName ||
        obj?.user?.name ||
        obj?.user?.fullName ||
        obj?.data?.name ||
        obj?.data?.fullName;

      if (email || name) return { name: name || "", email: email || "" };
    } catch {}
  }
  return { name: "", email: "" };
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [errors, setErrors] = useState({});
  const [identity, setIdentity] = useState(() => getLoginIdentity());
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
  avatarUrl: "",
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  nic: "",
  address: { district: "", city: "", line1: "" },
  emergencyContact: { name: "", phone: "", relationship: "" },
  bloodGroup: "",
  allergies: "",
  chronicConditions: "",
  medications: "",
  surgeries: "",
  notes: "",
  heightCm: "",
  weightKg: "",
});

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(form.avatarUrl || "");
      return;
    }

    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile, form.avatarUrl]);

  useEffect(() => {
    if (!msg) return;

    const timer = setTimeout(() => {
      setMsg("");
      setMsgType("");
    }, 3000); // auto hide after 3 sec

    return () => clearTimeout(timer);
  }, [msg]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await getMyProfile();
        setForm({
          avatarUrl: data?.avatarUrl || "",
          fullName: data?.fullName || "",
          email: data?.email || "",
          phone: data?.phone || "",
          dob: data?.dob ? data.dob.split("T")[0] : "",
          gender: data?.gender || "",
          nic: data?.nic || "",
          address: {
            district: data?.address?.district || "",
            city: data?.address?.city || "",
            line1: data?.address?.line1 || "",
          },
          emergencyContact: {
            name: data?.emergencyContact?.name || "",
            phone: data?.emergencyContact?.phone || "",
            relationship: data?.emergencyContact?.relationship || "",
          },
          bloodGroup: data?.bloodGroup || "",
          allergies: data?.medicalHistory?.allergies?.join(", ") || "",
          chronicConditions: data?.medicalHistory?.chronicDiseases?.join(", ") || "",
          medications: data?.medicalHistory?.medications?.join(", ") || "",
          surgeries: data?.medicalHistory?.surgeries?.join(", ") || "",
          notes: data?.medicalHistory?.notes || "",
          heightCm: data?.heightCm ? String(data.heightCm) : "",
          weightKg: data?.weightKg ? String(data.weightKg) : "",
        });

        setIdentity({
          name: data?.fullName || identity.name,
          email: data?.email || identity.email,
        });
      } catch (err) {
        setMsgType("error");
        setMsg(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleAvatarChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setAvatarFile(file);

  const previewUrl = URL.createObjectURL(file);
  setAvatarPreview(previewUrl);
};

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setMsgType("error");
      setMsg("Please choose an image first");
      return;
    }

    try {
      setUploadingAvatar(true);
      setMsg("");
      setMsgType("");

      const res = await uploadMyAvatar(avatarFile);

      setForm((prev) => ({
        ...prev,
        avatarUrl: res.avatarUrl,
      }));

      setAvatarFile(null);
      setMsgType("success");
      setMsg("Profile image updated successfully");
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Failed to upload profile image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const updateNested = (section, field, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${section}.${field}`];
      return next;
    });
  };

  const validate = () => {
    const e = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      e.fullName = "Name must be at least 3 characters";
    }

    if (form.dob) {
      const birth = new Date(form.dob);
      const age = new Date().getFullYear() - birth.getFullYear();
      if (Number.isNaN(birth.getTime()) || age < 0 || age > 150) {
        e.dob = "Invalid date of birth";
      }
    }

    if (form.emergencyContact.phone && form.emergencyContact.phone.length < 7) {
      e["emergencyContact.phone"] = "Phone must be at least 7 characters";
    }

    if (form.bloodGroup) {
      const valid = ["A", "B", "AB", "O"];
      if (!valid.some((g) => form.bloodGroup.toUpperCase().includes(g))) {
        e.bloodGroup = "Invalid blood group";
      }
    }

    if (form.heightCm !== "") {
      const cm = Number(form.heightCm);
      if (Number.isNaN(cm) || cm < 100 || cm > 250) {
        e.heightCm = "Height must be between 100 and 250 cm";
      }
    }

    if (form.weightKg !== "") {
      const kg = Number(form.weightKg);
      if (Number.isNaN(kg) || kg < 20 || kg > 500) {
        e.weightKg = "Weight must be between 20 and 500 kg";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = async (event) => {
    event.preventDefault();
    setMsg("");
    setMsgType("");

    if (!validate()) {
      setMsgType("error");
      setMsg("❌ Please fix the validation errors before saving.");
      return;
    }

    try {
      const payload = {
        phone: form.phone || undefined,
        fullName: form.fullName,
        dob: form.dob || undefined,
        gender: form.gender || undefined,
        nic: form.nic || undefined,
        bloodGroup: form.bloodGroup || undefined,
        heightCm: form.heightCm !== "" ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg !== "" ? Number(form.weightKg) : undefined,
        address: form.address,
        emergencyContact: form.emergencyContact,
        medicalHistory: {
          allergies: form.allergies.split(",").map((item) => item.trim()).filter(Boolean),
          chronicDiseases: form.chronicConditions.split(",").map((item) => item.trim()).filter(Boolean),
          medications: form.medications.split(",").map((item) => item.trim()).filter(Boolean),
          surgeries: form.surgeries.split(",").map((item) => item.trim()).filter(Boolean),
          notes: form.notes.trim(),
        },
      };

      await updateMyProfile(payload);
      setMsgType("success");
      setMsg("Profile updated successfully");
      setMsgType("success");
      setEditMode(false);
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Failed to update profile");
    }
  };

  const ErrorText = ({ field }) =>
    errors[field] ? <p className="text-xs text-red-600 mt-1">{errors[field]}</p> : null;

  const profilePreview = useMemo(() => {
    const addressParts = [form.address.line1, form.address.city, form.address.district].filter(Boolean);
    return {
      name: form.fullName || identity.name || "Patient",
      email: form.email || identity.email || "—",
      dob: form.dob || "—",
      gender: form.gender || "—",
      nic: form.nic || "—",
      address: addressParts.length ? addressParts.join(", ") : "—",
      emergency: form.emergencyContact.name
        ? `${form.emergencyContact.name} (${form.emergencyContact.relationship || "—"}) • ${form.emergencyContact.phone || "—"}`
        : "—",
      bloodGroup: form.bloodGroup || "—",
      height: form.heightCm ? `${form.heightCm} cm` : "—",
      weight: form.weightKg ? `${form.weightKg} kg` : "—",
      allergies: form.allergies.trim() || "—",
      conditions: form.chronicConditions.trim() || "—",
    };
  }, [form, identity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 relative">
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-r from-[#dff6f6] via-[#eff8f8] to-[#d9f1f2] blur-3xl opacity-70 -z-10" />
        <PatientNavbar />
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-white/60 shadow-sm p-8 text-gray-600">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 relative">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-r from-[#dff6f6] via-[#eff8f8] to-[#d9f1f2] blur-3xl opacity-70 -z-10" />
      <PatientNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-[#0f172a]">My Profile</h1>
            <p className="text-sm text-[#6b7280] mt-1">
              View and update your patient profile details.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <a
              href="/patient/dashboard"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[#dbe7ea] bg-white text-sm font-medium text-gray-700 hover:bg-[#f8fafc] hover:border-[#178d95]/30 active:scale-[0.98] transition shadow-sm"
            >
              ← Back
            </a>
            {!editMode ? (
              <button
                onClick={() => {
                  setMsg("");
                  setMsgType("");
                  setErrors({});
                  setEditMode(true);
                }}
                className="h-10 px-5 rounded-xl bg-[#178d95] text-white text-sm font-semibold hover:bg-[#126f76] active:scale-[0.98] transition shadow-sm"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setMsg("");
                  setMsgType("");
                  setErrors({});
                  setEditMode(false);
                }}
                className="h-10 px-5 rounded-xl border border-[#178d95] bg-white text-[#178d95] text-sm font-medium hover:bg-[#178d95]/5 active:scale-[0.98] transition shadow-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {msg && (
          <div className="fixed top-20 right-6 z-50">
            <div
              className={`px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2
              ${
                msgType === "success"
                  ? "bg-green-500 text-white"
                  : msgType === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msgType === "success" && "✅"}
              {msgType === "error" && "❌"}
              {msgType === "info" && "ℹ️"}
              {msg}
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 border border-white/60 shadow-sm mb-5">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#f8fafc] border border-[#dbe7ea] flex items-center justify-center shadow-sm">
              {(avatarPreview || form.avatarUrl) ? (
                <img
                  src={avatarPreview || form.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">👤</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-[#6b7280]">Profile Photo</div>
              <div className="text-base font-semibold text-[#0f172a] mt-1">{form.fullName || "Patient"}</div>
              <div className="text-sm text-[#64748b]">{form.email || "—"}</div>
              {editMode && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="inline-flex items-center justify-center h-11 px-4 rounded-xl border border-[#dbe7ea] bg-white text-sm font-medium text-gray-700 cursor-pointer hover:bg-[#f8fafc] transition">
                    Choose Image
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleAvatarUpload}
                    disabled={!avatarFile || uploadingAvatar}
                    className="h-11 px-4 rounded-xl bg-[#178d95] text-white text-sm font-semibold hover:bg-[#126f76] disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {uploadingAvatar ? "Uploading..." : "Upload Photo"}
                  </button>

                  <div className="text-sm text-gray-500 truncate">
                    {avatarFile ? avatarFile.name : "PNG, JPG, JPEG, WEBP up to 3MB"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!editMode ? (
          <div className="grid md:grid-cols-2 gap-4">
            <ProfileCard label="Full Name" value={profilePreview.name} />
            <ProfileCard label="Email" value={profilePreview.email} />
            <ProfileCard label="Phone" value={profilePreview.phone} />
            <ProfileCard label="DOB / Gender" value={`${profilePreview.dob} • ${profilePreview.gender}`} />
            <ProfileCard label="NIC" value={profilePreview.nic} />
            <ProfileCard label="Address" value={profilePreview.address} span />
            <ProfileCard label="Emergency Contact" value={profilePreview.emergency} span />
            <ProfileCard label="Blood Group" value={profilePreview.bloodGroup} />
            <ProfileCard label="Height / Weight" value={`${profilePreview.height} • ${profilePreview.weight}`} />
            <ProfileCard label="Allergies" value={profilePreview.allergies} span />
            <ProfileCard label="Chronic Conditions" value={profilePreview.conditions} span />
            <ProfileCard label="Medications" value={profilePreview.medications} span />
            <ProfileCard label="Surgeries" value={profilePreview.surgeries} span />

          </div>
        ) : (
          <form
            onSubmit={onSave}
            className="bg-white/90 backdrop-blur-xl rounded-[28px] p-6 border border-white/60 shadow-sm space-y-5"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  className={fieldClass(errors.fullName)}
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                />
                <ErrorText field="fullName" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Email <span className="normal-case font-normal">(readonly)</span>
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-[#dbe7ea] bg-[#f8fafc] px-3 text-sm text-gray-500 cursor-not-allowed"
                  value={form.email}
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Phone
                </label>
                <input
                  className={fieldClass(errors.phone)}
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="0771234567"
                />
                <ErrorText field="phone" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  DOB
                </label>
                <input
                  type="date"
                  className={fieldClass(errors.dob)}
                  value={form.dob}
                  onChange={(e) => setField("dob", e.target.value)}
                />
                <ErrorText field="dob" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Gender
                </label>
                <select
                  className={fieldClass(errors.gender)}
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ErrorText field="gender" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  NIC
                </label>
                <input
                  className={fieldClass(errors.nic)}
                  value={form.nic}
                  onChange={(e) => setField("nic", e.target.value)}
                />
                <ErrorText field="nic" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  District
                </label>
                <input
                  className={fieldClass(errors["address.district"])}
                  value={form.address.district}
                  onChange={(e) => updateNested("address", "district", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  City
                </label>
                <input
                  className={fieldClass(errors["address.city"])}
                  value={form.address.city}
                  onChange={(e) => updateNested("address", "city", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Address Line
                </label>
                <input
                  className={fieldClass(errors["address.line1"])}
                  value={form.address.line1}
                  onChange={(e) => updateNested("address", "line1", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Emergency Name
                </label>
                <input
                  className={fieldClass(errors["emergencyContact.name"])}
                  value={form.emergencyContact.name}
                  onChange={(e) => updateNested("emergencyContact", "name", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Emergency Phone
                </label>
                <input
                  className={fieldClass(errors["emergencyContact.phone"])}
                  value={form.emergencyContact.phone}
                  onChange={(e) => updateNested("emergencyContact", "phone", e.target.value)}
                />
                <ErrorText field="emergencyContact.phone" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Relationship
                </label>
                <input
                  className={fieldClass(errors["emergencyContact.relationship"])}
                  value={form.emergencyContact.relationship}
                  onChange={(e) => updateNested("emergencyContact", "relationship", e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Blood Group
                </label>
                <input
                  className={fieldClass(errors.bloodGroup)}
                  value={form.bloodGroup}
                  onChange={(e) => setField("bloodGroup", e.target.value)}
                />
                <ErrorText field="bloodGroup" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Height (cm)
                </label>
                <input
                  className={fieldClass(errors.heightCm)}
                  value={form.heightCm}
                  onChange={(e) => setField("heightCm", e.target.value)}
                />
                <ErrorText field="heightCm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Weight (kg)
                </label>
                <input
                  className={fieldClass(errors.weightKg)}
                  value={form.weightKg}
                  onChange={(e) => setField("weightKg", e.target.value)}
                />
                <ErrorText field="weightKg" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Allergies <span className="normal-case font-normal">(comma separated)</span>
                </label>
                <input
                  className={fieldClass(errors.allergies)}
                  value={form.allergies}
                  onChange={(e) => setField("allergies", e.target.value)}
                  placeholder="Peanuts, Dust…"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Chronic Conditions <span className="normal-case font-normal">(comma separated)</span>
                </label>
                <input
                  className={fieldClass(errors.chronicConditions)}
                  value={form.chronicConditions}
                  onChange={(e) => setField("chronicConditions", e.target.value)}
                  placeholder="Diabetes, Asthma…"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Medications <span className="normal-case font-normal">(comma separated)</span>
                </label>
                <input
                  className={fieldClass(errors.medications)}
                  value={form.medications}
                  onChange={(e) => setField("medications", e.target.value)}
                  placeholder="Paracetamol, Vitamin D"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-wide">
                  Surgeries <span className="normal-case font-normal">(comma separated)</span>
                </label>
                <input
                  className={fieldClass(errors.surgeries)}
                  value={form.surgeries}
                  onChange={(e) => setField("surgeries", e.target.value)}
                  placeholder="Appendix surgery"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 flex-wrap">
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-[#178d95] text-white text-sm font-semibold hover:bg-[#126f76] active:scale-[0.98] transition shadow-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setMsg("");
                  setMsgType("");
                  setErrors({});
                  setEditMode(false);
                }}
                className="h-10 px-5 rounded-xl border border-[#178d95] bg-white text-[#178d95] text-sm font-medium hover:bg-[#178d95]/5 active:scale-[0.98] transition shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function fieldClass(error) {
  const base =
    "h-11 w-full rounded-xl border bg-white/80 px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#178d95]/20 focus:border-[#178d95] shadow-sm transition";
  return error
    ? base + " border-red-300 focus:ring-red-300/30 focus:border-red-400"
    : base + " border-[#dbe7ea] hover:border-[#178d95]/40";
}

function ProfileCard({ label, value, span }) {
  return (
    <div
      className={
        "bg-white/90 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/60 shadow-sm " +
        (span ? "md:col-span-2" : "")
      }
    >
      <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1">
        {label}
      </div>
      <div className="text-sm font-semibold text-[#0f172a] leading-snug">{value || "—"}</div>
    </div>
  );
}

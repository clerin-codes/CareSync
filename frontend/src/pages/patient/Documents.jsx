import { useEffect, useMemo, useRef, useState } from "react";
import PatientNavbar from "../../components/PatientNavbar";
import Loader from "../../components/Loader";
import {
  getMyDocuments,
  uploadMyDocument,
  deleteMyDocument,
} from "../../services/patientService";

const categories = [
  { value: "report", label: "Lab Report" },
  { value: "prescription", label: "Prescription" },
  { value: "scan", label: "Scan" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null); // ID of document being deleted
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("report");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const fileRef = useRef(null);

  const msgClass =
    msgType === "success"
      ? "bg-green-50 text-green-800 ring-1 ring-green-100"
      : msgType === "error"
      ? "bg-red-50 text-red-800 ring-1 ring-red-100"
      : "bg-blue-50 text-blue-800 ring-1 ring-blue-100";

  const loadDocs = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await getMyDocuments();
      setDocs(data.documents || []);
    } catch (e) {
      setMsgType("error");
      setMsg(e.response?.data?.message || "Failed to load documents");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const filteredDocs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchesCategory =
        filterCategory === "all" || doc.fileType === filterCategory;
      const matchesSearch =
        !q ||
        doc.title?.toLowerCase().includes(q) ||
        doc.fileType?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [docs, filterCategory, search]);

  const upload = async () => {
    if (!file) {
      setMsgType("error");
      setMsg("Please choose a file");
      return;
    }

    try {
      setMsg("");
      setMsgType("");
      setUploading(true);

      await uploadMyDocument({
        file,
        title: title || file.name,
        fileType: category,
      });

      setMsgType("success");
      setMsg("✅ Document uploaded");
      setFile(null);
      setTitle("");
      setCategory("report");
      if (fileRef.current) fileRef.current.value = "";
      await loadDocs();
    } catch (e) {
      setMsgType("error");
      setMsg(e.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id) => {
    try {
      setDeleting(id);
      await deleteMyDocument(id);
      setMsgType("success");
      setMsg("✅ Document deleted");
      await loadDocs();
    } catch (e) {
      setMsgType("error");
      setMsg(e.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleOpen = (doc) => {
    if (!doc?.fileUrl) return;
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <PatientNavbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage your medical documents.
            </p>
          </div>
          <a
            href="/patient/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-[#178d95] text-sm font-medium text-white hover:bg-[#126b73] active:scale-[0.98] transition shadow-sm hover:shadow-md hover:-translate-y-1 duration-300"
          >
            ← Back
          </a>
        </div>

        {msg && <div className={`mb-4 p-3 rounded-xl text-sm ${msgClass}`}>{msg}</div>}

        <div className="bg-white rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm mb-6">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <select
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#178d95] focus:border-[#178d95] shadow-sm hover:border-teal-300 hover:bg-teal-50 transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Title <span className="normal-case font-normal">(optional)</span>
              </label>
              <input
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#178d95] focus:border-[#178d95] shadow-sm hover:border-teal-300 hover:bg-teal-50 transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Blood Test - Feb"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                File
              </label>
              <label className="flex items-center h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 cursor-pointer hover:border-teal-300 hover:bg-teal-50 transition shadow-sm overflow-hidden"
              >
                <span className="truncate">{file ? file.name : "Choose file…"}</span>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                />
              </label>
              <p className="text-xs text-gray-400">Max 10MB • PDF/Image/DOC/DOCX</p>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={upload}
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-[#178d95] text-white text-sm font-semibold hover:bg-[#126b73] active:scale-[0.98] transition shadow-sm hover:shadow-md hover:-translate-y-1 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#178d95] disabled:hover:translate-y-0"
            >
              {uploading ? (
                <>
                  <span className="auth-spinner" /> Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm px-5 py-4 mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Filter
            </span>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="h-10 w-40 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#178d95] focus:border-[#178d95] shadow-sm hover:border-teal-300 hover:bg-teal-50 transition"
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category…"
              className="h-10 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#178d95] focus:border-[#178d95] shadow-sm hover:border-teal-300 hover:bg-teal-50 transition"
            />

            <button
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
              }}
              className="h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 active:scale-[0.98] transition shadow-sm whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 ring-1 ring-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-gray-900">
              My Documents ({filteredDocs.length})
            </div>
            <button
              onClick={() => loadDocs(true)}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium hover:bg-teal-50 hover:border-teal-300 active:scale-[0.98] transition shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <Loader size={38} text="Loading documents..." />
          ) : filteredDocs.length === 0 ? (
            <div className="text-sm text-gray-500">No documents found.</div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 rounded-xl ring-1 ring-gray-100 hover:ring-gray-200 transition"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {doc.title || "Untitled"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {doc.fileType || "Other"} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "Uploaded recently"}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleOpen(doc)}
                      className="px-3 py-2 rounded-xl bg-[#178d95] text-white text-sm hover:bg-[#126b73] transition"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => remove(doc._id)}
                      disabled={deleting === doc._id}
                      className="px-3 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === doc._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import axios from "axios";
import {
  ArrowLeft,
  UploadCloud,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Lock,
  Image,
  Camera,
  FileText,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";

type DocumentStatus = "pending" | "uploading" | "uploaded" | "error";

interface Document {
  id: string;
  title: string;
  subtitle: string;
  hint: string;
  required: boolean;
  status: DocumentStatus;
  file?: File;
  preview?: string;
}

const DOCUMENTS: Document[] = [
  {
    id: "id-proof",
    title: "Identity Proof",
    subtitle: "Aadhar / PAN / Passport",
    hint: "Clear, readable photo of your ID",
    required: true,
    status: "pending",
  },
  {
    id: "license",
    title: "Driving License",
    subtitle: "Valid driving license (front & back)",
    hint: "Make sure all corners are visible",
    required: true,
    status: "pending",
  },
  {
    id: "registration",
    title: "Vehicle Registration",
    subtitle: "RC Certificate",
    hint: "Should match the vehicle details",
    required: true,
    status: "pending",
  },
  {
    id: "insurance",
    title: "Insurance",
    subtitle: "Valid insurance policy",
    hint: "Optional but recommended",
    required: false,
    status: "pending",
  },
];

type docsType = "aadhar" | "license" | "rc";

const Page = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>(DOCUMENTS);
  const [docs, setDocs] = useState<Record<docsType, File | null>>({
    aadhar: null,
    license: null,
    rc: null,
  });
  // const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [loading, setLoading] = useState(false);

  const handleDocs = async () => {
    if (!docs.aadhar || !docs.license || !docs.rc) {
      toast.error("Please upload all required documents");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData(); // ✅ FIXED

      formData.append("aadhar", docs.aadhar);
      formData.append("license", docs.license);
      formData.append("rc", docs.rc);

      const promise = axios.post("/api/partner/onboarding/documents", formData);

      await toast.promise(promise, {
        loading: "Uploading documents...",
        success: "Documents uploaded successfully 🎉",
        error: "Upload failed ❌",
      });

      router.push("/partner/onboarding/bank");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const allRequiredUploaded = documents
    .filter((doc) => doc.required)
    .every((doc) => doc.status === "uploaded");

  const handleFileUpload = async (docId: string, file: File) => {
    // Update status to uploading
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, status: "uploading", file } : doc,
      ),
    );

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setUploadProgress((prev) => ({ ...prev, [docId]: i }));
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);

    // Simulate successful upload after delay
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === docId ? { ...doc, status: "uploaded", preview } : doc,
        ),
      );
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[docId];
        return newProgress;
      });
    }, 500);
  };

  const handleRemoveDocument = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (doc?.preview) {
      URL.revokeObjectURL(doc.preview);
    }
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? { ...doc, status: "pending", file: undefined, preview: undefined }
          : doc,
      ),
    );
  };

  // const handleContinue = () => {
  //   if (allRequiredUploaded) {
  //     router.push("/partner/onboarding/bank");
  //   }
  // };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "uploaded":
        return <CheckCircle size={20} className="text-emerald-400" />;
      case "uploading":
        return (
          <div className="w-5 h-5 border-2 border-white/30 border-t-amber-400 rounded-full animate-spin" />
        );
      case "error":
        return <AlertCircle size={20} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case "uploaded":
        return "border-emerald-500/50 bg-emerald-500/10";
      case "uploading":
        return "border-amber-500/50 bg-amber-500/10";
      case "error":
        return "border-red-500/50 bg-red-500/10";
      default:
        return "border-white/10 bg-white/5 hover:bg-white/10";
    }
  };

  const handleImage = (doc: docsType, file: File) => {
    if (!file) return;

    setDocs((prev) => ({
      ...prev,
      [doc]: file,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-950 text-white pb-24 relative overflow-hidden">
      {/* Organic background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8 relative z-10">
        {/* Header with personality */}
        <div className="flex items-start gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="cursor-pointer p-2.5 hover:bg-white/10 rounded-full transition-all duration-300 group mt-1"
          >
            <ArrowLeft
              size={22}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </motion.button>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs tracking-[3px] text-amber-400/80 font-medium bg-amber-400/10 px-3 py-1 rounded-full">
                STEP 2 OF 3
              </span>
              <div className="flex gap-1">
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                <div className="w-12 h-0.5 bg-white rounded-full" />
                <div className="w-4 h-0.5 bg-white/20 rounded-full" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter leading-tight">
              Show us the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                paperwork
              </span>
            </h1>
            <p className="text-white/60 mt-3 text-lg">
              We need a few documents to verify your identity and vehicle
            </p>
          </div>
        </div>

        {/* Document Upload Grid */}
        <div className="space-y-4 mb-8">
          {documents.map((doc, idx) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl border transition-all duration-300 ${getStatusColor(doc.status)}`}
            >
              {doc.status === "uploaded" ? (
                // Uploaded state with preview
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                      {doc.preview ? (
                        <img
                          src={doc.preview}
                          alt={doc.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileText size={28} className="text-white/60" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{doc.title}</h3>
                        {!doc.required && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{doc.subtitle}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle size={12} />
                          Verified
                        </span>
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="cursor-pointer text-xs text-white/40 hover:text-red-400 transition flex items-center gap-1"
                        >
                          <X size={12} />
                          Replace
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <FileCheck size={24} className="text-emerald-400" />
                    </div>
                  </div>
                </div>
              ) : (
                // Upload state
                <label className="block cursor-pointer">
                  <input
                    ref={(el) => {
                      fileInputRefs.current[doc.id] = el;
                    }}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      handleFileUpload(doc.id, file);

                      // ✅ map UI doc → backend field
                      if (doc.id === "id-proof") handleImage("aadhar", file);
                      if (doc.id === "license") handleImage("license", file);
                      if (doc.id === "registration") handleImage("rc", file);
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                        <UploadCloud size={28} className="text-white/40" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-lg">{doc.title}</h3>
                          {!doc.required && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                              Optional
                            </span>
                          )}
                          {doc.required && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/60">{doc.subtitle}</p>
                        <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                          <Image size={10} />
                          {doc.hint}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusIcon(doc.status)}
                      </div>
                    </div>

                    {/* Upload progress */}
                    {doc.status === "uploading" &&
                      uploadProgress[doc.id] !== undefined && (
                        <div className="mt-4">
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress[doc.id]}%` }}
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                            />
                          </div>
                          <p className="text-xs text-white/40 mt-1 text-center">
                            Uploading... {uploadProgress[doc.id]}%
                          </p>
                        </div>
                      )}
                  </div>
                </label>
              )}
            </motion.div>
          ))}
        </div>

        {/* Security & Verification Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center flex-shrink-0">
              <Lock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-sm">
                Your documents are safe with us
              </p>
              <p className="text-sm text-white/50 mt-1">
                All documents are encrypted and securely stored. Our team
                manually verifies them within
                <span className="text-amber-400"> 24-48 hours</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={allRequiredUploaded ? { scale: 1.02, y: -2 } : {}}
          whileTap={allRequiredUploaded ? { scale: 0.98 } : {}}
          onClick={handleDocs}
          disabled={!allRequiredUploaded || loading}
          className={`mt-8 w-full py-4 cursor-pointer rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 group ${
            allRequiredUploaded
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg hover:shadow-amber-400/25"
              : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
        >
          <span>
            {allRequiredUploaded
              ? "Continue to Bank Setup"
              : "Upload all required documents"}
          </span>
          {allRequiredUploaded && (
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 2 }}
            >
              →
            </motion.span>
          )}
        </motion.button>

        {/* Progress tracker */}
        <div className="mt-8 flex justify-center gap-2">
          {documents
            .filter((d) => d.required)
            .map((doc, idx) => (
              <div
                key={doc.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  doc.status === "uploaded"
                    ? "w-8 bg-gradient-to-r from-amber-400 to-orange-500"
                    : "w-4 bg-white/20"
                }`}
              />
            ))}
        </div>
        <p className="text-center text-xs text-white/30 mt-3">
          {
            documents.filter((d) => d.required && d.status === "uploaded")
              .length
          }{" "}
          of {documents.filter((d) => d.required).length} required documents
          uploaded
        </p>
      </div>
    </div>
  );
};

export default Page;

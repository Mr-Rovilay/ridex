"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Image,
  File,
  ExternalLink,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const DocPreview = ({ label, url, icon }: any) => {
  const [showModal, setShowModal] = useState(false);

  const isImage = url?.match(/\.(jpeg|jpg|png|webp|gif)$/i);
  const isPdf = url?.endsWith(".pdf");

  const getFileIcon = () => {
    if (isImage) return <Image size={16} />;
    if (isPdf) return <FileText size={16} />;
    return <File size={16} />;
  };

  if (!url) {
    return (
      <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
        <div className="flex items-center gap-2">
          <AlertCircle size={14} className="text-red-400" />
          <p className="text-sm text-white/60">{label}</p>
        </div>
        <p className="text-xs text-red-400 mt-1">Not uploaded</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-amber-400">{icon || getFileIcon()}</div>
            <p className="text-sm text-white/60">{label}</p>
          </div>

          {isImage && (
            <div className="relative mt-2 rounded-lg overflow-hidden bg-black/50 h-32">
              <img
                src={url}
                alt={label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Eye size={20} className="text-white" />
              </div>
            </div>
          )}

          {isPdf && (
            <div className="mt-2 p-3 rounded-lg bg-black/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-red-400" />
                <span className="text-sm text-white/70">PDF Document</span>
              </div>
              <ExternalLink size={14} className="text-white/40" />
            </div>
          )}

          {!isImage && !isPdf && (
            <div className="mt-2 p-3 rounded-lg bg-black/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <File size={16} className="text-white/40" />
                <span className="text-sm text-white/70">View Document</span>
              </div>
              <ExternalLink size={14} className="text-white/40" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] mx-4 bg-zinc-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="text-amber-400">{icon || getFileIcon()}</div>
                  <h3 className="font-semibold text-white">{label}</h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X size={20} className="text-white/60" />
                </button>
              </div>

              <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                {isImage && (
                  <img src={url} alt={label} className="w-full rounded-lg" />
                )}
                {isPdf && (
                  <iframe src={url} className="w-full h-[70vh] rounded-lg" />
                )}
                {!isImage && !isPdf && (
                  <div className="text-center py-12">
                    <File size={48} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/60 mb-4">
                      Cannot preview this file type
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-black font-medium text-sm hover:bg-amber-500 transition"
                    >
                      Download File
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DocPreview;

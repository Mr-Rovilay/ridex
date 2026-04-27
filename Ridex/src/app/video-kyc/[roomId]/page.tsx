"use client";

import { RootState } from "@/redux/store";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  X,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  const { userData } = useSelector((state: RootState) => state.user);
  const [joined, setJoined] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [aLoading, setALoading] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [showApprovalModel, setShowApprovalModel] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showRejectionModel, setShowRejectionModel] = useState(false);

  const router = useRouter();

  const user = userData?.user;
  const params = useParams();

  const roomIdString = Array.isArray(params?.roomId)
    ? params.roomId[0]
    : (params?.roomId as string) || "";

  // Initialize camera and microphone preview
  useEffect(() => {
    if (joined) return;

    let localStream: MediaStream | null = null;

    const initPreview = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(localStream);
        if (previewRef.current) {
          previewRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast.error(
          "Unable to access camera or microphone. Please check permissions.",
        );
      }
    };

    initPreview();

    // Cleanup function
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [joined]);

  // Toggle camera
  const toggleCamera = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !isCameraOn));
      setIsCameraOn(!isCameraOn);
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !isMicOn));
      setIsMicOn(!isMicOn);
    }
  };

  // Handle approval
  const handleApprove = async () => {
    setALoading(true);
    try {
      const { data } = await axios.post("/api/admin/video-kyc/complete", {
        roomId: roomIdString,
        action: "approved",
      });
      toast.success("KYC approved successfully!");
      setShowApprovalModel(false);
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          error.message ??
          "Failed to approve KYC",
      );
    } finally {
      setALoading(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setRLoading(true);
    try {
      const { data } = await axios.post("/api/admin/video-kyc/complete", {
        roomId: roomIdString,
        action: "rejected",
        reason: reason,
      });
      toast.success("KYC rejected successfully!");
      setShowRejectionModel(false);
      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ??
          error.message ??
          "Failed to reject KYC",
      );
    } finally {
      setRLoading(false);
    }
  };

  // Start video call
  const startCall = () => {
    if (!roomIdString) {
      toast.error("Invalid Room ID. Please return to the dashboard.");
      return;
    }
    setLoading(true);

    if (!containerRef.current) {
      toast.error("Container not ready");
      setLoading(false);
      return;
    }

    if (!user?._id) {
      toast.error("User not ready. Please refresh the page.");
      setLoading(false);
      return;
    }

    try {
      const appId = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;

      if (!appId || !serverSecret) {
        toast.error("Video call configuration missing");
        setLoading(false);
        return;
      }

      const displayName =
        user.role === "admin" ? "Admin" : `${user.name} (${user.email})`;

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        serverSecret,
        roomIdString,
        user._id.toString(),
        displayName,
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
        onJoinRoom: () => {
          setJoined(true);
          setLoading(false);
          // Stop preview stream when joining call
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
          }
        },
        onLeaveRoom: () => {
          setJoined(false);
        },
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start video call");
      setLoading(false);
    }
  };

  // End call and cleanup
  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    router.push("/");
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
      {/* Header - Moved OUTSIDE the container ref so it stays visible */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Ridex</h1>
            <p className="text-sm text-gray-300 mt-1">
              {user?.role === "admin"
                ? "Admin Verification Panel"
                : "Partner Video KYC"}
            </p>
          </div>
          {joined && (
            <div className="flex gap-3">
              {user?.role === "admin" && (
                <>
                  <button
                    onClick={() => setShowApprovalModel(true)}
                    className="cursor-pointer px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectionModel(true)}
                    className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={endCall}
                className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
              >
                <PhoneOff size={18} />
                End Call
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Container for Zego Video Call */}
      <div ref={containerRef} className="w-full h-full">
        {/* Video Preview / Call Container */}
        <div className="w-full h-full">
          {!joined ? (
            // Preview Mode
            <div className="w-full h-full flex items-center justify-center p-4">
              <div className="max-w-4xl w-full bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
                {/* Video Preview */}
                <div className="relative aspect-video bg-black">
                  <video
                    ref={previewRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!isCameraOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                      <VideoOff className="w-16 h-16 text-gray-500" />
                      <p className="text-gray-400 mt-4">Camera is off</p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                      Secure Video KYC
                    </h2>
                    <p className="text-gray-400 text-center">
                      Please ensure good lighting and a stable internet
                      connection
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={toggleCamera}
                      className="cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                      {isCameraOn ? (
                        <Video className="w-6 h-6 text-white" />
                      ) : (
                        <VideoOff className="w-6 h-6 text-red-400" />
                      )}
                    </button>
                    <button
                      onClick={toggleMic}
                      className="cursor-pointer p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                    >
                      {isMicOn ? (
                        <Mic className="w-6 h-6 text-white" />
                      ) : (
                        <MicOff className="w-6 h-6 text-red-400" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={startCall}
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Join Secure Call"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Call in Progress - Container will be used by Zego
            <div className="w-full h-full" />
          )}
        </div>
      </div>

      {/* Approval Modal */}
      <AnimatePresence>
        {showApprovalModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowApprovalModel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Confirm Approval
                </h2>
                <button
                  onClick={() => setShowApprovalModel(false)}
                  className="cursor-pointer p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to approve this partner's KYC? This action
                cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowApprovalModel(false)}
                  className="cursor-pointer flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  disabled={aLoading}
                  onClick={handleApprove}
                  className="cursor-pointer flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  {aLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Approve"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rejection Modal */}
      <AnimatePresence>
        {showRejectionModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowRejectionModel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  Reject Partner KYC
                </h2>
                <button
                  onClick={() => setShowRejectionModel(false)}
                  className="cursor-pointer p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  placeholder="Please provide a detailed reason for rejection..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectionModel(false)}
                  className="cursor-pointer flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  disabled={rLoading}
                  onClick={handleReject}
                  className="cursor-pointer flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  {rLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;

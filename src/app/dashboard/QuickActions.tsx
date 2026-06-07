"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QuickActions() {
  const handleContinueLesson = () => {
    toast.info("Continuing last lesson...");
  };

  const handleCertificates = () => {
    toast.success("Opening certificates...");
  };

  const handleProfile = () => {
    toast("Redirecting to profile...", { type: "default" });
  };

  return (
    <div className="quick-actions">
      <h3>Quick Actions</h3>
      <div className="actions">
        <button onClick={handleContinueLesson}>Continue Last Lesson</button>
        <button onClick={handleCertificates}>View Certificates</button>
        <button onClick={handleProfile}>Edit Profile</button>
      </div>
    </div>
  );
}

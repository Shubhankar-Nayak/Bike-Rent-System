import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { Upload, FileImage, Check, ArrowLeft, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: "student" | "renter";
}

interface DocumentState {
  userType: "student" | "renter";
  userData: UserData;
}

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useAppSelector((state) => state.theme);

  const state = location.state as DocumentState | null;

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({
    aadhar: null,
    license: null,
    collegeId: null,
  });
  const [rollNumber, setRollNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state) {
    // navigate("/register");
    return null;
  }

  const { userType, userData } = state;

  const requiredDocs =
    userType === "student" ? ["aadhar", "license", "collegeId"] : ["aadhar", "license"];

  const handleFileUpload = (docType: string, file: File) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: file,
    }));
  };

  const isAllDocsUploaded = requiredDocs.every((doc) => uploadedDocs[doc] !== null);

  const handleSubmit = async () => {
    if (!isAllDocsUploaded || (userType === "student" && !rollNumber)) {
      setError("Please upload all required documents and enter roll number.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("userId", userData.id);
      formData.append("userType", userType);

      Object.entries(uploadedDocs).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      if (userType === "student") {
        formData.append("rollNumber", rollNumber);
      }

      await axios.post(`${API}/user/upload-documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/register/success");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload documents");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-8 ${
        isDark
          ? "bg-gradient-to-br from-primary-dark to-secondary-dark"
          : "bg-gradient-to-br from-primary-light to-secondary-light"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl w-full ${
          isDark ? "bg-secondary-dark" : "bg-white"
        } rounded-2xl shadow-2xl p-8 border ${
          isDark ? "border-neutral-dark" : "border-neutral-light"
        }`}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/register")}
            className={`mr-4 p-2 rounded-lg ${
              isDark ? "hover:bg-primary-dark" : "hover:bg-neutral-light"
            } transition-colors duration-200`}
          >
            <ArrowLeft
              className={`h-5 w-5 ${
                isDark ? "text-neutral-light" : "text-neutral-dark"
              }`}
            />
          </button>
          <div>
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-neutral-light" : "text-neutral-dark"
              }`}
            >
              Document Verification
            </h1>
            <p
              className={`mt-2 ${
                isDark
                  ? "text-neutral-light opacity-70"
                  : "text-neutral-dark opacity-70"
              }`}
            >
              Upload the required documents to complete your registration
            </p>
          </div>
        </div>

        {/* Upload Cards */}
        <div className="space-y-6">
          <DocumentUploadCard
            title="Aadhar Card"
            description="Upload a clear photo of your Aadhar card"
            docType="aadhar"
            file={uploadedDocs.aadhar}
            onUpload={handleFileUpload}
            isDark={isDark}
            required
          />

          <DocumentUploadCard
            title="Driving License"
            description="Upload a clear photo of your driving license"
            docType="license"
            file={uploadedDocs.license}
            onUpload={handleFileUpload}
            isDark={isDark}
            required
          />

          {userType === "student" && (
            <DocumentUploadCard
              title="College ID"
              description="Upload your college ID"
              docType="collegeId"
              file={uploadedDocs.collegeId}
              onUpload={handleFileUpload}
              isDark={isDark}
              required
            />
          )}

          {userType === "student" && (
            <div
              className={`p-6 rounded-xl border ${
                isDark
                  ? "border-neutral-dark bg-primary-dark"
                  : "border-neutral-light bg-neutral-light bg-opacity-30"
              }`}
            >
              <h3
                className={`font-semibold ${
                  isDark ? "text-neutral-light" : "text-neutral-dark"
                }`}
              >
                Roll Number *
              </h3>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your roll number"
                className={`w-full mt-2 px-4 py-3 rounded-lg border ${
                  isDark
                    ? "bg-primary-dark border-neutral-dark text-neutral-light"
                    : "bg-white border-neutral-light text-neutral-dark"
                }`}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Submit Button */}
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!isAllDocsUploaded || loading}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
              isAllDocsUploaded
                ? "bg-gradient-to-r from-accent-primary to-accent-secondary text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Uploading..." : "Complete Registration"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

interface DocumentUploadCardProps {
  title: string;
  description: string;
  docType: string;
  file: File | null;
  onUpload: (docType: string, file: File) => void;
  isDark: boolean;
  required?: boolean;
}

const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  title,
  description,
  docType,
  file,
  onUpload,
  isDark,
  required = false,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onUpload(docType, selectedFile);
    }
  };

  return (
    <div
      className={`p-6 rounded-xl border ${
        isDark
          ? "border-neutral-dark bg-primary-dark"
          : "border-neutral-light bg-neutral-light bg-opacity-30"
      }`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-lg ${
            isDark ? "bg-secondary-dark" : "bg-white"
          }`}
        >
          {file ? (
            <Check className="h-6 w-6 text-green-500" />
          ) : (
            <FileImage
              className={`h-6 w-6 ${
                isDark ? "text-accent-primary" : "text-accent-secondary"
              }`}
            />
          )}
        </div>
        <div className="flex-1">
          <h3
            className={`font-semibold ${
              isDark ? "text-neutral-light" : "text-neutral-dark"
            }`}
          >
            {title} {required && "*"}
          </h3>
          <p
            className={`text-sm mb-4 ${
              isDark ? "text-neutral-light opacity-70" : "text-neutral-dark opacity-70"
            }`}
          >
            {description}
          </p>

          <label className="cursor-pointer">
            <div
              className={`flex items-center justify-center space-x-2 p-4 border-2 border-dashed rounded-lg ${
                isDark
                  ? "border-neutral-dark hover:border-accent-primary bg-secondary-dark"
                  : "border-neutral-light hover:border-accent-primary bg-white"
              }`}
            >
              <Upload
                className={`h-5 w-5 ${
                  isDark ? "text-neutral-light" : "text-neutral-dark"
                }`}
              />
              <span
                className={`font-medium ${
                  isDark ? "text-neutral-light" : "text-neutral-dark"
                }`}
              >
                {file ? file.name : "Click to upload"}
              </span>
            </div>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
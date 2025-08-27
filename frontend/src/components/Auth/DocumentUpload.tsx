import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { Upload, FileImage, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentState {
  userType: 'student' | 'renter';
  userData: any;
}

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useAppSelector(state => state.theme);
  
  const state = location.state as DocumentState;
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, File | null>>({
    aadhar: null,
    license: null,
    collegeId: null,
    rollNumber: null,
  });

  if (!state) {
    navigate('/register');
    return null;
  }

  const { userType, userData } = state;

  const requiredDocs = userType === 'student' 
    ? ['aadhar', 'license', 'collegeId'] 
    : ['aadhar', 'license'];

  const handleFileUpload = (docType: string, file: File) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docType]: file
    }));
  };

  const handleSubmit = async () => {
    // Mock API call - replace with actual implementation
    console.log('Submitting documents:', uploadedDocs);
    console.log('User data:', userData);
    
    // Navigate to success page or login
    navigate('/register/success');
  };

  const isAllDocsUploaded = requiredDocs.every(doc => uploadedDocs[doc] !== null);

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${isDark ? 'bg-gradient-to-br from-primary-dark to-secondary-dark' : 'bg-gradient-to-br from-primary-light to-secondary-light'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-2xl w-full ${isDark ? 'bg-secondary-dark' : 'bg-white'} rounded-2xl shadow-2xl p-8 border ${isDark ? 'border-neutral-dark' : 'border-neutral-light'}`}
      >
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/register')}
            className={`mr-4 p-2 rounded-lg ${isDark ? 'hover:bg-primary-dark' : 'hover:bg-neutral-light'} transition-colors duration-200`}
          >
            <ArrowLeft className={`h-5 w-5 ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`} />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
              Document Verification
            </h1>
            <p className={`mt-2 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
              Upload the required documents to complete your registration
            </p>
          </div>
        </div>

        {/* Document Upload Cards */}
        <div className="space-y-6">
          {/* Aadhar Card */}
          <DocumentUploadCard
            title="Aadhar Card"
            description="Upload a clear photo of your Aadhar card"
            docType="aadhar"
            file={uploadedDocs.aadhar}
            onUpload={handleFileUpload}
            isDark={isDark}
            required
          />

          {/* License */}
          <DocumentUploadCard
            title="Driving License"
            description="Upload a clear photo of your driving license"
            docType="license"
            file={uploadedDocs.license}
            onUpload={handleFileUpload}
            isDark={isDark}
            required
          />

          {/* College ID (Student Only) */}
          {userType === 'student' && (
            <DocumentUploadCard
              title="College ID Card"
              description="Upload a clear photo of your college ID card"
              docType="collegeId"
              file={uploadedDocs.collegeId}
              onUpload={handleFileUpload}
              isDark={isDark}
              required
            />
          )}

          {/* Roll Number (Student Only) */}
          {userType === 'student' && (
            <div className={`p-6 rounded-xl border ${isDark ? 'border-neutral-dark bg-primary-dark' : 'border-neutral-light bg-neutral-light bg-opacity-30'}`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${isDark ? 'bg-secondary-dark' : 'bg-white'}`}>
                  <FileImage className={`h-6 w-6 ${isDark ? 'text-accent-primary' : 'text-accent-secondary'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                    Roll Number *
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                    Enter your college roll number
                  </p>
                  <input
                    type="text"
                    placeholder="Enter your roll number"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDark 
                        ? 'bg-primary-dark border-neutral-dark text-neutral-light placeholder-neutral-light placeholder-opacity-50' 
                        : 'bg-white border-neutral-light text-neutral-dark placeholder-neutral-dark placeholder-opacity-50'
                    } focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!isAllDocsUploaded}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 ${
              isAllDocsUploaded
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isAllDocsUploaded ? (
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                Complete Registration
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Upload All Required Documents
              </div>
            )}
          </motion.button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            {uploadedDocs.aadhar && uploadedDocs.license && (userType === 'renter' || uploadedDocs.collegeId) 
              ? '✅ All documents uploaded!' 
              : `${Object.values(uploadedDocs).filter(Boolean).length} of ${requiredDocs.length} documents uploaded`}
          </p>
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
    <div className={`p-6 rounded-xl border ${isDark ? 'border-neutral-dark bg-primary-dark' : 'border-neutral-light bg-neutral-light bg-opacity-30'}`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-secondary-dark' : 'bg-white'}`}>
          {file ? (
            <Check className="h-6 w-6 text-green-500" />
          ) : (
            <FileImage className={`h-6 w-6 ${isDark ? 'text-accent-primary' : 'text-accent-secondary'}`} />
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
            {title} {required && '*'}
          </h3>
          <p className={`text-sm mb-4 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
            {description}
          </p>
          
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileImage className="h-4 w-4 text-green-500" />
                <span className={`text-sm ${isDark ? 'text-neutral-light' : 'text-neutral-dark'}`}>
                  {file.name}
                </span>
              </div>
              <label className="cursor-pointer text-accent-primary hover:text-accent-secondary text-sm font-medium">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer">
              <div className={`flex items-center justify-center space-x-2 p-4 border-2 border-dashed rounded-lg ${
                isDark 
                  ? 'border-neutral-dark hover:border-accent-primary bg-secondary-dark hover:bg-primary-dark' 
                  : 'border-neutral-light hover:border-accent-primary bg-white hover:bg-neutral-light'
              } transition-all duration-200`}>
                <Upload className={`h-5 w-5 ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`} />
                <span className={`font-medium ${isDark ? 'text-neutral-light opacity-70' : 'text-neutral-dark opacity-70'}`}>
                  Click to upload
                </span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
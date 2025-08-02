import { useState, useCallback } from 'react';
import { uploadFile, validateFile } from '../utils/fileService';

/**
 * Custom hook for handling file uploads
 * @param {Object} options - Upload options
 * @param {Function} [options.onSuccess] - Callback when upload is successful
 * @param {Function} [options.onError] - Callback when upload fails
 * @param {Function} [options.onProgress] - Callback for upload progress
 * @param {Object} [options.validation] - Validation options
 * @returns {Object} - Upload state and handlers
 */
const useFileUpload = (options = {}) => {
  const {
    onSuccess,
    onError,
    onProgress,
    validation = {},
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  /**
   * Handle file upload
   * @param {File} file - The file to upload
   */
  const upload = useCallback(
    async (file) => {
      // Reset state
      setError(null);
      setProgress(0);
      setIsUploading(true);

      try {
        // Validate file
        const validationResult = validateFile(file, validation);
        if (!validationResult.isValid) {
          throw new Error(validationResult.error);
        }

        // Upload file
        const result = await uploadFile(file, {
          onUploadProgress: (progressValue) => {
            setProgress(progressValue);
            if (onProgress) onProgress(progressValue);
          },
        });

        if (result.success) {
          setUploadedFile(result.data);
          if (onSuccess) onSuccess(result.data);
          return result.data;
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
        const errorMessage = err.message || 'Failed to upload file';
        setError(errorMessage);
        if (onError) onError(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [onSuccess, onError, onProgress, validation]
  );

  /**
   * Reset the upload state
   */
  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    setIsUploading(false);
    setUploadedFile(null);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    uploadedFile,
    reset,
  };
};

export default useFileUpload;

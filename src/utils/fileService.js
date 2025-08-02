import api from './api';

/**
 * Service for handling file uploads to the backend
 */

/**
 * Uploads a file to the server
 * @param {File} file - The file to upload
 * @param {Object} options - Additional options
 * @param {Function} [options.onUploadProgress] - Progress callback
 * @returns {Promise<Object>} - Upload response
 */
export const uploadFile = async (file, { onUploadProgress } = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to upload file',
    };
  }
};

/**
 * Gets a file URL from the server
 * @param {string} fileKey - The S3 file key
 * @returns {string} - Full URL to the file
 */
export const getFileUrl = (fileKey) => {
  return `${process.env.REACT_APP_API_URL || '/api'}/files/${fileKey}`;
};

/**
 * Validates a file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} [options.maxSize=5] - Maximum file size in MB
 * @param {string[]} [options.allowedTypes=['image/jpeg', 'image/png', 'image/jpg']] - Allowed MIME types
 * @returns {{isValid: boolean, error?: string}} - Validation result
 */
export const validateFile = (
  file,
  {
    maxSize = 5, // MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  } = {}
) => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Only ${allowedTypes
        .map((type) => type.split('/')[1].toUpperCase())
        .join(', ')} files are allowed.`,
    };
  }

  // Check file size (convert MB to bytes)
  const maxSizeInBytes = maxSize * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File is too large. Maximum size is ${maxSize}MB.`,
    };
  }

  return { isValid: true };
};

export default {
  uploadFile,
  getFileUrl,
  validateFile,
};

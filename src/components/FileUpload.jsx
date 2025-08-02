import React, { useCallback, useState, useRef } from 'react';
import { Box, Button, CircularProgress, Typography, Paper, useTheme } from '@mui/material';
import { CloudUpload as UploadIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import useFileUpload from '../hooks/useFileUpload';
import { styled } from '@mui/material/styles';

const DropZone = styled(Paper)(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: 'rgba(25, 118, 210, 0.04)',
  },
}));

const UploadIconWrapper = styled(Box)(({ theme }) => ({
  margin: '0 auto 16px',
  color: theme.palette.text.secondary,
  '&.success': {
    color: theme.palette.success.main,
  },
}));

const FileUpload = ({
  onSuccess,
  onError,
  accept = 'image/*',
  maxSize = 5, // MB
  buttonText = 'Choose a file',
  dropzoneText = 'or drag and drop here',
  helperText = 'JPG, PNG up to 5MB',
  disabled = false,
  multiple = false,
  ...props
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { upload, isUploading, progress, error, uploadedFile } = useFileUpload({
    onSuccess: (data) => {
      setSelectedFile(data);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      setSelectedFile(null);
      if (onError) onError(error);
    },
    validation: {
      maxSize,
      allowedTypes: accept === 'image/*' 
        ? ['image/jpeg', 'image/png', 'image/jpg'] 
        : undefined,
    },
  });

  const handleFileChange = useCallback(
    (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        upload(files[0]);
      }
    },
    [upload]
  );

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragOver(false);
      
      const files = Array.from(event.dataTransfer.files);
      if (files.length > 0) {
        upload(files[0]);
      }
    },
    [upload]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (event) => {
    event.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderContent = () => {
    if (isUploading) {
      return (
        <>
          <CircularProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Uploading... {Math.round(progress)}%
          </Typography>
        </>
      );
    }

    if (uploadedFile) {
      return (
        <>
          <UploadIconWrapper className="success">
            <CheckCircleIcon fontSize="large" />
          </UploadIconWrapper>
          <Typography variant="subtitle1" gutterBottom>
            File uploaded successfully!
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {uploadedFile.imageUrl.split('/').pop()}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleRemove}
            disabled={disabled}
          >
            Remove
          </Button>
        </>
      );
    }

    return (
      <>
        <UploadIconWrapper>
          <UploadIcon fontSize="large" />
        </UploadIconWrapper>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          onClick={handleButtonClick}
          disabled={disabled}
          sx={{ mb: 1 }}
        >
          {buttonText}
        </Button>
        <Typography variant="body2" color="textSecondary">
          {dropzoneText}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {helperText}
        </Typography>
      </>
    );
  };

  return (
    <Box {...props}>
      <DropZone
        variant="outlined"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        isDragActive={isDragOver}
      >
        {renderContent()}
      </DropZone>
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;

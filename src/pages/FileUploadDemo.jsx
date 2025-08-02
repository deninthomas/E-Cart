import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Divider, Link } from '@mui/material';
import FileUpload from '../components/FileUpload';

const FileUploadDemo = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUploadSuccess = (fileData) => {
    console.log('File uploaded successfully:', fileData);
    setUploadedFile(fileData);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        File Upload Demo
      </Typography>
      
      <Typography variant="body1" paragraph>
        This demo showcases the file upload component that integrates with the AWS S3 backend.
        Try uploading an image file to see it in action!
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Basic File Upload
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              A simple file uploader with drag-and-drop support.
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <FileUpload
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
                accept="image/*"
                maxSize={5}
                buttonText="Select an image"
                dropzoneText="or drag and drop"
                helperText="JPG, PNG up to 5MB"
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Upload Preview
            </Typography>
            
            {uploadedFile ? (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Box
                  component="img"
                  src={uploadedFile.imageUrl}
                  alt="Uploaded preview"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: 1,
                    boxShadow: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="body2" color="textSecondary">
                  File URL: <Link href={uploadedFile.imageUrl} target="_blank" rel="noopener">
                    {uploadedFile.imageUrl.split('/').pop()}
                  </Link>
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                  Key: {uploadedFile.key}
                </Typography>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  height: '200px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Uploaded file will appear here
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          How to Use
        </Typography>
        
        <Typography variant="body1" paragraph>
          The <code>FileUpload</code> component provides a complete solution for handling file uploads 
          with drag-and-drop support, file validation, and upload progress tracking.
        </Typography>

        <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
          Basic Usage:
        </Typography>
        
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default', overflow: 'auto' }}>
          <pre>
            {`import FileUpload from './components/FileUpload';

function MyComponent() {
  const handleUploadSuccess = (fileData) => {
    console.log('Uploaded file:', fileData);
  };

  return (
    <FileUpload
      onSuccess={handleUploadSuccess}
      onError={(error) => console.error(error)}
      accept="image/*"
      maxSize={5}
    />
  );
}`}
          </pre>
        </Paper>

        <Typography variant="subtitle2" gutterBottom>
          Props:
        </Typography>
        
        <Box component="ul" sx={{ pl: 3, mb: 3 }}>
          <li><strong>onSuccess</strong>: Callback when upload is successful (receives file data)</li>
          <li><strong>onError</strong>: Callback when upload fails (receives error message)</li>
          <li><strong>accept</strong>: Accepted file types (default: 'image/*')</li>
          <li><strong>maxSize</strong>: Maximum file size in MB (default: 5)</li>
          <li><strong>buttonText</strong>: Text for the upload button</li>
          <li><strong>dropzoneText</strong>: Text shown in the dropzone</li>
          <li><strong>helperText</strong>: Helper text below the dropzone</li>
          <li><strong>disabled</strong>: Disable the uploader</li>
          <li><strong>multiple</strong>: Allow multiple file selection</li>
        </Box>
      </Box>
    </Container>
  );
};

export default FileUploadDemo;

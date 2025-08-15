import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const CertificateModal = ({ 
  open, 
  onClose, 
  course, 
  onDownload 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Download Certificate</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {course && (
          <Box>
            <Typography variant="body1" gutterBottom>
              You're about to download the certificate for:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', my: 2 }}>
              {course.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Certificate ID: {course.certificateId}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
              This certificate verifies your successful completion of the course.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={onDownload} 
          variant="contained" 
          color="primary"
          startIcon={<DownloadIcon />}
        >
          Download Certificate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateModal;
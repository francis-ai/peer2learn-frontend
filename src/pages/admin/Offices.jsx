import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Business as OfficeIcon,
  MeetingRoom as CohubIcon
} from '@mui/icons-material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const showAlert = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const [currentOffice, setCurrentOffice] = useState({
    id: '',
    office_name: '',
    address: '',
    phone_number: '',
    email: '',
    location: '',
    office_images: []
  });

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/all-offices`);
      setOffices(res.data);
    } catch (err) {
      console.error('Failed to fetch offices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleOpenModal = (office = null) => {
    if (office) {
      setEditMode(true);

      let imgs = [];
      try {
        imgs = office.office_images ? JSON.parse(office.office_images) : [];
      } catch {
        imgs = [];
      }

      setCurrentOffice({
        id: office.id,
        office_name: office.office_name,
        address: office.address,
        phone_number: office.phone_number,
        email: office.email,
        location: office.location,
        office_images: imgs
      });
    } else {
      setEditMode(false);
      setCurrentOffice({
        id: '',
        office_name: '',
        address: '',
        phone_number: '',
        email: '',
        location: '',
        office_images: []
      });
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOffice(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("office_name", currentOffice.office_name);
      formData.append("address", currentOffice.address);
      formData.append("location", currentOffice.location);
      formData.append("phone_number", currentOffice.phone_number);
      formData.append("email", currentOffice.email);

      // append only Files
      currentOffice.office_images.forEach((img) => {
        if (img instanceof File) {
          formData.append("office_image", img);
        }
      });

      if (editMode) {
        await axios.put(
          `${BASE_URL}/api/admin/update-office/${currentOffice.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showAlert("Office updated successfully!");
      } else {
        await axios.post(
          `${BASE_URL}/api/admin/add-office`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        showAlert("Office added successfully!");
      }

      fetchOffices();
      handleCloseModal();

    } catch (err) {
      console.error("Error saving office:", err);
      showAlert("Failed to save office", "error");
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setSelectedOfficeId(id);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setSelectedOfficeId(null);
    setDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/delete-office/${selectedOfficeId}`);
      fetchOffices();
      showAlert("Office deleted", "success");
    } catch (err) {
      console.error('Error deleting office:', err);
      showAlert("Failed to delete office", "error");
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const handleMoveToCohub = async (officeId) => {
    try {
      await axios.post(`${BASE_URL}/api/admin/move-to-cohub/${officeId}`);
      showAlert("Office moved to Cohub successfully!");
      fetchOffices();
    } catch (err) {
      console.error('Error moving office:', err);
      showAlert("Failed to move office", "error");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Office Locations
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Add New Office
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Office Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Actions</TableCell>
                  <TableCell align="center">Move</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  offices.map((office) => (
                    <TableRow key={office.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <OfficeIcon color="primary" />
                          <Typography>{office.office_name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon color="secondary" />
                          <Typography>{office.address}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{office.location}</TableCell>
                      <TableCell>{office.phone_number}</TableCell>
                      <TableCell>{office.email}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenModal(office)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDeleteConfirm(office.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<CohubIcon />}
                          onClick={() => handleMoveToCohub(office.id)}
                        >
                          Move
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {editMode ? 'Edit Office Location' : 'Add New Office Location'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField fullWidth label="Office Name" name="office_name" value={currentOffice.office_name} onChange={handleInputChange} required />
              <TextField fullWidth label="Address" name="address" value={currentOffice.address} onChange={handleInputChange} required multiline rows={3} />
              <TextField fullWidth label="Location" name="location" value={currentOffice.location} onChange={handleInputChange} required />
              <TextField fullWidth label="Email" name="email" value={currentOffice.email} onChange={handleInputChange} required />
              <TextField fullWidth label="Phone Number" name="phone_number" value={currentOffice.phone_number} onChange={handleInputChange} required />

              <Button variant="outlined" component="label">
                Upload Office Images
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setCurrentOffice(prev => ({
                      ...prev,
                      office_images: [...prev.office_images, ...Array.from(e.target.files)]
                    }))
                  }
                />
              </Button>

              {currentOffice.office_images.length > 0 && (
                <Typography variant="body2" color="primary">
                  {currentOffice.office_images.map((img, index) =>
                    typeof img === "string" ? (
                      <div key={index}>{img}</div>
                    ) : (
                      <div key={index}>{img.name}</div>
                    )
                  )}
                </Typography>
              )}
            </Stack>
          </form>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editMode ? 'Update Office' : 'Add Office'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this office?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   IconButton,
//   TextField,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import { Snackbar, Alert } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   LocationOn as LocationIcon,
//   Business as OfficeIcon,
//   MeetingRoom as CohubIcon
// } from '@mui/icons-material';

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// export default function Offices() {
//   const [offices, setOffices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openModal, setOpenModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [selectedOfficeId, setSelectedOfficeId] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarColor, setSnackbarColor] = useState('success');


//   const [currentOffice, setCurrentOffice] = useState({
//     id: '',
//     office_name: '',
//     address: '',
//     phone_number: '',
//     location: '',
//     office_image: null
//   });

//   const fetchOffices = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/api/admin/all-offices`);
//       setOffices(res.data);
//     } catch (err) {
//       console.error('Failed to fetch offices:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOffices();
//   }, []);

//   const handleOpenModal = (office = null) => {
//     if (office) {
//       setEditMode(true);
//       setCurrentOffice(office);
//     } else {
//       setEditMode(false);
//       setCurrentOffice({
//         id: '',
//         office_name: '',
//         address: '',
//         phone_number: '',
//         location: '',
//         office_image: null
//       });
//     }
//     setOpenModal(true);
//   };

//   const handleCloseModal = () => setOpenModal(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentOffice(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("office_name", currentOffice.office_name);
//       formData.append("address", currentOffice.address);
//       formData.append("location", currentOffice.location);
//       formData.append("phone_number", currentOffice.phone_number);

//       if (currentOffice.office_image) {
//         formData.append("office_image", currentOffice.office_image);
//       }

//       if (editMode) {
//         await axios.put(
//           `${BASE_URL}/api/admin/update-office/${currentOffice.id}`,
//           formData,
//           {
//             headers: { "Content-Type": "multipart/form-data" }
//           }
//         );
//       } else {
//         await axios.post(
//           `${BASE_URL}/api/admin/add-office`,
//           formData,
//           {
//             headers: { "Content-Type": "multipart/form-data" }
//           }
//         );
//       }

//       fetchOffices();
//       handleCloseModal();

//     } catch (err) {
//       console.error("Error saving office:", err);
//     }
//   };

//   const handleOpenDeleteConfirm = (id) => {
//     setSelectedOfficeId(id);
//     setDeleteConfirmOpen(true);
//   };

//   const handleCloseDeleteConfirm = () => {
//     setSelectedOfficeId(null);
//     setDeleteConfirmOpen(false);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`${BASE_URL}/api/admin/delete-office/${selectedOfficeId}`);
//       fetchOffices();
//     } catch (err) {
//       console.error('Error deleting office:', err);
//     } finally {
//       handleCloseDeleteConfirm();
//     }
//   };

//   // 🔹 Move office to Cohub
//   const handleMoveToCohub = async (officeId) => {
//     try {
//       await axios.post(`${BASE_URL}/api/admin/move-to-cohub/${officeId}`);

//       setSnackbarMessage('Office moved to Cohub successfully!');
//       setSnackbarColor('success');
//       setSnackbarOpen(true);

//       fetchOffices();
//     } catch (err) {
//       console.error('Error moving office to Cohub:', err);

//       setSnackbarMessage('Failed to move office to Cohub.');
//       setSnackbarColor('error');
//       setSnackbarOpen(true);
//     }
//   };


//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
//         Office Locations
//       </Typography>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarColor}
//           variant="filled"
//           sx={{ width: '100%' }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>


//       {/* Action Bar */}
//       <Card sx={{ mb: 3 }}>
//         <CardContent>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => handleOpenModal()}
//           >
//             Add New Office
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Offices Table */}
//       <Card>
//         <CardContent>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Office Name</TableCell>
//                   <TableCell>Address</TableCell>
//                   <TableCell>Location</TableCell>
//                   <TableCell>Phone Number</TableCell>
//                   <TableCell align="center">Actions</TableCell>
//                   <TableCell align="center">Move to Cohub</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={6}>Loading...</TableCell>
//                   </TableRow>
//                 ) : (
//                   offices.map((office) => (
//                     <TableRow key={office.id} hover>
//                       <TableCell>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <OfficeIcon color="primary" />
//                           <Typography>{office.office_name}</Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Stack direction="row" alignItems="center" spacing={1}>
//                           <LocationIcon color="secondary" />
//                           <Typography>{office.address}</Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>{office.location}</TableCell>
//                       <TableCell>{office.phone_number}</TableCell>
//                       <TableCell align="center">
//                         <IconButton color="primary" onClick={() => handleOpenModal(office)}>
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton color="error" onClick={() => handleOpenDeleteConfirm(office.id)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </TableCell>
//                       <TableCell align="center">
//                         <Button
//                           variant="contained"
//                           color="success"
//                           startIcon={<CohubIcon />}
//                           onClick={() => handleMoveToCohub(office.id)}
//                         >
//                           Move
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </CardContent>
//       </Card>

//       {/* Office Form Modal */}
//       <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Typography variant="h6" fontWeight="bold">
//             {editMode ? 'Edit Office Location' : 'Add New Office Location'}
//           </Typography>
//         </DialogTitle>
//         <DialogContent>
//           <form onSubmit={handleSubmit}>
//             <Stack spacing={3} sx={{ mt: 2 }}>
//               <TextField
//                 fullWidth
//                 label="Office Name"
//                 name="office_name"
//                 value={currentOffice.office_name}
//                 onChange={handleInputChange}
//                 required
//               />
//               <TextField
//                 fullWidth
//                 label="Address"
//                 name="address"
//                 value={currentOffice.address}
//                 onChange={handleInputChange}
//                 required
//                 multiline
//                 rows={3}
//               />
//               <TextField
//                 fullWidth
//                 label="Location"
//                 name="location"
//                 value={currentOffice.location}
//                 onChange={handleInputChange}
//                 required
//               />
//               <TextField
//                 fullWidth
//                 label="Phone Number"
//                 name="phone_number"
//                 value={currentOffice.phone_number}
//                 onChange={handleInputChange}
//                 required
//               />
//               <Button
//                 variant="outlined"
//                 component="label"
//               >
//                 Upload Office Image
//                 <input
//                   type="file"
//                   hidden
//                   accept="image/*"
//                   name="office_image"
//                   onChange={(e) =>
//                     setCurrentOffice(prev => ({
//                       ...prev,
//                       office_image: e.target.files[0]
//                     }))
//                   }
//                 />
//               </Button>

//               {currentOffice.office_image && (
//                 <Typography variant="body2" color="primary">
//                   {typeof currentOffice.office_image === 'string'
//                     ? currentOffice.office_image
//                     : currentOffice.office_image.name}
//                 </Typography>
//               )}
//             </Stack>
//           </form>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal}>Cancel</Button>
//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={
//               !currentOffice.office_name ||
//               !currentOffice.address ||
//               !currentOffice.location ||
//               !currentOffice.phone_number
//             }
//           >
//             {editMode ? 'Update Office' : 'Add Office'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteConfirmOpen}
//         onClose={handleCloseDeleteConfirm}
//         maxWidth="xs"
//         fullWidth
//       >
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <Typography>Are you sure you want to delete this office?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
//           <Button variant="contained" color="error" onClick={handleDelete}>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

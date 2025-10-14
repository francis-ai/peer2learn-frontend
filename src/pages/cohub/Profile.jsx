// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Avatar,
//   Box,
//   Paper,
//   Divider,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { useCohubAuth } from "../../context/cohubAuthContext";

// const BASE_URL = process.env.REACT_APP_BASE_URL;

// const ProfileUpdate = () => {
//   const { cohub } = useCohubAuth();
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//     location: "",
//     office_image: null,
//     office_image_url: "",
//   });

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");

//   // Fetch office profile on mount
//   useEffect(() => {
//     const fetchOfficeProfile = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/api/cohub/get-profile/${cohub.id}`);
//         const data = await res.json();
//         if (res.ok && data) {
//           setFormData({
//             name: data.name || "",
//             phone: data.phone || "",
//             address: data.address || "",
//             location: data.location || "",
//             office_image: null,
//             office_image_url: data.office_image_url || "",
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching office profile:", err);
//       }
//     };

//     fetchOfficeProfile();
//   }, [cohub.id]);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("phone", formData.phone);
//     data.append("address", formData.address);
//     data.append("location", formData.location);
//     if (formData.office_image) data.append("office_image", formData.office_image);

//     try {
//       const res = await fetch(`${BASE_URL}/api/cohub/update-profile/${cohub.id}`, {
//         method: "PUT",
//         body: data,
//       });

//       const result = await res.json();

//       if (res.ok) {
//         setSnackbarMessage("Profile updated successfully!");
//         setSnackbarSeverity("success");
//         // If image updated, update URL preview
//         if (formData.office_image) {
//           setFormData((prev) => ({
//             ...prev,
//             office_image_url: URL.createObjectURL(formData.office_image),
//             office_image: null,
//           }));
//         }
//       } else {
//         setSnackbarMessage(result.message || "Update failed");
//         setSnackbarSeverity("error");
//       }
//     } catch (error) {
//       console.error(error);
//       setSnackbarMessage("Error updating profile");
//       setSnackbarSeverity("error");
//     } finally {
//       setSnackbarOpen(true);
//     }
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 4 }}>
//       <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 4 }}>
//         <Box textAlign="center" sx={{ mb: 3 }}>
//           <Avatar
//             src={formData.office_image_url}
//             alt={formData.name}
//             sx={{ width: 80, height: 80, mb: 1, bgcolor: "primary.main", mx: "auto" }}
//           >
//             {formData.name?.[0] || "C"}
//           </Avatar>
//           <Typography variant="h5" fontWeight="bold">
//             {formData.name || "Cohub User"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {cohub?.email || "Not available"}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {formData.location || "Not available"}
//           </Typography>
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         <Box component="form" onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Phone Number"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Address"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />
//           <TextField
//             fullWidth
//             label="Location"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             sx={{ mb: 2 }}
//           />

//           <Box sx={{ mt: 2, mb: 2 }}>
//             <Button variant="outlined" component="label" fullWidth>
//               Upload Office Image
//               <input
//                 type="file"
//                 name="office_image"
//                 accept="image/*"
//                 hidden
//                 onChange={handleChange}
//               />
//             </Button>

//             {(formData.office_image || formData.office_image_url) && (
//               <img
//                 src={
//                   formData.office_image
//                     ? URL.createObjectURL(formData.office_image)
//                     : formData.office_image_url
//                 }
//                 alt="Office Preview"
//                 style={{
//                   width: 80,
//                   height: 80,
//                   marginTop: 8,
//                   objectFit: "cover",
//                   borderRadius: 4,
//                 }}
//               />
//             )}
//           </Box>

//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             fullWidth
//             sx={{ mt: 2, py: 1.2, fontWeight: "bold" }}
//           >
//             Update Profile
//           </Button>
//         </Box>
//       </Paper>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={4000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={() => setSnackbarOpen(false)}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default ProfileUpdate;


import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Paper,
  Divider,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCohubAuth } from "../../context/cohubAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ProfileUpdate = () => {
  const { cohub } = useCohubAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
    office_images: [], // store File objects here
    office_image_urls: [], // store existing URLs or previews
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // 📥 Fetch existing profile
  useEffect(() => {
    const fetchOfficeProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cohub/get-profile/${cohub.id}`);
        const data = await res.json();
        if (res.ok && data) {
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || "",
            location: data.location || "",
            office_images: [],
            office_image_urls: data.office_images ? JSON.parse(data.office_images).map(img => `${BASE_URL}/uploads/cohub/${img}`) : [],
          });
        }
      } catch (err) {
        console.error("Error fetching office profile:", err);
      }
    };
    fetchOfficeProfile();
  }, [cohub.id]);

  // 📤 Handle text changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 📤 Handle file selection
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => {
      const newFiles = [...prev.office_images];
      const newPreviews = [...prev.office_image_urls];
      newFiles[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      return { ...prev, office_images: newFiles, office_image_urls: newPreviews };
    });
  };

  // ➕ Add new image input (max 3)
  const addImageField = () => {
    if (formData.office_images.length >= 3) return;
    setFormData((prev) => ({
      ...prev,
      office_images: [...prev.office_images, null],
      office_image_urls: [...prev.office_image_urls, ""],
    }));
  };

  // ❌ Remove image field
  const removeImageField = (index) => {
    setFormData((prev) => {
      const newFiles = prev.office_images.filter((_, i) => i !== index);
      const newPreviews = prev.office_image_urls.filter((_, i) => i !== index);
      return { ...prev, office_images: newFiles, office_image_urls: newPreviews };
    });
  };

  // 📤 Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("location", formData.location);

    // Append all images
    formData.office_images.forEach((file) => {
      if (file) data.append("office_images", file);
    });

    try {
      const res = await fetch(`${BASE_URL}/api/cohub/update-profile/${cohub.id}`, {
        method: "PUT",
        body: data,
      });
      const result = await res.json();

      if (res.ok) {
        setSnackbarMessage("✅ Profile updated successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(result.message || "❌ Update failed");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage("❌ Error updating profile");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: {xs: 1}, mt: 4 }}>
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Avatar
            src={formData.office_image_urls[0] || ""}
            alt={formData.name}
            sx={{ width: 80, height: 80, mb: 1, bgcolor: "primary.main", mx: "auto" }}
          >
            {formData.name?.[0] || "C"}
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {formData.name || "Cohub User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {cohub?.email || "Not available"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleChange} sx={{ mb: 2 }} />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Office Images (max 3)
          </Typography>

          {formData.office_images.map((_, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Button variant="outlined" component="label" fullWidth startIcon={<AddPhotoAlternateIcon />}>
                Upload Image {index + 1}
                <input
                  type="file"
                  name="office_images"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFileChange(e, index)}
                />
              </Button>
              <IconButton color="error" onClick={() => removeImageField(index)}>
                <DeleteIcon />
              </IconButton>
              {formData.office_image_urls[index] && (
                <img
                  src={formData.office_image_urls[index]}
                  alt={`Office ${index + 1}`}
                  style={{ width: 80, height: 80, objectFit: "cover", marginLeft: 8, borderRadius: 6 }}
                />
              )}
            </Box>
          ))}

          {formData.office_images.length < 3 && (
            <Button variant="text" onClick={addImageField} fullWidth sx={{ mt: 1 }}>
              ➕ Add New Image
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
          >
            Update Profile
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileUpdate;

import { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import {
  CheckCircle,
  PendingActions
} from '@mui/icons-material';
import ActivePayments from '../../components/dashboard/ActivePayment';
import CompletedPayments from '../../components/dashboard/CompletedPayment';

export default function Payment() {
  const [activeTab, setActiveTab] = useState(0);

  const student = JSON.parse(localStorage.getItem('student'));
  const courseId = localStorage.getItem('selectedCourseId'); // Adjust this as needed

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3, mt: 12, mx: 'auto', maxWidth: '900px' }}>
      <Typography variant="h4" gutterBottom>
        Payment Management
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Active Payments" icon={<PendingActions />} />
        <Tab label="Completed Payments" icon={<CheckCircle />} />
      </Tabs>

      {activeTab === 0 ? (
        <ActivePayments 
          studentId={student?.id}
          courseId={courseId}
          formatDate={formatDate} 
          formatCurrency={formatCurrency} 
        />
      ) : (
        <CompletedPayments 
          studentId={student?.id}
          courseId={courseId}
          formatDate={formatDate} 
          formatCurrency={formatCurrency} 
        />
      )}
    </Box>
  );
};

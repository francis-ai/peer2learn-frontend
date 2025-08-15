import { Card, CardContent, Box, Typography, LinearProgress, Button } from '@mui/material';
import { Payment } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const paymentStatus = {
  total: 400000,
  paid: 180000,
  dueDate: "Jun 15, 2023"
};

const PaymentStatus = () => {
  const theme = useTheme();
  
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Payment sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Installment Status
          </Typography>
        </Box>
        <Typography sx={{ mb: 2 }}>
          <strong>Total:</strong> ₦{paymentStatus.total.toLocaleString()}
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(paymentStatus.paid / paymentStatus.total) * 100} 
          sx={{ height: 8, borderRadius: 4, mb: 2 }} 
        />
        <Typography sx={{ mb: 2 }}>
          <strong>Paid:</strong> ₦{paymentStatus.paid.toLocaleString()} of ₦{paymentStatus.total.toLocaleString()}
        </Typography>
        <Typography sx={{ mb: 3 }}>
          <strong>Next Due:</strong> {paymentStatus.dueDate}
        </Typography>
        <Button 
          variant="contained" 
          fullWidth
          sx={{
            background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
            '&:hover': {
              background: 'linear-gradient(90deg, #4361ee, #3a0ca3)'
            }
          }}
        >
          Make Payment
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
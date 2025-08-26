import React from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppWidget = () => {
  const phoneNumber = '2348159227696'; // Your phone number without + or 0
  const message = encodeURIComponent('I am from Peer2Learn');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Tooltip 
            title="Chat on WhatsApp" 
            placement="left"
            arrow
          >
            <Fab
              color="success"
              aria-label="whatsapp"
              onClick={handleClick}
              sx={{
                width: 60,
                height: 60,
                backgroundColor: '#25D366',
                boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
                '&:hover': {
                  backgroundColor: '#128C7E',
                  boxShadow: '0 6px 24px rgba(37, 211, 102, 0.4)',
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 32, color: 'white' }} />
            </Fab>
          </Tooltip>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
};

export default WhatsAppWidget;
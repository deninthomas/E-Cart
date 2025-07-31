import { useState } from 'react';
import { Box, Fab, Badge, Tooltip, Zoom } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import GlobalChat from './GlobalChat';

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setShowTooltip(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Show tooltip after 3 seconds if chat is not opened
  useState(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {isOpen ? (
        <GlobalChat isOpen={isOpen} onClose={handleClose} />
      ) : (
        <Tooltip 
          title="Need help? Chat with us!" 
          arrow 
          open={showTooltip}
          onClose={() => setShowTooltip(false)}
          TransitionComponent={Zoom}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error" 
            overlap="circular"
            onClick={handleOpen}
            sx={{
              '& .MuiBadge-badge': {
                boxShadow: '0 0 0 2px #fff',
              },
            }}
          >
            <Fab 
              color="primary" 
              aria-label="chat" 
              sx={{
                width: 60,
                height: 60,
                boxShadow: 3,
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>
          </Badge>
        </Tooltip>
      )}
    </Box>
  );
};

export default ChatButton;

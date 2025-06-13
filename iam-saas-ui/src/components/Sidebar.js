import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { Home, People, Security, BarChart, Settings, Menu as MenuIcon } from '@mui/icons-material';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <Home /> },
    { text: 'Users', icon: <People /> },
    { text: 'Roles', icon: <Security /> },
    { text: 'Reports', icon: <BarChart /> },
    { text: 'Settings', icon: <Settings /> }
  ];

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ position: 'absolute', top: 20, left: 20, color: 'white' }}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} sx={{ '& .MuiDrawer-paper': { background: '#1E1E2F', color: 'white', width: 250 } }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => setOpen(false)} sx={{ '&:hover': { backgroundColor: '#34344A' } }}>
                {item.icon}
                <ListItemText primary={item.text} sx={{ marginLeft: 2 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

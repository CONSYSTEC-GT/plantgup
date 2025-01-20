import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Sidebar = () => {
  const filters = ["All", "Approved", "Rejected", "Submitted", "Paused", "Failed", "Deactivated"];

  return (
    <Box sx={{ width: 200, backgroundColor: '#0000', height: '100vh', padding: 2, marginRight: 2, borderRight: '1px solid gray' }}>
      <List>
        {filters.map((filter) => (
          <ListItem key={filter}>
            <ListItemButton>
              <ListItemText primary={filter} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;

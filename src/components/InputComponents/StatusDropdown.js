import React from 'react';
import { MenuItem, Select, Box } from '@mui/material';

const StatusDropdown = ({ value, onChange }) => {
  return (
    <Box sx={{ m: 1, minWidth: 120 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        fullWidth
        value={value}
        onChange={onChange}
      >
        <MenuItem value="open">Open</MenuItem>
        <MenuItem value="inprogress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
        <MenuItem value="rejected">Rejected</MenuItem>
      </Select>
    </Box>
  );
};

export default StatusDropdown;

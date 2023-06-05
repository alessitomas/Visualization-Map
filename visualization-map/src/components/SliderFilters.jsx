
import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';



const SliderFilters = ({ duration, distance, updateDuration, updateDistance }) => {

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Duration'}
        value={duration}
        onChange={updateDuration}
        valueLabelDisplay="auto"

        disableSwap
      />
      <Slider
        getAriaLabel={() => 'Distance'}
        value={distance}
        onChange={updateDistance}
        valueLabelDisplay="auto"

        disableSwap
      />
    </Box>
  );
}

export default SliderFilters;
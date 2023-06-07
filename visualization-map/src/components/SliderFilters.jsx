import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';


const SliderFilters = ({ duration, distance, updateDuration, updateDistance }) => {

  return (
    <Box sx={{ width: 300 }}>
      <label htmlFor="duration-slider">Tempo da viagem (horas):</label>
      <Slider
        getAriaLabel={() => 'Duration Filter'}
        value={duration}
        onChange={updateDuration}
        valueLabelDisplay="auto"
        min={0}
        max={5000}
        disableSwap
        aria-label="duration-slider"
      />
      <label htmlFor="distance-slider">Distância da viagem (metros):</label>
      <Slider
        getAriaLabel={() => 'Distance Filter'}
        value={distance}
        onChange={updateDistance}
        valueLabelDisplay="auto"
        min={0}
        max={50000}      
        disableSwap
        aria-label="distance-slider"
      />
    </Box>
  );
}

export default SliderFilters;

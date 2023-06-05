
import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const minDistance = 10;

const SliderFilters = () => {
  const [duration, setDuration] = React.useState([20, 37]);
  const [distance, setDistance] = React.useState([20, 37]);

  const handleChangeDuration = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setDuration([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setDuration([clamped - minDistance, clamped]);
      }
    } else {
      setDuration(newValue);
    }
  };
  const handleChangeDistance = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setDistance([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setDistance([clamped - minDistance, clamped]);
      }
    } else {
      setDistance(newValue);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => 'Duration'}
        value={duration}
        onChange={handleChangeDuration}
        valueLabelDisplay="auto"

        disableSwap
      />
      <Slider
        getAriaLabel={() => 'Distance'}
        value={distance}
        onChange={handleChangeDistance}
        valueLabelDisplay="auto"

        disableSwap
      />
    </Box>
  );
}

export default SliderFilters;
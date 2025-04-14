import React from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField
} from '@mui/material';
import { PARAMETERS, CONDITIONS, getParameterUnit } from '../../utils/alertUtils';
import '../Animations.css';

interface AlertParametersProps {
  parameter: string;
  condition: string;
  threshold: number;
  onInputChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
}

const AlertParameters: React.FC<AlertParametersProps> = ({
  parameter,
  condition,
  threshold,
  onInputChange
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth required>
          <InputLabel>Parameter</InputLabel>
          <Select
            name="parameter"
            value={parameter}
            onChange={onInputChange as any}
            label="Parameter"
          >
            {PARAMETERS.map((param) => (
              <MenuItem key={param.value} value={param.value}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {param.icon}
                  <Box sx={{ ml: 1 }}>{param.label}</Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <FormControl fullWidth required>
          <InputLabel>Condition</InputLabel>
          <Select
            name="condition"
            value={condition}
            onChange={onInputChange as any}
            label="Condition"
          >
            {CONDITIONS.map((condition) => (
              <MenuItem key={condition.value} value={condition.value}>
                {condition.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label={`Threshold (${getParameterUnit(parameter)})`}
          name="threshold"
          type="number"
          value={threshold}
          onChange={onInputChange}
          required
        />
      </Grid>
    </Grid>
  );
};

export default AlertParameters; 
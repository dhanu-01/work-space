import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function CustomDropDown({
    disabled,
    dropDownList,
    value,
    onChange,
    required
}) {

  const theme = useTheme();

  const handleChange = (event) => {
    console.log("customDropDown",event.target.value)
     onChange(event.target.value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <Select
          required={required}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          disabled={disabled}
          size='small'
          onChange={handleChange}
        >

          {dropDownList.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}


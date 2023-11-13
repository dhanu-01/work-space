import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function SearchDropDown({
  dropDownList,
  val,
  onChange,
  disabled,
  required,
  ref,
  id
}) {
  return (
    <Autocomplete
    fullWidth
    size='small'
    disabled={disabled}
      disablePortal
      onChange={(event, newValue) => {
        onChange(newValue.value);
      }}
      id={id}
      options={dropDownList}
      renderInput={(params) => <TextField fullWidth required={required} {...params}/>}
    />
  );
}

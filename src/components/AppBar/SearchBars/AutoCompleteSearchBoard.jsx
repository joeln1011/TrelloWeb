import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { fetchBoardsAPI } from '~/apis';
import { useDebounce } from '~/customHooks/useDebounce';

function AutoCompleteSearchBoard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setBoards(null);
    }
  }, [open]);

  const handleInputSearchChange = (event, value, reason) => {
    if (reason !== 'input') return; // Only search on user input
    const searchValue = value;
    if (!searchValue) return;

    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`;

    setLoading(true);
    fetchBoardsAPI(searchPath)
      .then((res) => {
        setBoards(res.boards || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const debounceSearchBoard = useDebounce(handleInputSearchChange, 1000);

  const handleSelectedBoard = (event, selectedBoard) => {
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`);
    }
  };

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search boards' : 'No boards found'}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          slotProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress sx={{ color: 'white' }} size={20} />
                ) : null}
              </>
            ),
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '&  label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
            '.MuiSvgIcon-root': { color: 'white' },
          }}
        />
      )}
    />
  );
}

export default AutoCompleteSearchBoard;

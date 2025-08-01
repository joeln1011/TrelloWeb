import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validator';
import { createNewBoardAPI } from '~/apis';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Abc from '@mui/icons-material/Abc';
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LibraryAdd from '@mui/icons-material/LibraryAdd';
import Cancel from '@mui/icons-material/Cancel';
import Modal from '@mui/material/Modal';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import Tooltip from '@mui/material/Tooltip';
import AttachFile from '@mui/icons-material/AttachFile';
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput';

import { styled } from '@mui/material/styles';
const SideBarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
  },
  '&:active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff',
  },
}));

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

function SidebarCreateBoardModal({ afterFetchBoards }) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
    reset();
  };

  const submitCreateNewBoard = (data) => {
    createNewBoardAPI(data).then(() => {
      handleCloseModal();
      afterFetchBoards();
    });
  };

  const onUploadBoardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0]);
    if (error) {
      toast.error(error);
      return;
    }
    let reqData = new FormData();
    reqData.append('boardCover', event.target?.files[0]);
    // Call API to upload card cover
    // toast.promise(
    //   callApiUpdateBoard(reqData).finally(() => (event.target.value = '')),
    //   { pending: 'Uploading Board cover...' }
    // );
  };

  return (
    <>
      <SideBarItem onClick={handleOpenModal}>
        <LibraryAdd fontSize="small" />
        Create a new board
      </SideBarItem>

      <Modal
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: 2,
            border: 'none',
            outline: 0,
            padding: '20px 30px',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
            }}
          >
            <Cancel
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleCloseModal}
            />
          </Box>
          <Box
            id="modal-modal-title"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <LibraryAdd />
            <Typography variant="h6" component="h2">
              Create a new board
            </Typography>
          </Box>
          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateNewBoard)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Title"
                    type="text"
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Abc fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...register('title', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: {
                        value: 3,
                        message: 'Title must be at least 3 characters',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Title must be at most 50 characters',
                      },
                    })}
                    error={!!errors['title']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'title'} />
                </Box>
                <Box>
                  <TextField
                    fullWidth
                    label="Description"
                    type="text"
                    variant="outlined"
                    multiline
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionOutlined fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    {...register('description', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: {
                        value: 3,
                        message: 'Description must be at least 3 characters',
                      },
                      maxLength: {
                        value: 255,
                        message: 'Description must be at most 255 characters',
                      },
                    })}
                    error={!!errors['description']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'description'} />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  <Controller
                    name="type"
                    defaultValue={BOARD_TYPES.PUBLIC}
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        onChange={(event, value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControlLabel
                          value={BOARD_TYPES.PUBLIC}
                          control={<Radio size="small" />}
                          label="Public"
                          labelPlacement="start"
                        />
                        <FormControlLabel
                          value={BOARD_TYPES.PRIVATE}
                          control={<Radio size="small" />}
                          label="Private"
                          labelPlacement="start"
                        />
                      </RadioGroup>
                    )}
                  />
                </Box>
                <Box display="flex" gap={2} justifyContent="space-between">
                  <Tooltip title="Upload your board cover image">
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<ImageOutlined />}
                      size="small"
                    >
                      Upload Cover Image
                      <VisuallyHiddenInput
                        type="file"
                        onChange={onUploadBoardCover}
                      />
                    </Button>
                  </Tooltip>
                  <Typography
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <AttachFile fontSize="small" />
                    cat.png
                  </Typography>
                </Box>

                <Box sx={{ alignSelf: 'flex-end' }}>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default SidebarCreateBoardModal;

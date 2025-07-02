import { useState } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import DeleteForever from '@mui/icons-material/DeleteForever';
import Cloud from '@mui/icons-material/Cloud';
import AddCard from '@mui/icons-material/AddCard';
import DragHandle from '@mui/icons-material/DragHandle';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import ListCards from './ListCards/ListCards';

import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useConfirm } from 'material-ui-confirm';
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createNewCardAPI, deleteColumnDetailsAPI } from '~/apis';

function Column({ column }) {
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const orderedCards = column.cards;

  const [openNewCardForm, setOpenNewCardForm] = useState();
  const [newCardTitle, setNewCardTitle] = useState('');

  const toggleNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  };
  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please Enter Card Title', { position: 'bottom-right' });
      return;
    }

    // Create new card data to call API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };
    // Call an API to create a new card
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === newCardData.columnId
    );
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }

    dispatch(updateCurrentActiveBoard(newBoard));

    toggleNewCardForm();
    setNewCardTitle('');
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  const dndKitColumnStyles = {
    //touchAction: "none",

    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };
  const confirmDeleteColumn = useConfirm();
  const handleDeleteColumn = async () => {
    const { confirmed } = await confirmDeleteColumn({
      title: 'Delete Column?',
      description:
        'This action will permanently delete this column and cards! Are you sure?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',
    });
    if (confirmed) {
      // Update data in the board state correctly
      const newBoard = { ...board };
      newBoard.columns = newBoard.columns.filter(
        (col) => col._id !== column._id
      );
      newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
        (_id) => _id !== column._id
      );
      dispatch(updateCurrentActiveBoard(newBoard));
      // Call Api handle delete column
      deleteColumnDetailsAPI(column._id).then((res) => {
        toast.success(res?.deleteResult);
      });
    }
  };

  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} )`,
        }}
      >
        {/* Box Column Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {column?.title}
          </Typography>
          <Box>
            <Tooltip title="More Options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
            >
              <MenuItem
                onClick={toggleNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': { color: 'success.light' },
                  },
                }}
              >
                <ListItemIcon>
                  <AddCard className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' },
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteForever
                    className="delete-forever-icon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* ListCards */}
        <ListCards cards={orderedCards} />

        {/* Box Column Footers */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button startIcon={<AddCard />} onClick={toggleNewCardForm}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandle sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <TextField
                label="Enter card title...."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.white' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white',
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '& .MuiOutlinedInput-input': {
                      borderRadius: 1,
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Button
                  className="interceptor-loading"
                  onClick={addNewCard}
                  variant="contained"
                  color="success"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5ox solid',
                    color: 'white',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.error.light,
                    cursor: 'pointer',
                  }}
                  onClick={toggleNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;

import { singleFileValidator } from '~/utils/validator';
import { toast } from 'react-toastify';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CreditCard from '@mui/icons-material/CreditCard';
import Cancel from '@mui/icons-material/Cancel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined';
import LocalOfferOutlined from '@mui/icons-material/LocalOfferOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';
import WatchLaterOutlined from '@mui/icons-material/WatchLaterOutlined';
import AttachFileOutlined from '@mui/icons-material/AttachFileOutlined';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import AutoFixHighOutlined from '@mui/icons-material/AutoFixHighOutlined';
import AspectRatioOutlined from '@mui/icons-material/AspectRatioOutlined';
import AddToDriveOutlined from '@mui/icons-material/AddToDriveOutlined';
import ArrowForwardIosOutlined from '@mui/icons-material/ArrowForwardIosOutlined';
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import ArchitectureOutlined from '@mui/icons-material/ArchitectureOutlined';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import SubjectRounded from '@mui/icons-material/SubjectRounded';
import DvrOutlined from '@mui/icons-material/DvrOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';

import ToggleFocusInput from '~/components/Form/ToggleFocusInput';
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput';

import CardUserGroup from './CardUserGroup';
import CardDescriptionMdEditor from './CardDecriptionMdEditor';
import CardAcitvitySection from './CardActivitySection';

import { useDispatch, useSelector } from 'react-redux';
import {
  clearCurrentActiveCard,
  selectCurrentActiveCard,
  updateCurrentActiveCard,
} from '~/redux/activeCard/activeCardSlice';
import { updateCardDetailsAPI } from '~/apis';

import { styled } from '@mui/material/styles';
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#34485d' : theme.palette.grey[300],
    '&:active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff ',
    },
  },
}));

function ActiveCard() {
  const dispatch = useDispatch();
  const activeCard = useSelector(selectCurrentActiveCard);
  const handleCloseModal = () => {
    dispatch(clearCurrentActiveCard());
  };

  // Function
  const callApiUpdateCard = async (updatedData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updatedData);

    // Update active card in current modal
    dispatch(updateCurrentActiveCard(updatedData));
    // Update data in card in activeBoard (nested data)

    return updatedCard;
  };

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() });
  };

  const onUploadCardCover = (event) => {
    console.log(event.target.files[0]);
    const error = singleFileValidator(event.target?.files[0]);
    if (error) {
      toast.error(error);
      return;
    }
    let reqData = new FormData();
    reqData.append('cardCover', event.target?.files[0]);
    // Call API to upload card cover
  };

  return (
    <Modal
      disableScrollLock
      open={true}
      onClose={handleCloseModal}
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            cursor: 'pointer',
          }}
        >
          <Cancel
            color="error"
            sx={{ '&:hover': { color: 'error.light' } }}
            onClick={handleCloseModal}
          />
        </Box>
        {activeCard?.cover && (
          <Box sx={{ mb: 4, mt: 2 }}>
            <img
              style={{
                width: '100%',
                height: '320px',
                borderRadius: '6px',
                objectFit: 'cover',
              }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        )}

        <Box
          sx={{
            mb: 1,
            mt: -3,
            pr: 2.5,
            display: 'flex',
            alignContent: 'center',
            gap: 1,
          }}
        >
          <CreditCard />
          {/* Title of Card */}
          <ToggleFocusInput
            inputFontSize="22px"
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle}
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid size={{ xs: 12, sm: 9 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
              >
                Members
              </Typography>
              {/* Card Menbers */}
              <CardUserGroup />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRounded />
                <Typography
                  variant="span"
                  sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                  Description
                </Typography>
              </Box>
              <CardDescriptionMdEditor />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlined />
                <Typography
                  variant="span"
                  sx={{ fontWeight: '600', fontSize: '20px' }}
                >
                  Activity
                </Typography>
              </Box>
              <CardAcitvitySection />
            </Box>
          </Grid>

          {/* Right Side */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Add To Card
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem className="active">
                <PersonOutlineOutlined fontSize="small" />
                Join
              </SidebarItem>
              <SidebarItem className="active" component="label">
                <ImageOutlined fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem className="active" component="label">
                <AttachFileOutlined fontSize="small" />
                Attachment
              </SidebarItem>
              <SidebarItem className="active" component="label">
                <LocalOfferOutlined fontSize="small" />
                Labels
              </SidebarItem>
              <SidebarItem className="active" component="label">
                <TaskAltOutlined fontSize="small" />
                Checklist
              </SidebarItem>
              <SidebarItem className="active" component="label">
                <WatchLaterOutlined fontSize="small" />
                Dates
              </SidebarItem>
              <SidebarItem className="active" component="label">
                <AutoFixHighOutlined fontSize="small" />
                Custom Fields
              </SidebarItem>
            </Stack>
            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Power Ups
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <AspectRatioOutlined fontSize="small" /> Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlined fontSize="small" /> Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlined fontSize="small" /> Add Power-ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}
            >
              Actions
            </Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem>
                <ArrowForwardIosOutlined fontSize="small" /> Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlined fontSize="small" /> Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlined fontSize="small" /> Make Template
              </SidebarItem>
              <SidebarItem>
                <ArchitectureOutlined fontSize="small" /> Archive
              </SidebarItem>
              <SidebarItem>
                <ShareOutlined fontSize="small" /> Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ActiveCard;

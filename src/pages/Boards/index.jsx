import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { fetchBoardsAPI } from '~/apis';
import { DEFAULT_PAGE, DEFAULT_ITEM_PER_PAGE } from '~/utils/constants';
import AppBar from '~/components/AppBar/AppBar';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; // Change to Grid2
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import SpaceDashboard from '@mui/icons-material/SpaceDashboard';
import ListAlt from '@mui/icons-material/ListAlt';
import Home from '@mui/icons-material/Home';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import SidebarCreateBoardModal from './create';
import randomColor from 'randomcolor';

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

function Boards() {
  const [boards, setBoards] = useState(null);
  const [totalBoards, setTotalBoards] = useState(null);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const pageParam = query.get('page');
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  useEffect(() => {
    fetchBoardsAPI(location.search).then((res) => {
      const boardsWithColors = (res.boards || []).map((board) => ({
        ...board,
        color: randomColor(),
      }));

      setBoards(boardsWithColors);
      setTotalBoards(res.totalBoards || 0);
    });
  }, [location.search]);

  if (!boards) {
    return <PageLoadingSpinner caption="Loading Boards..." />;
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 3 }}>
            <Stack direction="column" spacing={1}>
              <SideBarItem className="active">
                <SpaceDashboard fontSize="small" />
                Boards
              </SideBarItem>
              <SideBarItem>
                <ListAlt fontSize="small" />
                Templates
              </SideBarItem>
              <SideBarItem>
                <Home fontSize="small" />
                Home
              </SideBarItem>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <Stack direction="column" spacing={1}>
              <SidebarCreateBoardModal />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 9 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
              Your boards:
            </Typography>
            {boards?.length === 0 && (
              <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>
                No boards found!
              </Typography>
            )}
            {boards?.length > 0 && (
              <Grid container spacing={2}>
                {boards.map((b) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={b._id}>
                    <Card sx={{ width: '250px' }}>
                      <Box sx={{ height: '50px', backgroundColor: b.color }} />
                      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {b?.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {b?.description}
                        </Typography>
                        <Box
                          component={Link}
                          to={`boards/${b._id}`}
                          sx={{
                            mt: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            color: 'primary.main',
                            '&:hover': { color: 'primary.light' },
                          }}
                        >
                          Go to board <ArrowRight fontSize="small" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {totalBoards > 0 && (
              <Box
                sx={{
                  my: 3,
                  pr: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Pagination
                  size="large"
                  color="secondary"
                  showFirstButton
                  showLastButton
                  count={Math.ceil(totalBoards / DEFAULT_ITEM_PER_PAGE)}
                  page={safePage}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`/boards${
                        item.page === DEFAULT_PAGE ? '' : `?page=${item.page}`
                      }`}
                      {...item}
                    />
                  )}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Boards;

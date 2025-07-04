import AppBar from '~/components/AppBar/AppBar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Security from '@mui/icons-material/Security';
import Person from '@mui/icons-material/Person';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AccountTab from './AccountTab';
import SecurityTab from './SecurityTab';

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security',
};

function Settings() {
  const location = useLocation();
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY;
    return TABS.ACCOUNT;
  };
  const [activeTab, setActiveTab] = useState(getDefaultTab());

  const handleChangeTab = (event, selectedTab) => {
    setActiveTab(selectedTab);
  };

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab
              label="Account"
              value={TABS.ACCOUNT}
              icon={<Person />}
              iconPosition="start"
              component={Link}
              to="/settings/account"
            />
            <Tab
              label="Security"
              value={TABS.SECURITY}
              icon={<Security />}
              iconPosition="start"
              component={Link}
              to="/settings/security"
            />
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}>
          <AccountTab />
        </TabPanel>
        <TabPanel value={TABS.SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  );
}

export default Settings;

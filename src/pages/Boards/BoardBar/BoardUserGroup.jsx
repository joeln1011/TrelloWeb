import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';

function BoardUserGroup({ boardUsers = [], limit = 8 }) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
  const isOpenPopover = Boolean(anchorPopoverElement);
  const popoverId = isOpenPopover ? 'board-all-user-popover' : undefined;
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget);
    else setAnchorPopoverElement(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {/* display the number of user base on limit */}
      {[...Array(16)].map((_, index) => {
        if (index < limit) {
          return (
            <Tooltip title="joelnguyen" key={index}>
              <Avatar
                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                alt="joelnguyen"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtbpaeieipxghtOKgVNA5hZF3UXKVxeQRj4mkeMiNPHVmLDGRqhYMNDHtFe2W10sJQqcY&usqp=CAU"
              />
            </Tooltip>
          );
        }
      })}

      {/* if users are more than limit will show +number  */}
      {[...Array(16)].length > limit && (
        <Tooltip title="Show more">
          <Box
            aria-describedby={popoverId}
            onClick={handleTogglePopover}
            sx={{
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be',
            }}
          >
            +{[...Array(16)].length - limit}
          </Box>
        </Tooltip>
      )}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{
            p: 2,
            maxWidth: '235px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {[...Array(16)].map((_, index) => (
            <Tooltip title="joelnguyen" key={index}>
              <Avatar
                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                alt="joelnguyen"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX8Ixi8EqHVQbS8q-m0yGC4Hc-sFMbIeGulLZ_DwugVeYzIsMrkcIKU3hvH0anZLdWygc&usqp=CAU"
              />
            </Tooltip>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}

export default BoardUserGroup;

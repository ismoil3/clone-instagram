import React from 'react';
import { Tooltip, Box, Typography, Avatar, Button } from '@mui/material';
import Zoom from '@mui/material/Zoom';

export default function ProfileHoverMenu({ profileInfo, children }) {
    return (
        <div>
            <Tooltip
                title={
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 1,
                            boxShadow: 3,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        {JSON.stringify(profileInfo, null, 2)}
                    </Box>
                }
                slotProps={{
                    tooltip: {
                        sx: {
                            padding: '0',
                        },
                    },
                }}
                slots={{ transition: Zoom }}
                arrow
                placement="bottom"
            >
                {children}
            </Tooltip>
        </div>
    );
}

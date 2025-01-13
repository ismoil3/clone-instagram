import React, { useState, useRef } from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { useSettingStore } from "@/store/pages/setting/useSettingStore";

const SwipableDrawer = ({ isOpen, onClose, children }) => {
    const [tY, setTY] = useState(0);
	const {darkMode:dm} = useSettingStore()
    const touchStartY = useRef(0);

    const handleTouchStart = (event) => {
        touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - touchStartY.current;
        
        if (deltaY > 0) {
            setTY(deltaY);
        }
    };

    const handleTouchEnd = () => {
        if (tY > touchStartY.current) {
            onClose()
        } else {
            setTY(0);
        }
    };

    return (
        <Drawer
            anchor="bottom"
            open={isOpen}
            onClose={() => {
                setTY(0)
                onClose()
            }}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer +100,
            }}
            PaperProps={{
                sx: {
                    borderRadius: "15px 15px 0 0",
                    height: "90dvh",
                    transform: `translateY(${tY}px)`,
                    transition: "all 0.3s ease-out",
                    backgroundColor: dm ? '#111' : '',
                },
            }}
            ModalProps={{
                keepMounted: true,
            }}
        >

            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="bg-transparent w-full h-7 modal-theme"
            >
                <div
                    className="bg-gray-500 w-24 h-fit p-[2px] my-1 rounded-full mx-auto"
                    style={{ background: "#ccc" }}
                >

                </div>
            </div>
            <Box className="modal-theme"
                sx={{ height: 'full', overflowY: "auto" }}
            >
                {children}
            </Box>
        </Drawer>
    );
};

export default SwipableDrawer;

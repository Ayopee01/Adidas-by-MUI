import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const SunMoonToggle = ({ darkMode, onToggle }) => {
    const [hover, setHover] = useState(false);

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 20,
                right: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 50,
            }}
        >
            {/* ปุ่มเล็กด้านบน ตอน hover */}
            <Box
                sx={{
                    opacity: hover ? 1 : 0,
                    transform: hover
                        ? "translateY(0) scale(1)"
                        : "translateY(20px) scale(0.8)",
                    transition: "all 0.25s cubic-bezier(.6,-0.05,0.01,0.99)",
                    pointerEvents: "none",
                }}
            >
                <IconButton
                    size="large"
                    sx={{
                        border: "2px solid",
                        borderColor: darkMode ? "#a6adc8" : "#e0e0e0",
                        background: darkMode ? "#232838" : "#fff",
                        color: darkMode ? "#a6adc8" : "#8e99a8",
                        width: 48,
                        height: 48,
                        mb: 1,
                        boxShadow: darkMode
                            ? "0 2px 8px 0 rgba(0,0,0,0.7)"
                            : "0 2px 8px 0 rgba(0,0,0,0.12)",
                        "&:hover": {
                            background: darkMode ? "#293047" : "#f7f7f9",
                        },
                    }}
                    disableRipple
                >
                    {darkMode ? (
                        <LightModeIcon sx={{ fontSize: 28 }} />
                    ) : (
                        <DarkModeIcon sx={{ fontSize: 28 }} />
                    )}
                </IconButton>
            </Box>
            {/* ปุ่มหลัก */}
            <IconButton
                size="large"
                sx={{
                    border: "2px solid",
                    borderColor: darkMode ? "#a6adc8" : "#e0e0e0",
                    background: darkMode ? "#232838" : "#fff",
                    color: darkMode ? "#a6adc8" : "#8e99a8",
                    width: hover ? 60 : 55,
                    height: hover ? 60 : 55,
                    boxShadow: hover
                        ? "0 6px 18px 2px rgba(0,0,0,0.18)"
                        : darkMode
                            ? "0 2px 8px 0 rgba(0,0,0,0.7)"
                            : "0 2px 8px 0 rgba(0,0,0,0.12)",
                    transition: "all 0.25s cubic-bezier(.6,-0.05,0.01,0.99)",
                    "&:hover": {
                        background: darkMode ? "#293047" : "#f7f7f9",
                    },
                }}
                onClick={onToggle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {darkMode ? (
                    <DarkModeIcon sx={{ fontSize: 30 }} />
                ) : (
                    <LightModeIcon sx={{ fontSize: 30 }} />
                )}
            </IconButton>
        </Box>
    );
};

export default SunMoonToggle;

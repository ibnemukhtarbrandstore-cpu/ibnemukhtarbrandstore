"use client";
import { Badge, IconButton, Menu, MenuItem, Typography, Divider, Box } from "@mui/material";
import { IconBell } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotificationBadge() {
    const router = useRouter();
    const [count, setCount] = useState(0);
    const [breakdown, setBreakdown] = useState({ cod: 0, manual: 0 });
    const [anchorEl, setAnchorEl] = useState(null);

    // Fetch notification count
    const fetchNotificationCount = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch("/api/admin/notifications/count", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });

            if (res.ok) {
                const data = await res.json();
                setCount(data.count || 0);
                setBreakdown(data.breakdown || { cod: 0, manual: 0 });
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    // Poll every 30 seconds
    useEffect(() => {
        fetchNotificationCount(); // Initial fetch
        const interval = setInterval(fetchNotificationCount, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleViewOrders = () => {
        router.push("/admin/unshifted-Orders");
        handleClose();
    };

    const handleMarkAllRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch("/api/admin/notifications/mark-all-read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token })
            });

            // Refresh count
            fetchNotificationCount();
            handleClose();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    return (
        <>
            <IconButton onClick={handleClick} color="inherit">
                <Badge badgeContent={count} color="error">
                    <IconBell size={22} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 280, mt: 1 }
                }}
            >
                <Box px={2} py={1.5}>
                    <Typography variant="h6">
                        Notifications
                    </Typography>
                </Box>
                <Divider />

                {count > 0 ? [
                    <MenuItem key="notification-info" disabled>
                        <Box>
                            <Typography variant="body1" fontWeight={600}>
                                {count} New Orders
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                💵 {breakdown.cod} COD • 🏦 {breakdown.manual} Manual
                            </Typography>
                        </Box>
                    </MenuItem>,
                    <Divider key="divider-1" />,
                    <MenuItem key="view-orders" onClick={handleViewOrders}>
                        <Typography variant="body2">
                            📋 View Unshifted Orders
                        </Typography>
                    </MenuItem>,
                    <MenuItem key="mark-read" onClick={handleMarkAllRead}>
                        <Typography variant="body2" color="text.secondary">
                            ✓ Mark All as Read
                        </Typography>
                    </MenuItem>
                ] : (
                    <MenuItem disabled>
                        <Typography variant="body2" color="text.secondary">
                            No new notifications
                        </Typography>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}

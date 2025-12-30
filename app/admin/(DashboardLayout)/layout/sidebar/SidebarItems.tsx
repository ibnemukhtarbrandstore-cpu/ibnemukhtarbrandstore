import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import {
  Logo as MuiLogo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";

import Menuitems from "./MenuItems";
import Link from "next/link";
import Logo from "@/components/atom/Logo";

import { IconPoint } from "@tabler/icons-react";
import Upgrade from "./Updrade";
import { DashboardContext } from "@/app/context/DashboardContext";
import { useNotificationCount } from "../../hooks/useNotificationCount"; // 🆕

const RenderMenuItems = (items: any[], pathDirect: string, notificationCount: number) => {
  const { pendingOrdersLength } = useContext(DashboardContext)
  return items.map((item) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      // Display Subheader
      return (
        <Box sx={{ margin: "0 -24px" }} key={item.subheader}>
          <Menu subHeading={item.subheader} key={item.subheader}>
            <></>
          </Menu>
        </Box>
      );
    }

    //If the item has children (submenu)
    if (item.children) {
      // For Orders menu - add badge inline to title
      const titleWithBadge = item.title === "Orders" ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span>{item.title}</span>
          {notificationCount >= 0 && (
            <Box
              sx={{
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: "bold",
                minWidth: "20px",
                textAlign: "center",
                animation: notificationCount > 0 ? "pulse 2s infinite" : "none",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.8, transform: "scale(1.05)" }
                }
              }}
            >
              {notificationCount}
            </Box>
          )}
        </Box>
      ) : item.title;

      return (
        <Submenu
          key={item.id}
          title={titleWithBadge}
          icon={itemIcon}
        >
          {RenderMenuItems(item.children, pathDirect, notificationCount)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <MenuItem
        key={item.id}
        isSelected={pathDirect === item?.href}
        icon={itemIcon}
        component={Link}
        link={item.href && item.href !== "" ? item.href : "#"}
        target={item.href && item.href.startsWith("https") ? "_blank" : "_self"}
        badge={item.title === "Confirm Order" ? true : item.title === "Unshifted" ? true : item.title === "Pending" ? true : item.chip ? true : false}
        badgeContent={
          item.title === "Confirm Order"
            ? pendingOrdersLength?.toString() || "0"
            : item.title === "Unshifted"
              ? notificationCount.toString() // Unshifted orders count
              : item.title === "Pending"
                ? pendingOrdersLength?.toString() || "0" // Pending/Delivering orders count
                : item.chip && item.chip !== "dynamic"
                  ? item.chip
                  : ""
        }
        badgeColor={item.title === "Unshifted" || item.title === "Pending" ? "error" : "secondary"}
        disabled={item.disabled}
      >
        {item.title}
      </MenuItem>

    );
  });
};

const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const notificationCount = useNotificationCount(); // 🆕 Get notification count

  return (
    <Box sx={{ px: "20px", overflowX: "hiddbloen" }}>
      <MUI_Sidebar
        width={"100%"}
        showProfile={false}
        themeColor="#1e4db7"
        themeSecondaryColor="#1a97f51a"
      >
        <div className="flex items-center justify-start my-8">
          <Logo
            width={100}
            height={50}
            showLink={true}
          />
        </div>
        {RenderMenuItems(Menuitems, pathDirect, notificationCount)}
      </MUI_Sidebar>
    </Box>
  );
};

export default SidebarItems;

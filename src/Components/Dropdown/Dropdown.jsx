import { useContext } from "react";
import { Menu } from "@mui/base/Menu";
import { MenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { MenuButton } from "@mui/base/MenuButton";
import { Dropdown } from "@mui/base/Dropdown";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import "./Dropdown.css";
import { LoginContext } from "../../Context/LoginContext";
import { getStringOfMaxLength } from "../../Utils/string.util";

export default function MenuSimple({ items }) {
  const { user, branch, loginState, setUser } = useContext(LoginContext);
  const name =
    loginState === "User"
      ? user.name
        ? getStringOfMaxLength(user.name)
        : ""
      : branch.branch_name
      ? getStringOfMaxLength(branch.branch_name)
      : "";
  const navigate = useNavigate();
  const createHandleMenuClick = (menuItem) => {
    switch (menuItem.id) {
      case 1:
        navigate("/profile");
        break;
      case 2:
        navigate("/orders");
        break;
      case 3:
        // navigate("/addresses");
        break;
      case 4:
        navigate("/myteam");
        break;
      case 0:
        localStorage.removeItem("auth-token");
        localStorage.removeItem("smId");
        window.location.replace("/");
        setUser({});
        break;
      default:
        navigate("/");
    }
  };

  // useEffect(() => {
  //   localStorage.removeItem("auth-token");
  //   localStorage.removeItem("smId");
  //   window.location.replace("/");
  // }, []);

  return (
    <Dropdown>
      <MenuButton className="TriggerButtonSimple">{name}</MenuButton>

      <Menu
        className="CustomMenuSimple"
        slotProps={{
          listbox: { className: "CustomMenuSimple--listbox" },
        }}
      >
        {items.map((item) => (
          <>
            {item.id === 0 && <hr></hr>}
            <MenuItem
              className="CustomMenuSimple--item"
              onClick={() => createHandleMenuClick(item)}
              key={item.id}
            >
              {item.value}
            </MenuItem>
          </>
        ))}
      </Menu>
      <Styles />
    </Dropdown>
  );
}

const cyan = {
  50: "#E9F8FC",
  100: "#BDEBF4",
  200: "#99D8E5",
  300: "#66BACC",
  400: "#1F94AD",
  500: "#0D5463",
  600: "#094855",
  700: "#063C47",
  800: "#043039",
  900: "#022127",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

function useIsDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === "dark";
}

function Styles() {
  // Replace this with your app logic for determining dark mode
  const isDarkMode = useIsDarkMode();

  return (
    <style>{`
    .CustomMenuSimple--listbox {
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 6px;
      margin: 12px 0;
      min-width: 200px;
      border-radius: 12px;
      overflow: auto;
      outline: 0px;
      background: ${isDarkMode ? grey[900] : "#fff"};
      border: 1px solid ${isDarkMode ? grey[700] : grey[200]};
      color: ${isDarkMode ? grey[300] : grey[900]};
      box-shadow: 0px 4px 6px ${
        isDarkMode ? "rgba(0,0,0, 0.50)" : "rgba(0,0,0, 0.05)"
      };
    }

    .CustomMenuSimple--item {
      list-style: none;
      padding: 8px;
      border-radius: 8px;
      cursor: default;
      user-select: none;
    }

    .CustomMenuSimple--item:last-of-type {
      border-bottom: none;
    }

    .CustomMenuSimple--item:focus {
      outline: 3px solid ${isDarkMode ? cyan[600] : cyan[200]};
      background-color: ${isDarkMode ? grey[800] : grey[100]};
      color: ${isDarkMode ? grey[300] : grey[900]};
    }

    .CustomMenuSimple--item.${menuItemClasses.disabled} {
      color: ${isDarkMode ? grey[700] : grey[400]};
    }

    .TriggerButtonSimple {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      line-height: 1.5;
      padding: 8px 16px;
      border-radius: 8px;
      color: white;
      transition: all 150ms ease;
      cursor: pointer;
      background: ${isDarkMode ? grey[900] : "#fff"};
      border: 1px solid ${isDarkMode ? grey[700] : grey[200]};
      color: ${isDarkMode ? grey[200] : grey[900]};
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

      &:hover {
        background: ${isDarkMode ? grey[800] : grey[50]};
        border-color: ${isDarkMode ? grey[600] : grey[300]};
      }

      &:active {
        background: ${isDarkMode ? grey[700] : grey[100]};
      }

      &:focus-visible {
        box-shadow: 0 0 0 4px ${isDarkMode ? cyan[300] : cyan[200]};
        outline: none;
      }
    }


    .CustomMenuSimple {
      z-index: 1;
    }
    `}</style>
  );
}

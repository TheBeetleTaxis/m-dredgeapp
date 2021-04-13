import React from "react";
import { Link } from "react-router-dom";

//MOBILE LOGO COMPONENT
export const MobileLogo = () => (
  <ul className="navbar-nav theme-brand flex-row  text-center">
    <li className="nav-item theme-logo">
      <Link to="index.html">
        <img src="assets/img/logo2.svg" className="navbar-logo" alt="logo" />
      </Link>
    </li>
    <li className="nav-item theme-text">
      <Link to="index.html" className="nav-link">
        {" "}
        M-Dredge{" "}
      </Link>
    </li>
  </ul>
);

// TOP NAV BAR MENU ITEM COMPONENT
export const MenuItem = ({ item, showSubMenu, setShowSubMenu }) => {
  const { icon, menuItem, dropdown, link } = item.menuItem;
  return (
    <li className="menu single-menu active">
      <Link
        to={link}
        data-toggle="collapse"
        aria-expanded="true"
        className="dropdown-toggle autodroprown"
        style={{ alignItems: "center" }}
        onClick={() => setShowSubMenu(true)}
      >
        {/* MENU ITEM CONTAINER */}
        <div
          className="menuItem-container"
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
        >
          {/* MENU ITEM ICON */}
          <ion-icon id="svg" src={icon} />
          {/* MENU ITEM TEXT */}
          <span>{menuItem}</span>
        </div>
        {/* MENU ITEM DROPDOWN */}
        <ion-icon className="feather feather-chevron-down" src={dropdown} />
      </Link>
      {item.subMenuItems && (
        // MENU ITEM SUB-MENU ITEM
        <ul
          className={`collapse ${showSubMenu && "show"} submenu list-unstyled`}
          id="dashboard"
          data-parent="#topAccordion"
        >
          {item.subMenuItems.map((subItem, i) => {
            return (
              <li key={i} className="active">
                <Link to={subItem.link}> {subItem.text} </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};
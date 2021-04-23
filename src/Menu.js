import React from "react";
import OrderForm from "./components/orders/order-form/order-form";
import LoginPage from "./pages/login-page";
import Profile from "./components/profile/profile";
import {Production} from "./components/production/production";
import ProductionList from "./components/production/production-list/production-list";
import WetSand from "./components/production/production-list/wet-sand";
import StockpiledSand from "./components/production/production-list/stockpiled-sand";
import Stock from "./components/production/production-list/stock";
import StockUpdate from "./components/production/production-list/stock-update";
import ViewOrders from "./components/orders/vieworder-reciept/vieworders";
import OrderReceipt from "./components/orders/order-receipt/order-receipt";
import DispatchOrderList from "./components/orders/dispatch-orders-list/dispatch-order-list";

import RevenueReport from "./components/revenue/revenue-report/revenue-report";
import SingleRevenueReport from "./components/revenue/single-revenue-report/single-revenue-report";
import PostExpense from "./components/account/post-expense";
import ExpenseReport from "./components/account/expense-report/expense-report";
import ChartList from "./components/account/charts/chart-list";
import AddAccount from "./components/account/account-actions/add-account";
import PostAccount from "./components/account/account-actions/account-post";
import Products from "./components/products/products";
import AddFuel from "./components/fuel-issues/add-fuel";
import FuelIssueList from "./components/fuel-issues/fuel-issue-list";
import FuelIssuing from "./components/fuel-issues/fuel-issuing";
import Machinery from "./components/operations/machinery";
import Users from "./components/users/users";
import Inspector from "./components/inspector/inspector";
import Security from "./components/security/security";
import { Dashboard } from "./pages/dashboard";


/** import all the dashboard items here  */
import RecentOrders from "./components/cards/recent-orders";
import Summary from "./components/cards/summary";
import TotalOrders from "./components/cards/total-orders";
import TotalRevenue from "./components/cards/total-revenue";
import TotalStockpile from "./components/cards/total-stockpile";
import RecentSummary from "./components/cards/recent-summary";



/** import menu Icons */
import dashboardIcon from "./assets/dashboard.svg";
import adminIcon from "./assets/admin.svg";
import accountantIcon from "./assets/accountant.svg";
import productionIcon from "./assets/production.svg";
import ordersIcon from "./assets/orders.svg";
import dropdownIcon from "./assets/dropdownIcon.svg";
import DetailedStatistics from "./components/cards/detailed-statistics";


/**
 * Create a menu route for app user based on user permission level
 * @constructor
 * @param userMenu
 */
export const createUserRoutes = (userMenu) => {

    if (typeof userMenu !== "object") {
        alert("user permission provide must be an object")
        return console.error("user permission provide must be an object")
    }

    /**
     * loop over user menu location and check if there is a corresponding entry in the global menu
     * declaration. The global menu will contain all the menus in our application
     */
    const globalMenu = Menu;

    /** this is an array that holds all the permitted routes for our user */
    let userAccess = [];

    /**
     * loop over the user menu, and menu if found in the globalMenu definition, we will also loop
     * through the menuLocationPages defined and create the appropriate route for this user
     */
    Object.keys(userMenu).forEach(menuLocation => {

        if (globalMenu[menuLocation] && globalMenu[menuLocation] !== null && typeof globalMenu[menuLocation] === "object") {

            /** get the pages allowed for this user within this menu location */
            let userAllowedPages = userMenu[menuLocation];

            /** loop over each pages in the userAllowPages and create a route */
            Object.keys(userAllowedPages).forEach(page => {

                if (globalMenu[menuLocation][page] && globalMenu[menuLocation][page] !== null && typeof globalMenu[menuLocation][page] === "object") {
                    /** get the current page we are allowing user to view **/
                    let currentPage = globalMenu[menuLocation][page];
                    /** concat to userAccess  list*/
                    userAccess = userAccess.concat({...currentPage});
                }
            })
        }
    });

    /** add the default route. This are the basic route that all user must have access to
     * This is defined under `default` section of the `Menu` definition
     */
    if (globalMenu["default"] && typeof globalMenu["default"] === "object") {
        Object.keys(globalMenu["default"]).forEach(defaultPage => {
            let currentPage = globalMenu["default"][defaultPage];
            userAccess = userAccess.concat({...currentPage});
        })
    }
    /** return the routes created */
    return userAccess
}


export const createUserMenu = (userMenu) => {

    if (typeof userMenu !== "object") {
        alert("user permission provide must be an object")
        return console.error("user permission provide must be an object")
    }
    /** get global Menu definition */
    const globalMenu = Menu;

    /** get the global menu styling options */
    const globalMenuStyle= MenuStyles;


    /** this is an array that holds all the permitted menu for user */
    let userMenuAccess = [];

    Object.keys(userMenu).forEach(menuLocation => {

        /** create a parent menu that houses all the sub menus
         * This is the main menu that user sees on the menu bar
         * clicking this menu may show submenu or not depending on configurations
         * */

        /** check the global menuStyle for a definition for this menu entry
         * if there is a definition, we will use this and if not, we will use default
         */
        const menuStyle=globalMenuStyle && globalMenuStyle[menuLocation]?globalMenuStyle[menuLocation] : {};
        const {text, icon,dropdownIcon, link, menuClass}= menuStyle;

        let menuObject = {
            menuItem: text?? menuLocation,
            icon: icon,
            dropdown: dropdownIcon,
            link: link,
            class: menuClass,
        }

        /** this will hold all our submenu items */
        let subMenuItems = [];

        if (globalMenu[menuLocation] && typeof globalMenu[menuLocation] === "object") {

            let userAllowedPages = userMenu[menuLocation];

            /** create as submenu for each page user has access to */
            Object.keys(userAllowedPages).forEach(page => {

                /** this will hold the current submenu item */
                let currentSubMenuItem = null;

                if (globalMenu[menuLocation][page] && globalMenu[menuLocation][page] !== null && typeof globalMenu[menuLocation][page] === "object") {
                    /** get the current page we are allowing user to view **/
                    let currentPage = globalMenu[menuLocation][page];

                    /** assign this current page as a subMenu */
                    const {subItem} = currentPage;

                    currentSubMenuItem = {...currentPage}

                    /** get the user subMenu permissions for this entry */
                    const userAllowedSubMenu = userMenu[menuLocation][page]["subItem"]?? null;

                    /** if this user has subMenu item permission we will give it
                     * **/
                    let userAllowedSubMenuItems = null;

                    if (userAllowedSubMenu && Array.isArray((userAllowedSubMenu))) {

                        userAllowedSubMenuItems = userAllowedSubMenu.map(({link, text}) => {
                            /** we will check and filter the subItem of our menu location
                             * return submenu items only if they are also defined for the user
                             *  */
                            return subItem.filter(item => {
                                if (item.link === link && item.text === text)
                                {
                                    // alert("here");
                                    return item;
                                }
                            })
                        });
                        /** If there are subMenu items, we will list them*/
                        if (userAllowedSubMenuItems !== null && userAllowedSubMenuItems !== undefined) {
                            currentSubMenuItem = {...currentSubMenuItem, subItem: userAllowedSubMenuItems};
                        }
                    }
                }

                /** assign the currentSubmenuObject to the subMenuItems array */
                subMenuItems = subMenuItems.concat(currentSubMenuItem);
            })
        }
        /** assign the submenu Items created to the subMenuObject **/
        menuObject = {...menuObject, subMenuItems}

        /** concat to the global  userMenuAccess array before we move to the next menu location */
        userMenuAccess = userMenuAccess.concat(menuObject);
    });

    /** return the routes created */
    return userMenuAccess
}

/**
 * This central menu definition within our application
 * @note: the user permission will also follow this format
 * to assign permissions to users within the application
 */

export const Menu = {

    /**
     * default menu are the menus that are constant and available
     * to all users irrespective of their user type and permission settings
     */
    default: {
        /** using the `usePageWrapper= false`  will hide the page wrapper for this component*/
        login: {
            text: "Login",
            link: "/",
            component: LoginPage,
            hideNavBar: true,
            usePageWrapper: false,
        },
        profile: {
            text: "Profile",
            link: "/profile",
            component: Profile,
        },
    },


    /** the dashboard page definition */
    dashboard:{
        dashboard: {
            text: "Dashboard Content",
            link: "/dashboard",
            component: Dashboard,
            usePageWrapper: false,
        },
        totalOrders: {
            text: "Total Orders",
            link: "/dashboard",
            component:TotalOrders ,
            usePageWrapper: false,
            showInMenu:false
        },
        recentOrders: {
            text: "Recent Orders",
            link: "/dashboard",
            component:RecentOrders ,
            usePageWrapper: false,
            showInMenu:false
        },
        totalRevenue: {
            text: "Total Revenue",
            link: "/dashboard",
            component: TotalRevenue ,
            usePageWrapper: false,
            showInMenu:false,
        },
        summary: {
            text: "Summary",
            link: "/dashboard",
            component:Summary ,
            usePageWrapper: false,
            showInMenu:false,
        },
        detailedStatistics: {
            text: "Detailed Statistics",
            link: "/dashboard",
            component: DetailedStatistics ,
            usePageWrapper: false,
            showInMenu:false,
        },
        RecentSummary: {
            text: "Detailed Statistics",
            link: "/dashboard",
            component: DetailedStatistics ,
            usePageWrapper: false,
            showInMenu:false,
        },

    },

    /**
     * Everything that relates to order goes here
     * */
    order: {
            placeOrder: {
                text: "Place Order",
                link: "/placeorder",
                component: OrderForm,
                /** use this entry if this sub menu will also have its own subMenu**/
                subItem: [
                    {link: "/checkorderstatus", text: "Sub Menu Order"}
                ],
            },
            viewOrder: {
                text: "View Orders",
                link: "/vieworders",
                component: ViewOrders,
            },
            orderReceipt: {
                text: "Order Receipt",
                link: "/orderreceipt",
                component: OrderReceipt,
            },
            orderDispatchList: {
                text: "Orders Dispatch",
                link: "/dispatchlist",
                component: DispatchOrderList,
            },
    },

    /**
     * Production related menu goes here
     * */
    production: {
        production: {
            text: "Start Pumping",
            link: "/production",
            component: Production,
        },
        productionList: {
            text: "Production List",
            link: "/productionlist",
            component: ProductionList,
        },
        wetSand: {
            text: "Wet Sand",
            link: "/wetsand",
            component: WetSand,
        },
        stockpile: {
            text: "Production Stockpile",
            link: "/stockpile",
            component: StockpiledSand,
        },
        stock: {
            text: "Stock Production",
            link: "/stock",
            component: Stock,
        },
        stockUpdate: {
            text: "Stock Movements",
            link: "/stockupdate",
            component: StockUpdate,
        },
    },

    /** revenue definition goes her */
    revenue : {
        revenueReport: {
            text: "Revenue Report",
            link: "/revenuereport",
            component: RevenueReport,
        },
        singleRevenueReport: {
            text: "Single Revenue Report",
            link: "/singlerevenuereport",
            component: SingleRevenueReport,
        },
    },

    /** Account menu items goes here */
    account :{
        postExpenses: {
            text: "Post Expenses",
            link: "/postexpense",
            component: PostExpense,
        },
        expenseReport: {
            text: "Expenses Report",
            link: "/expensereport",
            component: ExpenseReport,
        },
        chartOfAccount: {
            text: "Chart of Account",
            link: "/chartlist",
            component: ChartList,
        },
        addBusinessAccount: {
            text: "Add Business Account",
            link: "/accountlist",
            component: AddAccount,
        },
        postToAccount: {
            text: "Post Entry",
            link: "/postaccount",
            component: PostAccount,
        },
    },

    /** Administrative task menu starts her */
    admin :{
        addUsers: {
            text: "Add User",
            link: "/users",
            component: Users,
        },
        product: {
            text: "Add Products",
            link: "/products",
            component: Products,
        },
        addMachinery: {
            text: "Add Machinery",
            link: "/operations",
            component: Machinery,
        },
        addFuel: {
            text: "Add Fuel Stock",
            link: "/addfuel",
            component: AddFuel,
        },
        issueFuel: {
            text: "Issue Fuel",
            link: "/fuelissue",
            component: FuelIssuing,
        },
        fuelIssued: {
            text: "Issued Fuel",
            link: "/fuelissuelist",
            component: FuelIssueList,
        },
        fuelStockEntry: {
            text: "Fuel Stock Entry",
            link: "/fuelupdatelist",
            component: FuelIssueList,
        },
    },
    inspector:{
        inspect: {
            text: "Inspect Order",
            link: "/inspect",
            component: Inspector,
        },
    },
    security:{
        inspect: {
            text: "Clear Order",
            link: "/security",
            component: Security,
        },
    },
}

/**
 * This is the menu definition for our individual menu entries
 * This will hold the icons, the main style and the dropdown icon
 */
export const MenuStyles= {

    /** No styling for default menu entry. We will most likely not 
     * showing them on the menu bar */
    default:null,
    order:{
        icon: ordersIcon,
        text: "Order",
        dropdownIcon: dropdownIcon,
        link: "#",
        menuClass: "order",
    },
    production:{
        icon: productionIcon,
        text: "Production",
        dropdownIcon: dropdownIcon,
        link: "#",
        menuClass: "production",
    },
    dashboard:{
        icon: dashboardIcon,
        text: "Dashboard",
        dropdownIcon: dropdownIcon,
        link: "#",
        menuClass: "dashboard",
    },
    account:{
        icon: accountantIcon,
        text: "Account",
        dropdownIcon: dropdownIcon,
        link: "#",
        menuClass: "account",
    },
    admin:{
        icon: adminIcon,
        text: "Admin",
        dropdownIcon: dropdownIcon,
        link: "#",
        menuClass: "Admin",
    },
}
import {UserRole} from "./types";

export const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getColorByUserRole = (roles: UserRole[]) => {
    let color = "";
    if (roles.includes("admin")) {
        color = "green";
    } else if (roles.includes("moderator")) {
        color = "yellow";
    } else {
        color = "white";
    }
    return color;
};

import { SettingsIcon, UserIcon } from "lucide-react";
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";

const route =[
    {
        label: "Home",
        href: "/",
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: "My Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill

    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: " Members ",
        href: "/members",
        icon: UserIcon,
        activeIcon: UserIcon
    }
];

export const navigation = () => {
    return (
        <ul className="flex flex-col">
            {route.map((item) => (
                <li key={item.href} className="mb-4">
                    <a href={item.href} className="flex items-center text-gray-700 hover:text-gray-900">
                        <item.icon className="mr-2" />
                        {item.label}
                    </a>
                </li>
            ))}
        </ul>
    )
};

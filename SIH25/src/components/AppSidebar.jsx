import React from 'react';
import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    FileText,
    Upload,
    Download,
    BarChart3,
    Shield,
    Users,
    HelpCircle,
    ChevronDown,
    Plus,
    Folder
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    useSidebar,
    SidebarSeparator
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Menu items data
const mainMenuItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
        badge: null
    },
    {
        title: "Upload Documents",
        url: "/upload",
        icon: Upload,
        badge: null
    },
    {
        title: "Document Library",
        url: "/documents",
        icon: Folder,
        badge: "245"
    },
    {
        title: "Search & Query",
        url: "/search",
        icon: Search,
        badge: null
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
        badge: "New"
    }
];

const managementItems = [
    {
        title: "User Management",
        url: "/users",
        icon: Users,
    },
    {
        title: "Compliance",
        url: "/compliance",
        icon: Shield,
    },
    {
        title: "System Settings",
        url: "/settings",
        icon: Settings,
    }
];

const recentDocuments = [
    { name: "Safety Circular 2024-Q1", type: "PDF", size: "2.4 MB", date: "2 hours ago" },
    { name: "Maintenance Report", type: "PDF", size: "1.8 MB", date: "1 day ago" },
    { name: "Board Meeting Minutes", type: "DOCX", size: "456 KB", date: "2 days ago" },
];

export function AppSidebar({ activeItem = "Dashboard", onMenuClick }) {
    const { state } = useSidebar();

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center space-x-2 px-2 py-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                        <FileText className="h-4 w-4 text-white" />
                    </div>
                    {state === "expanded" && (
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold text-gray-900">KMRL Assistant</span>
                            <span className="truncate text-xs text-gray-500">Document Management</span>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Main Navigation */}
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={activeItem === item.title}
                                        onClick={() => onMenuClick?.(item.title)}
                                    >
                                        <button className="w-full flex items-center">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            {item.badge && (
                                                <Badge variant="secondary" className="ml-auto h-5 px-1 text-xs">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Management */}
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <button className="w-full flex items-center">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {state === "expanded" && (
                    <>
                        <SidebarSeparator />

                        {/* Recent Documents */}
                        <SidebarGroup>
                            <SidebarGroupLabel>Recent Documents</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <div className="space-y-2 px-2">
                                    {recentDocuments.slice(0, 3).map((doc, index) => (
                                        <div key={index} className="rounded-lg border p-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-3 w-3 text-gray-400" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate font-medium text-xs">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <div className="p-2">
                    {state === "expanded" ? (
                        <div className="flex items-center space-x-2 rounded-lg border p-2">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src="/avatar.jpg" alt="User" />
                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                                    KU
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">KMRL User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </div>
                    ) : (
                        <Avatar className="h-8 w-8 mx-auto">
                            <AvatarImage src="/avatar.jpg" alt="User" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm">
                                KU
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

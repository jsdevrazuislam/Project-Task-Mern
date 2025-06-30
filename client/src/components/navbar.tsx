import { Calendar, LogOut, Menu, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useAuth } from "../context/auth-context"
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { useState } from "react"


export default function Navbar() {
    const { user, accessToken, logout } = useAuth()
    const { pathname } = useLocation();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)

    const navigationItems = [
        { href: "/", label: "Home" },
        ...(user
            ? [
                { href: "/events", label: "Events" },
                { href: "/add-event", label: "Add Event" },
                { href: "/my-events", label: "My Events" },
            ]
            : []),
    ]

    const isActive = (path: string) => pathname === path

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">EventHub</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${isActive(item.href) ? "text-blue-600" : "text-gray-700"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-4">
                            {accessToken ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user?.photoURL || "/placeholder.svg"} alt={user?.name} />
                                                <AvatarFallback>
                                                    <User className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                            logout()
                                            navigate('/')
                                        }} className="cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link to="/login">
                                    <Button>Sign In</Button>
                                </Link>
                            )}
                        </div>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col space-y-4 mt-8">
                                    <div className="flex items-center space-x-2 pb-4 border-b">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                        <span className="text-lg font-bold text-gray-900">EventHub</span>
                                    </div>

                                    <div className="flex flex-col space-y-3">
                                        {navigationItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={`text-lg font-medium transition-colors hover:text-blue-600 py-2 px-3 rounded-md ${isActive(item.href) ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}

                                        {!user && (
                                            <Link
                                                to="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="text-lg font-medium text-gray-700 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50"
                                            >
                                                Sign In
                                            </Link>
                                        )}
                                    </div>

                                    {user && (
                                        <div className="pt-4 border-t">
                                            <div className="flex items-center space-x-3 p-3 rounded-md bg-gray-50">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user.name} />
                                                    <AvatarFallback>
                                                        <User className="h-4 w-4" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                                    <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    logout()
                                                    setIsOpen(false)
                                                }}
                                                variant="ghost"
                                                className="w-full justify-start mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                Log out
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

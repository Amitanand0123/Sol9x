import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectCurrentUser } from '../store/authSlice';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, BookOpen, LayoutDashboard, Settings } from 'lucide-react';

const Layout = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-600 hover:text-blue-500";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-xl font-extrabold text-blue-600 tracking-tight">
                            Sol9x
                        </Link>
                        
                        {user && (
                            <nav className="hidden md:flex items-center gap-6 h-16">
                                {user.role === 'Student' ? (
                                    <>
                                        <Link to="/student" className={`text-sm font-semibold h-full flex items-center px-1 transition-all ${isActive('/student')}`}>
                                            Dashboard
                                        </Link>
                                        <Link to="/courses" className={`text-sm font-semibold h-full flex items-center px-1 transition-all ${isActive('/courses')}`}>
                                            Courses
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/admin" className={`text-sm font-semibold h-full flex items-center px-1 transition-all ${isActive('/admin')}`}>
                                            Students
                                        </Link>
                                        <Link to="/manage-courses" className={`text-sm font-semibold h-full flex items-center px-1 transition-all ${isActive('/manage-courses')}`}>
                                            Manage Courses
                                        </Link>
                                    </>
                                )}
                            </nav>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer border-2 border-slate-100 hover:border-blue-200 transition-all">
                                        <AvatarFallback className="bg-blue-600 text-white font-bold">
                                            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(user.role === 'Admin' ? '/admin' : '/student')}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2">
                                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                                <Link to="/register"><Button className="bg-blue-600 hover:bg-blue-700">Join</Button></Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t py-6 text-center text-slate-400 text-sm">
                &copy; 2025 Sol9x Project. All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
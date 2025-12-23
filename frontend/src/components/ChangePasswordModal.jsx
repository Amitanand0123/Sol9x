import { useState } from 'react';
import api from '../lib/axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, KeyRound, Eye, EyeOff } from 'lucide-react';

const ChangePasswordModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [passwords, setPasswords] = useState({ 
        oldPassword: '', 
        newPassword: '', 
        confirmPassword: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!passwords.oldPassword) {
            return toast.error("Please enter your current password");
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (passwords.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);
        try {
            await api.put('/student/change-password', { 
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword 
            });
            
            toast.success("Password changed successfully!");
            setIsOpen(false);
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <KeyRound className="h-4 w-4" /> Change Password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Update Password</DialogTitle>
                    <DialogDescription>Verify your current password to set a new one.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    
                    {/* NEW: Old Password Field */}
                    <div className="grid gap-2">
                        <Label htmlFor="old-password">Current Password</Label>
                        <div className="relative">
                            <Input 
                                id="old-password" 
                                type={showPassword ? "text" : "password"} 
                                value={passwords.oldPassword} 
                                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} 
                                required 
                                className="pr-10"
                            />
                             <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                            id="new-password" 
                            type={showPassword ? "text" : "password"} 
                            value={passwords.newPassword} 
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
                            required 
                        />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                            id="confirm-password" 
                            type={showPassword ? "text" : "password"} 
                            value={passwords.confirmPassword} 
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} 
                            required 
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Update Password"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordModal;
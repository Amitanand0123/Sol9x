import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success("Reset link sent! Please check your email.");
        } catch (err) {
            toast.error("Failed to send reset link.");
            console.error(err);
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
            <div className="w-full max-w-md">
                <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
                            <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                        <p className="text-sm text-gray-500">
                            Enter your email and we'll send you a link to reset your password
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="you@example.com" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <Button 
                            onClick={handleSubmit} 
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/25 transition-all" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
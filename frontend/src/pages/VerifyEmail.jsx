import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        
        const verify = async () => {
            hasRun.current = true;
            try {
                await api.get(`/auth/verify/${token}`);
                setStatus('success');
            } catch (error) {
                console.error("Verification error:", error);
                setStatus('error');
            }
        };

        if (token) verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
                    {status === 'verifying' && (
                        <div className="text-center py-8">
                            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Email</h2>
                            <p className="text-gray-500">Please wait while we verify your account...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                            <p className="text-gray-500 mb-6">
                                Your email has been successfully verified. You can now sign in to your account.
                            </p>
                            <Button 
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-600/25" 
                                onClick={() => navigate('/login')}
                            >
                                Continue to Login
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                            <p className="text-gray-500 mb-6">
                                The verification link is invalid or has expired. Please try registering again.
                            </p>
                            <Button 
                                variant="outline" 
                                className="w-full h-11 border-gray-300 hover:bg-gray-50 rounded-lg" 
                                onClick={() => navigate('/register')}
                            >
                                Back to Register
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
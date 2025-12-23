import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                    <ShieldAlert className="h-10 w-10 text-red-600" />
                </div>
                
                <h1 className="text-6xl font-extrabold text-gray-900 mb-2">403</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                
                <p className="text-gray-500 mb-8 leading-relaxed">
                    You don't have permission to access this page. Please contact your administrator if you believe this is an error.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(-1)} 
                        className="gap-2 h-11 border-gray-300 hover:bg-gray-50"
                    >
                        <ArrowLeft className="h-4 w-4" /> 
                        Go Back
                    </Button>
                    
                    <Button 
                        onClick={() => navigate('/')} 
                        className="gap-2 h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                    >
                        <Home className="h-4 w-4" /> 
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
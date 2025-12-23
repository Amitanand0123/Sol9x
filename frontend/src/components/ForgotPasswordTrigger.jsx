import { useState } from 'react';
import api from '../lib/axios';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, MailQuestion } from 'lucide-react';

const ForgotPasswordTrigger = ({ email }) => {
    const [loading, setLoading] = useState(false);

    const handleSendLink = async () => {
        if (!confirm(`Send a password reset link to ${email}?`)) return;
        
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success("Reset link sent! Check your email.");
        } catch (err) {
            toast.error("Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" size="sm" className="gap-2 text-slate-600" onClick={handleSendLink} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailQuestion className="h-4 w-4" />}
            Forgot Password?
        </Button>
    );
};

export default ForgotPasswordTrigger;
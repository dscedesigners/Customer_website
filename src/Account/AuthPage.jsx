import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  useLoginMutation,
  useSignupMutation,
  useSendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendOtpMutation,
} from '../redux/services/userSlice';
import { setCredentials } from '../redux/feauters/authSlice';
import AuthImage from '../Utiles/AuthImage.jpg';
import { FaChevronLeft } from "react-icons/fa";
import OtpVerification from './OtpVerification';

const AuthPage = () => {
  const [authMode, setAuthMode] = useState('signUp');
  const [signupStep, setSignupStep] = useState(1);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', phoneOtp: '', emailOtp: '', contact: '', newPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [signup, { isLoading: isSigningUp }] = useSignupMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [forgotPassword, { isLoading: isSendingResetOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  
  const isLoading = isLoggingIn || isSigningUp || isSendingOtp || isSendingResetOtp || isResettingPassword;

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const clearMessages = () => setMessage({ type: '', text: '' });

  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setSignupStep(1);
    setForgotPasswordStep(1);
    clearMessages();
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '', phoneOtp: '', emailOtp: '', contact: '', newPassword: ''});
  };

  // --- SIGN UP HANDLERS ---
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    try {
      await sendOtp({ contact: formData.phone, purpose: 'signup' }).unwrap();
      setMessage({ type: 'success', text: 'OTP sent to your phone number.' });
      setSignupStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Failed to send OTP.' });
    }
  };

  const handlePhoneVerificationSuccess = async (verifiedOtp) => {
    setFormData(prev => ({ ...prev, phoneOtp: verifiedOtp }));
    clearMessages();
    try {
      await sendOtp({ contact: formData.email, purpose: 'signup' }).unwrap();
      setMessage({ type: 'success', text: 'Phone verified! Now sending OTP to your email.' });
      setSignupStep(3);
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Failed to send email OTP.' });
    }
  };

  const handleEmailVerificationSuccess = async (verifiedOtp) => {
    clearMessages();
    const finalFormData = { ...formData, emailOtp: verifiedOtp };
    try {
      const response = await signup({
        name: finalFormData.name,
        email: finalFormData.email,
        phone: finalFormData.phone,
        password: finalFormData.password,
        emailOtp: finalFormData.emailOtp,
        phoneOtp: finalFormData.phoneOtp,
      }).unwrap();
      dispatch(setCredentials(response));
      navigate('/profilepage');
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Signup failed. Please try again.' });
      setSignupStep(1);
    }
  };

  // --- SIGN IN HANDLER ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
        const { contact, password } = formData;
        const response = await login({ contact, password }).unwrap();
        dispatch(setCredentials(response));
        navigate('/profilepage');
    } catch (err) {
        setMessage({ type: 'error', text: err.data?.message || 'Login failed.' });
    }
  };

  // --- FORGOT PASSWORD HANDLERS ---
  const handleForgotPasswordSendOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      await forgotPassword({ contact: formData.contact }).unwrap();
      setMessage({ type: 'success', text: 'Reset OTP sent successfully.' });
      setForgotPasswordStep(2);
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Failed to send OTP.' });
    }
  };
  
  const handleForgotPasswordOtpSuccess = (verifiedOtp) => {
    setFormData(prev => ({ ...prev, otp: verifiedOtp }));
    setForgotPasswordStep(3);
    clearMessages();
  };
  
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: "Passwords do not match."});
        return;
    }
    try {
      const { contact, otp, newPassword } = formData;
      await resetPassword({ contact, otp, newPassword }).unwrap();
      setMessage({ type: 'success', text: 'Password reset successfully! Please sign in.' });
      handleModeChange('signIn');
      navigate('/account');
    } catch (err) {
      setMessage({ type: 'error', text: err.data?.message || 'Password reset failed.' });
    }
  };

  // --- RENDER LOGIC ---
  const getTitle = () => {
    if (authMode === 'signIn') return 'Sign In to Your Account';
    if (authMode === 'signUp') {
      if (signupStep === 1) return 'Create Your Account';
      if (signupStep === 2) return 'Verify Your Phone Number';
      if (signupStep === 3) return 'Verify Your Email Address';
    }
    if (authMode === 'forgotPassword') {
      if (forgotPasswordStep === 1) return 'Reset Your Password';
      if (forgotPasswordStep === 2) return 'Verify Your Identity';
      if (forgotPasswordStep === 3) return 'Create a New Password';
    }
    return 'Welcome';
  };

  const renderSignUpForm = () => {
    switch (signupStep) {
      case 1:
        return (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <input type="text" id="name" value={formData.name} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Full Name" />
            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Email Address" />
            <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Phone Number" />
            <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Password" />
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Confirm Password" />
            <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary">
              {isLoading ? 'Sending OTP...' : 'Sign Up'}
            </button>
          </form>
        );
      case 2:
        return <OtpVerification key="phone-otp" contactType="phone" contactValue={formData.phone} purpose="signup" onSuccess={handlePhoneVerificationSuccess} />;
      case 3:
        return <OtpVerification key="email-otp" contactType="email" contactValue={formData.email} purpose="signup" onSuccess={handleEmailVerificationSuccess} />;
      default: return null;
    }
  };

  const renderSignInForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
      <input type="text" id="contact" value={formData.contact} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Email or Phone" />
      <input type="password" id="password" value={formData.password} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Password" />
      <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary">
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );

  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <form onSubmit={handleForgotPasswordSendOtp} className="space-y-4">
            <p className="text-sm text-gray-600">Enter your email or phone to receive a reset OTP.</p>
            <input type="text" id="contact" value={formData.contact} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Email or Phone" />
            <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary">
              {isLoading ? 'Sending...' : 'Send Reset OTP'}
            </button>
          </form>
        );
      case 2:
        return <OtpVerification key="reset-otp" contactType="credentials" contactValue={formData.contact} purpose="forgotPassword" onSuccess={handleForgotPasswordOtpSuccess} />;
      case 3:
        return (
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
             <p className="text-sm text-gray-600">Your identity has been verified. Please create a new password.</p>
            <input type="password" id="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="New Password" />
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full h-[50px] pl-3 border bg-[#D9D9D9] rounded-md" required placeholder="Confirm New Password" />
            <button type="submit" disabled={isLoading} className="w-full h-[50px] btn-primary">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        );
      default: return null;
    }
  };

  return (
    <>
      <style>{`.btn-primary { background-color: #B5B1FF; color: #3B3A3A; } .btn-primary:hover { background-color: #2518BD; color: white; }`}</style>
      <Link to="/" className="flex mt-10 ml-10">
        <FaChevronLeft size={25} /> <h1 className="font-semibold">Go Back</h1>
      </Link>
      <div className="flex flex-col md:flex-row items-center justify-center mt-10">
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8">
          <img src={AuthImage} alt="Auth" className="w-[500px] mb-20" />
        </div>
        <div className="flex flex-col justify-center w-full md:w-1/3 p-6 md:p-8 mx-auto">
          <h1 className="w-full text-3xl font-bold mb-4">{getTitle()}</h1>
          {message.text && (
            <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          {authMode === 'signUp' && renderSignUpForm()}
          {authMode === 'signIn' && renderSignInForm()}
          {authMode === 'forgotPassword' && renderForgotPasswordForm()}
          
          <div className="mt-4 text-left">
            {authMode === 'signIn' && (
              <div>
                <p>Don't have an account? <button className="text-[#2518BD] font-semibold" onClick={() => handleModeChange('signUp')}>Sign Up</button></p>
                <p><button className="text-[#2518BD] font-semibold" onClick={() => handleModeChange('forgotPassword')}>Forgot Password?</button></p>
              </div>
            )}
            {authMode === 'signUp' && (<p>Already have an account? <button className="text-[#2518BD] font-semibold" onClick={() => handleModeChange('signIn')}>Sign In</button></p>)}
            {authMode === 'forgotPassword' && (<p>Remember your password? <button className="text-[#2518BD] font-semibold" onClick={() => handleModeChange('signIn')}>Sign In</button></p>)}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
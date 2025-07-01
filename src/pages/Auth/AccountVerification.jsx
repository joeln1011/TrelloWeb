import { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { verifyUserAPI } from '~/apis';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';

const AccountVerification = () => {
  let [searchParams] = useSearchParams();
  // Extract email and token from search parameters
  const { email, token } = Object.fromEntries([...searchParams]);
  const [verificationStatus, setVerificationStatus] = useState(false);

  // Call your API to verify the account
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerificationStatus(true));
    }
  }, [email, token]);
  //If email or token is not provided, redirect to 404 page
  if (!email || !token) {
    return <Navigate to="/404" />;
  }
  if (!verificationStatus) {
    return <PageLoadingSpinner caption="Verifying your account" />;
  }
  return <Navigate to={`/login?verifiedEmail=${email}`} />;
};

export default AccountVerification;

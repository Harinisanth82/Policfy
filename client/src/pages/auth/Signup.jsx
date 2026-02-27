import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Button from "./Button";
import { useTheme } from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { Visibility, VisibilityOff, Star } from '@mui/icons-material';
import GoogleIcon from "../../assets/images/icons8-google.svg";
import { Link, useNavigate } from "react-router-dom";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 550px;
  padding: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.text_secondary + '40'};
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.primary};
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px ${({ theme }) => theme.bg} inset !important;
      -webkit-text-fill-color: ${({ theme }) => theme.text_primary} !important;
      transition: background-color 5000s ease-in-out 0s;
  }
`;

const PasswordToggle = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: ${({ theme }) => theme.text_secondary};
    display: flex;
    padding: 4px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-top: 10px;
  text-align: center;
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
`;

const StyledLink = styled(Link)`
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;

const GoogleButton = styled.div`
    position: relative;
    width: 100%;
    height: 50px;
    border-radius: 50px;
    background: transparent;
    color: #222222;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    overflow: hidden;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: conic-gradient(
            from 0deg,
            #4285F4,
            #DB4437,
            #F4B400,
            #0F9D58,
            #4285F4
        );
        animation: ${rotate} 2s linear infinite;
        z-index: -2;
    }

    &::after {
        content: '';
        position: absolute;
        inset: 2px;
        background: #f5f5f5;
        border-radius: 50px;
        z-index: -1;
        transition: background 0.3s ease;
    }

    &:hover::after {
        background: #e0e0e0;
    }
`;



const Signup = () => {
  const { signup } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateinputs = () => {
    if (!name || !email || !password) {
      alert("Please Fill in All Fields");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    setLoading(true);
    if (validateinputs()) {
      try {
        await signup(name, email, password);
        alert("Account Created Success");
        navigate("/login");
      } catch (err) {
        alert(err.message || "Signup failed");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const REDIRECT_URI = "http://localhost:5001/api/auth/google/callback";
    const scope = "profile email";
    const responseType = "code";

    if (!GOOGLE_CLIENT_ID) {
      alert("Google Client ID not found");
      return;
    }

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${responseType}&scope=${scope}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <FormContainer>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', gap: '32px' }}>
        <Header>
          <Star sx={{ fontSize: 40, color: theme.text_primary }} />
          <Title>Create an account</Title>
          <Span>Please enter your details</Span>
        </Header>

        <div style={{ display: "flex", gap: "24px", flexDirection: "column", width: '100%' }}>
          <InputWrapper>
            <StyledInput
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper>
            <StyledInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper>
            <div style={{ position: 'relative', width: '100%' }}>
              <StyledInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
              </PasswordToggle>
            </div>
          </InputWrapper>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button
              text="Create Account"
              onClick={handleSignUp}
              isLoading={loading}
              isDisabled={loading}
              rounded={true}
              fullWidth={true}
            />

            <GoogleButton onClick={handleGoogleLogin}>
              <img src={GoogleIcon} alt="Google" style={{ width: '24px', height: '24px' }} />
              Sign up with Google
            </GoogleButton>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', fontSize: '14px', color: theme.text_secondary, padding: '20px 0' }}>
        Already have an account? <StyledLink to="/login" style={{ marginLeft: '4px' }}>Log In</StyledLink>
      </div>
    </FormContainer>
  );
};

export default Signup;

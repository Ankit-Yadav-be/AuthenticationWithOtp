import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Heading,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  Checkbox,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Mail } from "lucide-react";
import { useUser } from "../context/userContext";

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "" });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const { setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) navigate("/notes");
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1].focus();
      setForm((prev) => ({ ...prev, otp: newOtp.join("") }));
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(`/auth/login`, {
        email: form.email,
      });
      toast({ title: data.message, status: "success" });
      setStep(2);
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Error",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(`/auth/verify-login-otp`, {
        email: form.email,
        otp: form.otp,
      });
      localStorage.setItem("token", data.token);
       setUser(data.user);
      toast({ title: data.message, status: "success" });
      navigate("/notes");
    } catch (err) {
      toast({
        title: err.response?.data?.message || "Error",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" minH="100vh">
      {/* Left Side - Form */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px="8"
        py="12"
        bg="gray.50"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <Box
            backdropFilter="blur(12px)"
            bg="whiteAlpha.800"
            p="10"
            rounded="2xl"
            shadow="2xl"
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Brand */}
            <Text
              fontSize="2xl"
              fontWeight="extrabold"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
              mb="6"
            >
              🚀 HD Notes
            </Text>

            <Heading mb="2" fontSize="2xl" fontWeight="bold" color="gray.800">
              {step === 1 ? "Sign in" : "Enter OTP"}
            </Heading>
            <Text mb="8" color="gray.500">
              {step === 1
                ? "Login with your email to continue"
                : "We’ve sent a 6-digit OTP to your email"}
            </Text>

            <VStack spacing="6" align="stretch">
              {step === 1 && (
                <FormControl>
                  <InputGroup>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      size="lg"
                      rounded="xl"
                      focusBorderColor="blue.400"
                      pl="10"
                      shadow="sm"
                    />
                    <InputRightElement pointerEvents="none">
                      <Mail size={18} color="gray" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}

              {step === 2 && (
                <FormControl>
                  <HStack spacing="3" justify="center">
                    {otp.map((digit, i) => (
                      <Input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        ref={(el) => (inputRefs.current[i] = el)}
                        size="lg"
                        textAlign="center"
                        fontSize="2xl"
                        fontWeight="bold"
                        w="12"
                        h="14"
                        rounded="lg"
                        bg="whiteAlpha.700"
                        shadow="md"
                        border="1px solid"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 8px rgba(59,130,246,0.6)",
                        }}
                      />
                    ))}
                  </HStack>
                  <Text
                    fontSize="sm"
                    color="blue.600"
                    cursor="pointer"
                    mt="3"
                    textAlign="center"
                    _hover={{ textDecoration: "underline" }}
                    onClick={handleLogin}
                  >
                    Resend OTP
                  </Text>
                </FormControl>
              )}

              <HStack justify="space-between" w="full">
                <Checkbox colorScheme="blue">Keep me logged in</Checkbox>
              </HStack>

              <Button
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, blue.600, purple.600)" }}
                size="lg"
                rounded="xl"
                shadow="lg"
                w="full"
                onClick={step === 1 ? handleLogin : handleVerifyOtp}
                isDisabled={loading}
              >
                {loading ? <Spinner size="sm" /> : step === 1 ? "Send OTP" : "Sign in"}
              </Button>
            </VStack>

            <Text mt="6" textAlign="center" color="gray.600">
              Need an account?{" "}
              <a
                href="/signup"
                style={{
                  color: "#2563eb",
                  fontWeight: "600",
                  textDecoration: "underline",
                }}
              >
                Create one
              </a>
            </Text>
          </Box>
        </motion.div>
      </Box>

      {/* Right Side - Hero Section */}
      <Box
        flex="1"
        bgImage="url('https://images.pexels.com/photos/4252305/pexels-photo-4252305.jpeg')"
        bgSize="cover"
        bgPosition="center"
        display={{ base: "none", md: "block" }}
        position="relative"
      >
       
      </Box>
    </Box>
  );
}

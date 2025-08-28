// src/pages/Signup.jsx
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
  HStack,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useUser } from "../context/userContext";

export default function Signup() {
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", dob: "", otp: "" });
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
   const { setUser } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/notes");
  }, [navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // OTP Handling
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

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/auth/signup`, {
        name: form.name,
        email: form.email,
        dob: form.dob,
      });
      toast({ title: data.message, status: "success" });
      setStep(2);
    } catch (err) {
      toast({ title: err.response?.data?.message || "Error", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/auth/verify-signup-otp`, {
        email: form.email,
        otp: form.otp,
      });
      localStorage.setItem("token", data.token);
       setUser(data.user);
      toast({ title: data.message, status: "success" });
      navigate("/notes");
    } catch (err) {
      toast({ title: err.response?.data?.message || "Error", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" minH="100vh" bg="gray.50">
      {/* Left Section - Card Form */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px="6"
        py="10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", maxWidth: "420px" }}
        >
          <Box
            p="8"
            rounded="2xl"
            bg="white"
            boxShadow="xl"
            border="1px solid"
            borderColor="gray.100"
          >
            {/* Brand */}
            <Text
              fontSize="lg"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.500, purple.500)"
              bgClip="text"
              mb="2"
            >
              🚀 HD Notes
            </Text>

            {/* Title */}
            <Heading
              mb="1"
              fontSize="xl"
              fontWeight="semibold"
              color="gray.800"
            >
              {step === 1 ? "Create your account" : "Verify your email"}
            </Heading>
            <Text mb="6" fontSize="sm" color="gray.500">
              {step === 1
                ? "Fill in the details to get started"
                : "Enter the 6-digit OTP sent to your inbox"}
            </Text>

            {/* Form Fields */}
            <VStack spacing="4" align="stretch">
              {step === 1 ? (
                <>
                  <FormControl>
                    <Input
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      size="md"
                      rounded="md"
                      focusBorderColor="blue.500"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      size="md"
                      rounded="md"
                      focusBorderColor="blue.500"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange}
                      size="md"
                      rounded="md"
                      focusBorderColor="blue.500"
                    />
                  </FormControl>
                </>
              ) : (
                <FormControl>
                  <HStack spacing="2" justify="center">
                    {otp.map((digit, i) => (
                      <Input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        ref={(el) => (inputRefs.current[i] = el)}
                        size="md"
                        textAlign="center"
                        fontSize="lg"
                        fontWeight="medium"
                        w="12"
                        h="12"
                        rounded="md"
                        border="1px solid"
                        borderColor="gray.300"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px #63b3ed",
                        }}
                      />
                    ))}
                  </HStack>
                  <Text
                    fontSize="xs"
                    color="blue.600"
                    cursor="pointer"
                    mt="3"
                    textAlign="center"
                    _hover={{ textDecoration: "underline" }}
                    onClick={handleSignup}
                  >
                    Resend OTP
                  </Text>
                </FormControl>
              )}

              {/* CTA Button */}
              <Button
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
                _hover={{ bgGradient: "linear(to-r, blue.600, purple.600)" }}
                size="md"
                rounded="md"
                fontWeight="medium"
                w="full"
                onClick={step === 1 ? handleSignup : handleVerifyOtp}
                isDisabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" />
                ) : step === 1 ? (
                  "Send OTP"
                ) : (
                  "Verify & Sign up"
                )}
              </Button>
            </VStack>

            <Divider my="6" />

            <Text fontSize="sm" textAlign="center" color="gray.600">
              Already have an account?{" "}
              <a
                href="/login"
                style={{
                  color: "#2563eb",
                  fontWeight: "500",
                  textDecoration: "underline",
                }}
              >
                Sign in
              </a>
            </Text>
          </Box>
        </motion.div>
      </Box>

      {/* Right Section - Image with Overlay */}
      <Box
        flex="1"
        bgImage="url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')"
        bgSize="cover"
        bgPosition="center"
        display={{ base: "none", md: "block" }}
        position="relative"
      >

      </Box>
    </Box>
  );
}

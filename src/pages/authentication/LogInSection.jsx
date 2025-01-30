import React, { useState } from "react";
import {
  Flex,
  Link,
  Image,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  VStack,
  Text,
  Button,
  Box,
  useDisclosure,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import logo from "../../assets/images/habituo-logo.svg";
import gLogo from "../../assets/images/icons/g-icon.webp";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../../hooks/firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import customTheme from "../../theme/theme";

const LogInSection = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };

    if (!validateEmail(email)) {
      newErrors.email = "Por favor, introduce un correo válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña no puede estar vacía.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      if (error.code === "auth/user-not-found") {
        setErrors((prev) => ({
          ...prev,
          email: "No se encontró una cuenta con este correo.",
        }));
      } else if (error.code === "auth/wrong-password") {
        setErrors((prev) => ({
          ...prev,
          password: "La contraseña es incorrecta.",
        }));
    } else if (error.code === "auth/invalid-credential") {
        setErrors((prev) => ({
            ...prev,
            password: "El correo o la contraseña son incorrectos.",
          }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Ocurrió un error inesperado. Inténtalo más tarde.",
        }));
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Usuario:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  const { themeOptions, updateTheme } = useTheme();

  const handleClick = () => setShowPassword(!showPassword);

  return (
    <Box>
      <Button
        size="sm"
        h="36px"
        bg="transparent"
        border="1px solid var(--chakra-colors-chakra-border-color)"
        paddingInline="0.875rem"
        color="var(--chakra-colors-color-palette-fg)"
        fontWeight="500"
        onClick={onOpen}
      >
        Iniciar sesión
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader
            px="1.5rem"
            pt="1.5rem"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Link href="/">
              <Image src={logo} alt="Logo" w="145px" objectFit="contain" />
            </Link>
          </ModalHeader>
          <Box pt="1.5rem" px="1.5rem">
            <Text as="h3" fontSize="lg" fontWeight="600" lineHeight="1.75rem">
              Iniciar sesión
            </Text>
            <Text
              as="p"
              color="var(--chakra-colors-gray-600)"
              fontSize="sm"
              lineHeight="1.25rem"
            >
              Utiliza tu dirección de correo electrónico o cuenta de Google para
              iniciar sesión.
            </Text>
          </Box>
          <ModalCloseButton />
          <ModalBody p="1.5rem">
            <VStack spacing={6} align="stretch">
              {/* Formulario para iniciar sesión */}
              <VStack as="form" spacing={4} w="100%">
                <Box w="100%">
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    variant="outline"
                    focusBorderColor={themeOptions.focusColor}
                    size="sm"
                    w="100%"
                    h="2.5rem"
                    borderRadius={themeOptions.borderRadius}
                    fontWeight="500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <Text
                      as="span"
                      color="var(--chakra-colors-red-600)"
                      fontSize="xs"
                      fontWeight="500"
                    >
                      {errors.email}
                    </Text>
                  )}
                </Box>
                <Box w="100%">
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      variant="outline"
                      placeholder="Contraseña"
                      focusBorderColor={themeOptions.focusColor}
                      size="sm"
                      w="100%"
                      h="2.5rem"
                      onChange={(e) => setPassword(e.target.value)}
                      borderRadius={themeOptions.borderRadius}
                      fontWeight="500"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showPassword
                            ? "Ocultar contraseña"
                            : "Mostrar contraseña"
                        }
                        w="36px"
                        h="36px"
                        bg="transparent"
                        border="none"
                        fontSize="md"
                        variant="outline"
                        size="sm"
                        icon={
                          showPassword ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )
                        }
                        onClick={handleClick}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password ? (
                    <Text
                      as="span"
                      color="var(--chakra-colors-red-600)"
                      fontSize="xs"
                      fontWeight="500"
                    >
                      {errors.password}
                    </Text>
                  ) : (
                    <Link
                    href="/recover-password"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate("/recover-password");
                      }}
                    color="var(--chakra-colors-gray-600)"
                    fontSize="xs"
                    fontWeight="500"
                    _hover={{ color: `${useTheme.focusColor}` }}
                  >
                    Recuperar contraseña
                  </Link>
                  )}
                </Box>
                <Button
                  colorScheme={themeOptions.focusColor}
                  variant="solid"
                  size="sm"
                  w="100%"
                  h="2.5rem"
                  fontWeight="500"
                  onClick={handleLogin}
                >
                  Iniciar sesión
                </Button>
              </VStack>

              {/* Separador con "o" */}
              <Flex align="center" w="100%">
                <Box h="1px" bg="var(--chakra-colors-gray-200)" flex="1" />
                <Text
                  px={2}
                  color="var(--chakra-colors-gray-400)"
                  fontSize="sm"
                >
                  O
                </Text>
                <Box h="1px" bg="var(--chakra-colors-gray-200)" flex="1" />
              </Flex>

              {/* Botón de Google */}
              <Button
                onClick={signInWithGoogle}
                size="md"
                w="100%"
                color="var(--chakra-colors-gray-fg)"
                fontSize="sm"
                fontWeight="500"
                bg="transparent"
                borderWidth="1px"
                borderColor="var(--chakra-colors-gray-200)"
                leftIcon={
                  <Avatar
                    src={gLogo}
                    size="xs"
                    w="20px"
                    h="20px"
                    bg="transparent"
                  />
                }
              >
                Continuar con Google
              </Button>

              <Box>
                <Text as="p">¿Todavía no tienes una cuenta?</Text>
                <Text as="a" href="/register">
                  Crea tu cuenta
                </Text>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LogInSection;

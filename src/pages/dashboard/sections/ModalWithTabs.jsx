import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Text,
  Heading,
  Avatar,
  VStack,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  Grid,
  GridItem,
  Box,
  Select,
  useDisclosure,
  useColorMode,
  Input,
  FormLabel,
  Image,
} from "@chakra-ui/react";
import { useTheme } from "../../../theme/ThemeContext";
import gLogo from "../../../assets/images/icons/g-icon.webp";
import mailLogo from "../../../assets/images/icons/mail.svg";
import { LuMoon, LuSun } from "react-icons/lu";
import { FaUser, FaCog } from "react-icons/fa";

// ModalWithTabs component: Displays a modal with tabs for account settings and general settings.
const ModalWithTabs = ({ userInfo, userData }) => {
  // useDisclosure hook to control modal open/close state
  const { isOpen, onOpen, onClose } = useDisclosure();
  // useState hook to manage the active tab
  const [activeTab, setActiveTab] = useState(0);
  // useColorMode hook to handle color theme (light/dark)
  const { colorMode, toggleColorMode } = useColorMode();
  // Custom theme context for managing theme options
  const { themeOptions } = useTheme();

  const location = useLocation();
  const isActive = location.pathname === "/dashboard/settings";

  // Function to handle tab change when user clicks on a tab
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  // Determine the username to display, checking different properties of userInfo and userData
  let userName = "";
  if (userInfo?.displayName) {
    userName = userInfo.displayName;
  } else if (userData?.name) {
    userName = userData.name;
  } else if (userInfo?.email) {
    userName = userInfo.email.split("@")[0];
  }

  return (
    <>
      {/* Botón to open the modal */}
      <Button
        px={3}
        fontSize="sm"
        display="flex"
        justifyContent="flex-start"
        onClick={onOpen}
        width="100%"
        leftIcon={<FaCog size="16px" />}
        variant={isActive === true ? "solid" : "ghost"}
        colorScheme={isActive === true ? themeOptions.focusColor : ""}
      >
        Ajustes generales
      </Button>

      {/* Modal component for settings */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius={themeOptions.borderRadius}>
          <ModalCloseButton />
          <ModalBody p={0} fontFamily={themeOptions.fontFamily}>
            {/* Contenedor principal con Grid */}
            <Grid p={0} templateColumns="2fr 3fr" gap={0}>
              {/* Columna izquierda (Botones) */}
              <GridItem
                p={4}
                borderRight="1px"
                borderColor="var(--chakra-colors-chakra-border-color)"
                bg={
                  colorMode === "light"
                    ? "rgb(245, 245, 245)"
                    : "rgb(23, 23, 23)"
                }
                borderTopLeftRadius={themeOptions.borderRadius}
                borderBottomLeftRadius={themeOptions.borderRadius}
              >
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  opacity={0.4}
                >
                  Ajustes de la cuenta
                </Text>
                <VStack align="start" spacing={0}>
                  {/* Button for Profile tab */}
                  <Button
                    px={3}
                    fontSize="sm"
                    display="flex"
                    justifyContent="flex-start"
                    onClick={() => handleTabChange(0)}
                    width="100%"
                    variant={activeTab === 0 ? "solid" : "ghost"}
                    colorScheme={activeTab === 0 ? themeOptions.focusColor : ""}
                    leftIcon={<FaUser />}
                  >
                    Perfil
                  </Button>
                </VStack>
                <Text
                  mt={4}
                  fontSize="xs"
                  fontWeight="semibold"
                  textTransform="uppercase"
                  opacity={0.4}
                >
                  Configuración
                </Text>
                <VStack align="start" spacing={2}>
                  {/* Button for General tab */}
                  <Button
                    px={3}
                    fontSize="sm"
                    display="flex"
                    justifyContent="flex-start"
                    onClick={() => handleTabChange(1)}
                    width="100%"
                    variant={activeTab === 1 ? "solid" : "ghost"}
                    colorScheme={activeTab === 1 ? themeOptions.focusColor : ""}
                    leftIcon={<FaCog />}
                  >
                    General
                  </Button>
                </VStack>
              </GridItem>

              {/* Right column (Dynamic content based on active tab) */}
              <GridItem
                p={4}
                bg={
                  colorMode === "light"
                    ? "rgb(255, 254, 255)"
                    : "rgb(23, 23, 23)"
                }
                borderTopRightRadius={themeOptions.borderRadius}
                borderBottomRightRadius={themeOptions.borderRadius}
              >
                {/* Profile tab content */}
                {activeTab === 0 && (
                  <Box
                    bg={
                      colorMode === "light"
                        ? "rgb(255, 254, 255)"
                        : "rgb(23, 23, 23)"
                    }
                  >
                    <Text mb={2} fontSize="2xl" fontWeight="semibold">
                      Perfil
                    </Text>
                    <HStack gap={4}>
                      <Avatar
                        src={`//wsrv.nl/?url=${userInfo.photoURL}`}
                        name={userName}
                        size="xl"
                      />
                      <Box>
                        <FormLabel
                          m={1}
                          fontSize="xs"
                          fontWeight="semibold"
                          textTransform="uppercase"
                          opacity={0.4}
                        >
                          Nombre
                        </FormLabel>
                        <Input
                          value={userName}
                          borderRadius={themeOptions.borderRadius}
                          colorScheme={themeOptions.focusColor}
                          readOnly
                        />
                      </Box>
                    </HStack>
                    <FormLabel
                      mt={5}
                      mb={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      opacity={0.4}
                    >
                      Método de egistro
                    </FormLabel>
                    <Box>
                      <HStack
                        mt={1}
                        p={2}
                        border="1px solid"
                        borderColor="var(--chakra-colors-chakra-border-color)"
                        borderRadius={themeOptions.borderRadius}
                      >
                        {userData ? (
                          <>
                            <Image mx={2} src={mailLogo} w="30px" h="30px" />
                            <Box>
                              <Text fontSize="md" fontWeight="semibold">
                                Correo electrónico
                              </Text>
                              <Text fontSize="sm" fontWeight="light">
                                {userInfo.email}
                              </Text>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Image me={4} src={gLogo} w="30px" h="30px" />
                            <Box>
                              <Text fontSize="md">Cuenta de Google</Text>
                              <Text fontSize="sm" fontWeight="light">
                                {userInfo.email}
                              </Text>
                            </Box>
                          </>
                        )}
                      </HStack>
                    </Box>
                    {/* Danger zone for account deletion */}
                    <FormLabel
                      mt={5}
                      mb={1}
                      fontSize="xs"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      opacity={0.4}
                    >
                      Zona de peligro
                    </FormLabel>
                    <Box>
                      <HStack
                        mt={1}
                        p={4}
                        border="1px solid"
                        borderColor="var(--chakra-colors-chakra-border-color)"
                        borderRadius={themeOptions.borderRadius}
                      >
                        <Box>
                          <Text fontSize="md" fontWeight="semibold">
                            Eliminar cuenta
                          </Text>
                          <Text fontSize="xs" fontWeight="regular">
                            SI eliminas tu cuenta perderás todo el proceso y
                            datos que hay actualmente en ella.
                          </Text>
                        </Box>
                        <Button
                          px={6}
                          variant="outline"
                          colorScheme="red"
                          disabled
                        >
                          Eliminar
                        </Button>
                      </HStack>
                    </Box>
                  </Box>
                )}
                {/* General tab content */}
                {activeTab === 1 && (
                  <Box>
                    <Text fontSize="2xl" fontWeight="semibold">
                      General
                    </Text>
                    {/* Theme toggle */}
                    <HStack
                      py={2}
                      display="flex"
                      justifyContent="space-between"
                      gap={2}
                      borderBottom="1px"
                      borderColor="var(--chakra-colors-chakra-border-color)"
                    >
                      <Box>
                        <Text fontSize="md" fontWeight="medium">
                          Tema
                        </Text>
                        <Text fontSize="xs" fontWeight="regular">
                          Cambia el tema de la página al modo oscuro o claro.
                        </Text>
                      </Box>
                      <IconButton
                        fontSize="lg"
                        bg="transparent"
                        onChange={toggleColorMode}
                        onClick={toggleColorMode}
                        size="sm"
                        borderRadius={themeOptions.borderRadius}
                        outline="none"
                      >
                        {colorMode === "light" ? <LuSun /> : <LuMoon />}
                      </IconButton>
                    </HStack>
                    {/* First day of the week selection */}
                    <HStack
                      py={2}
                      display="flex"
                      justifyContent="space-between"
                      gap={2}
                      borderBottom="1px"
                      borderColor="var(--chakra-colors-chakra-border-color)"
                    >
                      <Box>
                        <Text fontSize="md" fontWeight="medium">
                          Primer día de la semana
                        </Text>
                        <Text fontSize="xs" fontWeight="regular">
                          Elige el día en el que comienza la semana en la
                          aplicación.
                        </Text>
                      </Box>
                      <Select
                        w="auto"
                        minW="120px"
                        size="sm"
                        colorScheme={themeOptions.focusColor}
                      >
                        <option value="monday" defaultChecked>
                          Lunes
                        </option>
                        <option value="tuesday">Martes</option>
                        <option value="wednesday">Miércoles</option>
                        <option value="thursday">Jueves</option>
                        <option value="friday">Viernes</option>
                        <option value="saturday">Sábado</option>
                        <option value="sunday">Domingo</option>
                      </Select>
                    </HStack>
                    {/* Language selection */}
                    <HStack
                      py={2}
                      display="flex"
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box>
                        <Text fontSize="md" fontWeight="medium">
                          Lenguaje
                        </Text>
                        <Text fontSize="xs" fontWeight="regular">
                          Selecciona el lenguaje que se adapte a ti.
                        </Text>
                      </Box>
                      <Select
                        w="auto"
                        size="sm"
                        colorScheme={themeOptions.focusColor}
                      >
                        <option value="spain" defaultChecked>
                          Español
                        </option>
                        <option value="english" disabled>
                          Inglés
                        </option>
                      </Select>
                    </HStack>
                  </Box>
                )}
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

ModalWithTabs.propTypes = {
  userInfo: PropTypes.shape({
    email: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
  userData: PropTypes.object,
};

export default ModalWithTabs;

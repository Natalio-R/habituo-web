import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";
import { useTheme } from "../../../theme/ThemeContext";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../hooks/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  VStack,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import ModalWithTabs from "./ModalWithTabs";
import { LuClipboardList, LuCloudSun, LuSun, LuMoon } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";
import { CustomThemePanel } from "../../../routes";

const LeftColumn = ({ userInfo }) => {
  const [userData, setUserData] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const { themeOptions } = useTheme();
  const { colorMode } = useColorMode();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === "/dashboard/all-habits";
  const { onOpen: openModal } = useDisclosure();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Sesión cerrada.",
        description: "Has cerrado sesión exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });

      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error al cerrar sesión.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const fetchUserData = async () => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        console.log("El usuario no existe en la base de datos.");
      }
    }
  };

  const fetchAreas = async () => {
    try {
      const areasRef = collection(db, "users", userInfo.uid, "areas");

      const unsubscribe = onSnapshot(areasRef, (snapshot) => {
        const areasList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAreas(areasList);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error al obtener las áreas: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAreas();
  }, [user]);

  let userName = "";
  if (userInfo?.displayName) {
    userName = userInfo.displayName;
  } else if (userData?.name) {
    userName = userData.name;
  } else if (userInfo?.email) {
    userName = userInfo.email.split("@")[0];
  }

  return (
    <Box
      px={2}
      py={4}
      w="100%"
      h="100vh"
      bg={colorMode === "light" ? "rgb(245, 245, 245)" : "rgb(23, 23, 23)"}
      fontFamily={themeOptions.fontFamily}
    >
      <Popover align="right">
        <PopoverTrigger>
          <Button
            px={2}
            py={6}
            w="100%"
            bg={colorMode === "light" ? "rgb(236, 236, 236)" : "rgb(50, 50, 50)"}
            display="flex"
            justifyContent="flex-start"
          >
            <Flex alignItems="center" justifyContent="flex-start" gap={3}>
              <Avatar
                src={`//wsrv.nl/?url=${userInfo.photoURL}`}
                name={userName}
                size="sm"
              />
              <Text fontSize="sm" fontWeight="medium">
                {userName}
              </Text>
            </Flex>
          </Button>
        </PopoverTrigger>
        <PopoverContent w="auto" borderRadius={themeOptions.borderRadius}>
          <PopoverBody p={0}>
            <VStack p={1} alignItems="stretch" gap={1}>
              <Button
                p={4}
                display="flex"
                justifyContent="flex-start"
                size="xs"
                onClick={openModal}
              >
                Perfil
              </Button>
              <Button
                p={4}
                display="flex"
                justifyContent="flex-start"
                size="xs"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <Button
        mt={2}
        px={3}
        w="100%"
        display="flex"
        justifyContent="flex-start"
        fontSize="sm"
        onClick={() => navigate("/dashboard/all-habits")}
        variant={isActive === true ? "solid" : "ghost"}
        colorScheme={isActive === true ? themeOptions.focusColor : ""}
        leftIcon={<LuClipboardList size="16px" />}
      >
        Todos los hábitos
      </Button>

      <Text
        mt={4}
        fontSize="xs"
        fontWeight="semibold"
        textTransform="uppercase"
        opacity={0.4}
      >
        Áreas
      </Text>
      <Button
        px={3}
        w="100%"
        display="flex"
        justifyContent="flex-start"
        fontSize="sm"
        onClick={() => navigate("/dashboard/areas")}
        variant={"ghost"}
        colorScheme={""}
        leftIcon={<LuClipboardList size="16px" />}
      >
        Todas las áreas
      </Button>
      <Button
        px={3}
        w="100%"
        display="flex"
        justifyContent="flex-start"
        fontSize="sm"
        onClick={() => navigate("/dashboard/areas/morning")}
        variant={"ghost"}
        colorScheme={""}
        leftIcon={<LuSun size="16px" />}
      >
        Mañanas
      </Button>
      <Button
        px={3}
        w="100%"
        display="flex"
        justifyContent="flex-start"
        fontSize="sm"
        onClick={() => navigate("/dashboard/areas/evening")}
        variant={"ghost"}
        colorScheme={""}
        leftIcon={<LuCloudSun size="16px" />}
      >
        Tardes
      </Button>
      <Button
        px={3}
        w="100%"
        display="flex"
        justifyContent="flex-start"
        fontSize="sm"
        onClick={() => navigate("/dashboard/areas/night")}
        variant={"ghost"}
        colorScheme={""}
        leftIcon={<LuMoon size="16px" />}
      >
        Noches
      </Button>
      <Button
        px={3}
        w="100%"
        display="flex"
        justifyContent="flex-start"
        fontSize="sm"
        onClick={() => navigate("/dashboard/areas/night")}
        variant={"ghost"}
        colorScheme={""}
        leftIcon={<FiPlus size="16px" />}
      >
        Agregar nueva
      </Button>

      <Text
        mt={4}
        fontSize="xs"
        fontWeight="semibold"
        textTransform="uppercase"
        opacity={0.4}
      >
        Ajuster generales
      </Text>
      <ModalWithTabs userInfo={userInfo} userData={userData} />
      <CustomThemePanel />
    </Box>
  );
};

export default LeftColumn;

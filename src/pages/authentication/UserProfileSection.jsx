import React from "react";
import {
  Flex,
  Avatar,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  VStack,
  Text,
  Button,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/AuthContext";
import { useTheme } from "../../theme/ThemeContext";


const UserProfileSection = () => {
  const { themeOptions } = useTheme();
  const { user, logout } = useAuth();

  if (!user) return null;

  const userName =
    user.displayName || (user.email ? user.email.split("@")[0] : "Usuario");
  const userAvatar = user.photoURL
    ? `//wsrv.nl/?url=${user.photoURL}`
    : undefined;

  if (user) {
    return (
      <Box>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <Avatar
              src={userAvatar} name={userName}
              cursor="pointer"
              size="sm"
            />
          </PopoverTrigger>
          <Portal>
            <PopoverContent w="auto" borderRadius={themeOptions.borderRadius} p={1}>
              <PopoverArrow />
              <PopoverBody>
                <VStack spacing={4} align="end">
                  <Flex alignItems="center" justifyContent="flex-start" gap={3}>
                    <Avatar
                      src={userAvatar} name={userName}
                      size="md"
                    />
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {userName}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color="var(--chakra-colors-gray-400)"
                      >
                        {user.email}
                      </Text>
                    </Box>
                  </Flex>
                  <Button
                    h="2rem"
                    px="0.625rem"
                    bg="transparent"
                    fontSize="xs"
                    iconSpacing={1}
                    color="var(--chakra-colors-color-palette-fg)"
                    leftIcon={<Icon as={FiLogOut} boxSize={4} />}
                    onClick={logout}
                  >
                    Cerrar sesión
                  </Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Box>
    );
  }
};

export default UserProfileSection;

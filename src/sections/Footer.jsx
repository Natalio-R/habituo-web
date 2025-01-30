import React from "react";
import logo from "../assets/images/habituo-logo.svg";
import {
  Box,
  Flex,
  Image,
  VStack,
  Grid,
  Text,
  Link,
  Divider,
} from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box as="footer" py={10} px={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "center", md: "flex-start" }}
        maxW="7xl"
        mx="auto"
        my={16}
      >
        {/* Logo Section */}
        <Box>
          <Link href="/">
            <Image src={logo} alt="Logo" w="145px" objectFit="contain" />
          </Link>
        </Box>

        {/* Navigation Links Section */}
        <Grid
          templateColumns={{
            base: "repeat(1, minmax(0px, 1fr))",
            md: "repeat(3, minmax(0px, 1fr))",
          }}
          gap={10}
          w="full"
          maxW="600px"
        >
          {/* Access Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="sm" fontWeight="500">
              Accesos
            </Text>
            <VStack
              align="start"
              fontSize="sm"
              color="var(--chakra-colors-gray-600)"
              spacing={3}
            >
              <Link href="/">Inicio</Link>
              <Link href="#">Acerca de</Link>
              <Link href="/dashboard">Tablero</Link>
            </VStack>
          </VStack>

          {/* Product Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="sm" fontWeight="500">
              Productos
            </Text>
            <VStack
              align="start"
              fontSize="sm"
              color="var(--chakra-colors-gray-600)"
              spacing={3}
            >
              <Link href="#">Aplicación</Link>
              <Link href="#">Desarrolladores</Link>
              <Link href="#">Integraciones</Link>
            </VStack>
          </VStack>

          {/* Support Links */}
          <VStack align="start" spacing={4}>
            <Text fontSize="sm" fontWeight="500">
              Soporte
            </Text>
            <VStack
              align="start"
              fontSize="sm"
              color="var(--chakra-colors-gray-600)"
              spacing={3}
            >
              <Link
                href="https://github.com/Natalio-R/habituo-web/"
                target="_blank"
              >
                Código
              </Link>
              <Link
                href="https://github.com/Natalio-R/habituo-web/issues/new"
                target="_blank"
              >
                Reportar bug
              </Link>
              <Link href="mailto:nataliorabasconavarro.com" target="_blank">
                Contacto
              </Link>
            </VStack>
          </VStack>
        </Grid>
      </Flex>

      {/* Divider Line */}
      <Divider />

      {/* Copyright Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        py={4}
      >
        <Text fontSize="sm" color="var(--chakra-colors-fg-muted)">
          ©{new Date().getFullYear()} Todos los derechos reservados.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;

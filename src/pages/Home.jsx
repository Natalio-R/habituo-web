import React from "react";
import { Navbar, Footer } from "../routes/index";
import { ChakraProvider } from "@chakra-ui/react";
import { useTheme } from "../theme/ThemeContext";
import customTheme from "../theme/theme";

const Home = () => {
  const { themeOptions, updateTheme } = useTheme();

  return (
    <>
      <ChakraProvider
        theme={customTheme(
          themeOptions.focusColor,
          themeOptions.fontFamily,
          themeOptions.borderRadius
        )}
      >
        <Navbar onUpdateTheme={updateTheme} />
        <Footer />
      </ChakraProvider>
    </>
  );
};

export default Home;

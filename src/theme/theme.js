import { extendTheme } from "@chakra-ui/react";

// Function to create a custom theme in Chakra UI
const customTheme = (focusColor = "gray", fontFamily = "Inter, sans-serif", borderRadius = "base") => {
    return extendTheme({
        colors: {
            brand: {
                500: focusColor, // Main brand color at level 500
                600: focusColor[600],
                700: focusColor[700],
            },
        },
        fonts: {
            body: fontFamily, // Sets the main font for the theme
        },
        radii: {
            base: `var(--chakra-radii-${borderRadius})`, // Sets border radius dynamically
        },
        components: {
            Button: {
                baseStyle: {
                    borderRadius: borderRadius,
                },
            },
        },
    });
};

export default customTheme;
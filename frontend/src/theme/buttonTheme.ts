import { defineRecipe } from "@chakra-ui/react";

const buttonTheme = defineRecipe({
  base: {
    fontWeight: "medium",
  },
  variants: {
    variant: {
      primary: {
        color: "white",
        bg: "blue.600",
        _hover: {
          bg: "blue.700",
        },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export default buttonTheme;

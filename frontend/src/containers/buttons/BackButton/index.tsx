import React from "react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Button, type ButtonProps } from "@mui/material";
import { ArrowBack, Home } from "@mui/icons-material";

const BackButton: React.FC<ButtonProps> = (props) => {
  /** Values */

  const router = useRouter();
  const canGoBack = useCanGoBack();

  /** Callbacks */

  const handleOnClick = () => {
    if (canGoBack) router.history.back();
    else router.navigate({ to: "/" });
  };

  return (
    <Button
      startIcon={canGoBack ? <ArrowBack /> : <Home />}
      onClick={handleOnClick}
      {...props}
    >
      {canGoBack ? "Back" : "Home"}
    </Button>
  );
};

export default BackButton;

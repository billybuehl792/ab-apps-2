import type { ErrorRouteComponent } from "@tanstack/react-router";
import { Container } from "@mui/material";
import StatusWrapper from "@/components/layout/StatusWrapper";
import BackButton from "@/containers/buttons/BackButton";
import { errorUtils } from "@/store/utils/error";

const DefaultErrorComponent: ErrorRouteComponent = ({ error }) => {
  return (
    <Container>
      <StatusWrapper
        error={{
          label: errorUtils.getErrorMessage(error),
          actions: [<BackButton />],
        }}
        my={2}
      />
    </Container>
  );
};

export default DefaultErrorComponent;

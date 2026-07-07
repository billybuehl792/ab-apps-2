import type { RouteComponent } from "@tanstack/react-router";
import { Container } from "@mui/material";
import StatusWrapper from "@/components/layout/StatusWrapper";

const DefaultPendingComponent: RouteComponent = () => {
  return (
    <Container>
      <StatusWrapper loading my={2} />
    </Container>
  );
};

export default DefaultPendingComponent;

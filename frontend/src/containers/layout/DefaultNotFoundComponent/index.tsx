import { Container } from "@mui/material";
import PageNotFoundCard from "@/components/cards/PageNotFoundCard";
import type { NotFoundRouteProps } from "@tanstack/react-router";

const DefaultNotFoundComponent: React.FC<NotFoundRouteProps> = () => {
  return (
    <Container>
      <PageNotFoundCard />
    </Container>
  );
};

export default DefaultNotFoundComponent;

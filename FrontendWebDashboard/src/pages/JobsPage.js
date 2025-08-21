import Container from "../components/Container";
import JobList from "../components/JobList";

export default function JobsPage() {
  return (
    <Container
      title="Processing Jobs"
      description="Monitor the status and progress of your ongoing and recent jobs."
    >
      <JobList />
    </Container>
  );
}

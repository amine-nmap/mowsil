import {
  Html, Head, Preview, Body, Container, Section, Text, Hr, Heading, Link,
} from "@react-email/components";

type NewBookingAgencyEmailProps = {
  agencyName: string;
  clientName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  dashboardUrl: string;
};

const main = {
  backgroundColor: "#F5F7FA",
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(10, 37, 64, 0.08)",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "520px",
  padding: "32px",
};

const h1 = {
  color: "#0A2540",
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "1.3",
  margin: "0 0 8px",
};

const text = {
  color: "#4A5568",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const alertBox = {
  backgroundColor: "#EBF5FF",
  border: "1px solid #93C5FD",
  borderRadius: "8px",
  padding: "14px",
  margin: "20px 0",
};

const alertTitle = {
  color: "#2563EB",
  fontSize: "13px",
  fontWeight: "700",
  margin: "0 0 4px",
};

const button = {
  backgroundColor: "#00C896",
  borderRadius: "8px",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  margin: "20px 0",
};

const hr = {
  border: "none",
  borderTop: "1px solid rgba(10, 37, 64, 0.08)",
  margin: "20px 0",
};

const footer = {
  color: "#718096",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
};

export default function NewBookingAgencyEmail({
  agencyName,
  clientName,
  vehicleName,
  startDate,
  endDate,
  dashboardUrl,
}: NewBookingAgencyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande de réservation — {vehicleName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>MOWSIL</Heading>
          <Text style={text}>Bonjour {agencyName},</Text>

          <Section style={alertBox}>
            <Text style={alertTitle}>Nouvelle demande de réservation</Text>
            <Text style={{ ...text, margin: 0, fontSize: "13px" }}>
              Un client vient de réserver un véhicule chez vous.
            </Text>
          </Section>

          <Text style={text}>
            <strong>Client :</strong> {clientName}<br />
            <strong>Véhicule :</strong> {vehicleName}<br />
            <strong>Début :</strong> {startDate}<br />
            <strong>Fin :</strong> {endDate}
          </Text>

          <Link href={dashboardUrl} style={button}>
            Voir la demande
          </Link>

          <Text style={{ ...text, fontSize: "13px", color: "#718096" }}>
            Vous avez 2 heures pour confirmer ou refuser cette demande. Passé ce délai, la réservation expire automatiquement.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            L&apos;équipe MOWSIL —{" "}
            <Link href="https://mowsil.vercel.app" style={{ color: "#00C896" }}>
              mowsil.vercel.app
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

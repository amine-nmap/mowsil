import {
  Html, Head, Preview, Body, Container, Section, Text, Hr, Heading,
} from "@react-email/components";

type BookingCodeEmailProps = {
  firstName: string;
  code: string;
  vehicleName: string;
  agencyName: string;
  agencyAddress: string;
  startDate: string;
  endDate: string;
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

const codeBox = {
  backgroundColor: "#0A2540",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const codeText = {
  color: "#00C896",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "6px",
  fontFamily: "'Courier New', monospace",
  margin: "0",
};

const codeLabel = {
  color: "#FFFFFF",
  fontSize: "11px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 12px",
};

const detailsBox = {
  backgroundColor: "#F5F7FA",
  borderRadius: "8px",
  padding: "16px",
  margin: "20px 0",
};

const detailRow = {
  display: "flex" as const,
  justifyContent: "space-between" as const,
  padding: "6px 0",
  fontSize: "13px",
};

const detailLabel = {
  color: "#718096",
  margin: "0",
};

const detailValue = {
  color: "#0A2540",
  fontWeight: "600",
  margin: "0",
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

export default function BookingCodeEmail({
  firstName,
  code,
  vehicleName,
  agencyName,
  agencyAddress,
  startDate,
  endDate,
}: BookingCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre véhicule est confirmé — Code : {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>MOWSIL</Heading>
          <Text style={text}>Bonjour {firstName},</Text>
          <Text style={text}>
            Bonne nouvelle — votre réservation est confirmée par l&apos;agence{" "}
            <strong>{agencyName}</strong>.
          </Text>

          <Section style={codeBox}>
            <Text style={codeLabel}>Votre code de retrait</Text>
            <Text style={codeText}>{code}</Text>
          </Section>

          <Text style={{ ...text, fontSize: "13px" }}>
            Présentez ce code à l&apos;agence lors du retrait. Paiement en
            espèces sur place.
          </Text>

          <Section style={detailsBox}>
            <div style={detailRow}>
              <p style={detailLabel}>Véhicule</p>
              <p style={detailValue}>{vehicleName}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>Agence</p>
              <p style={detailValue}>{agencyName}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>Adresse</p>
              <p style={detailValue}>{agencyAddress}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>Début</p>
              <p style={detailValue}>{startDate}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>Fin</p>
              <p style={detailValue}>{endDate}</p>
            </div>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            L&apos;équipe MOWSIL —{" "}
            <a
              href="https://mowsil.vercel.app"
              style={{ color: "#00C896" }}
            >
              mowsil.vercel.app
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

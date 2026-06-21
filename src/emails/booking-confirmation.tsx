import {
  Html, Head, Preview, Body, Container, Section, Text, Hr, Heading,
} from "@react-email/components";

type BookingConfirmationEmailProps = {
  firstName: string;
  vehicleName: string;
  agencyName: string;
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

const statusBox = {
  backgroundColor: "#FFF8E1",
  border: "1px solid #FFE082",
  borderRadius: "8px",
  padding: "14px",
  margin: "20px 0",
};

const statusTitle = {
  color: "#F59E0B",
  fontSize: "13px",
  fontWeight: "700",
  margin: "0 0 4px",
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

export default function BookingConfirmationEmail({
  firstName,
  vehicleName,
  agencyName,
  startDate,
  endDate,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre demande MOWSIL est en cours de validation</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>MOWSIL</Heading>
          <Text style={text}>Bonjour {firstName},</Text>
          <Text style={text}>
            Votre demande de réservation pour la <strong>{vehicleName}</strong>{" "}
            est bien reçue.
          </Text>

          <Section style={statusBox}>
            <Text style={statusTitle}>⏳ En attente de confirmation</Text>
            <Text style={{ ...text, margin: 0, fontSize: "13px" }}>
              L&apos;agence <strong>{agencyName}</strong> a{" "}
              <strong>2 heures</strong> pour confirmer votre réservation.
            </Text>
          </Section>

          <Text style={text}>
            Vous recevrez votre code de retrait par email dès validation par
            l&apos;agence.
          </Text>

          <Text style={{ ...text, fontSize: "13px", color: "#718096" }}>
            Si aucune réponse dans ce délai, votre demande est automatiquement
            annulée et le véhicule remis en ligne.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Dates : {startDate} → {endDate}
            <br />
            Véhicule : {vehicleName}
            <br />
            Agence : {agencyName}
          </Text>

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

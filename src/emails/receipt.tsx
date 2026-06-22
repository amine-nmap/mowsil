import {
  Html, Head, Preview, Body, Container, Section, Text, Hr, Heading,
} from "@react-email/components";

type ReceiptEmailProps = {
  firstName: string;
  vehicleName: string;
  agencyName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyPrice: number;
  totalAmount: number;
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

const receiptBox = {
  backgroundColor: "#F0FFF4",
  border: "1px solid #00C896",
  borderRadius: "8px",
  padding: "20px",
  margin: "20px 0",
};

const receiptTitle = {
  color: "#00C896",
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 12px",
};

const totalLine = {
  display: "flex" as const,
  justifyContent: "space-between" as const,
  padding: "6px 0",
  fontSize: "14px",
};

const totalLabel = {
  color: "#718096",
  margin: "0",
};

const totalValue = {
  color: "#0A2540",
  fontWeight: "600",
  margin: "0",
};

const grandTotalLine = {
  display: "flex" as const,
  justifyContent: "space-between" as const,
  padding: "12px 0 0",
  borderTop: "1px solid rgba(10, 37, 64, 0.08)",
  marginTop: "8px",
};

const grandTotalLabel = {
  color: "#0A2540",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0",
};

const grandTotalValue = {
  color: "#00C896",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0",
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

export default function ReceiptEmail({
  firstName,
  vehicleName,
  agencyName,
  startDate,
  endDate,
  totalDays,
  dailyPrice,
  totalAmount,
}: ReceiptEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Receipt — {vehicleName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>MOWSIL</Heading>
          <Text style={text}>Hello {firstName},</Text>
          <Text style={text}>
            Thank you for returning the <strong>{vehicleName}</strong>. Below is
            your rental receipt.
          </Text>

          <Section style={receiptBox}>
            <Text style={receiptTitle}>Receipt</Text>
            <div style={totalLine}>
              <p style={totalLabel}>Daily rate</p>
              <p style={totalValue}>{dailyPrice} DH</p>
            </div>
            <div style={totalLine}>
              <p style={totalLabel}>Days</p>
              <p style={totalValue}>{totalDays}</p>
            </div>
            <div style={grandTotalLine}>
              <p style={grandTotalLabel}>Total paid to agency</p>
              <p style={grandTotalValue}>{totalAmount} DH</p>
            </div>
          </Section>

          <Section style={detailsBox}>
            <div style={detailRow}>
              <p style={detailLabel}>Vehicle</p>
              <p style={detailValue}>{vehicleName}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>Agency</p>
              <p style={detailValue}>{agencyName}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>Start</p>
              <p style={detailValue}>{startDate}</p>
            </div>
            <div style={detailRow}>
              <p style={detailLabel}>End</p>
              <p style={detailValue}>{endDate}</p>
            </div>
          </Section>

          <Text style={{ ...text, fontSize: "13px", color: "#718096" }}>
            We hope you enjoyed your rental. Find your next vehicle on MOWSIL.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            The MOWSIL Team —{" "}
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

import { Resend } from "resend";
import { render } from "@react-email/components";
import BookingConfirmationEmail from "@/emails/booking-confirmation";
import BookingCodeEmail from "@/emails/booking-code";
import NewBookingAgencyEmail from "@/emails/new-booking-agency";
import ReceiptEmail from "@/emails/receipt";

const resend = new Resend(process.env.RESEND_API_KEY!);

type SendConfirmationInput = {
  to: string;
  firstName: string;
  vehicleName: string;
  agencyName: string;
  startDate: string;
  endDate: string;
};

export async function sendBookingConfirmation(input: SendConfirmationInput) {
  const { to, ...props } = input;

  const html = await render(
    <BookingConfirmationEmail
      firstName={props.firstName}
      vehicleName={props.vehicleName}
      agencyName={props.agencyName}
      startDate={props.startDate}
      endDate={props.endDate}
    />,
  );

  const { error } = await resend.emails.send({
    from: "MOWSIL <reservations@mowsil.ma>",
    to,
    subject: "Votre demande MOWSIL est en cours de validation",
    html,
  });

  if (error) console.error("Resend error (confirmation):", error);
  return { error: error?.message ?? null };
}

type SendCodeInput = {
  to: string;
  firstName: string;
  code: string;
  vehicleName: string;
  agencyName: string;
  agencyAddress: string;
  startDate: string;
  endDate: string;
};

export async function sendBookingCode(input: SendCodeInput) {
  const { to, ...props } = input;

  const html = await render(
    <BookingCodeEmail
      firstName={props.firstName}
      code={props.code}
      vehicleName={props.vehicleName}
      agencyName={props.agencyName}
      agencyAddress={props.agencyAddress}
      startDate={props.startDate}
      endDate={props.endDate}
    />,
  );

  const { error } = await resend.emails.send({
    from: "MOWSIL <reservations@mowsil.ma>",
    to,
    subject: `Votre véhicule est confirmé — Code : ${props.code}`,
    html,
  });

  if (error) console.error("Resend error (code):", error);
  return { error: error?.message ?? null };
}

type SendNewBookingNotificationInput = {
  to: string;
  agencyName: string;
  clientName: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  dashboardUrl: string;
};

export async function sendNewBookingNotification(input: SendNewBookingNotificationInput) {
  const { to, ...props } = input;

  const html = await render(
    <NewBookingAgencyEmail
      agencyName={props.agencyName}
      clientName={props.clientName}
      vehicleName={props.vehicleName}
      startDate={props.startDate}
      endDate={props.endDate}
      dashboardUrl={props.dashboardUrl}
    />,
  );

  const { error } = await resend.emails.send({
    from: "MOWSIL <reservations@mowsil.ma>",
    to,
    subject: `Nouvelle demande de réservation — ${props.vehicleName}`,
    html,
  });

  if (error) console.error("Resend error (agency notification):", error);
  return { error: error?.message ?? null };
}

type SendReceiptInput = {
  to: string;
  firstName: string;
  vehicleName: string;
  agencyName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyPrice: number;
  totalAmount: number;
};

export async function sendReceipt(input: SendReceiptInput) {
  const { to, ...props } = input;

  const html = await render(
    <ReceiptEmail
      firstName={props.firstName}
      vehicleName={props.vehicleName}
      agencyName={props.agencyName}
      startDate={props.startDate}
      endDate={props.endDate}
      totalDays={props.totalDays}
      dailyPrice={props.dailyPrice}
      totalAmount={props.totalAmount}
    />,
  );

  const { error } = await resend.emails.send({
    from: "MOWSIL <reservations@mowsil.ma>",
    to,
    subject: `Receipt — ${props.vehicleName}`,
    html,
  });

  if (error) console.error("Resend error (receipt):", error);
  return { error: error?.message ?? null };
}

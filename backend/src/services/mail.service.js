import nodemailer from "nodemailer";
import {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
  APP_URL,
} from "../config/configEnv.js";

export const correoConfigurado = () => Boolean(MAIL_HOST);

let transporter = null;

// solo se hace 1 vez cuando se necesite
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: MAIL_SECURE,
      auth: MAIL_USER && MAIL_PASS ? { user: MAIL_USER, pass: MAIL_PASS } : undefined,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

// dw
const esc = (valor) =>
  String(valor ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const armarCorreoEquipo = ({ miembro, team, companeros }) => {
  // Lo que llega al mail
  const subject = `Fuiste seleccionado para el equipo "${team.name}"`.replace(/\s+/g, " ");
  const otros = companeros.filter((c) => c.id !== miembro.id).map((c) => c.nombre);

  const lineasTexto = [
    `Hola ${miembro.nombre},`,
    "",
    `Has sido seleccionado(a) para formar parte del equipo "${team.name}".`,
  ];
  if (team.description) lineasTexto.push("", `Descripcion del equipo: ${team.description}`);
  if (otros.length) lineasTexto.push("", "Tus companeros de equipo:", ...otros.map((n) => `- ${n}`));
  lineasTexto.push("", `Puedes ingresar al sistema en ${APP_URL}`, "", "Este es un mensaje automatico, por favor no respondas a este correo.");

  const html = `
<div style="font-family: Arial, sans-serif; color: #222; max-width: 560px;">
  <p>Hola <strong>${esc(miembro.nombre)}</strong>,</p>
  <p>Has sido seleccionado(a) para formar parte del equipo <strong>${esc(team.name)}</strong>.</p>
  ${team.description ? `<p>${esc(team.description)}</p>` : ""}
  ${otros.length ? `<p>Tus companeros de equipo:</p><ul>${otros.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
  <p><a href="${esc(APP_URL)}">Ingresar al sistema</a></p>
  <p style="color: #777; font-size: 12px;">Este es un mensaje automatico, por favor no respondas a este correo.</p>
</div>`;

  return { subject, text: lineasTexto.join("\n"), html };
};


// Avisa por correo al que se selecciona y no debe evitar crear el equipo si falla
export async function notificarEquipoAsignado(team, miembros) {
  const resultado = { configurado: correoConfigurado(), enviados: 0, fallidos: [] };
  if (!miembros.length) return resultado;

  if (!resultado.configurado) {
    console.warn(`[correo] MAIL_HOST no esta configurado: se omiten ${miembros.length} correo(s) del equipo "${team.name}".`);
    return resultado;
  }

  const smtp = getTransporter();
  // un correo para cada persona
  const envios = await Promise.allSettled(
    miembros.map((miembro) =>
      smtp.sendMail({
        from: MAIL_FROM,
        to: miembro.email,
        ...armarCorreoEquipo({ miembro, team, companeros: miembros }),
      })
    )
  );

  envios.forEach((envio, i) => {
    if (envio.status === "fulfilled") {
      resultado.enviados += 1;
      return;
    }
    const miembro = miembros[i];
    const motivo = envio.reason?.message || "Error desconocido";
    console.error(`[correo] No se pudo enviar a ${miembro.email}: ${motivo}`);
    resultado.fallidos.push({ nombre: miembro.nombre, email: miembro.email, motivo });
  });

  return resultado;
}

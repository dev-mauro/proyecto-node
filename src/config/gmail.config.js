import nodemailer from 'nodemailer';

const email = "";
const emailPassword = "";

// Configuración del canal de comunicación entre node y gmail
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587, // Puerto que usa gmail
	auth: {
		user: email,
		pass: emailPassword,
	},
	secure: false,
	tls: {
		rejectUnauthorized: false,
	}
});

export { transporter };
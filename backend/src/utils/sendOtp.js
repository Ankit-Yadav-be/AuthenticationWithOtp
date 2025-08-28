import nodemailer from "nodemailer";


export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};


export const sendOtp = async (email, otp) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

  
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2> OTP Verification</h2>
          <p>Dear User,</p>
          <p>Your OTP code is:</p>
          <h1 style="color: #2E86C1;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.</p>
          <br/>
          <p>Regards, <br/>Your App Team</p>
        </div>
      `,
    };


    await transporter.sendMail(mailOptions);

    console.log(` OTP sent successfully to ${email}`);
  } catch (error) {
    console.error(" Error sending OTP:", error.message);
    throw new Error("Failed to send OTP email");
  }
};

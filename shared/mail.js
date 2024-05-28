import emailjs from "@emailjs/browser";

const emailId = process.env.EMAIL_PUBLIC_ID;

export const sendEmail = (email, template) => {
    emailjs.init({ publicKey: "HXShmzwK6-xv5wPet" });
    emailjs.send("service_0svlota", template, {
        from_name: email,
    }).then(
        (response) => {
            console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
            console.log('FAILED...', error);
        });
};

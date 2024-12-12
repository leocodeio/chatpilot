import { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "./hoc";
import { slideIn } from "./utils/motion";
import toaster from "react-hot-toast";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    console.log(form);
    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Harsha Leo",
          from_email: form.email,
          to_email: "saiharsha9897@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          toaster.success("Thank you. I will get back to you as soon as possible.");

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error: any) => {
          setLoading(false);
          console.error(error);

          toaster.error("Ahh, something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="mx-1 sm:mx-2 xl:mt-12 flex flex-col xl:flex-row gap-10 w-full overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0, 1)}
        className="flex-[0.75] bg-transparent dark:bg-black-100 p-4 sm:p-8 rounded-2xl"
      >
        <p className="text-[14px] sm:text-[18px] text-white dark:text-secondary uppercase tracking-wider">
          Get in touch
        </p>
        <h3 className="text-[30px] xs:text-[40px] sm:text-[50px] md:text-[60px] text-white dark:text-secondary font-black">
          Contact.
        </h3>

        <form
          ref={formRef as any}
          onSubmit={handleSubmit}
          className="mt-8 sm:mt-12 flex flex-col gap-6 sm:gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white dark:text-secondary font-medium mb-2 sm:mb-4">
              Your Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className="bg-gray-100 dark:bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-gray-500 dark:placeholder:text-black text-black rounded-lg outline-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white dark:text-secondary font-medium mb-2 sm:mb-4">
              Your email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your web address?"
              className="bg-gray-100 dark:bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-gray-500 dark:placeholder:text-black text-black  rounded-lg outline-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white dark:text-secondary font-medium mb-2 sm:mb-4">
              Your Message
            </span>
            <textarea
              rows={2}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What you want to say?"
              className="bg-gray-100 dark:bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-gray-500 dark:placeholder:text-black text-black rounded-lg outline-none border-none font-medium"
            />
          </label>

          <button
            type="submit"
            className="bg-secondary dark:bg-secondary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 h-[350px] md:h-[550px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");

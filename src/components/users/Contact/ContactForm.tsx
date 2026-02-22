import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import Input from "@/components/common/Input";
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const getPhoneDigits = (value: string) => value.replace(/\D/g, "").slice(0, 11);

const formatPhone = (value: string) => {
  const digits = getPhoneDigits(value);

  if (digits.length <= 4) return digits;

  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
};

const isValidPhone = (value: string) => {
  const digits = getPhoneDigits(value);
  return /^03\d{9}$/.test(digits);
};

export const ContactFormSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormData>();

  const syncAutofillValues = useCallback(() => {
    const fields: Array<keyof FormData> = [
      "fullName",
      "email",
      "phone",
      "subject",
      "message",
    ];

    fields.forEach((field) => {
      const element = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${field}"]`
      );

      if (element?.value) {
        const valueToSet =
          field === "phone" ? formatPhone(element.value) : element.value;

        if (field === "phone" && valueToSet !== element.value) {
          element.value = valueToSet;
        }

        setValue(field, valueToSet as FormData[typeof field], {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    });
  }, [setValue]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      syncAutofillValues();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [syncAutofillValues]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: FormData = {
        ...data,
        phone: formatPhone(data.phone),
      };
      const res = await apiClient.post("/contact", payload);

      if (res.data?.success) {
        toast.success("Message sent successfully! We'll contact you soon.");
        reset();
      } else {
        toast.error(res.data?.message || "Failed to send message");
      }
    } catch (error: unknown) {
      console.error("Contact error:", error);

      const apiMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      const nativeMessage = error instanceof Error ? error.message : undefined;

      const message = apiMessage || nativeMessage || "Something went wrong";

      toast.error(message);
    }
  };

  return (
    <section className="contact-autofill-scope py-20 px-6 text-center bg-white">
      <h2 className="text-2xl md:text-4xl font-bold mb-2">
        Send Us a Message
      </h2>

      <p className="text-gray-600 mb-10 max-w-xl mx-auto">
        We’d love to hear from you! Fill out the form below and we’ll get
        back to you as soon as possible.
      </p>

      <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl p-6 border">
        <h3 className="font-semibold text-lg mb-4">Contact Form</h3>

        <form
          className="space-y-4"
          onInput={syncAutofillValues}
          onFocusCapture={syncAutofillValues}
          onSubmitCapture={syncAutofillValues}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Full Name */}
          <label htmlFor="fullName" className="sr-only">
            Full Name
          </label>
          <Input
            id="fullName"
            icon={<User />}
            autoComplete="name"
            placeholder="Full Name"
            {...register("fullName", {
              required: "Full name is required",
            })}
            error={errors.fullName?.message}
          />

          {/* Email */}
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <Input
            id="email"
            icon={<Mail />}
            autoComplete="email"
            placeholder="Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          {/* Phone */}
          <label htmlFor="phone" className="sr-only">
            Phone Number
          </label>
          <Input
            id="phone"
            icon={<Phone />}
            placeholder="0306-1234567"
            maxLength={12}
            autoComplete="tel"
            inputMode="numeric"
            {...register("phone", {
              required: "Phone number is required",
              setValueAs: (value: string) => formatPhone(value ?? ""),
              validate: (value) =>
                isValidPhone(value) || "Phone must be like 0306-1234567",
              onChange: (e) => {
                const formatted = formatPhone(e.target.value);
                if (formatted !== e.target.value) {
                  e.target.value = formatted;
                }
              },
            })}
            error={errors.phone?.message}
          />

          {/* Subject */}
          <label htmlFor="subject" className="sr-only">
            Subject
          </label>
          <Input
            id="subject"
            icon={<MessageSquare />}
            autoComplete="off"
            placeholder="Subject"
            {...register("subject", {
              required: "Subject is required",
            })}
            error={errors.subject?.message}
          />

          {/* Message */}
          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              {...register("message", {
                required: "Message is required",
              })}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600"
              placeholder="Your Message"
              autoComplete="off"
              rows={4}
            />
            {errors.message && (
              <p className="text-red-500 text-xs text-left">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 cursor-pointer text-white py-3 rounded-xl hover:bg-green-700 border transition outline-none focus-within:border-black disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

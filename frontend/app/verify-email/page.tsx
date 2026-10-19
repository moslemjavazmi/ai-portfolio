// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function VerifyEmailPage() {

//   const searchParams = useSearchParams();

//   const token = searchParams.get("token");
//   const email = searchParams.get("email");

//   const [status, setStatus] = useState<
//     "loading" | "success" | "error"
//   >("loading");

//   const [message, setMessage] = useState("");

//   useEffect(() => {

//     if (!token) {
//       setStatus("error");
//       setMessage("توکن تأیید وجود ندارد.");
//       return;
//     }

//     const verify = async () => {

//       try {

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${encodeURIComponent(
//             token
//           )}`
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(
//             data.detail ??
//             "تأیید ایمیل ناموفق بود"
//           );
//         }

//         setStatus("success");
//         setMessage(
//           "ایمیل شما با موفقیت تأیید شد."
//         );

//       } catch (error) {

//         setStatus("error");

//         setMessage(
//           error instanceof Error
//             ? error.message
//             : "خطایی رخ داد."
//         );
//       }
//     };

//     verify();

//   }, [token]);

//   return (
//     <main className="min-h-screen flex items-center justify-center p-6">

//       <div className="w-full max-w-md text-center">

//         {status === "loading" && (
//           <>
//             <h1 className="text-3xl font-bold">
//               در حال تأیید ایمیل...
//             </h1>
//           </>
//         )}

//         {status === "success" && (
//           <>
//             <h1 className="text-3xl font-bold">
//               ایمیل تأیید شد ✓
//             </h1>

//             <p className="mt-4 text-neutral-600">
//               {email}
//             </p>

//             <Link
//               href="/login"
//               className="inline-block mt-8 bg-black text-white px-6 py-3 rounded-lg"
//             >
//               ورود به حساب
//             </Link>
//           </>
//         )}

//         {status === "error" && (
//           <>
//             <h1 className="text-3xl font-bold">
//               تأیید ناموفق بود
//             </h1>

//             <p className="mt-4 text-red-600">
//               {message}
//             </p>

//             <Link
//               href="/register"
//               className="inline-block mt-8 underline"
//             >
//               ثبت‌نام مجدد
//             </Link>
//           </>
//         )}

//       </div>

//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type VerificationStatus =
  | "loading"
  | "success"
  | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] =
    useState<VerificationStatus>("loading");

  const [message, setMessage] = useState(
    "در حال بررسی لینک تأیید..."
  );

  useEffect(() => {
    const token = new URLSearchParams(
      window.location.search
    ).get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "لینک تأیید نامعتبر است یا توکن وجود ندارد."
      );
      return;
    }

    const verify = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error(
            "آدرس API در فرانت‌اند تنظیم نشده است."
          );
        }

        const response = await fetch(
          `${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`,
          { method: "GET" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ?? "تأیید ایمیل ناموفق بود."
          );
        }

        setStatus("success");
        setMessage(
          "ایمیل شما با موفقیت تأیید شد. اکنون می‌توانید وارد شوید."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "خطایی رخ داد."
        );
      }
    };

    void verify();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-xl border p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">
          تأیید ایمیل
        </h1>

        <p
          className={
            status === "error"
              ? "mb-6 text-red-600"
              : status === "success"
                ? "mb-6 text-green-700"
                : "mb-6 text-neutral-600"
          }
        >
          {message}
        </p>

        {status === "loading" && (
          <p>لطفاً صبر کنید...</p>
        )}

        {status === "success" && (
          <Link
            href="/login"
            className="inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            رفتن به صفحه ورود
          </Link>
        )}

        {status === "error" && (
          <Link
            href="/login"
            className="text-sm underline"
          >
            بازگشت به ورود
          </Link>
        )}
      </section>
    </main>
  );
}

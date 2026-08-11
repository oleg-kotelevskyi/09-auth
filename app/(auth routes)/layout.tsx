import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // 1. Отримуємо куки поточного запиту
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session"); // Назва куки може бути іншою (наприклад, 'token' або 'session'), залежно від ТЗ GoIT.

  // 2. Якщо кука авторизації існує, робимо запит до нашого Route Handler для перевірки сесії
  if (sessionCookie) {
    try {
      const response = await fetch("https://notehub-api.goit.study", {
        headers: {
          // Передаємо куку безпосередньо на бекенд GoIT для валідації
          Cookie: `session=${sessionCookie.value}`,
        },
        cache: "no-store", // Вимикаємо кешування, щоб перевірка була актуальною
      });

      // 3. Якщо сервер підтвердив активну сесію (повернув об'єкт користувача)
      if (response.ok && response.status === 200) {
        const user = await response.json();

        if (user && user.email) {
          // Користувач уже в системі! Перенаправляємо його на приватний маршрут нотаток
          redirect("/notes/filter/all");
        }
      }
    } catch (error) {
      console.error("Auth proxy session verification failed:", error);
    }
  }

  // Якщо користувач неавторизований — рендеримо сторінку входу/реєстрації далі
  return <>{children}</>;
}

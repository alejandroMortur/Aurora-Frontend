// src/components/AccountMenu.tsx
import React from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";
import type { Props } from "@/models/LangProps";

const AccountMenu: React.FC<Props> = ({ lang }) => {
  const user = useAtomValue(userStore);

  return (
    <div className="absolute right-0 mt-2 w-48 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg z-50 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {user.loggedIn ? (
        <>
          <a href={`/${lang}/acount/profile`} className="block px-4 py-2">
            Perfil
          </a>
          <hr className="border-t" />
          <a href={`/${lang}/acount/logout`} className="block px-4 py-2">
            Cerrar Sesión
          </a>
        </>
      ) : (
        <a href={`/${lang}/acount/login`} className="block px-4 py-2">
          Iniciar Sesión
        </a>
      )}
    </div>
  );
};

export default AccountMenu;

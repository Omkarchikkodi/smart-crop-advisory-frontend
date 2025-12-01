import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-green-800 text-gray-200 text-center py-4 mt-8">
      <p>Omkar Pandit Chikkodi - 2025 | {t("footer.rights")} &copy;</p>
    </footer>
  );
}

export default Footer;

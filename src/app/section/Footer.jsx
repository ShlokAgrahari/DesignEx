const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-between gap-5 pb-3 text-sm text-neutral-400 c-space">
      <div className="mb-4 bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-[1px] w-full" />

      <nav aria-label="Footer navigation" className="mb-2">
        {" "}
        <ul className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 text-neutral-300">
          {" "}
          <li>
            <a
              href="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms & Conditions
            </a>
          </li>
          <li aria-hidden="true" className="text-neutral-500">
            |
          </li>
          <li>
            <a
              href="/privacy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </li>
        </ul>
      </nav>

      {/* Copyright text */}
      <p className="text-center text-neutral-500">
        © 2025 DesignEx. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

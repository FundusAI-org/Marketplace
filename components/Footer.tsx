import Link from "next/link";
import { FC } from "react";

const Footer: FC = ({}) => {
  return (
    <footer className="mt-12 flex w-full flex-col items-center justify-center border-t">
      <div className="container px-4 py-6 md:px-0">
        <div className="text-center md:flex md:items-center md:justify-between md:text-left">
          <p className="text-sm md:text-base">
            &copy; 2023 FundusAI. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4 md:mt-0 md:justify-end">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary md:text-base"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary md:text-base"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

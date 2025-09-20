import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "header" | "footer" | "hero";
  className?: string;
}

export default function Logo({
  variant = "header",
  className = "",
}: LogoProps) {
  const baseClasses =
    "flex items-center transition-opacity hover:opacity-80";

  const sizeClasses = {
    header: "h-8 w-auto",
    footer: "h-10 w-auto",
    hero: "h-12 w-auto sm:h-14",
  };

  const classes = `${baseClasses} ${className}`;

  return (
    <Link href="/" className={classes}>
      <div className="flex items-center">
        <Image
          src="/studiosoop logo.png"
          alt="Studio Soop Seoul"
          width={variant === "hero" ? 120 : variant === "footer" ? 100 : 80}
          height={variant === "hero" ? 40 : variant === "footer" ? 35 : 30}
          className={`${sizeClasses[variant]} object-contain`}
          priority
        />
      </div>
    </Link>
  );
}

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
  const baseClasses = "flex items-center transition-opacity hover:opacity-80";

  const sizeClasses = {
    header: "h-16 w-auto sm:h-20",
    footer: "h-16 w-auto",
    hero: "h-20 w-auto sm:h-24",
  };

  const classes = `${baseClasses} ${className}`;

  return (
    <Link href="/" className={classes}>
      <div className="flex items-center">
        <Image
          src="/studiosoop logo.png"
          alt="Studio Soop Seoul"
          width={variant === "hero" ? 200 : variant === "footer" ? 160 : 160}
          height={variant === "hero" ? 60 : variant === "footer" ? 50 : 50}
          className={`${sizeClasses[variant]} object-contain`}
          priority
        />
        {variant === "footer" && (
          <span className="text-black ml-3 text-lg font-light tracking-wide">
            studiosoop.seoul
          </span>
        )}
      </div>
    </Link>
  );
}

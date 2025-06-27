import React from "react";

export default function Button({
  size = "default",
  text = "Click me",
  fontSize = "text-base",
  fontWeight = "font-semibold",
  bgColor = "bg-primary",
  textColor = "text-dark",
  onClick,
  iconLeft = null,
  iconRight = null,
}) {
  let sizeClasses = "";

  if (size === "small") {
    sizeClasses = "px-3 py-2";
  } else if (size === "big") {
    sizeClasses = "px-6 py-3";
  } else {
    sizeClasses = "px-9 py-2";
  }

  return (
    <button
      onClick={onClick}
      className={`${sizeClasses} ${fontSize} ${fontWeight} ${bgColor} ${textColor} font-[Montserrat] rounded-lg inline-flex items-center gap-2 transition duration-200 hover:opacity-90`}
    >
      {iconLeft && <span>{iconLeft}</span>}
      <span>{text}</span>
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
}

interface IconProps {
  clicked: boolean;
}

export default function Icon({ clicked }: IconProps) {
  return (
    <span
      className={`relative inline-block w-6 h-0.5 mt-6 transition-all duration-300 ${
        clicked ? "bg-transparent" : "bg-yellow-500"
      }`}
    >
      <span
        className={`absolute left-0 w-6 h-0.5 transition-all duration-300 ${
          clicked ? "top-0 rotate-45 bg-yellow-500" : "-top-2 bg-yellow-500"
        }`}
      ></span>
      <span
        className={`absolute left-0 w-6 h-0.5 transition-all duration-300 ${
          clicked ? "top-0 -rotate-45 bg-yellow-500" : "top-2 bg-yellow-500"
        }`}
      ></span>
    </span>
  );
}
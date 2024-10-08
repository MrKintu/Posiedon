import { useStateContext } from "@/contexts/ContextProvider";

interface ButtonProps {
  color: string;
  text: string;
  borderRadius: string;
  size: string;
  classes?: string; // Optional props should be marked as such
  func?: () => void; // The onClick function should be typed properly
}

const Button: React.FC<ButtonProps> = ({ color, text, borderRadius, size, classes, func }) => {
  const { themeColor } = useStateContext();

  return (
    <button
      className={`text-${size} p-3 hover:drop-shadow-xl ${classes}`}
      type="button"
      style={{
        backgroundColor: themeColor,
        color: color,
        borderRadius: borderRadius,
      }}
      onClick={func}
    >
      {text}
    </button>
  );
};

export default Button;

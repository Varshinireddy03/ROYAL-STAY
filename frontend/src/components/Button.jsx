export default function Button({ children, variant = "primary", ...props }) {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}


const PriorityBadge = ({ level }) => {
  const styles = {
    Low: {
      icon: "🧘",
      bg: "bg-gray-100",
      text: "text-black-",
      label: "Low"
    },
    Medium: {
      icon: "⚠️",
      bg: "bg-yellow-100",
      text: "text-black-100",
      label: "Medium"
    },
    High: {
      icon: "🔥",
      bg: "bg-red-100",
      text: "text-grey-100",
      label: "High"
    }
  };

  const style = styles[level] || styles.Low;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${style.bg} ${style.text}`}>
      <span>{style.icon}</span>
      <span>{style.label}</span>
    </span>
  );
};

export default PriorityBadge;

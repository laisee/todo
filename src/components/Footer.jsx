const Footer = () => {
  return (
    <div className="container mx-auto px-4">
      <footer className="w-full bg-blue-200 text-blue p-4 text-center shadow border-2 border-blue-300 rounded mt-4 mb-4">
        <p className="text-sm text-blue-800">
          &copy; {new Date().getFullYear()} ToDo App
        </p>
      </footer>
    </div>
  );
};
export default Footer;

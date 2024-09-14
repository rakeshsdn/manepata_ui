const FooterComponent = () => {
  return (
    <footer className="bg-dark text-white text-center py-2">
      <div className="container">
        <p className="mb-0">
          © {new Date().getFullYear()} @asif @rakesh Company. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterComponent;

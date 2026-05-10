import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0 || pathnames.includes('login')) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-6 flex text-sm text-gray-500 font-medium">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-castelia-primary transition-colors">Dashboard</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

          return (
            <li key={to} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              {isLast ? (
                <span className="text-castelia-dark font-bold">{formattedValue}</span>
              ) : (
                <Link to={to} className="hover:text-castelia-primary transition-colors">
                  {formattedValue}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
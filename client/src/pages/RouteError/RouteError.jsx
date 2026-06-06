import { Link, useRouteError } from "react-router-dom";
import "./RouteError.scss";

const RouteError = () => {
  const error = useRouteError();
  const status = error?.status || 404;

  return (
    <main className="route_error">
      <section>
        <span>{status}</span>
        <h1>{status === 404 ? "Page not found" : "Something went wrong"}</h1>
        <p>
          {status === 404
            ? "The page you opened does not exist in the CircuitCart storefront."
            : "The app could not complete that request. Try returning to the storefront."}
        </p>
        <div className="route_error_actions">
          <Link to="/">Go home</Link>
          <Link to="/products/laptops">Browse products</Link>
        </div>
      </section>
    </main>
  );
};

export default RouteError;

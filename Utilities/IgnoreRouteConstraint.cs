namespace Qinqii.Utilities
{
    public class IgnoreRouteConstraint : IRouteConstraint
    {
        private readonly string routeToIgnore;

        public IgnoreRouteConstraint(string routeToIgnore)
        {
            this.routeToIgnore = routeToIgnore;
        }

        public bool Match(HttpContext? httpContext, IRouter? route, string routeKey, RouteValueDictionary values, RouteDirection routeDirection)
        {
            return !httpContext.Request.Path.StartsWithSegments(routeToIgnore);
        }
    }
}

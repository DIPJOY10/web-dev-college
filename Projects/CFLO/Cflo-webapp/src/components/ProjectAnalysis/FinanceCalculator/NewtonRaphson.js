/**
 * Newton-Raphson Method
 * =====================
 *
 * Given an initial guess x0, of the root of the function f(x),
 * the equation of the line tangent to curve y = f(x) at point x = x0
 *
 *     y = f'(x0)(x - x0) + f(x0)
 *
 * may provide a better approximation of the value x that takes the equation
 * y = f(x) to zero, at the point where this line crosses the x-axis.
 *
 * By solving for x = x1 and setting y = 0 we find The x-intercept of this line
 * and an incrementally better approximation of the root of the function f(x)
 *
 *    0 = f'(x0)(x1 - x0) + f(x0)
 *
 * with each iteration yielding a better approximation until the absolute delta
 * between approximations |xn+1 - xn| is less than some predetermined error threshold.
 *
 *     x1 = x0 - f(x0)/f'(x0)
 *
 * The slope of the curve will be negative for bond yields, amortized loans and other
 * annuity cashflows with fixed, uniform payments.
 *
 * https://en.wikipedia.org/wiki/Newton%27s_method
 *
 */

//  Enter cashflow year-on-year array and an initial guess (maybe 0.1)
export default function NewtonRaphson(cashflow, guess) {
  const MAX_ITERATIONS = 50;
  const PRECISION = 1e-9;
  // console.log(den);
  var x0 = guess;
  var x1;
  var i = 0;

  while (i < MAX_ITERATIONS) {
    var npv = 0;
    var ddx = 0;

    // npv -> discounted cashflow; ddx -> d/dx[npv]
    npv = cashflow.reduce((pv, pmt, t) => pv + pmt / Math.pow(x0 + 1.0, t), 0);
    ddx = cashflow.reduce(
      (pv, pmt, t) => pv + (-t * pmt) / Math.pow(x0 + 1.0, t + 1),
      0
    );
    if (ddx == 0) {
      return x0;
    }
    x1 = x0 - npv / ddx;
    // console.log(npv, " ", ddx);
    if (Math.abs(x1 - x0) <= PRECISION) {
      // console.log("converged after " + i + " iterations");
      return x1;
    }

    x0 = x1;
    ++i;
  }
  return "NaN";
}

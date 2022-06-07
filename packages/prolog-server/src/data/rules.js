const rules = [
  // fruits_in
  "fruits_in(Xs, X) :- member(X, Xs), fruit(X).",
  "eats_apple(X) :- eats(X, red_apple); eats(X, green_apple).",
  "eats_apple_alt(X) :- eats(X, Y), apple(Y).",
];

module.exports.rules = rules;
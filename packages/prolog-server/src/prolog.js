const pl = require("tau-prolog");

// Load "lists" module
require("tau-prolog/modules/lists")(pl);

class PrologClient {
  constructor(program, options) {
    this.session = pl.create(1000);

    if (program) this.session.consult(program, options);
  }

  query = async function (queryText) {
    const session = this.session;

    return new Promise((resolve, reject) => {
      session.query(queryText, {
        success: function (goal) {
          /* Goal parsed correctly */
          resolve(goal);
        },
        error: function (err) {
          /* Error parsing goal */
          reject(err);
        },
      });
    });
  };

  answer = async function () {
    const session = this.session;

    return new Promise((resolve, reject) => {
      session.answer({
        success: function (answer) {
          resolve(session.format_answer(answer));
        },
        error: function (err) {
          /* Uncaught error */
          reject(err);
        },
        fail: function () {
          /* No more answers */
          reject();
        },
        limit: function () {
          /* Limit exceeded */
        },
      });
    });
  };

  answers = async function () {
    const session = this.session;
    const answers = [];

    return await new Promise((resolve) => {
      session.answers(function (answer) {
        if (!answer) {
          if (answers.length > 0) return resolve(answers);
          return resolve(["false"]);
        }
        answers.push(session.format_answer(answer));
      });
    });
  };
}

module.exports.PrologClient = PrologClient;

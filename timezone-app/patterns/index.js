const patternDict = [
  {
    pattern: /\b(?<greeting>Hi|Hello|Hey|hello|hi)\b/i,
    intent: 'Hello'
  },
  {
    pattern: /\b(bye|exit|quit|leave|stop)\b/i,
    intent: 'Exit'
  },
  {
    pattern: /\b(time zone|time)\s(in)\s(?<city>\w+( \w+)?)\b/i,
    intent: "Time"
  },
  // {
  //   pattern: /\b(weather)\s(like\s)?in\s\b(?<city>[A-Za-z]+([A-Za-z]+)?)\s\b(?<time>tomorrow|today)\b/i,
  //   intent: `get weather`
  // },
  // {
  //   pattern: /\b(weather|time)(?:\s+like)?\s+in\s+(?<city>.+[^?])\b/i,
  //   intent: `current weather`
  // },
  

  {
    pattern: /\b(help)\b/i,
    intent: "Help"
  }];

module.exports = patternDict;
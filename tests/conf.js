exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  'browsername': 'chrome',
  suites: {
    makemm : 'makeMentorMentee.js',

  }

};